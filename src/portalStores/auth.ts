import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/portalStores/menus';
import axiosInstance from '@/axios';
import { setAccessToken, setPlatform, setRefreshToken, sessionLogout, setUserInfo, getRefreshToken } from '@/utils/sessionStorage';
import { usePlatformStore } from '@/portalStores/platform.ts';
import { Message } from '@/utils/message.ts';
import dayjs from 'dayjs';
import { useNotificationStore } from '@/portalStores/notification.ts';
import { useProfileDialogStore } from '@/portalStores/profileDialog.ts';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const menuStore = useMenuStore();
  const userSessionInfo = computed<{
    userId: String;
    roleName: String;
    companyName: String;
    roleType: String;
  }>(() => userInfoValue.value);
  const roleInfoValue = computed(() => roleMenus);
  const accessToken = ref(null);
  const securityMessage = ref<String>('');
  const platformStore = usePlatformStore();
  const platform = computed(() => platformStore.platform);
  const notificationStore = useNotificationStore();
  const profileDialogStore = useProfileDialogStore();
  // TODO: 1. 임시로 데이터 설정(로그인 관련 state 처리가 완료되면 초기화 시킨다)
  //       2. company 를 role로 변경 (API에서 변경 필요)
  const userInfoValue = ref<{
    userId: String;
    roleName: String;
    companyName: String;
    roleType: String;
  }>(null);
  const roleMenus = ref();

  async function login(userId: String, password: String) {
    return new Promise(async (resolve, reject) => {
      await axiosInstance('/krakend/api/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          client_id: 'service-framework',
          grant_type: 'password',
          username: userId,
          password: password
        }
      })
        .then(async (response) => {
          // utils 에 정의되어 있음. auto import 기능으로 선언을 안해도 사용가능.
          window?.sessionStorage?.setItem('status_check', 'LOGIN');
          await setAccessToken(response.data.access_token);
          setRefreshToken(response.data.refresh_token);
          await getUserSessionInfo();
          await setPlatform(platform.value);
          // if (platform.value === 'onshore') {
          //   if (userId === 'masteradmin') router.push('/setting/company');
          // else router.push('/fleet-management');
          // } else {
            router.push('/home');
          // }
        })
        .catch((err) => {
          reject(err);
        });
    });
    // const { data, isFetching, error, execute } =
  }

  async function logout(refreshToken: string | null) {
    if (refreshToken === null) {
      Message().err('Refresh token not found.');
      return;
    }
    axiosInstance('/krakend/api/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        client_id: 'service-framework',
        refresh_token: refreshToken
      }
    }).then(() => {
      // utils 에 정의되어 있음. auto import 기능으로 선언을 안해도 사용가능.
      sessionLogout();
      window.location.replace(window.location.href);
    });
  }

  async function tokenRefresh(refreshToken: string) {
    // const { data, isFetching, error, execute } =
    await axiosInstance('/krakend/api/refresh-token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        client_id: 'service-framework',
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }
    })
      .then((response) => {
        // utils 에 정의되어 있음. auto import 기능으로 선언을 안해도 사용가능.
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        getUserSessionInfo();
      })
      .catch(() => {
        sessionLogout();
        window.location.replace(window.location.href);
        Message().err('alert.401.Unauthorized');
      });
  }

  async function getUserSessionInfo() {
    try {
      return new Promise(async (resolve) => {
        await axiosInstance('/krakend/svcfw/api/authn/session').then(async (response) => {
          if (response.data) {
            const { userId, roleId, roleName, roleType, companyId, companyName, passwordChangedDate, expiryDate, status } = response.data.sessionInfo;
            const statusCheck = window?.sessionStorage?.getItem('status_check');
            const expiredTime = dayjs(passwordChangedDate).add(expiryDate * 86400000);
            const nowTime = dayjs(new Date());
            const remainingTime = expiryDate === -1 ? 99 : expiredTime.diff(nowTime, 'days');
            if (remainingTime <= 0) {
              notificationStore.updateNotification({
                isOpen: true,
                message: 'Your password has expired. Please reset your password.',
                confirm: () => {
                  window?.sessionStorage?.setItem('status_check', 'EXPIRED');
                  notificationStore.updateNotification({ isOpen: false });
                  profileDialogStore.updateProfileDialog({ isOpen: true });
                },
                cancel: () => {
                  notificationStore.updateNotification({ isOpen: false });
                  sessionLogout();
                  window.location.reload();
                }
              });
            } else if (remainingTime <= 14) {
              notificationStore.updateNotification({
                isOpen: true,
                message: 'Your password is nearing expiration. Please reset your password.',
                confirm: () => {
                  notificationStore.updateNotification({ isOpen: false });
                  profileDialogStore.updateProfileDialog({ isOpen: true });
                }
              });
            } else if ((status === 'CREATE' || status === 'RESET') && statusCheck === 'LOGIN') {
              notificationStore.updateNotification({
                isOpen: true,
                message: 'You are logged in with your temporary password! Temporary passwords are less secure. You need to reset your password.',
                confirm: () => {
                  window?.sessionStorage?.removeItem('status_check');
                  notificationStore.updateNotification({ isOpen: false });
                  profileDialogStore.updateProfileDialog({ isOpen: true });
                },
                cancel: () => {
                  window?.sessionStorage?.removeItem('status_check');
                  notificationStore.updateNotification({ isOpen: false });
                }
              });
            }
            roleMenus.value = response.data.roleMenus.map((roleMenu) => {
              const { url } = roleMenu.menu;
              const permission = [];
              if (roleMenu.aclc === 'Y') {
                permission.push('create');
              }
              if (roleMenu.acld === 'Y') {
                permission.push('delete');
              }
              if (roleMenu.aclr === 'Y') {
                permission.push('read');
              }
              if (roleMenu.aclu === 'Y') {
                permission.push('update');
              }
              return { menuId: roleMenu.menuId, permission, url, roleId };
            });
            userInfoValue.value = { userId, roleName, roleType, companyName, passwordChangedDate, expiryDate, status };
            setUserInfo({ userId, roleId, roleName, companyId, companyName });
            await menuStore.setMenuList(response.data.roleMenus);
            resolve(true);
          }
        });
      });
    } catch (err) {
      return err;
    }
  }

  return { login, logout, tokenRefresh, getUserSessionInfo, userSessionInfo, roleInfoValue, accessToken, securityMessage };
});

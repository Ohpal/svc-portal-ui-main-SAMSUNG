<template>
  <loading-dialog v-model="visible"></loading-dialog>
  <v-layout
    class="side-navi-layout-main"
    :style="{ zIndex: 'none' }"
  >
    <!--  Header -->
    <v-app-bar
      class="app-header"
      height="64"
      flat
    >
      <template #prepend>
        <v-btn
          class="btn-menu"
          @click="onClickMenu"
          icon="mdi-menu"
          color="secondary"
        />
        <v-btn
          class="btn-menu"
          @click="onClickHome"
          icon="mdi-home-outline"
          color="secondary"
        />
        <!-- <img
          class="flag-img"
          :src="'/countries/KR/flag.png'"
          alt="국기"
          height="24"
        /> -->
        <!-- <BaseAutocomplete
          width="160"
          return-object
          hide-details
          :items="companyList"
          v-model="company"
          :placeholder="'Select a customer'"
          item-title="name"
          @update:modelValue="companyStore.setCompanyInfo"
        ></BaseAutocomplete> -->
        <!-- <p
          v-if="ship && ship !== null"
          class="ship-info"
        >
          {{ ship.shipName + '/' + ship.shipTypeName }}
        </p> -->
      </template>

      <template #append>
        <!-- <BaseAutocomplete
          v-if="company !== null && platform === 'onshore' && userSessionInfo.userId !== 'masteradmin'"
          :items="shipList"
          v-model="ship"
          item-title="shipId"
          placeholder="Select a ship name"
          @update:modelValue="shipStore.setShipInfo"
          width="180"
          return-object
          hide-details
        /> -->
        <div class="time-wrap">
          <i class="mdi-clock-time-three-outline"></i>
          <p>{{ now.format('YYYY-MM-DD HH:mm:ss') }}</p>
        </div>
        <HeaderButtons />
      </template>
    </v-app-bar>
    <!--  Lnb -->
    <v-navigation-drawer
      class="app-side-nav"
      v-model="navidrawer.value"
      :rail="navidrawer.rail"
      order="0"
      width="240"
      :rail-width="67.2"
      flat
      disable-resize-watcher
    >
      <v-list
        class="gnb"
        v-model:selected="navidrawer.selected"
        v-model:opened="navidrawer.open"
        @click="navidrawer.rail = false"
        @click:open="navidrawer.rail = false"
        nav
        open-strategy="single"
      >
        <SideMenuItem
          :menu-list="menuList"
          :is-rail="navidrawer.rail"
          :selectedMenu="navidrawer.curMenu"
        />
      </v-list>
      <div class="logo"></div>
    </v-navigation-drawer>
    <!--  Page Content 영역 -->
    <v-main>
      <template v-if="fullScreen">
        <v-container
          fluid
          class="full-screen-layout"
        >
          <BaseBreadCrumb
            :router="router"
            :menu-list="menuList"
            class="px-8"
          />
          <slot />
        </v-container>
      </template>
      <template v-else>
        <v-container
          fluid
          class="pa-4 pt-0 pa-md-8 pt-md-0"
        >
          <v-row no-gutters>
            <v-col cols="12">
              <BaseBreadCrumb
                :router="router"
                :menu-list="menuList"
              />
              <slot />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-main>
    <ToastMessage />
    <BaseDialog
      :is-open="logoutDialog.visible"
      :title="logoutDialog.title"
      confirm-title="Stay"
      cancel-title="Lotout"
      @click:cancel="logoutDialog.cancel"
      @click:confirm="logoutDialog.confirm"
      :width="500"
    >
      <template #body>
        <div class="dialog-body">{{ logoutDialog.message }}({{ logoutDialog.timer }})</div>
      </template>
    </BaseDialog>
    <BaseDialog
      :is-open="notification.isOpen"
      :title="notification.title"
      persistent
      confirm-title="Ok"
      cancel-title="Cancel"
      @click:cancel="notification.cancel"
      @click:confirm="notification.confirm"
      :width="500"
    >
      <template #body>
        <div class="dialog-body">
          {{ notification.message }}
        </div>
      </template>
    </BaseDialog>
    <ProfileDialog
      :is-open="profileDialog.isOpen"
      @close="profileDialog.close"
    />
  </v-layout>
</template>

<script setup lang="ts">
import ToastMessage from '@/components/ToastMessage.vue';
import { computed, onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue';
import { useDisplay } from 'vuetify';
import axiosInstance from '@/axios';
import type { MenuType, ShipType } from '@/types';
import SideMenuItem from '@/components/layout/SideMenuItem.vue';
import { useRouter } from 'vue-router';
import HeaderButtons from '@/components/layout/HeaderButtons.vue';
import { useMenuStore } from '@/portalStores/menus';
import { useAuthStore } from '@/portalStores/auth';
import { useLoadingStore } from '@/portalStores/loading';

import { useShipStore } from '@/portalStores/ship';
import dayjs from 'dayjs';
import { useCompanyStore } from '@/portalStores/company';
import { usePlatformStore } from '@/portalStores/platform.ts';
import { getCommonIntervalTime, getLogoutTime, getRefreshToken } from '@/utils/sessionStorage.ts';
const TIMER = 60;
const logoutDialog = ref({
  visible: false,
  title: 'Logout',
  message: 'log out after one minute of inactivity.',
  timer: TIMER,
  cancel: () => logout(),
  confirm: () => stayLoggedIn()
});

import { useNotificationStore } from '@/portalStores/notification.ts';
import { useProfileDialogStore } from '@/portalStores/profileDialog.ts';
import ProfileDialog from '@/components/layout/ProfileDialog.vue';
const notificationStore = useNotificationStore();
const notification = computed(() => notificationStore.notification);
const profileDialogStore = useProfileDialogStore();
const profileDialog = computed(() => profileDialogStore.profileDialog);

const companyStore = useCompanyStore();
const companyList = computed(() => companyStore.companyList);
const company = computed(() => companyStore.company);
const platformStore = usePlatformStore();
const platform = computed(() => platformStore.platform);
const shipStore = useShipStore();
const LoadingStore = useLoadingStore();
const ship = computed(() => shipStore.shipInfo);
const shipForService = ref(<ShipType>null);
const shipList = computed(() => shipStore.shipList);
const visible = computed({
  get() {
    return LoadingStore.getLoading();
  },
  set(v) {
    LoadingStore.setLoading(v);
  }
});
const toggle = () => {
  visible.value = !visible.value;
};

const authStore = useAuthStore();
const userSessionInfo = computed<{
  userId: String;
  roleName: String;
  companyName: String;
}>(() => authStore.userSessionInfo);
const menuStore = useMenuStore();
const menuList = computed(() => {
  return menuStore.getValue;
});
const router = useRouter();
const { lgAndUp } = useDisplay();
const navidrawer = reactive({
  value: false,
  rail: false, // min nav toggle,
  selected: [-1],
  open: [-1],
  curMenu: [-1]
});
const fullScreen = ref(false);
const updateTime = ref();
const timeoutId = ref(0); // 1시간 타이머 ID
const countdown = ref(0); //60초 타이머 id
const updateId = ref(0);

function isFullScreenPath(path: string): boolean {
  return path.includes('voyage-monitoring') || path.includes('voyage-planner') || path.includes('fleet-management');
}

const isFleet = computed(() => router.currentRoute.value.path === '/fleet-management');

watch(
  () => userSessionInfo.value,
  () => {
    companyStore.getCompanyList(userSessionInfo.value);
  }
);

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    fullScreen.value = isFullScreenPath(newPath);
    //y scroll 제거
    if (isFullScreenPath(newPath)) {
      document.documentElement.classList.add('overflow-y-hidden');
      document.querySelector('.v-main')?.classList.remove('overflow-y-auto'); // v-main 클래스 overflow 제거
    } else {
      document.documentElement.classList.remove('overflow-y-hidden');
      document.querySelector('.v-main')?.classList.add('overflow-y-auto'); // v-main 클래스 overflow 추가
    }

    setMenu();
    resetTimer();
  }
);
watch(
  () => company.value,
  (newCompany, oldCompany) => {
    if (company.value !== null) {
      shipStore.getShipList(company.value?.companyId);
      if (newCompany?.companyId !== oldCompany?.companyId) {
        shipStore.setShipInfo(null);
      }
    }
  }
);
watch(
  () => ship.value,
  (newValue, oldValue) => {
    if (newValue && newValue !== null && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      if (router.currentRoute.value.path !== '/fleet-management' && newValue?.shipId !== oldValue?.shipId) {
        router.push('/voyage/voyage-monitoring');
      } else {
        if (ship.value !== newValue) {
          shipStore.setShipInfo(newValue);
        }
      }
    }
  }
);
watch(
  () => menuList,
  () => setMenu()
);
watch(
  () => lgAndUp.value,
  (v) => {
    if (v) {
      navidrawer.value = true;
    } else {
      navidrawer.value = false;
    }
  },
  {
    immediate: true
  }
);
watch(
  () => navidrawer.rail,
  () => {
    // navidrawer.open = [];
  }
);

onMounted(() => {
  if (userSessionInfo.value) {
    companyStore.getCompanyList(userSessionInfo.value);
  }
  if (company.value) {
    shipStore.getShipList(company.value?.companyId);
  }

  if (window.location.hash === '#new') {
    // 새창열기로 들어왔을 때
    const roleName = JSON.parse(window?.sessionStorage?.getItem('user_info'))?.roleName;
    console.log(`roleName`, roleName);
    if (roleName === 'Master') {
      // 한화 계정이면
      companyStore.setCompanyInfo(null);
    } else {
      // 선사 계정이면
      shipStore.setShipInfo(null);
    }
    history.pushState('', document.title, window.location.pathname);
  }

  navidrawer.rail = false;

  fullScreen.value = isFullScreenPath(router.currentRoute.value.path);
  //y scroll 제거
  if (isFullScreenPath(router.currentRoute.value.path)) {
    document.documentElement.classList.add('overflow-y-hidden');
    document.querySelector('.v-main')?.classList.remove('overflow-y-auto'); // v-main 클래스 overflow 제거
  } else {
    document.documentElement.classList.remove('overflow-y-hidden');
    document.querySelector('.v-main')?.classList.add('overflow-y-auto'); // v-main 클래스 overflow 추가
  }
  setMenu();
  if (!platform.value) {
    platformStore.getPlatformInfo();
  }
  if (platform.value === 'onboard') {
    getUpdateTime();
  }
  resetTimer();
});

const onClickMenu = () => {
  if (lgAndUp.value) {
    navidrawer.value ? (navidrawer.rail = !navidrawer.rail) : (navidrawer.value = !navidrawer.value);
  } else {
    navidrawer.value = !navidrawer.value;
  }
};

const onClickHome = () => {
  // if (platform.value === 'onshore') {
  //   if (userSessionInfo.value.userId === 'masteradmin') router.push('/setting/company');
  //   else router.push('/fleet-management');
  // } else {
  router.push({ name: 'home' });
  // }
};

const resetTimer = () => {
  // 이전 타이머 클리어
  clearTimeout(timeoutId.value);
  clearInterval(countdown.value);

  // 1시간 타이머 설정

  timeoutId.value = setTimeout(showLogoutWarning, getLogoutTime());

  // 팝업 숨기기
  logoutDialog.value.visible = false;
};

const showLogoutWarning = () => {
  logoutDialog.value.timer = TIMER;
  // 1분 후 로그아웃을 경고하는 팝업 표시
  logoutDialog.value.visible = true;

  countdown.value = setInterval(() => {
    // 타이머를 1초씩 감소
    logoutDialog.value.timer--;

    // 시간이 0초가 되면 타이머를 멈춤
    if (logoutDialog.value.timer <= 0) {
      clearInterval(countdown.value); // 타이머 중지
      logout();
    }
  }, 1000);
};

const stayLoggedIn = () => {
  // "계속 사용하기" 클릭 시 타이머 리셋
  resetTimer();
};

const logout = () => {
  logoutDialog.value.visible = false;
  // 실제 로그아웃 처리 로직
  authStore.logout(getRefreshToken());
  // 로그아웃 처리 로직 추가 (예: 토큰 삭제, 페이지 리다이렉트)
};

function setMenu() {
  navidrawer.selected = [];
  navidrawer.open = [];
  findMenu(menuList.value);
  checkCurMenu(menuList.value);
}

function findMenu(menus: Array<MenuType>) {
  if (menus === undefined) {
    return;
  }
  let currentPath: string;
  if (router.currentRoute.value.path.startsWith('/publish')) {
    currentPath = router.currentRoute.value.path.replace('/publish', '');
  } else {
    currentPath = router.currentRoute.value.path;
  }
  const findedMenu = menus.filter((menu) => currentPath.startsWith(menu.url))[0];

  if (findedMenu) {
    navidrawer.curMenu.push(findedMenu.menuId);
    if (findedMenu.children) {
      navidrawer.selected.pop();
      findMenu(findedMenu.children);
    }
  }
}

function checkCurMenu(menus: Array<MenuType>) {
  if (menus === undefined) {
    return;
  }
  let currentPath = router.currentRoute.value.path;
  const curMenu = menus.filter((menu) => currentPath.startsWith(menu.url))[0];

  if (curMenu) {
    navidrawer.open.push(curMenu.menuId);
    if (curMenu.children) {
      navidrawer.selected.pop();
      checkCurMenu(curMenu.children);
    }
  }
}

// function onChangeShip() {
//   if (d.ship !== null) {
//     shipStore.setShipInfo(d.ship);
//   }
// }

const now = ref(dayjs().tz('Asia/Seoul'));
const utcInterval = setInterval(() => {
  now.value = dayjs().tz('Asia/Seoul');
});
onBeforeUnmount(() => {
  clearInterval(utcInterval);
  clearTimeout(timeoutId.value);
  clearInterval(countdown.value);
  clearInterval(updateId.value);
});

function getUpdateTime() {
  let latestTime: any = null;
  axiosInstance
    .get(`/krakend/inbound-gateway/receiver/ships/${ship.value.shipId}/health/devices`, { headers: { 'X-API-VERSION': '1.0.0' } })
    .then((res: any) => {
      res.data.collection.forEach((devices: any) => {
        if (updateTime.value) {
          if (new Date(latestTime).getTime() < new Date(devices.dataLatestTime).getTime()) {
            updateTime.value = dayjs(new Date(devices.dataLatestTime));
            latestTime = devices.dataLatestTime;
          }
        } else {
          updateTime.value = dayjs(new Date(devices.dataLatestTime));
          latestTime = devices.dataLatestTime;
        }
      });
    });
  updateId.value = setInterval(() => {
    axiosInstance
      .get(`/krakend/inbound-gateway/receiver/ships/${ship.value.shipId}/health/devices`, { headers: { 'X-API-VERSION': '1.0.0' } })
      .then((res: any) => {
        res.data.collection.forEach((devices: any) => {
          if (updateTime.value) {
            if (new Date(latestTime).getTime() < new Date(devices.dataLatestTime).getTime()) {
              updateTime.value = dayjs(new Date(devices.dataLatestTime));
              latestTime = devices.dataLatestTime;
            }
          } else {
            updateTime.value = dayjs(new Date(devices.dataLatestTime));
            latestTime = devices.dataLatestTime;
          }
        });
      });
  }, getCommonIntervalTime());
}
</script>

<style lang="scss" scoped>
.side-navi-layout {
  &-main {
    background: #ecf0f8;
  }
}

.app-header {
  box-shadow: 0 8px 20px 0 var(--black8) !important;

  ::v-deep(.v-toolbar__prepend) {
    margin-inline: 0 auto;
  }

  .v-btn.v-theme--light.v-btn--icon.v-btn--density-default.btn-menu {
    height: 100% !important;
    width: 68px !important;
    border-right: 1px solid var(--black12);
    border-radius: 0;

    ::v-deep(.v-btn__content) {
      .v-icon--size-default {
        font-size: 20px;
      }
    }

    &:has(.mdi-menu) {
      &:hover {
        background: var(--primary);

        ::v-deep(.v-icon) {
          color: #fff;
        }
      }
    }

    &:has(.mdi-home-outline) {
      &:hover {
        background: var(--main);

        ::v-deep(.v-icon) {
          color: #fff;
        }
      }
    }
  }

  .flag {
    &-img {
      margin-left: 24px;
      margin-right: 8px;
    }
  }

  .ship-info {
    margin-left: 12px;
    font-size: 17px;
    font-weight: 500;
    line-height: 20.29px;
    color: var(--black80);
  }

  .time-wrap {
    display: flex;
    align-items: center;
    justify-items: center;
    gap: 4px;
    height: 36px;
    padding: 0px 16px;
    margin-left: 8px;
    white-space: nowrap;
    border-radius: 4px;
    background-color: var(--primary5);

    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 16.41px;
      color: var(--black80);
      margin: 0 auto;
    }

    i {
      color: var(--black60);
      font-size: 18px;
    }
  }

  ::v-deep(.v-toolbar__append) {
    margin-inline: auto 32px;
  }
}

.app-side-nav {
  border-right-width: 0;
  box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.08) !important;
  background-color: white;

  .gnb {
    height: calc(100% - 56px);
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px 0;
  }

  .logo {
    position: absolute;
    bottom: 0;
    z-index: 1;
    width: 100%;
    height: 56px;
    border-top: 1px solid var(--black8);
    background: #fff url('@/assets/img/ss_logo.png') center center no-repeat;
    background-size: 140px 28px;
  }

  &.v-navigation-drawer {
    &--rail {
      &:deep() {
        .v-list-item {
          padding: 12px 24px;

          &__content,
          &__append {
            display: none;
          }
        }

        .v-list-group__items {
          display: none;
        }
      }

      .logo {
        display: none;
      }
    }
  }
}

.v-main {
  max-height: calc(100vh - 64px);
  // overflow-y: auto;  // monitoring 화면 scroll 문제로 overflow-y 직접 넣지 않고 메뉴 route 될 때 지정하도록 변경
}

.full-screen-layout {
  height: calc(100% - 80px);
  padding: 0;
}
</style>

<style lang="scss">
.v-container {
  min-width: 1180px;
}
</style>

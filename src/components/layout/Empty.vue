<template>
  <v-layout>
    <v-main>
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
          <div class="dialog-body">
            {{logoutDialog.message}}({{logoutDialog.timer}})
          </div>
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
            {{notification.message}}
          </div>
        </template>
      </BaseDialog>
      <ProfileDialog
          :is-open="profileDialog.isOpen"
          @close="profileDialog.close"
      />
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import ToastMessage from '@/components/ToastMessage.vue';
import {getLogoutTime, getRefreshToken} from "@/utils/sessionStorage.ts";
import {onMounted, ref, computed, watch, onBeforeUnmount} from "vue";
import { useAuthStore } from '@/portalStores/auth';
import router from "@/router";
import {useNotificationStore} from "@/portalStores/notification.ts";
import {useProfileDialogStore} from "@/portalStores/profileDialog.ts";
import ProfileDialog from "@/components/layout/ProfileDialog.vue";
const notificationStore = useNotificationStore()
const notification = computed(() => notificationStore.notification)
const profileDialogStore = useProfileDialogStore()
const profileDialog = computed(() => profileDialogStore.profileDialog)
const isLogin = computed(() => router.currentRoute.value.path === '/login')
const authStore = useAuthStore();
const TIMER = 60;
const logoutDialog = ref({
  visible: false,
  title: 'Logout',
  message: 'log out after one minute of inactivity.',
  timer: TIMER,
  cancel: () => logout(),
  confirm: () => stayLoggedIn()
})
const timeoutId = ref(0);      // 1시간 타이머 ID
const countdown = ref(0)          //60초 타이머 id
const resetTimer = () => {
  // 이전 타이머 클리어
  clearTimeout(timeoutId.value);
  clearInterval(countdown.value)

  // 1시간 타이머 설정

  timeoutId.value = setTimeout(showLogoutWarning, getLogoutTime());

  // 팝업 숨기기
  logoutDialog.value.visible = false;
}

const showLogoutWarning = () => {
  logoutDialog.value.timer = TIMER;
  // 1분 후 로그아웃을 경고하는 팝업 표시
  logoutDialog.value.visible = true;

  countdown.value = setInterval(() => {
    // 타이머를 1초씩 감소
    logoutDialog.value.timer--;

    // 시간이 0초가 되면 타이머를 멈춤
    if (logoutDialog.value.timer <= 0) {
      clearInterval(countdown.value);  // 타이머 중지
      logout();
    }
  }, 1000);
}

const stayLoggedIn = () => {
  // "계속 사용하기" 클릭 시 타이머 리셋
  resetTimer();
}

const logout = () => {
  logoutDialog.value.visible = false;
  // 실제 로그아웃 처리 로직
  authStore.logout(getRefreshToken());
  // 로그아웃 처리 로직 추가 (예: 토큰 삭제, 페이지 리다이렉트)
}

watch(
    () => router.currentRoute.value.path,
    (newPath) => {
      if(!isLogin.value) {
        resetTimer();
      }
    }
);
onMounted(() => {
  if(!isLogin.value) {
    resetTimer();
  }
})

onBeforeUnmount(() => {
  clearTimeout(timeoutId.value);
  clearInterval(countdown.value)
})

</script>

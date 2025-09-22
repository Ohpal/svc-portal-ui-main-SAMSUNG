<template>
  <div class="header-buttons-main">
    <!-- <v-btn
      @click="togglePublish"
      icon="mdi-note-edit-outline"
      color="secondary"
    /> -->
    <!-- <v-btn
      class="alert-btn"
      @click="openAlarm"
      color="secondary"
      icon
    >
      <v-badge
        color="error"
        :offset-x="1"
        :dot="count > 0"
      >
        <v-icon icon="mdi-bell-outline"/>
      </v-badge>
    </v-btn> -->
    <v-divider
      class="h-16"
      vertical
    />
    <!-- 언어 토글 버튼 -->
    <v-btn
      class="language-btn"
      @click="toggleLanguage"
      color="secondary"
      variant="text"
      size="small"
    >
      <v-icon class="mr-1">mdi-translate</v-icon>
      {{ currentLanguage === 'ko' ? 'English' : '한국어' }}
    </v-btn>
    <v-divider
      class="h-16"
      vertical
    />
    <v-menu
      class="admin-menu-wrapper"
      v-model="isOpenedAdminMenu"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="account-btn"
          v-bind="props"
          color="secondary"
          prepend-icon="mdi-account-outline"
        >
          {{ userSessionInfo?.userId }}
        </v-btn>
      </template>
      <v-list
        class="admin-menu-list"
        density="comfortable"
      >
        <v-list-item class="admin-item">
          <v-list-item-title>{{ userSessionInfo?.userId + ' (' + roleName + ')' }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          prepend-icon="mdi-account-outline"
          @click="openUserProfile"
          :close-on-content-click="false"
        >
          <v-list-item-title>User profile</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-location-exit"
          @click="logout"
        >
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <ProfileDialog
      :is-open="isOpenedUserProfile"
      @close="isOpenedUserProfile = false"
    />
    <!-- <AlarmDialog
      :is-open="isOpenedAlarm"
      @close="isOpenedAlarm = false"
    /> -->
  </div>
</template>
<script setup lang="ts">
import { usePublishStore } from '@/portalStores/publish';
import { useAuthStore } from '@/portalStores/auth';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getRefreshToken } from '@/utils/sessionStorage';
// import {useCounterStore} from "@/portalStores/counter";
import { storeToRefs } from 'pinia';
import ProfileDialog from '@/components/layout/ProfileDialog.vue';
import AlarmDialog from '@/components/layout/AlarmDialog.vue';
import { useLoadingStore } from '@/portalStores/loading';

const publishStore = usePublishStore();
const authStore = useAuthStore();
const router = useRouter();
const { userSessionInfo } = authStore;

const { t, locale } = useI18n();

// const countStore = useCounterStore();
// const {count} = storeToRefs(countStore)
// const {increment} = countStore
const count = 0;
const LoadingStore = useLoadingStore();

const isOpenedAdminMenu = ref(false);
const isOpenedUserProfile = ref(false);
const isOpenedAlarm = ref(false);

const roleName = computed(() => {
  return userSessionInfo?.roleName;
});

// 현재 언어 상태
const currentLanguage = computed(() => locale.value);

// 언어 토글 함수
function toggleLanguage() {
  locale.value = currentLanguage.value === 'ko' ? 'en' : 'ko';
  // 로컬 스토리지에 언어 설정 저장
  localStorage.setItem('language', locale.value);
}

// 컴포넌트 마운트 시 저장된 언어 설정 복원
function initializeLanguage() {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
    locale.value = savedLanguage;
  }
}

// 컴포넌트 마운트 시 언어 설정 초기화
initializeLanguage();

function togglePublish() {
  alert(`개발모드 변경 퍼블모드: ${!publishStore.getValue}`);
  publishStore.toggle();
}

function openUserProfile() {
  isOpenedUserProfile.value = true;
  isOpenedAdminMenu.value = false;
}

function openAlarm() {
  isOpenedAlarm.value = true;
}

function logout() {
  authStore.logout(getRefreshToken());
}
</script>

<style lang="scss" scoped>
.header-buttons {
  &-main {
    display: flex;
    align-items: center;
    min-height: 24px;
    margin-left: 8px;
    &:deep() {
      .v-divider {
        align-self: center;
      }
      .v-badge {
        .v-badge__badge {
          display: none;
        }
        &.v-badge--dot {
          .v-badge__badge {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid #fff;
          }
        }
      }
      .v-icon {
        font-size: 20px !important;
      }
      .alert-btn,
      .account-btn,
      .language-btn {
        .v-btn__overlay {
          display: none;
        }
      }
      .alert-btn {
        position: relative;

        .mdi-bell-outline {
          color: var(--black80);
        }
        &:hover {
          .v-icon {
            color: var(--primary);
          }
        }
      }
      .language-btn {
        .v-btn__prepend {
          margin-right: 4px;
          color: var(--black80) !important;
        }
        .v-btn__content {
          color: var(--black80);
          font-weight: 400;
          font-size: 14px;
        }
        &:hover {
          .v-icon,
          .v-btn__content {
            color: var(--primary);
          }
        }
      }
      .account-btn {
        .v-btn__prepend {
          margin-right: 4px;
          color: var(--black80) !important;
        }
        .v-btn__content {
          color: var(--black80);
          font-weight: 400;
        }
        &[aria-expanded='true'],
        &:hover {
          .v-icon,
          .v-btn__content {
            color: var(--primary);
          }
        }
      }
    }
  }
}

.admin-menu-wrapper {
  ::v-deep(.v-overlay__content) {
    box-shadow: 0px 8px 24px 0px #0000001f;
  }
}
.admin-menu-list {
  width: 160px;
  padding-top: 0;
  .v-list-item {
    height: 32px;
    padding: 0 16px;
    &.v-list-item--density-comfortable.v-list-item--one-line {
      min-height: auto;
    }
    ::v-deep(.v-list-item__overlay) {
      display: none;
    }
    &:nth-child(n + 2):hover {
      background: var(--primary10);
    }
    .v-list-item-title {
      font-size: 14px;
      font-weight: 400;
      color: var(--black70);
    }
    &.admin-item {
      position: relative;
      height: 40px;
      margin-bottom: 8px;
      text-align: center;
      white-space: initial;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        box-shadow: 0px 2px 8px 0px #0000000f;
      }
      &::after {
        display: none;
      }
    }
    &:nth-child(n + 3) {
      margin-top: 2px;
    }
    ::v-deep(.v-list-item__prepend) {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    .v-icon {
      font-size: 16px;
      color: var(--black60);
      opacity: 1;
    }
  }
}
</style>

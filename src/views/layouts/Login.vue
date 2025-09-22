<template>
  <div class="login-wrap">
    <div class="half-sec bg-wrap">
      <img
        src="@/assets/img/bg_samsung.png"
        width="100%"
        height="100%"
        alt="ss_logo"
      />
    </div>
    <div class="half-sec lg-wrap">
      <div class="lg-inner flex-column">
        <p class="lg-title">SeaTrial Service</p>
        <v-form
          v-model="formValid"
          class="form-wrap flex-column"
          @submit.prevent
        >
          <div class="input-wrap flex-column">
            <p>User ID</p>
            <BaseTextField
              id="form_user_id"
              v-model="userId"
              density="default"
              placeholder="enter ID"
              :rules="rules.id"
            />
          </div>
          <div class="input-wrap flex-column">
            <p>Password</p>
            <BaseTextField
              id="form_password"
              v-model="password"
              type="password"
              density="default"
              placeholder="enter password"
              :rules="rules.password"
            />
          </div>
          <v-btn
            block
            id="form_submit"
            type="submit"
            variant="flat"
            size="large"
            color="primary"
            class="login mb-5"
            @click="submit"
          >
            Login
          </v-btn>
          <label
            v-if="showError"
            class="text-red"
          >
            Please check your ID or password.
          </label>
          <a
            href="#"
            @click="onClickOpenForgetPW"
            class="forget"
          >
            Forget Password
          </a>
        </v-form>
      </div>
      <img
        src="@/assets/img/ss_logo.png"
        width="172px"
        alt="ss_logo"
      />
    </div>
  </div>

  <ConfirmDialog
    :is-open="confirm.visible"
    confirm-btn-text="Ok"
    persistent
    @click:confirm="onClickCloseConfirm"
    @click:cancel="onClickCloseConfirm"
  >
    {{ confirm.message }}
  </ConfirmDialog>
</template>

<script setup lang="ts">
// definePageMeta({
//   layout: 'empty'
// });

import { useAuthStore } from '@/portalStores/auth.ts';
import { computed, onMounted, reactive, ref } from 'vue';
import { usePlatformStore } from '@/portalStores/platform.ts';
import { WebConfigType } from '@/types';
import { setCommonIntervalTime, setLogoutTime } from '@/utils/sessionStorage.ts';

const showError = ref(false);
const platformStore = usePlatformStore();
const platform = computed(() => platformStore.platform);
const authStore = useAuthStore();
const userId = ref('');
const password = ref('');
const rules = ref({
  id: [
    (value: string) => {
      if (value) return true;
      return 'You must enter ID.';
    }
  ],
  password: [
    (value: string) => {
      if (value) return true;
      return 'You must enter Password.';
    }
    // (value) => {
    //   console.log(typeof value);
    //   if (value.match(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/)) return true;
    //   return 'The first letter of the ID must not have any special characters ID must have used only special characters like (-, _). ID can only contain at least 4-15 lowercase letters and numbers.';
    // }
  ]
});
const formValid = ref(null);

const confirm = reactive({
  message: 'It has requsted account manager to reset your password.',
  visible: false
});

function onClickOpenForgetPW() {
  confirm.message = 'It has requsted account manager to reset your password.';
  confirm.visible = true;
}

function onClickCloseConfirm() {
  confirm.visible = false;
}

function submit() {
  if (formValid.value === true) {
    authStore
      .login(userId.value, password.value)
      .then((res) => {
        showError.value = false;
      })
      .catch((err) => {
        if (err.response.data.error_description.includes('disabled')) {
          confirm.visible = true;
          confirm.message = 'Your account has been disabled. Check with administrator.';
        } else showError.value = true;
      });
  }
}

async function setConfig() {
  const response = await fetch('/web-config');
  let result: WebConfigType;
  try {
    result = (await response.json()) as WebConfigType;
  } catch (e) {
    result = {
      intervalTime: 15000,
      logoutTime: 3600000
    };
  }
  setLogoutTime(result.logoutTime);
  setCommonIntervalTime(result.intervalTime);
  return result;
}

onMounted(async () => {
  await platformStore.getPlatformInfo();
  await setConfig();
});
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'GmarketSans';
  font-weight: 700;
  font-style: normal;
  src: url('../../assets/fonts/GmarketSansB.ttf') format('truetype');
  font-display: swap;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.login-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  .half-sec {
    position: relative;
    flex: 1;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    .mark {
      margin: 0 9px 0 2px;
    }
  }
  .bg-wrap {
    justify-content: center;
    video,
    img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      object-fit: cover;
    }
    .bg-txt {
      z-index: 1;
      text-align: left;
      h1 {
        color: #fff;
        font-size: 40px;
        font-weight: 500;
        line-height: 46px;
        span {
          font-weight: 700;
          color: var(--main);
          font-family: 'GmarketSans';
        }
      }
      & > p {
        color: rgba($color: #fff, $alpha: 0.8);
        font-size: 20px;
        font-weight: 400;
        margin-top: 16px;
      }
    }
  }
  .lg-wrap {
    flex-direction: column;
    justify-content: flex-start;
    .lg-inner {
      position: absolute;
      top: 32%;
      transform: translateY(-50%);
      width: 420px;
      align-items: flex-start;
      .lg-title {
        font-size: 42px;
        font-weight: 700;
        white-space: nowrap;
        color: var(--black80);
        display: flex;
        align-items: flex-start;
        span {
          font-size: 20px;
        }
      }
      .form-wrap {
        width: 100%;
        align-items: flex-start;
        justify-content: center;
        gap: 20px;
        margin-top: 40px;
        &::v-deep(.v-btn) {
          width: 100%;
          height: 48px;
          margin: 0 !important;
          transition: 0.2s !important;
          &:hover {
            background-color: var(--primary80) !important;
          }
        }
        .input-wrap {
          width: 100%;
          align-items: flex-start;
          gap: 4px;
          &::v-deep(.v-input) {
            width: 100%;
            height: 48px;
            .v-input__control {
              min-height: 48px !important;
            }
          }
          & > p {
            font-size: 12px;
            font-weight: 400;
            color: var(--black60);
          }
        }
        .forget {
          font-size: 14px;
          font-weight: 400;
          color: var(--black60);
          &:hover {
            color: var(--black80);
            text-decoration: underline;
          }
        }
      }
    }
    & > img {
      position: absolute;
      bottom: 60px;
    }
  }
}
</style>

<template>
  <BaseDialog
    :is-open="isOpen"
    title="User Profile"
    confirm-title="Save"
    cancel-title="Close"
    @click:cancel="close"
    @click:confirm="onClickSave"
    :width="540"
  >
    <template #body>
      <div class="dialog-body">
        <div class="form-section">
          <BaseTextField
            v-model="userInfo.userId"
            label="User ID"
            placeholder="Please enter your ID"
            disabled
          />
          <BaseTextField
            v-model="userInfo.name"
            label="User name"
            placeholder="Please enter your name"
          />
        </div>
        <div class="form-section">
          <BaseTextField
            v-model="userInfo.email"
            label="E-mail"
            placeholder="Please enter your email"
          />
          <BaseTextField
            v-model="userInfo.phone"
            label="Contact"
            placeholder="Please enter your phone number"
          />
        </div>
        <div class="input-section">
          <BaseTextField
            v-model="userInfo.roleName"
            label="User Group"
            placeholder="Please enter your group"
            disabled
          />
        </div>
        <div class="input-section">
          <BaseTextField
            v-model="data.newPassword"
            type="password"
            label="New Password"
            :placeholder="$t('change-pw.new')"
            :rules="data.rules"
            hint="Please set the password within 8 to 20 digits by combining numbers, English and special characters. 3 consecutive duplicates and spaces are not allowed."
          />
        </div>
        <div class="input-section">
          <BaseTextField
            v-model="data.newPasswordCheck"
            type="password"
            label="Confirm Password"
            :placeholder="$t('change-pw.newRe')"
            :rules="[(value) => value === data.newPassword || 'Passwords do not match. Please re-enter after confirmation.']"
            hint="Please re-enter your password."
          />
        </div>
      </div>
    </template>
  </BaseDialog>

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
import { defineEmits, reactive, ref, watch } from 'vue';
import { Message } from '@/utils/message';
import { passwordRule, required } from '@/utils/rules';
import axiosInstance from '@/axios';
import { useI18n } from 'vue-i18n';
import {useAuthStore} from "@/portalStores/auth.ts";
import {getRefreshToken, sessionLogout} from "@/utils/sessionStorage.ts";


const authStore = useAuthStore()
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) {
      const user = JSON.parse(window?.sessionStorage?.getItem('user_info'));

      data.value.infoCloseCheck = false;
      data.value.pwCloseCheck = false;
      data.value.newPassword = '';
      data.value.newPasswordCheck = '';

      axiosInstance.get(`/krakend/svcfw/api/users/${user.userId}`).then((res) => {
        userInfo.userId = res.data.userId;
        userInfo.name = res.data.name;
        userInfo.email = res.data.email;
        userInfo.phone = res.data.phone;
        userInfo.roleName = res.data.roleName;
      });
    }
  }
);

const { t } = useI18n();

const confirm = reactive({
  message: 'Please check password.',
  visible: false
});

const data = ref({
  infoCloseCheck: false,
  pwCloseCheck: false,
  password: '',
  newPassword: '',
  newPasswordCheck: '',
  rules: [(value: string) => passwordRule(value, t('rules.passwordRule'))]
});

watch(
  () => data.value.infoCloseCheck,
  () => {
    if (data.value.infoCloseCheck && data.value.pwCloseCheck) {
      close();
    }
  }
)

watch(
  () => data.value.pwCloseCheck,
  () => {
    if (data.value.infoCloseCheck && data.value.pwCloseCheck) {
      close();
    }
  }
)

const userInfo = reactive({
  userId: '',
  name: '',
  email: '',
  phone: '',
  roleName: ''
});

const emit = defineEmits(['close']);

function onClickSave() {
  data.value.infoCloseCheck = false;
  data.value.pwCloseCheck = false;
  if (data.value.newPassword !== '') {
    if (!passwordRule(data.value.newPassword)) {
      confirm.message = 'Please check password.';
      confirm.visible = true;
      return;
    }

    if (data.value.newPassword !== data.value.newPasswordCheck) {
      confirm.message = 'Please check password.';
      confirm.visible = true;
      return;
    }

    axiosInstance.patch(`/krakend/svcfw/api/users/${userInfo.userId}/password/change`, { newPassword: data.value.newPassword }).then(res => {
      authStore.logout(getRefreshToken());
      data.value.pwCloseCheck = true;
    }).catch((err) => {
      if (err.response.data.resultCode === 'SFAP-APID-COMM-0107') {
        confirm.message = 'You cannot change your password. You can change your password after one week from the time of changing the password.';
        confirm.visible = true;
      }

      if (err.response.data.resultCode === 'SFAP-APID-COMM-0503' && err.response.data.resultMessage.includes('last 1 passwords')) {
        confirm.message = 'Must not be equal to any of last 1 passwords.';
        confirm.visible = true;
      }
    });
  }
  else data.value.pwCloseCheck = true;

  axiosInstance
    .patch(`/krakend/svcfw/api/users/${userInfo.userId}`, { name: userInfo.name, email: userInfo.email, phone: userInfo.phone })
    .then(() => {
      data.value.infoCloseCheck = true;
    })
    .catch(err=>{
      Message().err(err.response.data.resultMessage);
    });
}

function onClickCloseConfirm() {
  const statusCheck = window?.sessionStorage?.getItem('status_check');
  
  if (statusCheck === 'EXPIRED') {
    sessionLogout();
    window.location.reload();
  }
  confirm.visible = false;
}

const close = () => {
  const statusCheck = window?.sessionStorage?.getItem('status_check');

  if (statusCheck === 'EXPIRED') {
    sessionLogout();
    window.location.reload();
  }

  userInfo.userId = '';
  userInfo.name = '';
  userInfo.phone = '';
  (userInfo.roleName = ''), (data.value.newPassword = '');
  data.value.newPasswordCheck = '';
  emit('close');
};
</script>

<style lang="scss">
.form-section {
  display: flex;
  flex-wrap: nowrap;
  gap: 0 8px;

  .v-input {
    width: 50%;
  }

  &:nth-child(n + 2) {
    margin-top: 16px;
  }
}
.input-section {
  margin-top: 16px;
}
</style>

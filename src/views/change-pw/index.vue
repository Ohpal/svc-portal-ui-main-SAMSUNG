<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          width="600"
          class="mx-auto mt-15 pa-5"
        >
          <v-form ref="formRef">
            <div class="d-flex align-center">
              <h3>{{ $t('change-pw.changePw') }}</h3>
              <v-divider
                vertical
                class="ma-2"
              />
              <p class="text-secondary">{{ $t('rules.passwordRule') }}</p>
            </div>

            <v-divider class="mt-5" />

            <dl class="mt-5">
              <dt>{{ $t('change-pw.origin') }}</dt>
              <dd class="mt-1">
                <BaseTextField
                  v-model="data.password"
                  type="password"
                  :placeholder="$t('change-pw.origin')"
                />
              </dd>
            </dl>

            <dl class="mt-4">
              <dt>{{ $t('change-pw.new') }}</dt>
              <dd class="mt-1">
                <BaseTextField
                  v-model="data.newPassword"
                  type="password"
                  :placeholder="$t('change-pw.new')"
                  :rules="data.rules"
                />
              </dd>
            </dl>

            <dl class="mt-4">
              <dt>{{ $t('change-pw.newRe') }}</dt>
              <dd class="mt-1">
                <BaseTextField
                  v-model="data.newPasswordCheck"
                  type="password"
                  :placeholder="$t('change-pw.newRe')"
                  :rules="data.rules"
                  @keydown.enter="change()"
                />
              </dd>
            </dl>

            <div class="d-flex justify-center gc-2 mt-5">
              <v-btn
                color="primary"
                @click="() => change()"
              >
                {{ $t('common.confirm') }}
              </v-btn>
              <v-btn @click="$router.go(-1)">{{ $t('common.cancel') }}</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import { Message } from '@/utils/message';
import { ref } from 'vue';
import { useAuthStore } from '@/portalStores/auth';
import { passwordRule, required } from '@/utils/rules';
import axiosInstance from '@/axios';

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const authStore = useAuthStore();
const { userInfoValue } = authStore;

const data = ref({
  password: '',
  newPassword: '',
  newPasswordCheck: '',
  rules: [(value: string) => required(value), (value: string) => passwordRule(value)]
});

async function change() {

  formRef.value?.validate();
  // validation이 통과한 경우
  if (formRef.value?.isValid) {
    if (data.value.newPassword !== data.value.newPasswordCheck) {
      Message().err('alert.passwordCheck');
      return;
    }
    axiosInstance.patch(`/krakend/svcfw/api/users/${userInfoValue?.value?.userId}/change-pw`, {data: {password: data.value.password, newPassword: data.value.newPassword}}).then(response => {

    }).catch(error => {
      if (error.value) {
        // TODO 에러내용을 파싱해서 보여주도록 구성 필요
        if (error.value.data.resultMessage === 'wrong password') {
          Message().err('alert.wrongPassword');
        } else {
          Message().err(error.value.statusMessage as string);
        }
      } else {
        Message().success('alert.204.successChange');
      }
    })
  } else {
    // TODO 메시지 표시 기능 추가
    Message().err('alert.passwordRules');
  }
}
</script>

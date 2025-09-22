<template>
  <v-dialog
    v-model="visible"
    width="300"
  >
    <v-card>
      <div class="d-flex align-start pt-3 pr-3 pb-4 pl-5">
        <v-card-title class="pt-1">{{ dialogProps.title }}</v-card-title>
        <v-btn
          variant="text"
          color="secondary"
          class="ml-auto"
          icon="mdi-close"
          @click="emits('update:model-value', false)"
          ><v-icon size="18"
        /></v-btn>
      </div>

      <p class="text-height-18 text-center px-5">{{ dialogProps.message }}</p>
      <div
        v-if="dialogProps.form"
        class="dialog_form px-5"
      >
        <FormBox
          v-model="valid"
          :items="dialogProps.form"
          :dense="true"
        />
      </div>

      <div class="d-flex justify-center gc-1 pa-5 pt-4">
        <v-btn
          v-if="dialogProps.confirm"
          color="primary"
          :disabled="form ? !valid : false"
          @click="dialogProps.confirm"
          >{{ t('common.confirm') }}</v-btn
        >
        <v-btn @click="emits('update:model-value', false)">{{ t('common.cancel') }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type { FormBoxType } from '@/types';
import {useI18n} from "vue-i18n";
import {ref} from "vue";

const { t } = useI18n();
const emits = defineEmits(['update:model-value']);

const dialogProps = defineProps<{
  title: string;
  message: string;
  confirm?: Function | null;
  form?: FormBoxType | null;
}>();
const visible = defineModel<boolean>();
const valid = ref(false);
</script>

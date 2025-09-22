import { defineStore } from 'pinia';
import {computed, ref} from 'vue';

export const useProfileDialogStore = defineStore('profileDialog', () => {
  const profileDialogValue = ref({
    isOpen: false,
    close: () => {
      profileDialogValue.value.isOpen = false
    }
  })
  const profileDialog = computed(() => profileDialogValue.value)
  function updateProfileDialog(updateValue: any) {
    profileDialogValue.value = { ...profileDialogValue.value, ...updateValue};
  }

  return { profileDialog, updateProfileDialog };
});

import { defineStore } from 'pinia';
import {computed, ref} from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notificationValue = ref({
    isOpen: false,
    title: 'Notification',
    message: '',
    confirm: () => {
      notificationValue.value.isOpen = false
    },
    cancel: () => {
      notificationValue.value.isOpen = false
    }
  })
  const notification = computed(() => notificationValue.value)
  function updateNotification(updateValue: any) {
    if (notificationValue.value.isOpen !== updateValue.isOpen) notificationValue.value = { ...notificationValue.value, ...updateValue};
  }

  return { notification, updateNotification };
});

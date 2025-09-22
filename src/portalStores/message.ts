import type { MessageType } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMessageStore = defineStore('message', () => {
  const showMessage = ref(false);
  const messageOption = ref<MessageType>({
    contents: '',
    color: ''
  });

  function SetShowMessage(show: boolean) {
    showMessage.value = show;
  }

  function SetMessageOption(option: MessageType) {
    messageOption.value = option;
  }

  function getShowMessage() {
    return showMessage.value;
  }

  function getMessageOption(): MessageType {
    return messageOption.value;
  }

  return { SetShowMessage, SetMessageOption, getShowMessage, getMessageOption };
});

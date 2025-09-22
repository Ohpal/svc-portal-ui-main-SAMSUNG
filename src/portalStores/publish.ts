// import type { LoginType } from '~/types/auth';

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePublishStore = defineStore('publish', () => {
  const publish = ref<Boolean | null>(false);
  const getValue = computed(() => publish.value);

  function toggle() {
    publish.value = !publish.value;
  }
  return { toggle, getValue };
});

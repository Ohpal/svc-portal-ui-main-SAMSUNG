import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref<boolean>(false);
  const loadingCount = ref(0);

  function getLoading() {
    return loading.value;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function addLoadingCount() {
    loadingCount.value += 1;
  }

  function reduceLoadingCount() {
    if (loadingCount.value > 0) {
      loadingCount.value -= 1;
    }
  }

  function getLoadingCount() {
    return loadingCount.value;
  }

  return {
    setLoading,
    getLoading,
    addLoadingCount,
    reduceLoadingCount,
    getLoadingCount
  };
});

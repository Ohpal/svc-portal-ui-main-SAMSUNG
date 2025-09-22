<template>
  <v-snackbar
    v-model="showMessage"
    :color="messageOption.color"
    :timeout="30000"
    content-class="app-snackbar"
    location="top"
    variant="flat"
  >
    <div class="d-flex mr-8">
      <v-icon class="pre-icon mr-3">
        <template v-if="messageOption.color === 'info'"> mdi-alert-info</template>
        <template v-else-if="messageOption.color === 'success'"> mdi-alert-ok</template>
        <template v-else-if="messageOption.color === 'warning'"> mdi-alert-warning</template>
        <template v-else-if="messageOption.color === 'error'"> mdi-alert-error</template>
        <template v-else> mdi-checkbox-marked-circle</template>
      </v-icon>
      <div class="contents">{{ messageOption.contents }}</div>
    </div>
    <template #actions>
      <v-icon
        class="close-icon"
        @click="messageStore.SetShowMessage(false)">
        mdi-close
      </v-icon>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import { useMessageStore } from '@/portalStores/message';

const messageStore = useMessageStore();

const showMessage = computed({
  get() {
    return messageStore.getShowMessage();
  },
  set(v) {
    messageStore.SetShowMessage(v);
  }
});

const messageOption = computed(() => {
  return messageStore.getMessageOption();
});

watch(
  () => messageStore.getMessageOption,
  () => {
    messageStore.SetShowMessage(false);
    nextTick(() => messageStore.SetShowMessage(true));
  }
);
</script>
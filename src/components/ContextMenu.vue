<template>
  <div
    class="fixed h-1/3 context-menu"
    :style="{ top: y + 'px', left: x + 'px' }"
  >
    <div
      v-for="action in actions"
      :key="action.action"
      @click="emitAction(action.action)"
    >
      {{ action.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface ContextMenuType {
  actions: Array<any>;
  x: number;
  y: number;
}
const { actions, x, y } = defineProps<ContextMenuType>();
const emit = defineEmits(['action-click']);

const emitAction = (action: any) => {
  emit('action-click', action);
};
</script>

<style scoped>
.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  z-index: 50;
}

.context-menu div {
  padding: 10px;
  cursor: pointer;
}

.context-menu div:hover {
  background-color: #f0f0f0;
}
</style>

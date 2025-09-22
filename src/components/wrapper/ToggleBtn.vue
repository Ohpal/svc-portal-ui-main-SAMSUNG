<template>
  <div class="btn-toggle">
    <button
      v-for="(option, index) in options"
      :key="index"
      :class="{ 'is-active': index === selectedIndex }"
      @click="selectButton(index)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

type Option = {
  label: string;
};

const props = defineProps<{
  options: Option[];
  modelValue: number;
}>();

const selectedIndex = ref<number>(props.modelValue);

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (newValue) => {
  selectedIndex.value = newValue;
});

function selectButton (index: number) {
  selectedIndex.value = index;
  emit('update:modelValue', index);
}
</script>

<style scoped lang="scss">
.btn-toggle {
  display: inline-flex;
  height: 36px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}

button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);

  &.is-active {
    background: white;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    color: black;
  }
}

</style>

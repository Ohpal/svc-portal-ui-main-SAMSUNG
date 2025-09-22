<template>
  <div
    :style="flexStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  direction: {
    type: String,
    default: 'row'
  },
  justify: {
    type: String,
    default: 'flex-start'
  },
  align: {
    type: String,
    default: 'stretch'
  },
  wrap: {
    type: String,
    default: 'nowrap'
  },
  gap: {
    type: String,
    default: '0'
  },
  classes: {
    type: [String, Array],
    default: ''
  }
});

const flexStyle = computed<any>(() => ({
  display: 'flex',
  flexDirection: props.direction,
  justifyContent: props.justify,
  alignItems: props.align,
  flexWrap: props.wrap,
  gap: `${props.gap}px`
}));

</script>

<style lang="scss" scoped>
</style>

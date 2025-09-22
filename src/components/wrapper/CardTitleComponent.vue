<template>
  <div class="card-title">{{ title }}</div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
})

</script>

<style lang="scss" scoped>
.card-title {
  height: 32px;
  font-size: 18px;
  line-height: 32px;
  color: black;
}
</style>

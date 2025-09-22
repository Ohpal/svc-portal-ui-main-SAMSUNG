<template>
  <v-card class="shadow">
    <slot></slot>
  </v-card>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.shadow {
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.08);
}
</style>

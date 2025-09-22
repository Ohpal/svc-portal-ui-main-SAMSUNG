<template>
  <v-app>
    <component :is="$route.meta.layout || 'div'">
      <router-view></router-view>
    </component>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
</style>

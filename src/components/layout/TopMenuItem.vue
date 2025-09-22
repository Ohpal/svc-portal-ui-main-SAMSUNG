<template>
  <!-- eslint-disable-next-line vue/valid-v-for -->
  <v-list>
    <v-menu
      v-for="(menu, index) in menuList"
      :key="index"
      :open-on-hover="true"
      :value="index"
      location="end"
    >
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          :append-icon="menu.children ? 'mdi-arrow-right' : ''"
        >
          <v-list-item-title @click="$router.push(menu.url)">{{ $t(menu.title) }}</v-list-item-title>
        </v-list-item>
      </template>

      <TopMenuItem
        v-if="menu.children"
        :menu-list="menu.children || []"
      ></TopMenuItem>
    </v-menu>
  </v-list>
</template>
<script setup lang="ts">
import type { MenuType } from '@/types';

defineProps<{
  menuList: Array<MenuType>;
}>();
</script>

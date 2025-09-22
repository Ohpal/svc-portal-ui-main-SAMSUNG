<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <template #prepend>
        <!-- <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon> -->
      </template>
      <div class="d-flex justify-space-around">
        <v-spacer></v-spacer>
        <v-menu
          v-for="(menu, index) in menuList"
          :key="index"
          :open-on-hover="true"
          :value="index"
        >
          <template #activator="{ props }">
            <v-btn
              color="primary"
              v-bind="props"
            >
              {{ $t(menu.title) }}
            </v-btn>
          </template>
          <TopMenuItem :menu-list="menu.children"></TopMenuItem>
        </v-menu>
      </div>
      <template #append>
        <HeaderButtons></HeaderButtons>
      </template>
    </v-app-bar>

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px"
    >
      <slot />
    </v-main>

    <v-footer
      app
      class="bg-grey-lighten-1"
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          variant="text"
          class="mx-2"
          rounded="xl"
        >
          {{ link }}
        </v-btn>
        <v-col
          class="text-center mt-4"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-layout>
</template>

<script setup lang="ts">
import type { MenuType } from '@/types';
import {ref} from "vue";

defineProps<{
  menuList: Array<MenuType>;
}>();
const links = ref(['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us']);
</script>

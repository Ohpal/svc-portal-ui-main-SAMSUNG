<template>
  <loading-dialog v-model="visible"></loading-dialog>
  <v-layout
    v-resize="onResize"
    class="side_navi_layout"
  >
    <v-app-bar
      height="64"
      class="app_header"
      :flat="true"
    >
      <template #prepend>
        <v-btn
          v-if="showMenuHamburger"
          variant="text"
          class="btn_menu"
          @click.stop="d.naviRail ? (d.rail = !d.rail) : (d.naviDrawer = !d.naviDrawer)"
        >
          <v-icon />
        </v-btn>
        <img
          src="@/assets/img/flag/denmark.png"
          alt="국기"
          width="auto"
          height="24"
          class="ml-5 d-none d-md-block"
        />
        <img
          src="@/assets/img/company/maersk.png"
          alt="선사 로고"
          width="auto"
          height="24"
          class="ml-3 d-none d-md-block"
        />
        <v-divider
          vertical
          class="my-6 ml-5 d-none d-md-inline-flex"
        />
        <v-btn
          v-if="shipInfo !== null"
          class="btn_ship_info px-2 ml-3"
        >
          {{ shipInfo.shipName + '/' + shipInfo.shipTypeName }}
          <v-icon class="ml-2" />
        </v-btn>
      </template>

      <template #append>
        <HeaderButtons />
      </template>
    </v-app-bar>
    <v-main>
      <v-container
        fluid
        class="pa-4 pt-0 pa-md-8 pt-md-0"
      >
        <v-row no-gutters>
          <v-col cols="12">
            <BaseBreadCrumb
              :router="router"
              :menu-list="menuList"
            />
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <ToastMessage />
  </v-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { useDisplay } from 'vuetify';
import type { MenuType } from '@/types';
import SideMenuItem from '@/components/layout/SideMenuItem.vue';
import { useRouter } from 'vue-router';
import ToastMessage from '@/components/ToastMessage.vue';
import HeaderButtons from '@/components/layout/HeaderButtons.vue';
import { useMenuStore } from '@/portalStores/menus';
import { useAuthStore } from '@/portalStores/auth';

import { useLoadingStore } from '@/portalStores/loading';
import ShipSelect from '../ShipSelect.vue';
import { useShipStore } from '@/portalStores/ship';

interface Search {
  pageNumber: number;
  pageSize: number;
  sort: string;
  order: string;
  shipType: any;
  ship: any;
  system: any;
  tag: any;
  subSystem: any;
}

const shipStore = useShipStore();
const shipInfo = computed(() => shipStore.shipInfo);
const LoadingStore = useLoadingStore();
const visible = computed({
  get() {
    return LoadingStore.getLoading();
  },
  set(v) {
    LoadingStore.setLoading(v);
  }
});
const toggle = () => {
  visible.value = !visible.value;
};
const search: Search = reactive({
  pageNumber: 1,
  pageSize: 10,
  sort: 'createTime',
  order: 'DESC',
  shipType: null,
  ship: null,
  system: null,
  tag: null,
  subSystem: null
});
const showMenuHamburger = computed(() => {
  let show = true;
  if (window.location.pathname === '/home') {
    show = false;
  }
  return show;
});
const authStore = useAuthStore();
const menuStore = useMenuStore();
const menuList = computed(() => menuStore.getValue);
const router = useRouter();
const { lgAndUp } = useDisplay();
const d = reactive({
  naviDrawer: false,
  permanent: false,
  naviRail: false, // min nav 사용
  rail: false, // min nav toggle,
  selected: [-1],
  open: [-1]
});
const onResize = () => {
  if (lgAndUp.value) {
    d.permanent = true;
    d.naviRail = true;
  } else {
    d.permanent = false;
    d.naviRail = false;
  }
};
watch(
  () => router.currentRoute.value.path,
  () => setMenu()
);
watch(
  () => menuList,
  () => setMenu()
);
onMounted(() => {
  setMenu();
});
function setMenu() {
  d.selected = [];
  d.open = [];
  findMenu(menuList.value);
}
function findMenu(menus: Array<MenuType>) {
  if (menus === undefined) {
    return;
  }
  let currentPath: string;
  if (router.currentRoute.value.path.startsWith('/publish')) {
    currentPath = router.currentRoute.value.path.replace('/publish', '');
  } else {
    currentPath = router.currentRoute.value.path;
  }
  const findedMenu = menus.filter((menu) => currentPath.startsWith(menu.url))[0];
  if (findedMenu) {
    d.selected.push(findedMenu.menuId);
    d.open.push(findedMenu.menuId);
    if (findedMenu.children) {
      d.selected.pop();
      findMenu(findedMenu.children);
    }
  }
}
function onChangeOptions(value: any) {
  search.shipType = value.shipType;
  search.ship = value.ship;
  search.system = value.equipment;
  search.subSystem = value.subEquipment;
  search.tag = value.sensor;
}
</script>

<style lang="scss" scoped>
/* App Bar */
.app_header {
  position: fixed !important;
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.08);
  .v-toolbar__prepend {
    margin-inline: 0 auto;
    .btn_menu {
      width: 68px;
      height: 100%;
      border-radius: 0;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
      .v-icon {
        mask-image: url('@/assets/img/ic_s20_menu@2x.png');
        background-color: rgba(0, 0, 0, 0.8);
      }
      &:hover {
        & > .v-btn__overlay {
          opacity: 1;
        }
        .v-icon {
          background-color: #fff;
        }
      }
    }
    .btn_ship_info {
      font-size: 18px;
      font-weight: 500;
      .v-icon {
        background: url('@/assets/img/ic_s20_info@2x.png') 0 0 / 20px 20px no-repeat;
      }
      &:hover {
        .v-icon {
          background: url('@/assets/img/ic_s20_info_h@2x.png') 0 0 / 20px 20px no-repeat;
        }
      }
    }
  }
  .v-toolbar__append {
    margin-inline: auto 12px;
    .btn_alarm {
      .v-icon {
        mask-image: url('@/assets/img/ic_s20_bell@2x.png');
        background-color: rgba(0, 0, 0, 0.8);
      }
      .v-badge.v-badge--dot .v-badge__badge {
        border: 2px solid #fff;
      }
      .v-badge:not(.v-badge--dot) .v-badge__badge {
        min-width: 16px;
        height: 16px;
        padding: 0 3px;
        border-radius: 8px;
        font-size: 10px;
        line-height: 16px;
      }
      &:hover .v-icon {
        background-color: rgb(var(--v-theme-primary));
      }
    }
    .btn_account {
      .v-icon {
        mask-image: url('@/assets/img/ic_s20_account@2x.png');
        background-color: rgba(0, 0, 0, 0.8);
      }
      &:hover {
        .v-icon {
          background-color: rgb(var(--v-theme-primary));
        }
        .v-btn__content {
          color: rgb(var(--v-theme-primary));
        }
      }
    }
  }
  @include tablet {
    .v-toolbar__append {
      margin-inline: auto 28px;
    }
  }
}

/* App Side Nav */
.app_side_nav {
  position: fixed !important;
  box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.04);
  background: #fff;
  .nav_header {
    position: sticky;
    top: 0;
    z-index: 1;
    box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.08);
    .btn_menu {
      width: 68px;
      height: 100%;
      border-radius: 0;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
      .v-icon {
        mask-image: url('@/assets/img/ic_s20_menu@2x.png');
        background-color: rgba(0, 0, 0, 0.8);
      }
      &:hover {
        & > .v-btn__overlay {
          opacity: 1;
        }
        .v-icon {
          background-color: #fff;
        }
      }
    }
  }
  .gnb {
    height: calc(100% - 56px);
    overflow-x: hidden;
    overflow-y: auto;
    --indent-padding: 0px;
    .v-list-item {
      padding-inline: 20px 20px;
      border-radius: 0;
      .v-list-item__prepend {
        & > .v-icon {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.8);
          &:before {
            content: '';
          }
          & ~ .v-list-item__spacer {
            width: 8px;
          }
          &.mdi-ship-wheel {
            // Voyage 메뉴 아이콘
            mask-image: url('@/assets/img/ic_s20_ship_wheel@2x.png');
          }
        }
      }
      .v-list-item__append {
        & > .v-icon {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.38);
          opacity: 1;
        }
        & > .v-icon ~ .v-list-item__spacer {
          width: 8px;
        }
      }
      .v-list-item-title {
        font-size: 14px;
        line-height: 18px;
        font-weight: 400;
      }
      &.v-list-item--active {
        .v-list-item__prepend {
          & > .v-icon {
            background-color: #3277ff;
            color: rgb(var(--v-theme-primary));
          }
        }
        .v-list-item-title {
          font-weight: 500;
        }
      }
      &:not(:only-child) {
        margin-bottom: 0;
      }
    }
    .v-list-group__items {
      .v-list-item {
        padding-inline-start: 52px !important;
        .v-list-item__prepend {
          display: none; // depth2 부터 메뉴아이콘 삭제
        }
        .v-list-item-title {
          font-size: 13px;
        }
        &.v-list-item--density-default.v-list-item--one-line {
          min-height: 32px;
        }
      }
      .v-list-group__items {
        .v-list-item {
          padding-inline-start: 56px;
          .v-list-item-title::before {
            content: '·'; // depth3 부터 메뉴아이콘 '- ' 로 변경
            display: inline-block;
            margin: 0 6px 0 7px;
            font-size: 18px;
            line-height: 18px;
            font-weight: 700;
          }
        }
      }
    }
  }
  .logo {
    position: absolute;
    bottom: 0;
    z-index: 1;
    width: 100%;
    height: 56px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    background: #fff url('@/assets/img/ss_logo.png') center center no-repeat;
    background-size: 140px 28px;
  }
  &.v-navigation-drawer--rail {
    .gnb {
      height: 100%;
      .v-list-item {
        padding-inline: 24px 24px;
        .v-list-item__prepend > .v-icon ~ .v-list-item__spacer {
          display: none;
        }
        .v-list-item__append,
        .v-list-item__content {
          display: none;
        }
      }
      .v-list-group__items {
        display: none; // v-list-group 닫기
      }
    }
    .logo {
      display: none;
    }
  }
  &.v-navigation-drawer--mobile {
    .gnb {
      height: calc(100% - 64px - 56px);
    }
  }
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  ::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    border-radius: 6px;
    background-clip: content-box;
  }
}
.v-navigation-drawer__scrim {
  position: fixed;
  opacity: var(--v-medium-emphasis-opacity);
}

/* v-main 의 bgcolor, min-width, min-height */
.side_navi_layout {
  background: #ecf0f8;
}
.home-container {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

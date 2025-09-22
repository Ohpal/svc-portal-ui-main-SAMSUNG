<template>
  <template
    v-for="menu in sortedMenuList?.filter((menu) => menu.url !== '/fleet-management')"
    :key="menu.menuId"
  >
    <!-- eslint-disable-next-line vue/valid-v-for -->
    <!-- 메뉴에 children이 있는 경우 그룹 변경-->
    <v-list-group
      v-if="menu.children"
      class="side-menu-item-group"
      :value="menu.menuId"
      v-tooltip:right="{
        text: $t(menu.title),
        disabled: isRail ? false : true
      }"
    >
      <template #activator="{ props }">
        <v-list-item
          class="side-menu-item-list"
          v-bind="props"
          :title="$t(menu.title)"
          :append-icon="menu.depth === 1 ? undefined : 'mdi-chevron-down'"
          :active="isActive(menu)"
        >
          <template v-slot:prepend>
            <v-icon :icon="menu.icon" />
            <!-- <v-icon :icon="transformIconName(menu.icon)" /> -->
          </template>
        </v-list-item>
      </template>

      <SideMenuItem
        :menu-list="menu.children"
        @update:ship-for-service="onUpdateShipForService"
      />
    </v-list-group>
    <!-- eslint-disable-next-line vue/valid-v-for -->
    <v-list-item
      v-else-if="showAdminOrMaster(`${userSessionInfo.roleType}`, menu.url)"
      class="side-menu-item-list"
      :title="$t(menu.title)"
      :value="menu.menuId"
      v-tooltip:right="{
        text: $t(menu.title),
        disabled: isRail ? false : true
      }"
      :active="isActive(menu)"
      @click="onClickService(menu)"
    >
      <template
        v-if="menu.depth === 1"
        v-slot:prepend
      >
        <v-icon :icon="menu.icon" />
      </template>
    </v-list-item>
  </template>
  <ConfirmDialog
    :is-open="shipDialog.visible"
    :width="400"
    title="Notification"
    confirm-btn-text="Apply"
    :opacity="0"
    @click:confirm="onClickApply"
    @click:cancel="onClickCancel"
  >
    <div class="description mb-4">Please select a customer & ship to use other services.</div>
    <FlexComponent
      direction="column"
      gap="8"
    >
      <BaseAutocomplete
        v-if="!shipDialog.company"
        v-bind="shipDialog.company"
        :items="shipDialog.companyList"
        :item-title="'name'"
        :placeholder="'Select a customer'"
        return-object
        @update:modelValue="onChangeCompany"
      >
      </BaseAutocomplete>
      <BaseAutocomplete
        v-if="!isSetting"
        v-model="shipDialog.ship"
        :items="shipDialog.shipList"
        item-title="shipId"
        placeholder="Select a Ship"
        return-object
      />
    </FlexComponent>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { useCompanyStore } from '@/portalStores/company.ts';
import { useShipStore } from '@/portalStores/ship.ts';
import type { CompanyType, MenuType, ShipType } from '@/types';
import { useAuthStore } from '@/portalStores/auth.ts';
import FlexComponent from '@/components/wrapper/FlexComponent.vue';
import { ca } from 'vuetify/locale';

const props = defineProps({
  menuList: {
    type: Array as PropType<Array<MenuType>>
  },
  isRail: {
    type: Boolean,
    default: false
  },
  selectedMenu: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:shipForService']);
const onlyCompany = [
  '/setting/user/account',
  '/setting/user/group',
  '/setting/common/port-canal',
  '/setting/common/emission',
  '/setting/vessel/data'
];
const authStore = useAuthStore();
const userSessionInfo = computed(() => authStore.userSessionInfo);
const companyStore = useCompanyStore();
const company = computed(() => companyStore.company);
const companyList = computed(() => companyStore.companyList);
const shipStore = useShipStore();
const shipInfo = computed(() => shipStore.shipInfo);
const shipList = computed(() => shipStore.shipList);
const shipDialog = ref({
  visible: false,
  title: 'Select Ship',
  companyList: companyList,
  shipList: shipList,
  company: company,
  ship: null,
  service: null,
  message: ''
});
const router = useRouter();
const isFleet = computed(() => router.currentRoute.value.path === '/fleet-management');
const isSetting = computed(() => shipDialog.value.service.url.startsWith('/setting'));
const isActive = (menu) => {
  const currentPath = router.currentRoute.value.path;
  return currentPath.startsWith(menu.url);
};

const sortedMenuList = computed(() => {
  return props.menuList ? [...props.menuList] : [];
});

// 아이콘 이름을 변환하는 함수 예시
function transformIconName(icon: string): string {
  console.log('>>>icon', icon, '!!!!!!!', icon.includes('schedule'));

  return icon;
}

function onClickService(service: any) {
  shipDialog.value.service = service;
  if (userSessionInfo.value.userId === 'masteradmin') {
    router.push(service?.url);
    return;
  }
  if (company.value === null) {
    shipDialog.value.message = 'Please select a customer & ship to use other services.';
    shipDialog.value.companyList = companyList;
    shipDialog.value.visible = true;
  } else if (shipInfo.value === null) {
    if (onlyCompany.includes(`${shipDialog.value.service?.url}`)) {
      shipDialog.value.visible = false;
      router.push(shipDialog.value.service?.url || '');
      return;
    }
    shipDialog.value.message = 'Please select a ship to use other services.';
    shipDialog.value.shipList = shipList;
    shipDialog.value.visible = true;
  } else {
    router.push(service?.url);
    // window.open(service?.url, '_blank')
  }
}

function onChangeCompany(company: CompanyType) {
  companyStore.setCompanyInfo(company);
  if (onlyCompany.includes(`${shipDialog.value.service?.url}`)) {
    shipDialog.value.visible = false;
    router.push(shipDialog.value.service?.url || '');
    return;
  }
  shipStore.getShipList(company.companyId);
}

function onChangeShip(ship: ShipType) {
  shipStore.setShipInfo(ship);
}

function onUpdateShipForService() {
  emit('update:shipForService', shipInfo.value);
}

function onClickApply() {
  shipDialog.value.visible = false;

  if (shipDialog.value.ship !== null) {
    shipStore.setShipInfo(shipDialog.value.ship);
    emit('update:shipForService');
    // window.open(shipDialog.value.service?.url, '_blank')
    router.push(shipDialog.value?.service?.url);
  }
}

function onClickCancel() {
  shipDialog.value.visible = false;
  companyStore.setCompanyInfo(null);
  shipStore.setShipInfo(null);
}

function showAdminOrMaster(roleType: string, url: string) {
  if (url === '/setting') {
    if (roleType === 'MASTER' || roleType === 'ADMIN') {
      return true;
    } else {
      return false;
    }
  } else if (url === '/setting/company') {
    if (roleType === 'MASTER') {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
</script>

<style lang="scss" scoped>
.side-menu-item {
  &-group {
    // 1depth
    &.v-list-group {
      ::v-deep(> .v-list-item) {
        min-height: auto;

        .v-list-item-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        &:has(.mdi-chevron-up) {
          .v-icon,
          .v-list-item-title {
            font-weight: 500;
            color: var(--primary);
          }
        }
      }

      &:deep() {
        .v-list-group {
          &__items {
            --indent-padding: 36px;

            // 2depth
            .v-list-item {
              min-height: auto;
              padding: 8px 20px 8px 48px;
              padding-inline-start: 48px !important;

              &.v-list-item--active {
                .mdi-chevron-down {
                  &::before {
                    content: '\e045' !important;
                    font-family: 'hs4';
                  }
                }
              }

              &__prepend {
                display: none;
              }

              .v-list-item-title {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }
            }

            // 3depth
            .v-list-group {
              &__items {
                .v-list-item {
                  padding: 8px 20px 8px 0;
                  padding-inline-start: 48px !important;

                  &-title {
                    position: relative;
                    padding-left: 20px;
                    font-size: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;

                    &::before {
                      position: absolute;
                      content: '';
                      left: 10px;
                      top: 50%;
                      transform: translateY(-50%);
                      width: 2.5px;
                      height: 2.5px;
                      border-radius: 50%;
                      background: var(--black70);
                    }
                  }

                  &.v-list-item--active {
                    .v-list-item-title {
                      &::before {
                        background: var(--primary);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  &-list {
    &.v-list-item {
      padding: 12px 20px;

      &--nav:not(:only-child) {
        margin-bottom: 0;
      }

      &:deep() {
        .v-list-item {
          &-title {
            font-size: 14px;
            line-height: 18px;
            font-weight: 400;
            color: var(--black70);
            text-overflow: initial;
            word-break: break-word;
            white-space: normal;
          }

          &__prepend {
            width: 20px;
            margin-right: 8px;

            .v-icon {
              font-size: 20px;
              opacity: 1;
              color: var(--black80);
            }
          }

          &__append {
            .v-icon {
              font-size: 16px;
              opacity: 1;
              color: rgba(0, 0, 0, 0.38);
            }
          }

          &__spacer {
            width: initial;
          }
        }
      }

      &--active {
        &:deep() {
          .v-list-item {
            &-title {
              font-weight: 500;
              color: var(--primary);
            }

            &__prepend {
              .v-icon {
                color: var(--primary);
              }
            }
          }
        }
      }
    }
  }
}
</style>

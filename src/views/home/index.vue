<template>
  <div class="home-wrap">
    <div class="home-main-wrap">
      <div class="top-text-wrap">
        <div class="top-logo-wrap">
          <img
            src="@/assets/img/title_logo_new.png"
            width="600px"
            alt="ss_logo"
          />
        </div>
        <!-- <p class="main-title">Ship SeaTrial Service</p> -->
        <!-- <p class="sub-title">디지털 트윈 선박 시운전 서비스 개발 및 플랫폼 구축</p> -->
      </div>
      <div class="home-card-grid">
        <div
          class="home-card"
          :class="{ 'can-hover': true }"
          v-for="service in menuList"
          :key="`service_${service.id}`"
          @click="onClickService(service)"
        >
          <div class="home-card-icon">
            <em :class="`${service.convIcon}`" />
            <!-- "-dis"에따라 컨트롤   -->
          </div>
          <p class="home-card-title">
            {{ t(service.title) }}
          </p>
        </div>
      </div>
    </div>
    <div class="title-logo-wrap">
      <!-- <div class="chip-wrap">
        <div
          v-for="(item, idx) in ['Efficenet', 'Safe', 'Transparent', 'Conveient']"
          class="chip-item"
          :key="`chip_${idx}`"
        >
          {{ item }}
        </div>
      </div> -->
      <img
        src="@/assets/img/ss_logo.png"
        width="172px"
        alt="ss_logo"
      />
    </div>
  </div>

  <ConfirmDialog
    :is-open="confirm.visible"
    confirm-btn-text="Check"
    :width="600"
    persistent
    @click:confirm="() => (confirm.visible = false)"
    @click:cancel="() => (confirm.visible = false)"
  >
    <div v-if="confirm.messageList.length > 0">
      <p
        v-for="(msg, index) in confirm.messageList"
        v-bind:key="`msg_${index}`"
      >
        {{ msg !== '' ? msg : '&nbsp' }}
      </p>
    </div>
    <p v-else>{{ confirm.message }}</p>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/portalStores/menus';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { computed, onBeforeMount, onMounted, reactive, watch } from 'vue';
import axiosInstance from '@/axios';
import { useRouter, type RouteLocationRaw } from 'vue-router';
import { useShipStore } from '@/portalStores/ship';
import { useCompanyStore } from '@/portalStores/company.ts';
import { usePlatformStore } from '@/portalStores/platform.ts';
import { useAuthStore } from '@/portalStores/auth.ts';

interface MenuItem {
  createdUser: string;
  updatedUser: any;
  createdTime: string;
  updatedTime: any;
  menuId: number;
  title: string;
  url: string;
  parentId: any;
  sequence: number;
  depth: number;
  useYN: string;
  icon: string;
  type: string;
  description: string;
  children: any;
  convIcon?: string;
  id?: string;
}

const shipStore = useShipStore();
const shipList = computed(() => shipStore.shipList);
const router = useRouter();
const menuStore = useMenuStore();
const menuOrder = [
  // { url: '/voyage', convIcon: 'home_icon_mdi-voyage-dis', title: 'menu.voyage' },
  // { url: '/spms', convIcon: 'home_icon_mdi-performance-dis', title: 'menu.SPMS' },
  // { url: '/equip-system', convIcon: 'home_icon_mdi-equipment-dis', title: 'menu.equipmentSystem' },
  // { url: '/security', convIcon: 'home_icon_mdi-manager-dis', title: 'menu.smartManager' },
  // { url: '/emission', convIcon: 'home_icon_mdi-emission-dis', title: 'menu.emission' },
  // { url: '/crew-support', convIcon: 'home_icon_mdi-crew-dis', title: 'menu.crewSupport' },
  // { url: '/safety', convIcon: 'home_icon_mdi-safety-dis', title: 'menu.safetyMonitor' },
  { url: '/lesson', convIcon: 'home_icon_mdi-share-variant-dis', title: 'menu.lesson' },
  { url: '/schedule', convIcon: 'home_icon_mdi-calendar-clock-dis', title: 'menu.schedule' },
  { url: '/digitalization', convIcon: 'home_icon_mdi-file-document-check-outline-dis', title: 'menu.digitalization' },
  { url: '/personnel', convIcon: 'home_icon_mdi-account-multiple-dis', title: 'menu.personnel' },
  { url: '/simulation', convIcon: 'home_icon_mdi-simulation-dis', title: 'menu.simulation' },
  { url: '/monitoring', convIcon: 'home_icon_mdi-map-dis', title: 'menu.monitoring' },
  { url: '/analysis', convIcon: 'home_icon_mdi-chart-timeline-variant-dis', title: 'menu.analysis' },
  { url: '/setting', convIcon: 'home_icon_mdi-setting-dis', title: 'menu.setting' }
];
const menuList = computed<Array<MenuItem>>(() => {
  let newMenuList = [...menuStore.getValue];
  for (let i = 0; i < menuOrder.length; i++) {
    const findIndex = newMenuList.findIndex((menu: MenuItem) => {
      return menu.url === menuOrder[i].url;
    });
    if (findIndex > -1) {
      newMenuList[findIndex].convIcon = `home_icon_${newMenuList[findIndex].icon}`;
    } else {
      newMenuList.splice(i, 0, menuOrder[i]);
    }
  }
  return newMenuList;
});
const companyStore = useCompanyStore();
const company = computed(() => companyStore.company);
const platformStore = usePlatformStore();
const platform = computed(() => platformStore.platform);
const authStore = useAuthStore();
const userSessionInfo = computed(() => authStore.userSessionInfo);
const confirm = reactive({
  message: '',
  messageList: [],
  visible: false
});

watch(
  () => userSessionInfo.value,
  () => {
    companyStore.getCompanyList(userSessionInfo.value);
  }
);

watch(
  () => company.value,
  () => {
    if (company.value !== null) {
      shipStore.getShipList(company.value.companyId);
    }
  }
);

watch(
  () => shipList.value,
  () => {
    if (shipList.value !== undefined) {
      shipStore.setShipInfo(shipList.value?.[0]);
    }
  }
);
// function getShipList() {
//   shipDialog.shipList = [];
//   const resData = {
//     rows:[
//       {
//         shipId: "S001",
//       shipName: "testShip",
//       shipTypeId: "1",
//       typeName: "testType",
//       builder: "test",
//       tonnage: "1000",
//       maximumSpeed: "1",
//       commissionDate: "2024-07-05"
//       }
//     ]
//   }  // axiosInstance.get(`/api/ships`, { params: {pageSize: 9999, pageNumber: 0}}).then((res) =>{
//     // const resData = res.data;

//     resData.rows.forEach((e: { shipId: any; })=>shipDialog.shipList.push({ ...e, key: e.shipId, title: e.shipId }));
//   // });
// }

function onClickService(service: MenuItem) {
  if (service.menuId) {
    if (userSessionInfo.value.userId === 'masteradmin') router.push('/setting/company');
    else router.push(service.url);
  }
}

// onBeforeMount(() => {
// if (platform.value === 'onshore') {
//   router.push('/fleet-management');
// }
// });
async function getSecurityMessage() {
  await axiosInstance(`/krakend/svcfw/api/users-security/warning`).then((res) => {
    if (res.data) {
      if (res.data.msg.length > 0) {
        confirm.messageList = res.data.msg.split('<br/>');
        confirm.visible = true;
      }
    }
  });
}
onMounted(() => {
  console.log('onMounted');
  if (!company.value && userSessionInfo.value) {
    companyStore.getCompanyList(userSessionInfo.value);
  }
  getSecurityMessage();
});
</script>
<style scoped lang="scss">
.home-wrap {
  width: 100%;
  height: calc(100% - 148px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 40px;
  .title-logo-wrap {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 148px;
    background: var(--black3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    .chip-wrap {
      display: flex;
      align-items: center;
      gap: 20px;
      .chip-item {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 40px;
        background: #fff;
        border-radius: 20px;
        color: var(--black70);
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
  .home-card-grid {
    width: 100%;
    height: 440px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0px;
    .home-card {
      width: 200px;
      transition: 0.3s;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid rgba($color: #000000, $alpha: 0);
      gap: 34px;
      border-radius: 12px;
      &.can-hover {
        &:hover {
          box-shadow: 0px 20px 32px 0px var(--black8);
          border: 1px solid var(--black8);
        }
      }
      .home-card-icon {
        width: 92px;
        height: 92px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: var(--black60);
      }
      .home-card-title {
        font-size: 16px;
        font-weight: 400;
        color: var(--black60);
      }
    }
  }
  .home-main-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 76px;
    .top-text-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      .main-title {
        font-size: 42px;
        font-weight: 700;
        color: var(--black80);
        display: flex;
        align-items: flex-start;
        span {
          font-size: 24px;
          font-weight: 700;
          margin-right: 12px;
        }
      }
      .sub-title {
        font-size: 15px;
        font-weight: 400;
        color: var(--black60);
        text-align: center;
        line-height: 24px;
      }
    }
  }
}
.top-logo-wrap {
  width: 100%;
  margin-bottom: 1rem;
}
.home_icon_ {
  @each $icon in calendar-clock, map, account-multiple, file-document-check-outline, chart-timeline-variant, simulation, share-variant, setting {
    &mdi-#{$icon} {
      content: url('@/assets/img/home_icon/home_icon_mdi-#{$icon}.svg');
      &-dis {
        content: url('@/assets/img/home_icon/home_icon_mdi-#{$icon}-dis.svg');
      }
    }
  }
}
@media screen and (max-width: 1180px) {
  .home-main-wrap {
    gap: 40px !important;
  }
}
</style>

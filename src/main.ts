import '@svcfw/components/dist/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerPlugins } from './plugins';
import axiosInstance from '@/axios';
import i18nInstance from '@/i18n';
import { registerDirectives } from '@/directive';
import type { CompanyType, ShipType, WebConfigType } from '@/types';
import mitt from 'mitt';
import { setCommonIntervalTime, setLogoutTime } from '@/utils/sessionStorage.ts';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import VueApexCharts from 'vue3-apexcharts';

import vDash from '@/plugins/dash_directive.ts';

const app = createApp(App);
app.config.globalProperties.$axios = axiosInstance;

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
});

// map component emitter 설정
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

app.use(router);
app.use(createPinia());
app.use(i18nInstance);
app.use(vuetify);
app.use(Antd); // ant design
app.directive('dash', vDash);
app.use(VueApexCharts);

registerPlugins(app);
registerDirectives(app);

// MFE 에서 상태관리를 위한 global 변수 설정
type ShareDataType = {
  shipList?: ShipType[];
  count?: number;
  companyList?: CompanyType[];
  intervalTime: number;
  logoutTime: number;
};

async function setConfig() {
  const response = await fetch('/web-config');
  let result: WebConfigType;
  try {
    result = (await response.json()) as WebConfigType;
  } catch (e) {
    result = {
      intervalTime: 15000,
      logoutTime: 3600000
    };
  }
  setLogoutTime(result.logoutTime);
  setCommonIntervalTime(result.intervalTime);
  return result;
}
const webConfig: WebConfigType = await setConfig();

declare global {
  interface Window {
    SHARE_DATA: ShareDataType;
  }
}
window.SHARE_DATA = {
  count: 0,
  intervalTime: webConfig.intervalTime,
  logoutTime: webConfig.logoutTime
};

app.mount('#app');

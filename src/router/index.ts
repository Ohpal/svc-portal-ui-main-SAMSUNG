import { createRouter, createWebHistory } from 'vue-router';
import SideNaviLayout from '@/components/layout/SideNaviLayout.vue';
import Empty from '@/components/layout/Empty.vue';
import OnlyTopBarLayout from '@/components/layout/OnlyTopBarLayout.vue';

import Home from '@/views/home/index.vue';
import Login from '@/views/layouts/Login.vue';
import ChangePW from '@/views/change-pw/index.vue';
import NotFound from '@/views/layouts/NotFound.vue';

import { getAccessToken } from '@/utils/sessionStorage.ts';
import { Message } from '@/utils/message.ts';
import { useMenuStore } from '@/portalStores/menus.ts';
import { useAuthStore } from '@/portalStores/auth';

// const voyageRouter = () => import('svc-voyage/voyageRouter');
// const securitymanagerRouter = () => import('svc-securitymanager/securityRouter');
// const spmsRouter = () => import('svc-spms/spmsRouter');
// const equipSystemRouter = () => import('svc-equip-system/equipSystemRouter');
// const emissionRouter = () => import('svc-emission/emissionRouter');
// const crewSupportRouter = () => import('svc-crew-support/crewSupportRouter');
// const safetyRouter = () => import('svc-safety/safetyRouter');
const settingRouter = () => import('svc-setting/settingRouter');
// const fleetRouter = () => import('svc-fleet/fleetRouter');
const lessonRouter = () => import('svc-lesson/lessonRouter');
const scheduleRouter = () => import('svc-xinnos/scheduleRouter');
const digitalizationRouter = () => import('svc-xinnos/digitalizationRouter');
const personnelRouter = () => import('svc-xinnos/personnelRouter');
const simulationRouter = () => import('svc-kdt/simulationRouter');
// const mrcRouter = () => import('svc-mrc/mrcRouter');
const monitoringRouter = () => import('svc-mrc/monitoringRouter');
const analysisRouter = () => import('svc-vegas/analysisRouter');
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { layout: Empty }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { layout: Empty }
    },
    {
      path: '/change-pw',
      name: 'ChangePW',
      component: ChangePW,
      meta: { layout: Empty }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { layout: Empty }
    }
  ]
});

// 레이아웃 없이 보여져야 할 path List
const emptyList = ['report/detail-for-pdf', 'emission-cii/preview'];
function traverseChildren(node: any) {
  node.meta = emptyList.includes(node.path) ? { ...node.meta, layout: Empty } : { ...node.meta, layout: SideNaviLayout };
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => traverseChildren(child));
  }
}

// 비동기로 호출하여 라우터에 추가할때 라우터가 덮어쓰기 되는 현상으로 인해 sleep을 주고 라우터에 추가한다.
Promise.allSettled([
  // spmsRouter(),
  // voyageRouter(),
  // securitymanagerRouter(),
  // equipSystemRouter(),
  // emissionRouter(),
  // crewSupportRouter(),
  // safetyRouter(),
  settingRouter(),
  // fleetRouter(),
  lessonRouter(),
  scheduleRouter(),
  digitalizationRouter(),
  personnelRouter(),
  simulationRouter(),
  // mrcRouter(),
  monitoringRouter(),
  analysisRouter()
])
  .then(async (results) => {
    for (const result of results) {
      await sleep(100);
      if (result.status === 'fulfilled') {
        const tempRouter = result.value.default;
        traverseChildren(tempRouter);
        router.addRoute(tempRouter);
      }
      // if (result.status === 'rejected') {}
    }
  })
  .catch((error) => {
    console.log(error);
  });

router.beforeEach(async (to, from, next) => {
  if (document.getElementsByClassName('v-main')[0]) document.getElementsByClassName('v-main')[0].scrollTop = 0;
  // 토큰이 없는 상태에서 로그인 페이지가 아닌경우 로그인페이지로 이동
  if (!getAccessToken() && !to.path.includes('login')) {
    if (from.path !== '/' && from.path !== '') {
      Message().err('alert.401.Unauthorized');
    }
    next('/login');
  } else if (to.path.includes('login')) {
    //로그인 페이지로 이동
    // 추후 로그인 뿐만아니라 레이아웃 없이 페이지만 노출되는 화면들이 추가된다면 여기에 분기처리를 추가한다.
    next();
  } else {
    // 토큰도 있고 로그인페이지가 아닌 경우
    let queue: any[] = [];
    const checkSubPage = () => {
      return true;
    };
    const company = JSON.parse(window?.sessionStorage?.getItem('company_info'));
    const platform = window?.sessionStorage?.getItem('platform');
    const user = JSON.parse(window?.sessionStorage?.getItem('user_info'));
    // if (platform && platform === 'onshore' && to.name !== 'NotFound') {
    //   if (user.userId === 'masteradmin') {
    //     next();
    //   } else if (company === null && to.path !== '/fleet-management') {
    //     next('/fleet-management');
    //   }
    // }

    // session으로 가져온 메뉴에 이동하려고 하는 url이 있는지 확인하는 함수. 있다면 해당 메뉴를 리턴
    const checkRoute = (menuList: any[], findMenuUrl: string, vueRoute) => {
      if (vueRoute?.meta?.subPage) {
        const lastIndex = findMenuUrl.lastIndexOf('/');
        findMenuUrl = findMenuUrl.slice(0, lastIndex);
      }
      queue = queue.concat(menuList);
      let findMenu = undefined;
      while (queue.length) {
        const menuItem = queue.shift();

        if (findMenuUrl.startsWith(menuItem.url)) {
          if (menuItem.url === findMenuUrl) {
            findMenu = menuItem;
            queue = [];
            break;
          } else if (menuItem.children) {
            queue = queue.concat(menuItem.children);
            continue;
          }
        }
      }
      return findMenu;
    };
    const menuStore = useMenuStore();
    let menuList = menuStore.getValue;
    if (menuList === undefined) {
      const authStore = useAuthStore();
      await authStore.getUserSessionInfo();
      menuList = menuStore.getValue;
    }

    let tempRoute;
    // 1초마다 한번씩 최대 5초 동안 라우트가 로드 되었는지 확인한다.
    for (let i = 0; i < 5; i++) {
      tempRoute = router.getRoutes().filter((route) => route.path === to.path)[0];
      if (tempRoute !== undefined) {
        break;
      } else {
        await sleep(1000);
      }
    }

    // 권한은 있으나 route에 등록이 안되어 있는 경우 MFE에서 처리가 늦어지거나 실제로 vue route에 등록이 안되어 있는 경우이다.
    const foundMenu = checkRoute(menuList, to.path, tempRoute);
    // console.log(foundMenu, tempRoute);
    if (foundMenu !== undefined) {
      // foundMenu가 있다면 권한과 메뉴에는 데이터가 있다.
      if (to.name === 'NotFound') {
        // 하지만 라우팅이 실패하여 페이지를 찾을 수 없는 경우 MFE 파일을 로드 하기 전에 라우트 이동이 된 상황이다.
        if (tempRoute !== undefined) {
          // 라우트에 등록이 되었다면 해당하는 라우트로 다시한번 라우팅처리한다.
          next(to.fullPath);
        } else {
          // 3초이상 불러오지 못한경우 네트워크 에러라고 판단하여 not found 페이지로 이동된다.
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

export default router;

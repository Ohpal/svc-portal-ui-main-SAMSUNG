import { useAuthStore } from '@/portalStores/auth';
import { ref, watch } from 'vue';

export default {
  // called before bound element's attributes
  // or event listeners are applied
  //   created(el, binding, vnode, prevVnode) {
  // see below for details on arguments
  //   },
  // called right before the element is inserted into the DOM.
  // beforeMount(el, binding, vnode, prevVnode) {
  beforeMount() {
    // const authStore = useAuthStore();
    // const router = useRouter();
    // const { roleInfoValue } = authStore;
    // console.log(roleInfoValue.value);
    // let currentPath;
    // if (router.currentRoute.value.path.startsWith('/publish')) {
    //   currentPath = router.currentRoute.value.path.replace('/publish', '');
    // } else {
    //   currentPath = router.currentRoute.value.path;
    // }
    // const findedMenu = roleInfoValue.value.filter((roleMenu) => currentPath.startsWith(roleMenu.menu.url))[0];
    // console.log(findedMenu);
  },
  // called when the bound element's parent component
  // and all its children are mounted.
  //   mounted(el, binding, vnode, prevVnode) {},
  // called before the parent component is updated
  //   beforeUpdate(el, binding, vnode, prevVnode) {},
  // called after the parent component and
  // all of its children have updated
  //   updated(el, binding, vnode, prevVnode) {},
  // called before the parent component is unmounted
  //   beforeUnmount(el, binding, vnode, prevVnode) {},
  // called when the parent component is unmounted
  //   unmounted(el, binding, vnode, prevVnode) {}
  mounted(el: any, binding: any) {
    //   console.log(el, binding);
    //   page에서 접근가능한 권한을 List 형식으로 pagePermission 에 저장한다.

    // if (findedMenu) {
    // }
    const authStore = useAuthStore();
    // const router = useRouter();
    const { roleInfoValue } = authStore;
    const findedMenu = ref();
    watch(
      () => roleInfoValue.value,
      () => {
        changePermission(roleInfoValue.value);
      }
    );

    init();

    function init() {
      if (roleInfoValue?.value) {
        changePermission(roleInfoValue?.value);
      }
    }

    function changePermission(rolePermission: any) {
      let currentPath = window.location.href.split(window.location.host)[1];
        if (currentPath.startsWith('/publish')) {
          currentPath = currentPath.replace('/publish', '');
        } else if (currentPath.includes('/write')) {
          currentPath = currentPath.replace('/write', '');
        }


      [findedMenu.value] = rolePermission.filter((role: any) => currentPath === role.url);
      if (!findedMenu.value?.permission.includes(binding.value)) {
        el.remove();
      }
    }

    // const pagePermission = computed(() => ['read', 'create', 'delete', 'update']);
    //   element에서 접근가능한 권한을 받아오고 해당 권한에 접근할 수 없다면 element를 지워서 보여지지 않도록 한다.
    // if (!pagePermission
  }
  // getSSRProps(binding, vnode) {
  //   // you can provide SSR-specific props here
  //   return {};
  // }
}

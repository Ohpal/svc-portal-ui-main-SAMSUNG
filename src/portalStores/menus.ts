import type { MenuType } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref();
  const getValue = computed(() => menuList.value);

  async function setMenuList(menus: any[]) {
    const roleMenuList: any[] = [];
    menus.forEach((e) => {
      if (e.aclr === 'Y') roleMenuList.push(e.menu);
    });
    menuList.value = await setTreeMenu(roleMenuList.sort((a, b) => {
      // 첫 번째 조건: depth로 정렬
      if (a.depth < b.depth) return -1;
      if (a.depth > b.depth) return 1;

      // 두 번째 조건: menuId로 정렬 (dpeth가 같은 경우)
      if (a.menuId < b.menuId) return -1;
      if (a.menuId > b.menuId) return 1;

      // 두 조건 모두 같은 경우
      return 0;
    }) || []);
  }
  async function setTreeMenu(menuData: Array<MenuType>) {
    return new Promise(async (resolve) => {
      const tree: MenuType = {
        menuId: 0,
        appId: 'root',
        description: 'root',
        title: 'root',
        url: 'root',
        parentId: null,
        sequence: 0,
        depth: 1,
        useYN: 'root',
        icon: 'root',
        type: 'menu',
        children: []
      };
      for (const menuItem of menuData) {
        await resolveTreeMenu(menuItem, tree, tree);
      }
      tree.children?.sort((a: MenuType, b: MenuType) => a.sequence - b.sequence);
      resolve(tree.children)
    })
  }
  async function resolveTreeMenu(menuItem: MenuType, targetMenuItem: MenuType, tree: MenuType) {
    new Promise(async (resolve) => {
      if (menuItem.depth === 1) {
        if (menuItem.useYN === 'Y') {
          tree.children?.push(menuItem);
        }
        return
      }

      if (menuItem.parentId === targetMenuItem.menuId) {
        if (!targetMenuItem.children) {
          targetMenuItem.children = [];
        }
        if (!targetMenuItem.children.includes(menuItem)) {
          targetMenuItem.children.push(menuItem);
          targetMenuItem.children.sort((a: MenuType, b: MenuType) => a.sequence - b.sequence);
        }
        return
      }
      if (targetMenuItem.children) {
        for (const newTargetMenuItem of targetMenuItem.children) {
          await resolveTreeMenu(menuItem, newTargetMenuItem, tree);
        }
      }
    })

  }
  return { getValue, setMenuList };
});

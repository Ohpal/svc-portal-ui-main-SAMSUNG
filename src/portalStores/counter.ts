// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'
// import {useShipStore} from "@/portalStores/ship.ts";

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(window.SHARE_DATA.count)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//     window.SHARE_DATA.count = count.value
//     const ship = useShipStore();
//     console.log(ship.getShipInfo().shipId)
//   }

//   return { count, doubleCount, increment }
// })

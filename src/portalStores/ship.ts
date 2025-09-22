import { defineStore } from 'pinia';
import axiosInstance from "@/axios.ts";
import { computed, ref } from "vue";
import type { ShipType } from "@/types";

export const useShipStore = defineStore('ship', () => {

    const shipListValue = ref<ShipType[] | undefined>(window.SHARE_DATA.shipList)
    const shipList = computed(() => shipListValue.value)
    const shipInfoValue = ref<ShipType | null>(JSON.parse(window?.sessionStorage?.getItem('ship_info')))
    const shipInfo = computed<ShipType | null>(() => shipInfoValue.value)
    function getShipList(companyId: number) {
        axiosInstance.get(`/krakend/svcfw/api/ships`, {
            params: {
                companyId: companyId,
                pageSize: 9999,
                pageNumber: 0,
                order: 'asc'
            }
        }).then(response => {
            const ship = getShipInfo();
            if (ship) {
              const selected = response.data.rows.filter((e) => e.shipId === ship.shipId);

              if (selected.length < 1) {
                  setShipInfo(null);
              } else {
                  setShipInfo(selected[0])
              }
            }

            window.SHARE_DATA.shipList = response.data.rows
            shipListValue.value = response.data.rows
        })
    }

    function getShipInfo() {
        return JSON.parse(window?.sessionStorage?.getItem('ship_info'));
    }

    function setShipInfo(ship: ShipType | null) {
        if (!ship) {
            window?.sessionStorage?.removeItem('ship_info');
            shipInfoValue.value = null
        } else {
            const {shipId, shipName, shipTypeName, shipTypeId, isChangedByBtnMenu} = ship
            shipInfoValue.value = {shipId, shipName, shipTypeName, shipTypeId, isChangedByBtnMenu}
            window?.sessionStorage?.setItem('ship_info', JSON.stringify({shipId, shipName, shipTypeName, shipTypeId}));
        }
    }

    return {
        getShipList,
        shipList,
        shipInfo,
        getShipInfo,
        setShipInfo
    }
});

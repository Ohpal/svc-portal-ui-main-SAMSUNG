import { defineStore } from 'pinia';
import axiosInstance from "@/axios.ts";
import {computed, ref} from "vue";
import {setPlatform} from "@/utils/sessionStorage.ts";

export const usePlatformStore = defineStore('platform',()=>{
    const platform = computed(() => platformValue.value);
    const platformValue  = ref(window?.sessionStorage?.getItem('platform') || undefined);
    async function getPlatformInfo() {
        await axiosInstance.get('/krakend/svcfw/api/platforms').then(response => {
            platformValue.value = response.data.platform
            setPlatform(response.data.platform)
        })
        return Promise.resolve()
    }


    return { getPlatformInfo, platform}
})

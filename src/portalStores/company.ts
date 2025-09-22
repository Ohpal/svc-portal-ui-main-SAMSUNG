import { defineStore } from 'pinia';
import axiosInstance from "@/axios.ts";
import {computed, ref} from "vue";
import type {CompanyType} from "@/types";

export const useCompanyStore = defineStore('company',()=>{

    const companyListValue = ref(window.SHARE_DATA.companyList)
    const companyList = computed(() => companyListValue.value)

    const companyValue = ref<CompanyType | null>(JSON.parse(window?.sessionStorage?.getItem('company_info')))
    const company = computed(() => companyValue.value)
    function getCompanyList(userSession: {
        userId: String;
        roleName: String;
        companyName: String;
    }) {
        if(userSession.roleName === 'Admin') {
            axiosInstance.get('/krakend/svcfw/api/companies', { params: {pageSize: 9999, pageNumber: 0}}).then(response => {
                const platform = window?.sessionStorage?.getItem('platform');
                window.SHARE_DATA.companyList = response.data.rows
                companyListValue.value = response.data.rows
                // if(response.data?.rows?.length === 1 || platform === 'onboard') {
                    const data = response.data.rows.filter(e=> e.name === userSession.companyName);
                    if(data.length === 1) {
                        setCompanyInfo(data[0])
                    }
                // }
            })
        } else {
            // axiosInstance.get(`/krakend/svcfw/api/users/${userSession.userId}`).then(response => {
            //     window.SHARE_DATA.companyList = [{...response.data, description: response.data.companyName}]
            //     setCompanyInfo({...response.data, description: response.data.companyName})
            // })
            axiosInstance.get('/krakend/svcfw/api/companies', { params: {pageSize: 9999, pageNumber: 0}}).then(response => {
                const data = response.data.rows.filter(e=> e.name === userSession.companyName);
                window.SHARE_DATA.companyList = data
                companyListValue.value = data
                if(data.length === 1) {
                    setCompanyInfo(data[0])
                }
            })
        }
    }
    function setCompanyInfo(company: CompanyType | null) {
        companyValue.value = company
        if (company === null) window?.sessionStorage?.removeItem('company_info');
        else window?.sessionStorage?.setItem('company_info', JSON.stringify(company));
    }

    return { getCompanyList, companyList, company, setCompanyInfo }
})

import { defineStore } from "pinia"
import type { SessionResponse } from "~/model/auth"
import type { OutletConfigMain, OutletTime } from "~/model/booking"
import type { Outlet } from "~/model/merchant"
import type { Staff } from "~/model/staff"

export const useMainStore = defineStore('main', () => {
    const mainLoading = ref(false)

    const locale = ref<"en" | "ms" | "zn-CH">("en")
    const langOption = ref(['en','ms', "zn-CH"])
    const shopToken = ref<string | null>(null)
    const systemLoading = ref(false)
    const outletSetup = ref<OutletConfigMain[]>([])
    const sessionData = ref<SessionResponse | null>(null)
    const staffList = ref<Staff[]>([])
    const outletList = ref<Outlet[]>([])

    function setSessionData(sessionD: SessionResponse) {
        sessionData.value = sessionD
    }

    function setSysLoad(wasIt: boolean){
        systemLoading.value = wasIt
    }

    function setOutletSetup(setupList: OutletConfigMain[]){
        outletSetup.value = setupList
    }

    function updateShopToken(token: string){
        shopToken.value = token
    }
    function switchLanguage(lang: "en" | "ms" | "zn-CH"){
        // console.log("The Value",lang)
        locale.value = lang
    }

    function setMainLoading(val: boolean) {
        mainLoading.value = val
    }

    function saveListOutlet(lst: Outlet[]){
        outletList.value = lst
    }

    return { 
        mainLoading, 
        setMainLoading, 
        locale, 
        switchLanguage, 
        langOption, 
        shopToken, 
        updateShopToken, 
        systemLoading, 
        setSysLoad, 
        sessionData, 
        setSessionData,
        outletSetup,
        setOutletSetup,
        outletList,
        saveListOutlet
    }
})

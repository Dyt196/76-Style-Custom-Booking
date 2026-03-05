import type { StaffResponse, OutletResponse, SessionResponse, MenuResponse, WorkHourResponse, ShopSetupResponse, LogRes } from "~/model/auth";
import type { Outlet } from "~/model/merchant";
import type { MenuItem } from "~/model/service";
import type { Staff } from "~/model/staff";
import type { FetchError } from 'ofetch'
import type { Classroom } from "~/model/classroom";
import { page } from "#build/ui";
import type { AllOutlet } from "~/model/custom";

const cachedTime = 5 * 60 * 1000 // Time data to saved in milliseconds
export async function getMerchantToken(shortname: string): Promise<{sessionData?: SessionResponse, result: number}>{

    const mainStore = useMainStore()

    const url = "https://authen.tunai.io/web/login"
    const method = "POST"
    const sendBody = { shortname: shortname }
    const logMessage = "Merchant Token"

    const start = performance.now()
    try {
        const sessionData = await $fetch<SessionResponse>(
            url, 
            {
                method: method,
                body: sendBody
            }
        );
        const ms = performance.now() - start
        mainStore.setSessionData(sessionData)
        mainStore.updateShopToken(sessionData.token)
        const logRes: LogRes = {
            responseMs: ms,
            code: 200,
            message: "Success",
            method: method,
            url: url,
            shortName: shortname,
            response: sessionData,
            sendData: sendBody,
        }
        myLog.trace(logMessage, logRes)
        return { sessionData, result: 1 }
    } catch(err) {
        const error = err as FetchError

        const ms = performance.now() - start
        const logRes: LogRes = {
            responseMs: ms,
            code: error.statusCode ? error.statusCode : 0,
            message: error.message,
            method: method,
            url: url,
            shortName: shortname,
            response: error.data,
            sendData: sendBody,
        }
        myLog.error(logMessage, logRes)
        return { result: 0 }
    }
}

export async function getShopSetup(){
    const mainStore = useMainStore()
    const token = mainStore.shopToken ? mainStore.shopToken : ""

    const url = "https://appt2.tunai.io/web/setup"
    const method = "GET"
    const logMessage = "Shop Setup"
    const header = { 'token': token }
    const start = performance.now()
    try {
        const outletSetup = await $fetch<ShopSetupResponse>(
            url,
            {
                method: method,
                headers: header,
                cache: "no-store"
            }
        )
        const ms = performance.now() - start
        mainStore.setOutletSetup(outletSetup.outlet)
        const logRes: LogRes = {
            responseMs: ms,
            code: 200,
            message: "Success",
            method: method,
            url: url,
            token: token,
            response: outletSetup,
        }
        myLog.trace(logMessage, logRes)
        return 1
    } catch (err) {
        // console.log("Before Log: ", err)
        const error = err as FetchError
        
        const ms = performance.now() - start
        const logRes: LogRes = {
            responseMs: ms,
            code: error.statusCode ? error.statusCode : 0,
            message: error.message,
            method: method,
            url: url,
            token: token,
            response: error.data,
        }
        myLog.error(logMessage, logRes)
        return 0
    }
}

export async function getStaffList(outletId: number) {
    const mainStore = useMainStore()
    const token = mainStore.shopToken ? mainStore.shopToken : ""

    const url = "https://staff2.tunai.io/web/staffs"
    const method = "GET"
    const logMessage = "Staff List"
    const header = { 'token': token }
    const start = performance.now()
    let startParam = {
        outletID: outletId,
        limit: 100,
        page: 0
    }
    try{ 
        let loopIt = true
        let staffList: Staff[] = []
        const safetyPin = 10

        while(loopIt && startParam.page < safetyPin){

            const staffData = await $fetch<StaffResponse>(
                url,
                {
                    method: method,
                    headers: header,
                    params: startParam,
                    cache: "no-store"
                }
            )
            const ms = performance.now() - start
            const logRes: LogRes = {
                responseMs: ms,
                code: 200,
                message: "Success",
                method: method,
                url: url,
                token: token,
                sendParam: startParam,
                outletID: outletId,
                response: staffData,
            }
            myLog.trace(logMessage, logRes)

            // console.log("Looping", startParam.page)
            if(staffData && staffData.staffs.length > 0){
                staffList = staffList.concat(staffData.staffs.filter((stf) => stf.deleteDate == 0 && stf.enable == 1 && stf.showOnline == 1))
                startParam.page = startParam.page + 1
            } else {
                // console.log("Got Empty")
                loopIt = false
            }
        }
        return { staffData: staffList ,result: 1}
    } catch(err){
        const error = err as FetchError

        const ms = performance.now() - start
        const logRes: LogRes = {
            responseMs: ms,
            code: error.statusCode ? error.statusCode : 0,
            message: error.message,
            method: method,
            url: url,
            token: token,
            sendParam: startParam,
            outletID: outletId,
            response: error.data,
        }
        myLog.error(logMessage, logRes)
        return { staffData: [] ,result: 0}
    }
}

export async function getOutletList(token: string): Promise<{ outlets: Outlet[] }>{
    const url = "https://outlet2.tunai.io/web/outlets"
    const method = "GET"
    const logMessage = "Outlet List"
    const header = { 'token': token }

    const start = performance.now()
    try {
        
        const outletList = await $fetch<OutletResponse>(
            url,
            {
                method: method,
                headers: header,
                cache: "no-store"
            }
        )

        const ms = performance.now() - start
        const logRes: LogRes = {
            responseMs: ms,
            code: 200,
            message: "Success",
            method: method,
            url: url,
            token: token,
            response: outletList,
        }
        myLog.trace(logMessage, logRes)

        return { outlets: outletList.outlets}
    } catch(err) {
        const error = err as FetchError
        
        const ms = performance.now() - start
        const logRes: LogRes = {
            responseMs: ms,
            code: error.statusCode ? error.statusCode : 0,
            message: error.message,
            method: method,
            url: url,
            token: token,
            response: error.data,
        }
        myLog.error(logMessage, logRes)
        return { outlets: [] }
    }
}

export async function getMerchantDetail(shortname: string, outletID: number | null = null){
    const mainStore = useMainStore()
    mainStore.setSysLoad(true)
    
    const sessionData = mainStore.sessionData ? mainStore.sessionData : (await getMerchantToken(shortname)).sessionData

    const token = sessionData?.token
    const shop = sessionData?.shop
    if(!token){
        mainStore.setSysLoad(false)
        throw {
            code: 1001,
            message: "No Token Received"
        }
    }
    mainStore.setSessionData(sessionData)
    mainStore.updateShopToken(token)
    await getShopSetup()


    const outletData = await getOutletList(token)

    const outletList :Outlet[] = outletData ? outletData.outlets.sort((a,b) => a.outletID - b.outletID) : []

    let currentOutletData = null

    if(outletList?.length > 0){
        if(outletID && outletID!= null && outletList.filter((olt) => olt.outletID == outletID).length > 0){
            currentOutletData = outletList.find((olt) => olt.outletID == outletID)
        } else {
            currentOutletData = outletList[0]
        }
    }

    mainStore.saveListOutlet(outletList)

    let staffList: Staff[] = []
    let serviceList: MenuItem[] = []
    let classList: Classroom[] = []

    if(currentOutletData){
        staffList = (await getStaffList(currentOutletData.outletID)).staffData
        serviceList = (await getServiceList(currentOutletData.outletID)).activeAvailable
        // classList = (await getClassroom(Date.now(), currentOutletData.outletID)).list
    }

    return {
        shopDetail: shop,
        outletList: outletList,
        currentOutlet: currentOutletData,
        staffList: staffList,
        serviceList: serviceList,
        classList: classList
    }
}

export async function getMerchantAllOutlet(shortname: string, outletID?: number | null){
    const mainStore = useMainStore()
    mainStore.setSysLoad(true)
    
    const sessionData = mainStore.sessionData ? mainStore.sessionData : (await getMerchantToken(shortname)).sessionData

    // const keyString = `Tunai${shortname}-getMerchantAllOutlet`
    // console.log("Checking Cached", keyString)
    // const cachedData = getCache(keyString)
    // if(cachedData && Date.now() - cachedData.savedTime <= cachedTime){
    //     console.log("The Cached", cachedData)
    //     return cachedData.savedData
    // }
    const token = sessionData?.token
    const shop = sessionData?.shop
    if(!token){
        mainStore.setSysLoad(false)
        throw {
            code: 1001,
            message: "No Token Received"
        }
    }
    mainStore.setSessionData(sessionData)
    mainStore.updateShopToken(token)
    await getShopSetup()

    const outletData = await getOutletList(token)

    const outletList: Outlet[] = outletData ? outletData.outlets.sort((a,b) => a.outletID - b.outletID) : []

    let allOutletData: AllOutlet[] = []
    // let currentOutletData = null

    // if(outletList?.length > 0){
    //     if(outletID && outletID!= null && outletList.filter((olt) => olt.outletID == outletID).length > 0){
    //         currentOutletData = outletList.find((olt) => olt.outletID == outletID)
    //     } else {
    //         currentOutletData = outletList[0]
    //     }
    // }

    mainStore.saveListOutlet(outletList)

    for(const olt of outletList){
        let staffList: Staff[] = []
        let serviceList: MenuItem[] = []
        staffList = (await getStaffList(olt.outletID)).staffData
        serviceList = (await getServiceList(olt.outletID)).activeAvailable

        const theOutlet: AllOutlet = {
            outlet: olt,
            staffList: staffList,
            serviceList: serviceList
        }

        allOutletData.push(theOutlet)
    }

    // const dataToSaved = {
    //     savedTime: Date.now(),
    //     savedData: {
    //         shopDetail: shop,
    //         outletList: allOutletData
    //     }
    // }

    // setCache(keyString, dataToSaved)

    let dataToReturn =  {
        shopDetail: shop,
        outletList: allOutletData,
        theOutlet: allOutletData[0] ? allOutletData[0] : null
    }

    if(outletID){
        let findOutlet = allOutletData.find((val) => val.outlet.outletID == outletID)
        if(findOutlet){
            // console.info("Finding Outlet", findOutlet)
            dataToReturn.theOutlet = findOutlet
        }
    }

    return dataToReturn
}

export async function getServiceList(outletId: number) {
    const mainStore = useMainStore()
    const token = mainStore.shopToken ? mainStore.shopToken : ""
    const url = "https://menu2.tunai.io/web/menus/online"
    const method = "GET"
    const logMessage = "Service Menu List"
    const header = { 'token': token }

    const start = performance.now()
    try {
        const menuData = await $fetch<MenuResponse>(
            url,
            {
                method: method,
                headers: header,
                params: {
                    outletID: outletId
                },
                cache: "no-store"
            }
        )

        const ms = performance.now() - start
        const activeAvailable = menuData.menus.find((menu) => menu.typeID == 1 && menu.deleteDate == 0)

        const logRes: LogRes = {
            responseMs: ms,
            code: 200,
            message: "Success",
            method: method,
            url: url,
            token: token,
            outletID: outletId,
            response: menuData,
        }
        myLog.trace(logMessage, logRes)
        return {result: 1, activeAvailable: activeAvailable ? activeAvailable.items.filter((itm) => itm.deleteDate == 0) : []}
    } catch(err){
        const error = err as FetchError
        
        const ms = performance.now() - start
        const logRes: LogRes = {
            responseMs: ms,
            code: error.statusCode ? error.statusCode : 0,
            message: error.message,
            method: method,
            url: url,
            token: token,
            outletID: outletId,
            response: error.data,
        }
        myLog.error(logMessage, logRes)
        return {result: 0, activeAvailable: []}
    }
}

export async function changeOutlet(outletID: number) {
    const mainStore = useMainStore()
    const token = mainStore.shopToken ? mainStore.shopToken : ""
    let staffList: Staff[] = []
    let serviceList: MenuItem[] = []

    staffList = (await getStaffList(outletID)).staffData
    serviceList = (await getServiceList(outletID)).activeAvailable

    return { staffList: staffList, serviceList: serviceList }

}


export async function getSingleOutlet(shortname: string, outletID: number){
    const mainStore = useMainStore()

    const sessionData = mainStore.sessionData ? mainStore.sessionData : (await getMerchantToken(shortname)).sessionData

    const token = sessionData?.token
    const shop = sessionData?.shop
    if(!token){
        mainStore.setSysLoad(false)
        throw {
            code: 1001,
            message: "No Token Received"
        }
    }
    mainStore.setSessionData(sessionData)
    mainStore.updateShopToken(token)
    await getShopSetup()

    const outletData = await getOutletList(token)

    const outletList: Outlet[] = outletData ? outletData.outlets.sort((a,b) => a.outletID - b.outletID) : []

    mainStore.saveListOutlet(outletList)

    let staffList: Staff[] = []
    let serviceList: MenuItem[] = []

    staffList = (await getStaffList(outletID)).staffData
    serviceList = (await getServiceList(outletID)).activeAvailable

    const outlet = outletList.find((out) => out.outletID == outletID)

    return {
        shopDetail: shop,
        staffList: staffList,
        serviceList: serviceList,
        outlet: outlet
    }
}
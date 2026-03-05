import type { StaffResponse, BlockResponse, BookInfoResponse, BookOutletResponse, AvailabilityResponse, ShopSetupResponse, LogRes, MenuResponse } from "~/model/auth"
import type { ApptInfo, BookShop } from "~/model/book"
import type { OutletConfigMain, StaffSlot } from "~/model/booking"
import type { Outlet } from "~/model/merchant"
import type { Staff } from "~/model/staff"
import type { FetchError } from 'ofetch'
import type { MenuItem } from "~/model/service"

export async function getBookingInfo(bookUuid: string): Promise<BookInfoResponse | null> {
  const url = "https://appt2.tunai.io/book/appts/info"
  const method = "GET"
  const logMessage = "Book Detail"

  const start = performance.now()
  try {
    const bookInfo = await $fetch<BookInfoResponse>(
        url, 
        {
            method: method,
            headers: { 'token': bookUuid },
            cache: "no-store"
        }
    );
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        response: bookInfo
    }

    myLog.trace(logMessage, logRes)
    return bookInfo
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return null
  }
}

export async function getBookingOutlet(bookUuid: string): Promise<BookOutletResponse | null> {
  const url = "https://outlet2.tunai.io/book/outlets"
  const method = "GET"
  const logMessage = "Booking Outlet"

  const start = performance.now()
  try {
    const outletData = await $fetch<BookOutletResponse>(
      url, 
      {
          method: method,
          headers: { 'token': bookUuid },
          cache: "no-store"
      }
    );

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        response: outletData
    }
    myLog.trace(logMessage, logRes)
    return outletData
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return null
  }
}

export async function getBookingStaff(bookUuid: string): Promise<StaffResponse | null>{
  const url = "https://staff2.tunai.io/book/staffs"
  const method = "GET"
  const logMessage = "Booking Staff"

  const start = performance.now()
  try {
    const staffData = await $fetch<StaffResponse>(
      url, 
      {
          method: method,
          headers: { 'token': bookUuid },
          cache: "no-store"
      }
    );

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        response: staffData
    }
    myLog.trace(logMessage, logRes)
    return staffData
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return null
  }
}

export async function getBookingSetup(bookUuid: string): Promise<ShopSetupResponse | null>{
  const url = "https://appt2.tunai.io/book/setup"
  const method = "GET"
  const logMessage = "Booking Shop Setup"

  const start = performance.now()
  try {
    const outletSetup = await $fetch<ShopSetupResponse>(
      url, 
      {
          method: method,
          headers: { 'token': bookUuid },
          cache: "no-store"
      }
      
    );
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        response: outletSetup
    }
    myLog.trace(logMessage, logRes)
    return outletSetup
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return null
  }
}

export async function getBookingDetail(bookUuid: string){

  const bookInfo = await getBookingInfo(bookUuid)

  const outletData = await getBookingOutlet(bookUuid)

  const staffData = await getBookingStaff(bookUuid)

  const outletSetup = await getBookingSetup(bookUuid)

  const menuSetup = await getBookMenu(bookUuid)

  const shopOutlet: Outlet | null = outletData && outletData.outlets[0] ? outletData.outlets[0] : null

  const shopSetup: OutletConfigMain | null = outletSetup && outletSetup.outlet[0] ? outletSetup.outlet[0] : null

  const shopDetail: BookShop = outletData && outletData.shop[0] ? outletData.shop[0] : { name: 'Tunai Pro', shopID: 0, icon: "" }

  const bookDetail: ApptInfo | null = bookInfo && bookInfo.appts[0] ? bookInfo.appts[0] : null

  const staffList: Staff[] = staffData ? staffData.staffs : []

  const bookStore = useBookStore()

  bookStore.saveBookShop(shopDetail)

  return {
      shopDetail: shopDetail,
      currentOutlet: shopOutlet,
      staffList: staffList,
      bookDetail: bookDetail,
      outletSetup: shopSetup,
      serviceList: menuSetup
  }
}

export async function getBookAvailability(staffID: string | null, bookUuid: string, startDate: number, endDate: number, unit: number, anyStaff: number): Promise<{ result: number, slotTime:StaffSlot[] }>{
  
  let theParam : { start: number, stop: number, unit: number, staffIDs?: string }= {
    start: startDate,
    stop: endDate,
    unit: unit
  }

  if(staffID && anyStaff == 0){
    theParam.staffIDs = staffID 
  }

  const url = "https://staff2.tunai.io/book/availability"
  const method = "GET"
  const logMessage = "Slot Availability"

  const start = performance.now()
  try {

      const slotData = await $fetch<AvailabilityResponse>(
        url,
        {
            method: method,
            headers: { 'token': bookUuid },
            params: theParam,
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
          bookUuid: bookUuid,
          sendParam: theParam,
          response: slotData,
      }
      myLog.trace(logMessage, logRes)

      const slotReturn = slotData.availability.staffs
      return { result: 1, slotTime: slotReturn }

  } catch(err){
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      sendParam: theParam,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return { result: 0, slotTime: [] }
  }
}

export async function confirmBook(bookUuid: string){

  const url = "https://appt2.tunai.io/book/appts/confirm"
  const method = "POST"
  const logMessage = "Confirm Book"

  const start = performance.now()
  try {
    const apiData = await $fetch<BookInfoResponse>(
      url,
      {
          method: method,
          headers: { 'token': bookUuid }
      }
    )
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        response: apiData,
    }
    myLog.trace(logMessage, logRes)

    const bookDetail: ApptInfo | null = apiData && apiData.appts[0] ? apiData.appts[0] : null
    
    if(bookDetail == null){
      throw ("No Appointment Detail Received")
    }
    return { result: 1, bookDetail: bookDetail }
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      response: error.data
    }

    myLog.error(logMessage, logRes)

    return { result: 0, bookDetail: null }
  }
}

export async function updateStaff(bookUuid:string, staffID: number){
  const url = "https://appt2.tunai.io/book/appts/staff"
  const method = "POST"
  const sendBody = {
    staffID: staffID
  }
  const logMessage = "Change Book Staff"

  const start = performance.now()
  try {
    const resp = await $fetch(
      url, 
      {
        method: method,
        headers: { 'token': bookUuid },
        body: sendBody
      }
    )
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        sendData: sendBody,
        response: resp,
    }
    myLog.trace(logMessage, logRes)

  } catch(err){
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      sendData: sendBody,
      response: error.data
    }

    myLog.error(logMessage, logRes)
  }
}

export async function updateTime(bookUuid: string, newTime: number){
  const url = "https://appt2.tunai.io/book/appts/arrival"
  const method = "POST"
  const sendBody = {
    arrivalDate: newTime / 1000
  }
  const logMessage = "Change Book Time Slot"

  const start = performance.now()

  try {
    const resp = await $fetch(
      url,
      {
        method: method,
        headers: { 'token' : bookUuid },
        body: sendBody
      }
    )

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        sendData: sendBody,
        response: resp,
    }
    myLog.trace(logMessage, logRes)
  } catch(err){
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      sendData: sendBody,
      response: error.data
    }

    myLog.error(logMessage, logRes)
  }
}

export async function updateBook(bookUuid: string, staffID: number, newTime: number, oldStaff: number, oldTime: number){
  try {
    if(oldStaff != staffID){
      await updateStaff(bookUuid, staffID)
    }
    if(oldTime != newTime){
      await updateTime(bookUuid, newTime)
    }
    return { result: 1 }
  } catch(err){
    return { result: 0 }
  }
}

export async function getBookMenu(bookUuid: string): Promise<MenuItem[]> {
const url = "https://menu2.tunai.io/book/menus/online"
  const method = "GET"
  const logMessage = "Booking Menu List"

  const start = performance.now()

  try {
    const MenuInfo = await $fetch<MenuResponse>(
        url, 
        {
            method: method,
            headers: { 'token': bookUuid },
            cache: "no-store"
        }
    );
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        bookUuid: bookUuid,
        response: MenuInfo
    }

    myLog.trace(logMessage, logRes)

    const activeAvailable = MenuInfo.menus.find((menu) => menu.typeID == 1 && menu.deleteDate == 0)

    return activeAvailable ? activeAvailable.items : []
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      bookUuid: bookUuid,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return []
  }
}
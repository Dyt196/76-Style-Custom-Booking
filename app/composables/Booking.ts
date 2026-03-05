import { type MemberResponse, type BlockResponse, type SendBookResponse, type AvailabilityResponse, type LogRes } from "~/model/auth";
import type { Appointment, ConfirmBooking, StaffSlot } from "~/model/booking";
import type { MenuItem } from "~/model/service";
import type { FetchError } from "ofetch"
import type { Membership } from "~/model/member";

export async function sendBooking(outletId: number, arrivalDate: number, staffId: number, skuId: number, duration: number, bookDetail: ConfirmBooking, newSelected: MenuItem[], anyStaff: number) {
  const mainStore = useMainStore()
  const bookStore = useBookStore()
  const token = mainStore.shopToken ? mainStore.shopToken : ""
  
  const memberData = await processMember(bookDetail, outletId)
  
  const url = "https://appt2.tunai.io/web/appts"
  const method = "POST"
  const dataToSend = {
    outletID: outletId,
    arrivalDate: arrivalDate/1000, // API Required in Seconds
    staffID: staffId,
    skuID: skuId,
    duration: duration,
    memberID: memberData.memberID,
    note: bookDetail.note,
    anystaff: anyStaff,
    assistants: [],
    extras: newSelected.filter((itm) => itm.skuID != skuId).map((itm) => {return {skuID: itm.skuID, quantity: 1}})
  }

  const logMessage = "Create Appointment"

  const start = performance.now()
  try {
    const bookedData = await $fetch<SendBookResponse>(
      url,
      {
        method: method,
        headers: { 'token': token },
        body: dataToSend
      }
    )
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        outletID: outletId,
        response: bookedData,
        sendData: dataToSend,
        token: token
    }
    myLog.trace(logMessage, logRes)

    for(const appt of bookedData.appts){
      appt.bookExtra = {service: newSelected, note: bookDetail.note}
    }

    bookStore.addBooking(bookedData.appts)
    

    // await getStaffList(outletId)
    return { result: 1, bookID: bookedData.appts[0]?.bookID || 0, uuid: bookedData.appts[0]?.identifier || "" }
  } catch(err) {
    const error = err as FetchError

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: error.statusCode ? error.statusCode : 0,
        message: error.message,
        method: method,
        url: url,
        outletID: outletId,
        response: error.data,
        sendData: dataToSend,
        token: token
    }
    myLog.error(logMessage, logRes)
    return { result: 0, bookID: 0, uuid: ""}
  }
}

// TODO Error Handling
export async function processMember(
  bookDetail: ConfirmBooking,
  outletID: number
) {
  const mainStore = useMainStore();
  const token = mainStore.shopToken ?? "";

  const dataToSend: {
    mobile: number | null,
    name: string,
    outletID: number,
    email?: string
  } = {
    mobile: bookDetail.mobile,
    name: bookDetail.name,
    outletID,
  };

  if(bookDetail.email){
    dataToSend.email = bookDetail.email
  }
    // 1) Try to find existing member
    const checkMember = await findMember(dataToSend)

    // Defensive
    const activeMembers =
      checkMember?.filter((m) => m.deleteDate === 0) ?? [];

    if (activeMembers.length > 0) {
      return { result: 1, memberID: activeMembers[0]?.memberID };
    }

    // 2) Not found → create new member
    const newMember = await registerMember(dataToSend);

    const activeCreated =
      newMember ?? [];

    if (activeCreated.length > 0) {
      return { result: 1, memberID: activeCreated[0]?.memberID };
    }

    // Shouldn’t happen — creation returned no usable member
    return { result: 0 , memberID: 0};
}

export async function getDateAvailability(staffID: string | null, outletID: number, startDate: number, endDate: number, unit: number, anyStaff: number, staffList: string): Promise<{ result: number, slotTime:StaffSlot[] }>{
  const mainStore = useMainStore();
  const token = mainStore.shopToken ?? "";
  let theParam : { outletID: number, start: number, stop: number, unit: number, staffIDs?: string }= {
    outletID: outletID,
    start: startDate,
    stop: endDate,
    unit: unit
  }

  if(staffID && anyStaff == 0){
    theParam.staffIDs = staffID 
  } 
  if(anyStaff == 1) {
    theParam.staffIDs = staffList
  }

  const url = "https://staff2.tunai.io/web/availability"
  const method = "GET"
  const logMessage = "Date Availability"

  const start = performance.now()
  try {


      const slotData = await $fetch<AvailabilityResponse>(
        url,
        {
            method: method,
            headers: { 'token': token },
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
          outletID: outletID,
          response: slotData,
          sendParam: theParam,
      }
      myLog.trace(logMessage, logRes)

      const slotReturn = slotData.availability.staffs
      return { result: 1, slotTime: slotReturn }

  } catch(err){
    const error = err as FetchError

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: error.statusCode ? error.statusCode : 0,
        message: error.message,
        method: method,
        url: url,
        outletID: outletID,
        response: error.data,
        sendParam: theParam,
    }
    myLog.error(logMessage, logRes)
    return { result: 0, slotTime: [] }
  }
}

export async function findMember(dataToSend: any):  Promise<Membership[]>{
  const mainStore = useMainStore();
  const token = mainStore.shopToken ?? "";

  const url = "https://member2.tunai.io/web/members/find"
  const method = "POST"
  const logMessage = "Find Member"

  const start = performance.now()
  try {
    const checkMember = await $fetch<MemberResponse>(
      url,
      {
        method: method,
        headers: { token },
        body: dataToSend,
      }
    );
    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: 200,
        message: "Success",
        method: method,
        url: url,
        response: checkMember,
        sendData: dataToSend,
    }
    myLog.trace(logMessage, logRes)
    return checkMember.members
  } catch(err){
    const error = err as FetchError

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: error.statusCode ? error.statusCode : 0,
        message: error.message,
        method: method,
        url: url,
        response: error.data,
        sendParam: dataToSend,
    }
    myLog.error(logMessage, logRes)
    return []
  }
}

export async function registerMember(dataToSend: any): Promise<Membership[]>{
  const mainStore = useMainStore();
  const token = mainStore.shopToken ?? "";

  const url = "https://member2.tunai.io/web/members"
  const method = "POST"
  const logMessage = "Register Member"

  const start = performance.now()
  try {
    const newMember = await $fetch<MemberResponse>(
      url,
      {
        method: method,
        headers: { token },
        body: dataToSend,
      }
    );
    const ms = performance.now() - start
      const logRes: LogRes = {
          responseMs: ms,
          code: 200,
          message: "Success",
          method: method,
          url: url,
          response: newMember,
          sendData: dataToSend,
      }
      myLog.trace(logMessage, logRes)

    return newMember.members
  } catch(err){
    const error = err as FetchError

    const ms = performance.now() - start
    const logRes: LogRes = {
        responseMs: ms,
        code: error.statusCode ? error.statusCode : 0,
        message: error.message,
        method: method,
        url: url,
        response: error.data,
        sendParam: dataToSend,
    }
    myLog.error(logMessage, logRes)
    return []
  }
}

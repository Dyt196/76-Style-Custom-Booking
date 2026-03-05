import type { ClassroomResponse, LogRes } from "~/model/auth"
import type { FetchError } from "ofetch"
import type { ConfirmBooking } from "~/model/booking"
import type { Classroom } from "~/model/classroom"

export async function getClassroom(from: number, until: number, outletID: number){

  const mainStore = useMainStore()

  const token = mainStore.shopToken ? mainStore.shopToken : ""
  const url = "https://classroom.tunai.io/web/classrooms"
  const method = "GET"
  let theParam = {
    // delta: countDelta.toFixed(0),
    start: from/1000,
    stop: until/1000,
    outletID: outletID,
    page: 0,
    limit: 100
  }


  const logMessage = "Classroom List"

  const start = performance.now()

  try {
    let loopIt = true
    let classroomList: Classroom[] = []
    const safetyPin = 10

        while(loopIt && theParam.page < safetyPin){
      const classList = await $fetch<ClassroomResponse>(
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
        response: classList,
        sendParam: theParam,
      }
      myLog.trace(logMessage, logRes)

      // console.log("Looping Classroom", theParam.page)
        if(classList && classList.classrooms.length > 0){
            classroomList = classroomList.concat(classList.classrooms.filter((stf) => stf.deleteDate == 0))
            theParam.page = theParam.page + 1
        } else {
            // console.log("Got Empty Class")
            loopIt = false
        }
    }

    return { list: classroomList, result: 1 }

  }catch (err){
      // console.error(err)
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
    return {list: [] , result: 0}
  }
}

export async function bookClassroom(outletID: number, bookDetail: ConfirmBooking, classroomID: number){
  const mainStore = useMainStore()
  const token = mainStore.shopToken ? mainStore.shopToken : ""

  const memberData = await processMember(bookDetail, outletID)

  const url = `https://classroom.tunai.io/web/classrooms/${classroomID}/book`
  const method = "POST"
  const dataToSend = {
    memberID: memberData.memberID
  }

  const logMessage = "Book Classroom"

  const start = performance.now()

  try {
    const bookedData = await $fetch<ClassroomResponse>(
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
        outletID: outletID,
        response: bookedData,
        sendData: dataToSend,
        token: token
    }
    myLog.trace(logMessage, logRes)

    return { result: 1 }
  } catch(err){
      // console.error(err)
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
          sendData: dataToSend,
      }
    myLog.error(logMessage, logRes)
    
    return { result: 0 }
  }
}
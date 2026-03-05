import type { DepoResponse, LogRes } from "~/model/auth"
import type { FetchError } from 'ofetch'

export async function getDepoInfo(bookUuid: string, skuID: number, price: number): Promise<DepoResponse | null> {
  const mainStore = useMainStore()
  const token = mainStore.shopToken ? mainStore.shopToken : ""
  const url = `https://appt2.tunai.io/web/appts/${bookUuid}/deposit/request`
  const method = "POST"
  const logMessage = "Get Deposit Info"
  const sendBody = {
    skuID: skuID,
    expectation: price.toFixed(2)
  }

  const start = performance.now()
  try {
    const resp = await $fetch<DepoResponse>(
      url, 
      {
        method: method,
        headers: { 'token': token },
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
        token: token,
        sendData: sendBody,
        response: resp,
    }

    myLog.trace(logMessage, logRes)

    return resp
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
      token: token,
      sendData: sendBody,
      response: error.data
    }


    myLog.error(logMessage, logRes)
    return null
  }
}

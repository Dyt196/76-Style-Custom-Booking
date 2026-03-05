import type { LogRes, WorkGalleryResponse } from "~/model/auth";
import type { WorkGallery } from "~/model/staff";
import type { FetchError } from "ofetch"

export async function getStaffGallery(staffID: number): Promise<WorkGallery[]> {
  const url = `https://staff2.tunai.io/web/staffs/${staffID}/images`
  const method = "GET"
  const logMessage = "Get Staff Gallery"

  const mainStore = useMainStore()
  const token = mainStore.shopToken ?? "";

  const start = performance.now()
  try {
    const gallery = await $fetch<WorkGalleryResponse>(
      url, 
      {
          method: method,
          headers: { 'token': token },
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
        response: gallery
    }
    myLog.trace(logMessage, logRes)
    return gallery.images.filter((img) => img.deleteDate == 0)
  } catch(err) {
    const ms = performance.now() - start
    const error = err as FetchError

    const logRes: LogRes = {
      responseMs: ms,
      code: error.statusCode ? error.statusCode : 0,
      message: error.message,
      method: method,
      url: url,
      response: error.data
    }

    myLog.error(logMessage, logRes)
    return []
  }
}
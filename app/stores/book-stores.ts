import { defineStore } from 'pinia'
import type { BookShop, ApptInfo } from '~/model/book'
import type { Appointment } from '~/model/booking'

export const useBookStore = defineStore('book',() => {
  const bookingDetail = ref<Appointment[]>([])

  function addBooking(bokDet: Appointment[]){
    bookingDetail.value = bookingDetail.value.concat(bokDet)
  }

  const confBookingDetail = ref<ApptInfo[]>([])

  const savedUuid = ref("")

  function saveBookDetail(bokDet: ApptInfo[]){
    confBookingDetail.value = bokDet
  }

  function saveUuid(uuid: string){
    savedUuid.value = uuid
  }

  const bookShop = ref<BookShop>({
    name: "Tunai Pro",
    shopID: 0,
    icon: ""
  })

  function saveBookShop(shop: BookShop){
    bookShop.value = shop
  }

  const bookLoad = ref(false)

  function setBookLoad(load: boolean){
    bookLoad.value = load
  }

  return { 
    bookingDetail, addBooking, 
    confBookingDetail, 
    savedUuid, saveBookDetail, saveUuid, 
    bookShop, saveBookShop,
    bookLoad, setBookLoad
   }
})

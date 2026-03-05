import type { City, Galleries, GeneralLocation, SliderGalleries, Social } from "./general"
import type { Review } from "./staff"

export interface ShopModel {
    shopId: number,
    name: string,
    mobile: string,
    icon: string,
    about: string,
    motto: string,
    address: string,
    contact: string,
    tnc: string,
    outlet: OutletShort[]
}

export interface OutletShort {
    outletID: number,
    shopID: number,
    bizTypeID: number
}

export interface Outlet {
    shopID: number,
    outletID: number,
    contact?: string,
    social: Social,
    timezone: string,
    city: City,
    location: GeneralLocation,
    sliders: SliderGalleries[],
    galleries: Galleries[]
    review?: Review,
    bizTypeID: number,
    deposit?: string,
    sortID: number
}

// "shopID": 3231,
//             "outletID": 3861,
//             "mobile": "601162048867",
//             "cityID": 216,
//             "cutoff": 0,
//             "colorID": 13,
//             "timezone": "Asia/Singapore",
//             "bizTypeID": 16,


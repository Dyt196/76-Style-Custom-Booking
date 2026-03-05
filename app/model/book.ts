export interface ApptInfo {
    bookID: number,
    outletID: number,
    duration: number,
    colorID: number,
    memberID: number,
    staffID: number,
    roomID: number,
    skuID: number,
    blocked: number,
    source: string,
    requestID: number,
    origin: string,
    remarks: string,
    anystaff: number,
    arrivalDate: number,
    deleteDate: number,
    member: Member,
    outlet: BookOutlet,
    staff: BookStaff,
    sku: MainSku,
    reminder: BookReminder,
    extras: ExtraSku[],
    assistants: BookStaff[],
    identifier: string,
    deposit: Deposit
}

export interface Deposit {
    bookID: number,
    saleID: number,
    skuID: number,
    createDate: number,
    requestDate: number,
    depositDate: number,
    cancelDate: number,
    updateDate: number,
    expectation: number,
    collection: number,
    url?: string
}

export interface Member {
    memberID: number,
    mobileID: number,
    name: string,
    mobile: string,
    email: string
}

export interface BookOutlet {
    outletID: number,
    shopID: number,
    shopName: string,
    city: string,
    location: string,
    email: string,
    contact: string,
    timezone: string
}

export interface BookStaff {
    staffID: number,
    name: string,
    mobile: string,
    mobileID: number,
    outletID: number
}

export interface MainSku {
    name: string,
    skuID: number
}

export interface ExtraSku {
    skuID: number,
    sku: {
        name: string,
        typeID: number
    }
}

export interface BookReminder {
    reminderID: number,
    requestID: number,
    sendDate: string,
    sentDate: string
}

export interface BookShop {
    shopID: number,
    name: string,
    icon: string
}


export interface DepoInfo {
    bookID: number,
    outletID: number,
    memberID: number,
    skuID: number,
    uuid: string,
    identifier: string,
    deleteDate: number,
    deposit: {
        bookID: number,
        saleID: number,
        url: string
    }
}


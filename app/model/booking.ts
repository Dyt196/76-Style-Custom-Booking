import type { MenuItem } from "./service";
import type { Staff } from "./staff";

export interface BookStep {
  order: number;
  label: string;
  short: string;
  code: string;
  condition: boolean;
  nextCondition: boolean;
  page: Component;
  props: Record<string, any>;
}

export interface ConfirmBooking {
    mobile: number | null,
    name: string,
    email?: string,
    note: string
}

export interface DateBlock {
    dayTimeStamp: number,
    slotTimeStamp: number[]
}

export interface TimeSlot {
    wdhmID: number,
    enable: number,
    outletID: number,
    day: string,
    hour: number,
    min: number
}

export interface OutletTime {
    outletID: number,
    timezone: string,
    wdhms: TimeSlot[]
}

export interface BlockSlot {
    blockID: number,
    outletID: number,
    start: number,
    stop: number
}

export interface OutletConfig {
    outletID: number,
    buffer: number,
    futureInDays: number,
    blockSlot: 1,
    disableOnline: number,
    depositAmount: number,
    intervals: number,
    displayHour: string,
    anystaff: number,
    deposit?: number,
}

export interface OutletConfigMain {
    outletID: number,
    timezone: string,
    config: OutletConfig,
    blocks: BlockSlot[]
}

export interface Appointment {
    bookID: number,
    outletID: number,
    duration: number,
    colorID: number,
    memberID: number | null | undefined,
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
    deleteData: number
    member: {
        memberID: number,
        mobileID: number,
        name: string,
        mobile: number,
        email: string
    } | null | undefined,
    outlet: {
        outletID: number,
        shopID: number,
        shopName: string,
        city: string,
        location: string,
        email: string,
        contact: string,
        timezone: string
    },
    staff: Staff,
    sku: {
        skuID: number,
        name: string
    },
    reminder: {
        remiderID: number,
        requestID: number,
        sendDate: string,
        sentDate: string
    },
    bookExtra?: BookExtra,
    identifier: string
}

export interface BookExtra {
    service: MenuItem[]
    note: string
}

export interface StaffSlot {
    staffID: number,
    slots: DateSlot[] // TODO: To change
}

export interface DateSlot {
    date: number,
    slots: number[]
}

export interface OutletSlot {
    outletID: number,
    timezone: string
}

export interface Availability {
    staffs: StaffSlot[],
    outlet: OutletSlot,
    start: number,
    stop: number
}

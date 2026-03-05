import type { ApptInfo, BookShop, DepoInfo } from "./book";
import type { Appointment, Availability, OutletConfigMain, OutletTime } from "./booking";
import type { Classroom } from "./classroom";
import type { Membership } from "./member";
import type { Outlet, ShopModel } from "./merchant";
import type { Menu } from "./service";
import type { BlockedSlot, Staff, WorkGallery } from "./staff";

export interface LogRes {
    code: number,
    message: string,
    responseMs: number,
    shortName?: string,
    method: string,
    url: string,
    outletID?: number,
    bookUuid?: string,
    response?: any,
    sendData?: any,
    sendParam? :any,
    token?: string,
}
export interface SessionResponse {
    token: string,
    shop: ShopModel
}

export interface OutletResponse {
    outlets: Outlet[]
}

export interface StaffResponse {
    staffs: Staff[]
}

export interface MenuResponse {
    menus: Menu[]
}

export interface BlockResponse {
    slots: BlockedSlot[]
}

export interface SendBookResponse {
    appts: Appointment[]
}

export interface WorkHourResponse {
    outlet: OutletTime[]
}

export interface ShopSetupResponse {
    outlet: OutletConfigMain[]
}

export interface MemberResponse {
    members: Membership[]
}

export interface AvailabilityResponse {
    availability: Availability
};

export interface BookOutletResponse {
    outlets: Outlet[],
    shop: BookShop[]
}

export interface BookInfoResponse {
    appts: ApptInfo[]
}

export interface ClassroomResponse {
    classrooms: Classroom[]
}

export interface DepoResponse {
    appts: DepoInfo[]
}

export interface WorkGalleryResponse {
    images: WorkGallery[]
}
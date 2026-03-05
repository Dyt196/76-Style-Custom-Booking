export interface Classroom {
    outletID: number,
    classroomID: number,
    staffID: number,
    unit: number,
    occupied: number,
    publics: number,
    title: string,
    roomID: number,
    skuID: number,
    uuid: string,
    recurringID: number,
    deleteDate: number,
    startDate: number,
    endDate: number,
    createDate: number,
    updateDate: number,
    sku: ClassService,
    staff: ClassStaff,
    slots: ClassSlot[]
}

export interface ClassService {
    name: string,
    skuID: number,
    icon: string,
    image: string
}

export interface ClassStaff {
    staffID: number,
    name: string,
    icon: string
}

export interface ClassSlot {
    slotID: number,
    classroomID: number,
    occupied: boolean,
    qrcode: string
}

export interface ClassStep {
  order: number;
  label: string;
  short: string;
  code: string;
  condition: boolean;
  nextCondition: boolean;
  page: Component;
  props: Record<string, any>;
}

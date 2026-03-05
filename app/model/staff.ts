export interface Staff {
    staffID: number,
    name: string,
    icon?: string,
    showOnline?: number,
    enable?: number,
    outletID: number,
    deleteDate?: number,
    sortID?: number
    excludes?: ExcludeService[],
    review?: Review,
    lola?: {
        staffID: number,
        lolaDate: number
    },
    employee?: {
        prefix: string,
        title: string,
        html: string
    }
}

export interface Review {
    rate: number,
    review: IndividualReview[]
}

export interface IndividualReview {
    name: string,
    rate: number,
    review: string,
    date: number,
    icon: string | null | undefined
}

export interface ExcludeService {
    excludeID: number,
    sectionID: number,
    deleteDate: number
}

export interface BlockedSlot {
    slotID: number,
    slotDate: number,
    blockDate: number,
    staffID: number
}

export interface WorkGallery {
    imageID: number,
    staffID: number,
    url: string,
    createDate: number,
    deleteDate: number,
    updateDate: number
}
export interface Menu {
    menuID: number,
    name: string,
    typeID: number, // For Online Web only include menu.typeID == 1
    createDate: number,
    updateDate: number,
    deleteDate: number,
    items: MenuItem[]
}

export interface MenuItem {
    itemID: number,
    menuID: number,
    skuID: number,
    minimum: number,
    maximum: number,
    selling: number,
    duration: number,
    sortID: number,
    section: string,
    name: string,
    sectionID: number,
    points: number,
    startDate: number,
    deleteDate: number,
    lastHour?: string
}

export interface Section {
    sectionID: number,
    section: string
}
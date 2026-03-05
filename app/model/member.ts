export interface Membership {
    memberID: number,
    uuid?: string,
    mobileID: number,
    mobile: string,
    profile: Profile,
    summary: MemberSummary,
    createDate?: number,
    updateDate?: number,
    deleteDate?: number
}

export interface MemberSummary {
    memberID: number,
    credits: number,
    points: number,
    outstanding: number
}

export interface Profile {
    memberID: number,
    vip: number,
    vvip: number,
    vvvip: number,
    dob: string,
    mobile1: string,
    mobile2: string,
    nick1: string,
    nick2: string,
    colorID: number,
    cityID: number,
    email: string,
    name: string,
    nationalID: string,
    gender: number,
    marital: number,
    ethnicID: number,
    icon: string,
    weddingDate: string,
    createDate: number,
    updateDate: number
}
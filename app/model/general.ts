export interface Social {
    facebook?: string,
    instagram?: string,
    whatsapp?: string,
    fave?: string,
    googleMap?: string,
    webGoogleMap?: string,
    waze?: string,
    webWaze?: string,
    shortname: string
}

export interface City {
    cityID: number,
    city: string,
    stateID: number,
    latitude: number,
    longitude: number,
    name: string
}

export interface GeneralLocation {
    name: string,
    location: string,
    address1: string,
    address2: string,
    address3: string,
    address4: string
}

export interface Galleries {
    galleryID: number,
    outletID: number,
    url: string
}

export interface SliderGalleries {
    sliderID: number,
    image: string
}

export interface InputError {
    hasError: boolean,
    errorMessage: string
}
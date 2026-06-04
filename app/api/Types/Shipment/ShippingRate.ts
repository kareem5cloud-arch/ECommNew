export interface responseGetShippingLocal {
  message: string;
  error: string;
  loopList: loopListLocal[];
}

export interface loopListLocal {
  rateID: string;
  deliveryType: string;
  deliveryTypeID: string;
  fromZoneID: string;
  fromZoneName: string;
  greaterThen10KG: number;
  lessThen1KG: number;
  lessThen5KG: number;
  lessThen10KG: number;
  toZoneID: string;
  toZoneName: string;
}

export interface responseGetShippingInternation {
  message: string;
  error: string;
  loopList: loopListInternation[];
}

export interface loopListInternation {
  intlRateID: string;
  deliveryType: string;
  deliveryTypeID: string;
  countryFromID: string;
  countryFrom: string;
  greaterThen10KG: number;
  lessThen1KG: number;
  lessThen5KG: number;
  lessThen10KG: number;
  countryToID: string;
  countryTo: string;
}

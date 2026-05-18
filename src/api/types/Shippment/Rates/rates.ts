export interface responseShippingRate {
  message: string;
  loopList: ShippingRate[];
}
export interface ShippingRate {
  storeZoneID: string;
  storeZoneName: string;
  destinationZoneID: string;
  destinationZoneName: string;
  greaterThen10KG: number;
  lessThen5KG: number;
  lessThen1KG: number;
}

export interface requestShippingRate {
  shippingDetail: ShippingZoneRate[];
}
export interface ShippingZoneRate {
  lessThen1KG: number;
  lessThen5KG: number;
  StoreZoneID: string;
  DestinationZoneID: string;
  greaterThen10KG: number;
}

export interface requestAddStoreToGetRate {
  storeList: stores[];
}
export interface stores {
  storeID: string;
}

export interface shiipingInformation {
  message: string;
  informationList: informationList[];
}
export interface informationList {
  destinationZoneID: string;
  greaterThen10KG: number;
  lessThen1KG: number;
  lessThen5KG: number;
  storeID: string;
  storeName: string;
  storeZoneID: string;
}

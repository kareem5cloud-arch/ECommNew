export interface RequestAddShippingZone {
  zoneID: string;
  cityName: string;
}

export interface responseShippingZone {
  message: string;
  zonelist: ShippingZone[];
}
export interface ShippingZone {
  cityID: string;
  cityName: string;
}

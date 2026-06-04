export interface DeleivryStandardAddRequest {
  standardName: string;
  numberOfDays: string;
  description: string;
}
export interface DeleivryStandardModifyRequest {
  standardName: string;
  deliveryTypeID: string;
  numberOfDays: string;
  description: string;
}

export interface ResponpseDelievryStandard {
  message: string;
  error: string;
  delievryData: DelievryDataStandard[];
}
export interface DelievryDataStandard {
  deliveryTypeID: string;
  typeName: string;
  description: string;
  numberofDays: string;
}

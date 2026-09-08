export interface requestAddCourierService {
  serviceName: string;
  phoneNo: string;
  deliveryTypeID: string;
  email: string;
  openingBalance: number;
  description: string;
}

export interface requestUpdateCourierService {
  courierID: string;
  serviceName: string;
  phoneNo: string;
  deliveryTypeID: string;
  openingBalance: number;
  email: string;
  description: string;
}

export interface responseCourierService {
  message: string;
  error: string;
  courierList: courierList[];
}
export interface courierList {
  courierID: string;
  serviceName: string;
  openingBalance: number;
  phoneNo: string;
  email: string;
  description: string;
  deliveryTypeID: string;
  typeName: string;
}

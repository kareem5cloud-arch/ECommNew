export interface requestAddCourierService {
  serviceName: string;
  phoneNo: string;
  deliveryTypeID: string;
  email: string;
  description: string;
}

export interface requestUpdateCourierService {
  courierID: string;
  serviceName: string;
  phoneNo: string;
  deliveryTypeID: string;
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
  phoneNo: string;
  email: string;
  description: string;
  deliveryTypeID: string;
  typeName: string;
}

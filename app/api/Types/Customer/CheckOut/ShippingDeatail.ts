export interface GetResponseShippingDeatail {
  message: string;
  error: string;
  shippingDeatil: shippingDeatilCustoemr[];
}
export interface shippingDeatilCustoemr {
  shippingDetailID: string;
  address: string;
  phoneNo: string;
  email: string;
  name: string;
  deliverAt: string;
}

export interface AddShippingDetailCustoemr {
  address: string;
  phoneNo: string;
  email: string;
  fullName: string;
  deliverAt: string;
}

export interface RequestAddPromotion {
  title: string;
  promotionName: string;
  promoCode: string;
  maxMember: number;
  promotionType: string;
  amount: number;
  discountType: string;
  startDate: string;
  expiryDate: string;
  customerList: custoemr[];
}
export interface RequestModifyPromotion {
  promoID: string;
  title: string;
  promotionName: string;
  promoCode: string;
  promotionType: string;
  maxMember: number;
  amount: number;
  discountType: string;
  startDate: string;
  expiryDate: string;
  customerList: custoemr[];
}
export interface ResponseGetPromotion {
  message: string;
  error: string;
  promolist: RequestModifyPromotion[];
}

export interface RequestAddModifyFormDara {
  message: string;
  error: string;
}

export interface custoemr {
  customerID: string;
  email?: string;
}

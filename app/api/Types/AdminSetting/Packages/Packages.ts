export interface AddRequestPackageForm {
  name: string;
  maxProduct: number;
  maxStore: number;
  maxFeaturedProduct: number;
  price: number;
  duration: number;
  posIntegration: boolean;
}
export interface ModifyRequestPackageForm {
  subID: string;
  name: string;
  maxProduct: number;
  maxStore: number;
  maxFeaturedProduct: number;
  price: number;
  duration: number;
  posIntegration: boolean;
}
export interface getResponsePackagesList {
  message: string;
  error: string;
  subscriptionList: SubscriptionList[];
}
export interface SubscriptionList {
  subID: string;
  name: string;
  maxStore: number;
  maxproduct: number;
  maxFetauredProduct: number;
  posIntegration: boolean;
  price: number;
  duration: number;
}

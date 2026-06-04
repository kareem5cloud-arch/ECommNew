export interface loginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  userName: string;

  email: string;

  password: string;

  phoneNo: string;

  status: string;

  stores: storeListSellerSignup[];
  address: string;
}
export interface storeListSellerSignup {
  storeID: string;
  storeName: string;
}

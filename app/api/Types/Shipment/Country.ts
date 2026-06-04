export interface GetCountryListResponse {
  countryList: countryList[];
  error: "";
  message: string;
}
export interface countryList {
  countryID: string;
  countryName: string;
}

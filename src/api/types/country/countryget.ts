// Response Type
export interface CountrygetApiResponse {
  countryList: Countryget[];
}

// A single Countryget record
export type Countryget = {
  countryID: string;
  countryName: string;
};

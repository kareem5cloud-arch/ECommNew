export interface RequestAddRegion {
  countryID: string;
  regionName: string;
}
export interface RequestModifyRegion {
  regionID: string;
  countryID: string;
  regionName: string;
}
export interface responseApi {
  message: string;
}

export interface responseRegionList {
  message: string;
  regionlist: regionlist[];
}
export interface regionlist {
  regionID: string;
  countryName: string;
  countryID: string;
  regionName: string;
}

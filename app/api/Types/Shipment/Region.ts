export interface RegionAddRequest {
  countryID: string;
  regionName: string;
}
export interface RegionModifyRequest {
  regionID: string;
  countryID: string;
  regionName: string;
}

export interface RegionGetListResposne {
  error: string;
  message: string;
  regionlist: regionlist[];
}
export interface regionlist {
  regionID: string;
  regionName: string;
  countryID: string;
  countryName: string;
}

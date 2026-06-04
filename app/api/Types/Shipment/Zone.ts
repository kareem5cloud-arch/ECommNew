export interface ZoneAddRequest {
  regionID: string;
  zoneName: string;
}
export interface ZoneModifyRequest {
  zoneID: string;
  regionID: string;
  zoneName: string;
}

export interface ZoneGetListResposne {
  error: string;
  message: string;
  zonelist: zonelist[];
}
export interface zonelist {
  regionID: string;
  regionName: string;
  countryID: string;
  countryName: string;
  zoneID: string;
  zoneName: string;
}

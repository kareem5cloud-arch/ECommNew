export interface RequestAddZone {
  regionID: string;
  zoneName: string;
}

export interface RequestModifyZone {
  regionID: string;
  zoneID: string;
  zoneName: string;
}

export interface responseZoneList {
  message: string;
  zonelist: zonelist[];
}
export interface zonelist {
  regionID: string;
  zoneID: string;
  zoneName: string;
  countryName: string;
  countryID: string;
  regionName: string;
}

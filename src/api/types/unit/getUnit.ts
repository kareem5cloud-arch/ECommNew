export interface UnitApiResponse {
  categoryList: UnitList[];
}

export type UnitList = {
  unitID: string;
  unitName: string;
  abbreviation: string;
  description: string;
};

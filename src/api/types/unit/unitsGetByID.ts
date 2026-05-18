export interface UnitIDApiResponse {
  unitsList: UnitListID[];
}

export type UnitListID = {
  unitID: string;
  unitName: string;
};

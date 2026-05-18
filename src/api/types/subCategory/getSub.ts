// Response Type
export interface FurtherSubApiResponse {
  categoryList: FurtherSub[];
}

// A single FurtherSub record
export type FurtherSub = {
  subCategoryID: string;
  subCategoryDetailID: string;
  name: string;
  unit: Unit[];
};

// Unit inside FurtherSub
export type Unit = {
  unitID: string;
  unitName: string;
};

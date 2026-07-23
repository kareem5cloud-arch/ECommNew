export interface RequestAddFurtherSub {
  subCategoryID: string;
  name: string;
  units: unitReqesut[];
  varientslist: varients[];
}
export interface RequestModifyFurtherSub {
  subCategoryDetailID: string;
  subCategoryID: string;
  name: string;
  units: unitReqesut[];
  varientslist: varients[];
}
export interface unitReqesut {
  unitID: string;
  unitName?: string;
}
interface varients {
  id: string;
  values: string;
}
export interface RespopnseFurtherListGet {
  message: string;
  error: string;
  furtherSubCategoryList: furtherSubCategoryList[];
}
export interface furtherSubCategoryList {
  subCategoryID: string;
  categoryID: string;
  subCategoryName: string;
  categoryName: string;
  subCategoryDetailID: string;
  name: string;
  unitListSub: unitListSub[];
  varientslist: varients[];
}
export interface unitListSub {
  unitID: string;
  unitName: string;
}

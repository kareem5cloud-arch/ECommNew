export interface RequestAddVariants {
  variantsName: string;
  description: string;
  varientList: varientList[];
}

export interface ResponseVariantsListGet {
  message: string;
  error: string;
  variantsList: VariantsList[];
}
export interface VariantsList {
  variantsID: string;
  variantsName: string;
  description: string;
  sortingOrder: number;
  varientList: varientList[];
}
interface varientList {
  ID?: string;
  value: string;
}

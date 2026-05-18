// types/product.ts

export interface ProductImage {
  urlID: string;
  url: string;
}

export interface VariantValue {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
}

export interface ProductVariant {
  varientID: string;
  variantName: string;
  variantValues: VariantValue[];
}

export interface ProductHomePage {
  storeID: string;
  storeName: string;
  productID: string;
  categoryID: string;
  subCategoryID: string;
  subCategoryName: string;
  subCategoryDetailID: string;
  storeSale: string;
  unitID: string;
  totalCount: number;

  productName: string;
  description: string;

  discount: number;
  currentStock: number;
  threshold: number;

  width: number;
  height: number;
  depth: number;
  weight: number;

  images: ProductImage[];
  variants: ProductVariant[];
}

export interface GetProductHomeApiResponse {
  message: string;
  totalCount: number;
  productList: ProductHomePage[];
}

// export interface ProductHome {
//   range: string;
//   products: [];
// }

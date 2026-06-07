"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ResponseHomePageStoreSetting,
  ResposneStoreListHomePage,
} from "./api/Types/Customer/HomePageStoreSetting";

import {
  categoryListHomePageCustomerCategroy,
  resposneGetHomePageCustomerCategroy,
} from "./api/Types/Customer/HomePageCustomerCategroy";
import HomePageSettingStoreApi from "./api/Controller/Customer/HomePage/HomePageStoreSetting/HomePageStoreSetting";
import HomePageCustomerCategroyApi from "./api/Controller/Customer/HomePage/HomePageCustomerCategroy/HomePageCustomerCategroy";
import {
  categoryListHomePageCategroyImages,
  resposneGetHomePageCategroy,
} from "./api/Types/Customer/CategorySectionHomePage";
import CategroySectionWithImages from "./api/Controller/Customer/HomePage/CategroySectionWithImages/CategroySectionWithImages";
import ProductListingHomePage from "./api/Controller/Customer/HomePage/ProductListingHomePage/ProductListingHomePage";
import {
  ProductSectionHomePage,
  ResponseProductSectionHomePage,
} from "./api/Types/Customer/ProductSectionHomePage";

interface AppContextType {
  storeInfo: ResposneStoreListHomePage[];
  setStoreInfo: (data: ResposneStoreListHomePage[]) => void;
  categroyInfo: categoryListHomePageCustomerCategroy[];
  setcategroyInfo: (data: categoryListHomePageCustomerCategroy[]) => void;
  categroyMainInfo: categoryListHomePageCategroyImages[];
  setcategroyMainInfo: (data: categoryListHomePageCategroyImages[]) => void;
  ProductData: ProductSectionHomePage[];
  setProductData: (data: ProductSectionHomePage[]) => void;
  productLoading: boolean;
  setProductLoading: (data: boolean) => void;
  refreshStoreInfo: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [storeInfo, setStoreInfo] = useState<ResposneStoreListHomePage[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [categroyInfo, setcategroyInfo] = useState<
    categoryListHomePageCustomerCategroy[]
  >([]);
  const [ProductData, setProductData] = useState<ProductSectionHomePage[]>([]);
  const [categroyMainInfo, setcategroyMainInfo] = useState<
    categoryListHomePageCategroyImages[]
  >([]);

  const refreshStoreInfo = async () => {
    try {
      const response = await HomePageSettingStoreApi();

      if (response.status === 200) {
        const data = response.data as ResponseHomePageStoreSetting;
        setStoreInfo(data.storeList);
      } else {
        setStoreInfo([]);
      }
    } catch (error) {
      setStoreInfo([]);
    }
  };
  const getCategoryInfo = async () => {
    try {
      const response = await HomePageCustomerCategroyApi();

      if (response.status === 200) {
        const data = response.data as resposneGetHomePageCustomerCategroy;
        setcategroyInfo(data.categoryList);
      } else {
        setcategroyInfo([]);
      }
    } catch (error) {
      setcategroyInfo([]);
    }
  };
  const getCategoryMainInfo = async () => {
    try {
      const response = await CategroySectionWithImages();

      if (response.status === 200) {
        const data = response.data as resposneGetHomePageCategroy;
        setcategroyMainInfo(data.categoryList);
      } else {
        setcategroyMainInfo([]);
      }
    } catch (error) {
      setcategroyMainInfo([]);
    }
  };
  const getProduct = async () => {
    try {
      setProductLoading(true);
      const response = await ProductListingHomePage();

      if (response.status === 200) {
        const data = response.data as ResponseProductSectionHomePage;
        setProductData(data.productList);
      } else {
        setProductData([]);
      }
    } catch (error) {
      setProductData([]);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    refreshStoreInfo();
    getCategoryInfo();
    getCategoryMainInfo();
    getProduct();
  }, []);

  return (
    <AppContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
        refreshStoreInfo,
        setcategroyInfo,
        categroyInfo,
        categroyMainInfo,
        setcategroyMainInfo,
        setProductData,
        ProductData,
        setProductLoading,
        productLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};

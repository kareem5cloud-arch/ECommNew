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

import HomePageSettingStoreApi from "./api/Controller/Customer/HomePageStoreSetting/HomePageStoreSetting";
import HomePageCustomerCategroyApi from "./api/Controller/Customer/HomePageCustomerCategroy/HomePageCustomerCategroy";
import {
  categoryListHomePageCustomerCategroy,
  resposneGetHomePageCustomerCategroy,
} from "./api/Types/Customer/HomePageCustomerCategroy";

interface AppContextType {
  storeInfo: ResposneStoreListHomePage[];
  setStoreInfo: (data: ResposneStoreListHomePage[]) => void;
  categroyInfo: categoryListHomePageCustomerCategroy[];
  setcategroyInfo: (data: categoryListHomePageCustomerCategroy[]) => void;
  refreshStoreInfo: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [storeInfo, setStoreInfo] = useState<ResposneStoreListHomePage[]>([]);
  const [categroyInfo, setcategroyInfo] = useState<
    categoryListHomePageCustomerCategroy[]
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

  useEffect(() => {
    refreshStoreInfo();
    getCategoryInfo();
  }, []);

  return (
    <AppContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
        refreshStoreInfo,
        setcategroyInfo,
        categroyInfo,
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

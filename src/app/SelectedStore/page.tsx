"use client";
import { useEffect, useState } from "react";
import SellerDashboardPanel from "./admin/dashboard/page";

export default function AdminPage() {
  const [storeID, setStoreID] = useState<string | null>(null);

  useEffect(() => {
    setStoreID(sessionStorage.getItem("storeID"));
  }, []);

  if (!storeID) return null;

  return <SellerDashboardPanel storeID={storeID} />;
}

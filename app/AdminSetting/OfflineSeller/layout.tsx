// app/admin/layout.tsx
import React from "react";
import OfflineSellerSidebar from "./page";

export default function OfflineSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <OfflineSellerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="w-full  px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

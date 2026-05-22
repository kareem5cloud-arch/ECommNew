// app/admin/layout.tsx
import React from "react";
import OnlineSellerSidebar from "./page";

export default function OnlineSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <OnlineSellerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="w-full  px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

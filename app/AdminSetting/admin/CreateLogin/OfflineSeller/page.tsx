"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useState } from "react";
import AddOfflineLogin from "./AddOfflineSeller";
import GetOfflineLogin from "./GetOfflineSeller";
// import AddOnlineLogin from "./AddLogin";
// import GetLoginList from "./GetLoginList";

export default function OfflineSeller() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  return (
    <>
      <div>
        <ShowAddFile update={setUpdate} setView={setView} view={view} />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Offline-Seller Login
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddOfflineLogin />
            </>
          )}
          {view === "list" && (
            <>
              <GetOfflineLogin />
            </>
          )}
        </div>
      </div>
    </>
  );
}

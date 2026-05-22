"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useState } from "react";
import AddZoneForm from "./AddZoneForm";
import GetZoneList from "./GetZoneList";

export default function ZoneManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  return (
    <>
      <div>
        <ShowAddFile update={setUpdate} setView={setView} view={view} />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Zone Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddZoneForm update={update} />
            </>
          )}
          {view === "list" && (
            <>
              <GetZoneList />
            </>
          )}
        </div>
      </div>
    </>
  );
}

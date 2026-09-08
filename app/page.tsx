"use client";
import HomePage from "./HomePage/page";

import { useEffect, useState } from "react";

export default function Home() {
  const [Description, setDescription] = useState("");

  useEffect(() => {
    console.log(Description);
  }, [Description]);
  return (
    // <div className="w-full flex justify-center">
    //   <div className="min-w-3xl py-8 px-2">
    //     <DescriptionTextArea setDescription={setDescription} />
    //   </div>
    // </div>
    <>
      <HomePage />
    </>
  );
}

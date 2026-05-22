import { List, Plus } from "lucide-react";

interface ShowListprops {
  update: (data: boolean) => void;
  setView: (data: "list" | "form") => void;
  view: string;
}

export default function ShowAddFile({ update, setView, view }: ShowListprops) {
  return (
    <>
      <div className="w-full bg-gray-100 dark:bg-gray-800/50 shadow-md flex justify-between p-2 rounded-xl">
        <button
          onClick={() => {
            setView("list");
            update(false);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200
            ${
              view === "list"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
        >
          <List size={18} />
          Show List
        </button>

        <button
          onClick={() => {
            setView("form");
            //setUpdate(false);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200
            ${
              view === "form"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
        >
          <Plus size={18} />
          Add New
        </button>
      </div>
    </>
  );
}

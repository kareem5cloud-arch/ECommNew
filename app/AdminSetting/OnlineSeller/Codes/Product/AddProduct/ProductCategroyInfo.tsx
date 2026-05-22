import DropDownList from "@/app/ui/DropDownList/DropDownList";
import { useState } from "react";
interface CatgeoryList {
  categoryID: string;
  categoryName: string;
}
interface SubCatgeoryList {
  subCategoryID: string;
  subCategoryName: string;
}
interface FurtherSubCatgeoryList {
  furtherSubID: string;
  furtherSubName: string;
}
interface unitList {
  unitID: string;
  unitName: string;
}
export default function ProductCategroyInfo() {
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryList, setCategoryList] = useState<CatgeoryList[]>([]);
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [SubCategoryList, setSubCategoryList] = useState<SubCatgeoryList[]>([]);
  const [furtherSubCategoryID, setfurtherSubCategoryID] = useState("");
  const [FurtherSubCategoryList, setFurtherSubCategoryList] = useState<
    FurtherSubCatgeoryList[]
  >([]);
  const [UnitID, setUnitID] = useState("");
  const [unitList, setunitList] = useState<unitList[]>([]);
  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="">
            <div className="mb-2">
              <DropDownList
                label="Category "
                placeholder="Enter Category"
                required={true}
                value={CategoryID}
                onChange={setCategoryID}
                options={CategoryList.map((item) => ({
                  label: item.categoryID,
                  value: item.categoryName,
                }))}
              />
            </div>
            <div className="mb-2">
              <DropDownList
                label="Sub Category "
                placeholder="Enter Sub Category"
                required={true}
                value={SubCategoryID}
                onChange={setSubCategoryID}
                options={SubCategoryList.map((item) => ({
                  label: item.subCategoryID,
                  value: item.subCategoryName,
                }))}
              />
            </div>
            <div className="mb-2">
              <DropDownList
                label="Further Sub-Category "
                placeholder="Enter Further Sub-Category "
                required={true}
                value={furtherSubCategoryID}
                onChange={setfurtherSubCategoryID}
                options={FurtherSubCategoryList.map((item) => ({
                  label: item.furtherSubID,
                  value: item.furtherSubName,
                }))}
              />
            </div>
            <div className="mb-2">
              <DropDownList
                label="Unit "
                placeholder="Enter Unit"
                required={true}
                value={UnitID}
                onChange={setUnitID}
                options={unitList.map((item) => ({
                  label: item.unitID,
                  value: item.unitName,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

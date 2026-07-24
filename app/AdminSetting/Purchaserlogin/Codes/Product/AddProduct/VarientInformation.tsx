// AddVarientInformation.tsx
import {
  furtherSubCategoryList,
  varients,
} from "@/app/api/Types/OnlineSetting/FurtherCategory/FurtherCategory";
import {
  List,
  Plus,
  Save,
  Trash2,
  Edit,
  X,
  Package,
  Tag,
  Barcode,
  Box,
  Trash,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddProductImage from "./ProductImageInfo";
export interface RowData {
  id: number;
  attributeID: attributeList[];
  costPrice: string;
  salePrice: string;
  barcode: string;
  qty: string;
  file: imagesData[];
}
export interface imagesData {
  id: string;
  file: File;
}
interface attributeList {
  id: string;
  values: string;
}
export interface varientAttributes {
  varientValue: string;
  qty: string;
  costPrice: string;
  salePrice: string;
  barcode: string;
}

export interface listVarient {
  varientName: string;
  varientAttributes: varientAttributes[];
}

interface AddVarientInformationProps {
  furtherSubCategoryID: string;
  FurtherSubCategoryList: furtherSubCategoryList[];
  showPopupModel: (data: boolean) => void;
  combinationList: RowData[];
  setCombinationList: (
    value: RowData[] | ((prev: RowData[]) => RowData[]),
  ) => void;
  setRowID: (data: string) => void;
}

export default function AddVarientInformation({
  furtherSubCategoryID,
  FurtherSubCategoryList,
  setCombinationList,
  showPopupModel,
  setRowID,

  combinationList,
}: AddVarientInformationProps) {
  const [vareintList, setVareintList] = useState<varients[]>([]);
  const [ShhowPopupModel2, setShhowPopupModel2] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedRowID, setSelectedRowID] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [ID, setID] = useState("");
  //const [images, setImages] = useState<imagesData[]>([]);

  useEffect(() => {
    const data = FurtherSubCategoryList.find(
      (item) => item.subCategoryDetailID === furtherSubCategoryID,
    );

    if (data) {
      setVareintList(data.varientslist);

      setCombinationList([
        {
          id: 0,
          attributeID: [],
          costPrice: "",
          salePrice: "",
          qty: "",
          barcode: "",
          file: [],
        },
      ]);
    }
  }, [FurtherSubCategoryList, furtherSubCategoryID]);

  const updateRow = (rowIndex: number, field: keyof RowData, value: any) => {
    setCombinationList((prev) =>
      prev.map((row) =>
        row.id === rowIndex ? { ...row, [field]: value } : row,
      ),
    );
  };

  // useEffect(() => {
  //   //updateRow(Number(imagesList[0]?.id), "file", images);
  //   //setImages(images);
  // }, [images]);

  const addRow = () => {
    setCombinationList((prev) => {
      const lastId = prev.length > 0 ? Number(prev[prev.length - 1].id) : 0;

      return [
        ...prev,
        {
          id: lastId + 1,
          attributeID: [],
          qty: "",
          barcode: "",
          costPrice: "",
          salePrice: "",
          file: [],
        },
      ];
    });
  };

  const deleteRow = (ID: number) => {
    setCombinationList((prev) => {
      const updated = prev.filter((item) => item.id !== ID);
      return updated;
    });
  };
  const fetchData = (id: number) => {
    const row = combinationList.find((item) => item.id === id);

    if (row) {
      setSelectedRowID(id);

      setSelectedImages(row.file.map((item) => item.file));

      setShhowPopupModel2(true);
    }
  };
  return (
    <>
      {ShhowPopupModel2 && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center"
          //onClick={() => setShowBasicINfoModel(false)}
          style={{ marginBottom: "0px" }}
        >
          <div
            //onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-lg shadow-xl z-10 max-w-2xl"
          >
            <div className="w-full flex justify-end">
              <button
                onClick={() => setShhowPopupModel2(false)}
                className="text-gray-800 hover:text-red-500 cursor-pointer"
              >
                <X />
              </button>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Add Product Image
            </h1>
            <AddProductImage
              images={selectedImages}
              setImages={(imgs) => {
                if (selectedRowID === null) return;

                setSelectedImages(imgs);

                setCombinationList((prev) =>
                  prev.map((row) =>
                    row.id === selectedRowID
                      ? {
                          ...row,
                          file: imgs.map((file, index) => ({
                            id: String(index),
                            file,
                          })),
                        }
                      : row,
                  ),
                );
              }}
            />
          </div>
        </div>
      )}

      <div className="w-full bg-white rounded-lg border border-gray-200">
        <div className="w-full flex justify-end p-4">
          <button
            title="Add Row"
            className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
            onClick={addRow}
          >
            +Add Row
          </button>
        </div>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {vareintList.map((item, index) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant {index + 1}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {combinationList.map((res, index) => (
              <tr key={res.id} className="hover:bg-gray-50 transition">
                {vareintList.map((item) => (
                  <td
                    key={item.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    <select
                      className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={
                        res?.attributeID.find((attr) => attr.id === item.id)
                          ?.values || ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;

                        setCombinationList((prev) => {
                          const updated = [...prev];

                          const attributes = [...updated[index].attributeID];

                          const attrIndex = attributes.findIndex(
                            (attr) => attr.id === item.id,
                          );

                          if (attrIndex >= 0) {
                            attributes[attrIndex] = {
                              ...attributes[attrIndex],
                              values: value,
                            };
                          } else {
                            attributes.push({
                              id: item.id,
                              values: value,
                            });
                          }

                          updated[index] = {
                            ...updated[index],
                            attributeID: attributes,
                          };

                          return updated;
                        });
                      }}
                    >
                      <option value="">Select {item.values}</option>

                      {item.attributeList?.map((attr) => (
                        <option key={attr.id} value={attr.id}>
                          {attr.values}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    onChange={(e) => updateRow(index, "qty", e.target.value)}
                    className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Qty"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    onChange={(e) =>
                      updateRow(index, "costPrice", e.target.value)
                    }
                    className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Cost Price"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    onChange={(e) =>
                      updateRow(index, "salePrice", e.target.value)
                    }
                    className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Sale Price"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    onChange={(e) =>
                      updateRow(index, "barcode", e.target.value)
                    }
                    className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Barcode"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* <input
                  onChange={(e) =>
                    updateRow(index, "file", e.target.files?.[0] || null)
                  }
                  className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="file"
                  placeholder="Sale Price"
                /> */}
                  <button
                    onClick={() => {
                      fetchData(res.id);
                      // setShhowPopupModel2(true);
                      // setID(String(res.id));
                    }}
                    className="bg-blue-500 px-2 py-2 hover:bg-red-600 text-white transition  rounded "
                    title="View Images"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
                <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => deleteRow(res.id)}
                    className="bg-red-500 px-2 py-2 hover:bg-red-600 text-white transition  rounded "
                    title="Delete Row"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddProductForm from "./AddProductForm";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import GetProductList from "./GetProductList";
import {
  productList,
  variantsList,
} from "@/app/api/Types/PurchaserLogin/Codes/Product/Product";
import ModifyBasicInfo from "./ModifyProduct/ModifyBasicInfo";
import { Eye, Trash, X } from "lucide-react";
import ModifyProductImage from "./ModifyProduct/ModifyImageList";
import AddProductImage from "./AddProduct/ProductImageInfo";
import { imagesData, RowData } from "./AddProduct/VarientInformation";
import { IoGitMerge } from "react-icons/io5";
import {
  furtherSubCategoryList,
  RespopnseFurtherListGet,
  varients,
} from "@/app/api/Types/PurchaserLogin/Codes/FurtherCategory/FurtherCategory";
import FurtherGetApi from "@/app/api/Controller/PurchaserLogin/Codes/FurtherSubCategory/GetFurtherCategory";
import ProductDeleteVariantsApi from "@/app/api/Controller/PurchaserLogin/Codes/Product/ModifyProduct/DeleteVariants";
export default function ProductManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showBasicINfoModel, setShowBasicINfoModel] = useState(false);
  const [showImageListModel, setShowImageListModel] = useState(false);
  const [productList, setProductList] = useState<productList>();
  const [event, setEvent] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [showPopupModel, setShowPopupModel] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagesList, setImagesList] = useState<imagesData[]>([]);
  const [selectedRowID, setSelectedRowID] = useState<string | null>("");
  const [selectedImages, setSelectedImages] = useState<imagesData[]>([]);
  const [rowID, setRowID] = useState("");
  const [subCategoryID, setSubCategoryID] = useState("");
  const [ShhowPopupModel2, setShhowPopupModel2] = useState(false);
  const [combinationList, setCombinationList] = useState<RowData[]>([]);
  const [combinationList2, setCombinationList2] = useState<RowData[]>([]);
  const [AddNewRecord, setAddnewRecord] = useState(true);
  const [FurtherSubCategoryList, setFurtherSubCategoryList] = useState<
    furtherSubCategoryList[]
  >([]);
  const [vareintList2, setVareintList2] = useState<varients[]>([]);
  const [vareintList, setVareintList] = useState<varients[]>([]);
  const [productVariant, setProductVariant] = useState<variantsList[]>([]);
  const [variantID, setVariantID] = useState("");

  const updateRow = (rowIndex: string, field: keyof RowData, value: any) => {
    setCombinationList2((prev) =>
      prev.map((row) =>
        row.id === rowIndex ? { ...row, [field]: value } : row,
      ),
    );
  };
  const fetchData = (id: string) => {
    const row = combinationList.find((item) => item.id === id);

    if (row) {
      setSelectedRowID(id);

      setSelectedImages(
        row.file.map((item) => ({
          id: item.id,
          file: item.file,
          url: item.url,
        })),
      );

      setShhowPopupModel2(true);
    }
  };
  const addRow = () => {
    setCombinationList2((prev) => {
      return [
        ...prev,
        {
          id: String(prev.length + 1),
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

  useEffect(() => {
    setCombinationList2(
      productVariant.map((item, index) => ({
        id: item.varientID,
        attributeID: item.values.map((item2) => ({
          variantDefId: item.varientID,
          id: item2.attributeID,
          values: item2.varientValue,
        })),
        qty: String(item.qty),
        barcode: item.barcode,
        costPrice: String(item.costPrice),
        salePrice: String(item.salePrice),
        file: item.images.map((item2) => ({
          id: item2.urlID || "",
          url: item2.url || "",
          file: new File([], "placeholder.jpg"),
        })),
      })),
    );
  }, [productVariant]);

  useEffect(() => {
    const data = FurtherSubCategoryList.find(
      (item) => item.subCategoryDetailID === subCategoryID,
    );
    setVareintList(data?.varientslist || []);
    setVareintList2(data?.varientslist || []);
  }, [FurtherSubCategoryList, subCategoryID]);

  const deleteVarinats = async (ID: string) => {
    const confirmDelete = window.confirm(
      "The following action cannot be reverted. Are you sure you want to delete this variant? ",
    );

    if (!confirmDelete) return;
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await ProductDeleteVariantsApi(ID, String(token));
    if (response.status == 200) {
      const data = combinationList2.filter((item) => item.id !== ID);
      setCombinationList2(data);
    }
  };

  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      {showBasicINfoModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          //onClick={() => setShowBasicINfoModel(false)}
          style={{ marginBottom: "0px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-sm"></div>
          <div
            //onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-lg shadow-xl z-10 max-w-2xl max-w-full"
          >
            <div className="w-full flex justify-end">
              <button
                onClick={() => setShowBasicINfoModel(false)}
                className="text-gray-800 hover:text-red-500 cursor-pointer"
              >
                <X />
              </button>
            </div>{" "}
            <h1 className="text-2xl font-semibold text-neutral-900">
              Basic Info Modify
            </h1>
            <ModifyBasicInfo
              initalData={productList}
              refreshevent={setEvent}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                  setShowBasicINfoModel(false);
                }
              }}
            />
          </div>
        </div>
      )}

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
              conditionShowSave={true}
              images={selectedImages}
              variantID={variantID}
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
                            url: file.url,
                            file: file.file,
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

      {showImageListModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          //onClick={() => setShowBasicINfoModel(false)}
          style={{ marginBottom: "0px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-sm"></div>
          <div
            //onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-lg shadow-xl z-10 max-w-5xl"
          >
            <div className="w-full flex justify-end">
              <button
                onClick={() => {
                  setCombinationList([]);
                  setShowImageListModel(false);
                }}
                className="text-gray-800 hover:text-red-500 cursor-pointer"
              >
                <X />
              </button>
            </div>{" "}
            <div className="w-full flex justify-between items-center">
              <div className="w-full">
                {" "}
                <h1 className="text-lg font-semibold text-neutral-900">
                  Modify Variant Information
                </h1>
              </div>
              <div className="w-full flex justify-end p-4">
                <button
                  title="Add Row"
                  className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                  onClick={() => setAddnewRecord(!AddNewRecord)}
                >
                  {AddNewRecord ? "+Add Row" : "Add Purchase"}
                </button>
              </div>
            </div>
            <div className="w-full bg-white rounded-lg border border-gray-200">
              {AddNewRecord ? (
                <>
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {vareintList.map((item2, index) => (
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
                        <tr
                          key={res.id}
                          className="hover:bg-gray-50 transition"
                        >
                          {vareintList.map((item) => (
                            <td
                              key={item.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <select
                                className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={(() => {
                                  // Find the stored attribute by matching the variant name
                                  const storedAttr = res?.attributeID?.find(
                                    (stored) => {
                                      // For each stored attribute, check if its value exists in the current variant's attributeList
                                      // and if the variant name matches
                                      return item.attributeList?.some(
                                        (listAttr) =>
                                          listAttr.id === stored.id &&
                                          listAttr.values === stored.values,
                                      );
                                    },
                                  );
                                  return storedAttr?.id || "";
                                })()}
                                onChange={(e) => {
                                  const selectedAttrId = e.target.value;
                                  const selectedAttr = item.attributeList?.find(
                                    (attr) => attr.id === selectedAttrId,
                                  );

                                  setCombinationList((prev) => {
                                    const updated = [...prev];
                                    const attributes = [
                                      ...(updated[index]?.attributeID || []),
                                    ];

                                    const existingIndex = attributes.findIndex(
                                      (attr) => attr.variantDefId === item.id,
                                    );

                                    if (existingIndex >= 0) {
                                      attributes[existingIndex] = {
                                        ...attributes[existingIndex],
                                        id: selectedAttrId,
                                        values: selectedAttr?.values || "",
                                      };
                                    } else {
                                      attributes.push({
                                        variantDefId: item.id,
                                        id: selectedAttrId,
                                        values: selectedAttr?.values || "",
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
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "qty",
                                  e.target.value,
                                )
                              }
                              value={res.qty || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Qty"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "costPrice",
                                  e.target.value,
                                )
                              }
                              value={res.costPrice || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Cost Price"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "salePrice",
                                  e.target.value,
                                )
                              }
                              value={res.salePrice || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Sale Price"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "barcode",
                                  e.target.value,
                                )
                              }
                              value={res.barcode || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Barcode"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => {
                                fetchData(res.id);
                                setVariantID(res.id);
                                // setShhowPopupModel2(true);
                                // setID(String(res.id));
                              }}
                              className="bg-blue-500 px-2 py-2 hover:bg-red-600 text-white transition rounded"
                              title="View Images"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => deleteVarinats(res.id)}
                              className="bg-red-500 px-2 py-2 hover:bg-red-600 text-white transition rounded"
                              title="Delete Row"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <div className="w-full flex justify-end p-4">
                    <button
                      title="Add Row"
                      className="px-4 py-2 font-medium text-xs border border-gray-300 hover:border-gray-500 transition duration-200 ease-in-out rounded-md cursor-pointer"
                      onClick={addRow}
                    >
                      {AddNewRecord ? "+Add Row" : "Add Purchase"}
                    </button>
                  </div>

                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {vareintList2.map((item2, index) => (
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
                      {combinationList2.map((res, index) => (
                        <tr
                          key={res.id}
                          className="hover:bg-gray-50 transition"
                        >
                          {vareintList2.map((item) => (
                            <td
                              key={item.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <select
                                className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={(() => {
                                  // Find the stored attribute by matching the variant name
                                  const storedAttr = res?.attributeID?.find(
                                    (stored) => {
                                      // For each stored attribute, check if its value exists in the current variant's attributeList
                                      // and if the variant name matches
                                      return item.attributeList?.some(
                                        (listAttr) =>
                                          listAttr.id === stored.id &&
                                          listAttr.values === stored.values,
                                      );
                                    },
                                  );
                                  return storedAttr?.id || "";
                                })()}
                                onChange={(e) => {
                                  const selectedAttrId = e.target.value;
                                  const selectedAttr = item.attributeList?.find(
                                    (attr) => attr.id === selectedAttrId,
                                  );

                                  setCombinationList2((prev) => {
                                    const updated = [...prev];
                                    const attributes = [
                                      ...(updated[index]?.attributeID || []),
                                    ];

                                    const existingIndex = attributes.findIndex(
                                      (attr) => attr.variantDefId === item.id,
                                    );

                                    if (existingIndex >= 0) {
                                      attributes[existingIndex] = {
                                        ...attributes[existingIndex],
                                        id: selectedAttrId,
                                        values: selectedAttr?.values || "",
                                      };
                                    } else {
                                      attributes.push({
                                        variantDefId: item.id,
                                        id: selectedAttrId,
                                        values: selectedAttr?.values || "",
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
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "qty",
                                  e.target.value,
                                )
                              }
                              readOnly
                              value={res.qty || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Qty"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "costPrice",
                                  e.target.value,
                                )
                              }
                              value={res.costPrice || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Cost Price"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "salePrice",
                                  e.target.value,
                                )
                              }
                              value={res.salePrice || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Sale Price"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              onChange={(e) =>
                                updateRow(
                                  String(index + 1),
                                  "barcode",
                                  e.target.value,
                                )
                              }
                              value={res.barcode || ""}
                              className="w-full p-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              type="text"
                              placeholder="Barcode"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => {
                                fetchData(res.id);
                                setVariantID(res.id);
                                // setShhowPopupModel2(true);
                                // setID(String(res.id));
                              }}
                              className="bg-blue-500 px-2 py-2 hover:bg-red-600 text-white transition rounded"
                              title="View Images"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => deleteVarinats(res.id)}
                              className="bg-red-500 px-2 py-2 hover:bg-red-600 text-white transition rounded"
                              title="Delete Row"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        <ShowAddFile
          update={setUpdate}
          setView={setView}
          view={view}
          setlistView={() => {}}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Product Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddProductForm
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
                images={imagesList}
                setImages={setImages}
                showPopupModel={setShowPopupModel}
                imageRowID={setRowID}
              />
            </>
          )}
          {view === "list" && (
            <>
              <GetProductList
                refreshevent={event}
                setShowBasicINfoModel={setShowBasicINfoModel}
                initalData={setProductList}
                setShowImageListModel={setShowImageListModel}
                setSubCategoryID={setSubCategoryID}
                setFurtherSubCategoryList={setFurtherSubCategoryList}
                setProductVariant={setProductVariant}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

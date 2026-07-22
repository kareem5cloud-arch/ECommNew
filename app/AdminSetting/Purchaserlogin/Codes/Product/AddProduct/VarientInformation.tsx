// AddVarientInformation.tsx
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
} from "lucide-react";
import { useState } from "react";

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
  // Main Variant State
  mainVarientName: string;
  setMainVarientName: (value: string) => void;

  // List of Variants
  listVarient: listVarient[];
  setListVarient: (value: listVarient[]) => void;

  // Current Attributes being edited
  currentAttributes: varientAttributes[];
  setCurrentAttributes: (value: varientAttributes[]) => void;

  // Editing State
  editingVariantIndex: number | null;
  setEditingVariantIndex: (value: number | null) => void;

  // New Attribute Form State
  newAttribute: varientAttributes;
  setNewAttribute: (value: varientAttributes) => void;
}

export default function AddVarientInformation({
  mainVarientName,
  setMainVarientName,
  listVarient,
  setListVarient,
  currentAttributes,
  setCurrentAttributes,
  editingVariantIndex,
  setEditingVariantIndex,
  newAttribute,
  setNewAttribute,
}: AddVarientInformationProps) {
  const handleNewAttributeChange = (
    field: keyof varientAttributes,
    value: string | number,
  ) => {
    setNewAttribute({ ...newAttribute, [field]: value });
  };

  const handleRemoveAttribute = (index: number) => {
    setCurrentAttributes(currentAttributes.filter((_, i) => i !== index));
  };

  const handleAddAttribute = () => {
    if (!newAttribute.varientValue.trim()) {
      alert("Please enter Attribute Name");
      return;
    }
    if (Number(newAttribute.qty) < 0) {
      alert("Please enter valid quantity");
      return;
    }
    if (Number(newAttribute.costPrice) <= 0) {
      alert("Please enter valid cost price");
      return;
    }
    if (Number(newAttribute.salePrice) <= 0) {
      alert("Please enter valid sale price");
      return;
    }
    setCurrentAttributes([...currentAttributes, newAttribute]);
    setNewAttribute({
      varientValue: "",
      qty: "",
      costPrice: "",
      salePrice: "",
      barcode: "",
    });
  };

  const handleAddMainVariant = () => {
    if (!mainVarientName.trim()) {
      alert("Please enter a Variant Name");
      return;
    }
    if (currentAttributes.length === 0) {
      alert("Please add at least one attribute");
      return;
    }

    if (editingVariantIndex !== null) {
      const updatedList = [...listVarient];
      updatedList[editingVariantIndex] = {
        varientName: mainVarientName.trim(),
        varientAttributes: currentAttributes,
      };
      setListVarient(updatedList);
      setEditingVariantIndex(null);
    } else {
      const updatedList = [
        ...listVarient,
        {
          varientName: mainVarientName.trim(),
          varientAttributes: currentAttributes,
        },
      ];
      setListVarient(updatedList);
    }

    setMainVarientName("");
    setCurrentAttributes([]);
  };

  const handleEditVariant = (index: number) => {
    const variant = listVarient[index];
    setMainVarientName(variant.varientName);
    setCurrentAttributes(variant.varientAttributes);
    setEditingVariantIndex(index);
  };

  const handleDeleteVariant = (index: number) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      setListVarient(listVarient.filter((_, i) => i !== index));
    }
  };

  const handleCancelEdit = () => {
    setMainVarientName("");
    setCurrentAttributes([]);
    setEditingVariantIndex(null);
  };

  const totalQuantity = listVarient.reduce(
    (sum, variant) =>
      sum +
      variant.varientAttributes.reduce((s, attr) => s + Number(attr.qty), 0),
    0,
  );

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col ">
          {/* Left Side - Add/Edit Variant Form */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                {editingVariantIndex !== null
                  ? "Edit Variant"
                  : "Add New Variant"}
              </h3>

              {/* Variant Name Input */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Variant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Size, Color"
                  value={mainVarientName}
                  onChange={(e) => setMainVarientName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition"
                />
              </div>

              {/* Attributes Table */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Variant Attributes <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">
                            Attribute
                          </th>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">
                            Quantity
                          </th>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">
                            Cost Price
                          </th>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">
                            Sale Price
                          </th>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">
                            Barcode
                          </th>
                          <th className="px-3 py-2 text-center text-gray-600 font-medium w-16">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentAttributes.map((attr, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-700">
                              {attr.varientValue}
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {attr.qty}
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {attr.costPrice}
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {attr.salePrice}
                            </td>
                            <td className="px-3 py-2">
                              <span className="font-mono text-xs text-gray-500">
                                {attr.barcode || "-"}
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handleRemoveAttribute(i)}
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              placeholder="Attribute name"
                              value={newAttribute.varientValue}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "varientValue",
                                  e.target.value,
                                )
                              }
                              className="w-full p-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              placeholder="0"
                              value={newAttribute.qty}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "qty",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full p-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newAttribute.costPrice}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "costPrice",
                                  parseFloat(e.target.value),
                                )
                              }
                              className="w-full p-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newAttribute.salePrice}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "salePrice",
                                  parseFloat(e.target.value),
                                )
                              }
                              className="w-full p-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              placeholder="Barcode"
                              value={newAttribute.barcode}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "barcode",
                                  e.target.value,
                                )
                              }
                              className="w-full p-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none font-mono"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={handleAddAttribute}
                              className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center justify-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddMainVariant}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingVariantIndex !== null
                      ? "Update Variant"
                      : "Save Variant"}
                  </span>
                </button>

                {editingVariantIndex !== null && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-md hover:bg-gray-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Variant List */}
          <div className="space-y-4 mt-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <List className="w-4 h-4" />
                Variant List ({listVarient.length})
              </h3>

              {listVarient.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No variants added yet</p>
                  <p className="text-gray-300 text-xs mt-1">
                    Add your first variant using the form
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {listVarient.map((variant, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-500" />
                            {variant.varientName}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {variant.varientAttributes.length} attributes
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditVariant(index)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 rounded transition"
                            title="Edit Variant"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(index)}
                            className="p-1.5 text-gray-500 hover:text-red-500 rounded transition"
                            title="Delete Variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {variant.varientAttributes.map((attr, attrIndex) => (
                          <div
                            key={attrIndex}
                            className="text-sm p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span className="font-medium text-gray-700">
                                  {attr.varientValue}
                                </span>
                              </div>
                              {attr.barcode && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Barcode className="w-3 h-3" />
                                  <span className="font-mono">
                                    {attr.barcode}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-gray-600">
                                Qty:{" "}
                                <span className="font-medium text-gray-800">
                                  {attr.qty}
                                </span>
                              </div>
                              <div className="text-gray-600">
                                Cost:{" "}
                                <span className="font-medium text-gray-800">
                                  {attr.costPrice}
                                </span>
                              </div>
                              <div className="text-gray-600">
                                Sale:{" "}
                                <span className="font-medium text-gray-800">
                                  {attr.salePrice}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState } from "react";

interface phoneList {
  phoneNo: string;
  country: string;
}

interface AddressList {
  country: string;
  city: string;
  postalCode: string;
  address: string;
}

export default function ProfileManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [showList, setShowList] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const [images, setImages] = useState<(File | null)[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [selectedBox, setSelectedBox] = useState<number | null>(null); // NEW
  const fileInputRef = useRef<HTMLInputElement>(null);

  //PhoneVariable
  const [phoneList, setPhoneList] = useState<phoneList[]>([]);

  //PhoneVariable
  const [AddressList, setAddressList] = useState<AddressList[]>([]);

  const REQUIRED_WIDTH = 4500;
  const REQUIRED_HEIGHT = 3000;

  const handleClick = (index?: number) => {
    if (index !== undefined) setSelectedBox(index);
    else setSelectedBox(null);
    fileInputRef.current?.click();
  };

  const validateDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);

    // If replacing a specific box
    if (selectedBox !== null) {
      const file = newFiles[0];

      if (selectedBox === 0) {
        const valid = await validateDimensions(file);
        if (!valid) {
          alert(`Header image must be ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px`);
          return;
        }
      }

      const updated = [...images];
      updated[selectedBox] = file;
      setImages(updated);
      return;
    }

    // Else add dynamically
    for (let file of newFiles) {
      // Validate banner size for first position (header)
      if (images.length === 0) {
        const valid = await validateDimensions(file);
        if (!valid) {
          alert(`Header image must be ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px`);
          return;
        }
      }
      setImages((prev) => [...prev, file]);
    }
  };

  const reorderImages = (from: number, to: number) => {
    const updated = [...images];
    const moved = updated.splice(from, 1)[0];
    updated.splice(to, 0, moved);
    setImages(updated);
  };
  //-------------------------------PhoneList---------------------
  const addPhone = () => {
    setPhoneList([...phoneList, { phoneNo: "", country: "" }]);
  };

  const updatePhone = (
    index: number,
    field: keyof phoneList,
    value: string
  ) => {
    setPhoneList((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };
  const removePhone = (index: number) => {
    setPhoneList(phoneList.filter((_, i) => i !== index));
  };

  //-------------------------------AddressList---------------------
  const addAddress = () => {
    setAddressList([
      ...AddressList,
      { country: "", city: "", postalCode: "", address: "" },
    ]);
  };

  const updateAddress = (
    index: number,
    field: keyof AddressList,
    value: string
  ) => {
    setAddressList((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };
  const removeAddress = (index: number) => {
    setAddressList(AddressList.filter((_, i) => i !== index));
  };
  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Store Management
      </h1>

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showList ? (
              <>
                <ChevronRight size={18} /> Add New
              </>
            ) : (
              <>
                <ChevronLeft size={18} /> Show List
              </>
            )}
          </button>
        </div>

        {!showList && (
          <div className="space-y-5 mt-2">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  //   value={productName}
                  //   onChange={(e) => setProductName(e.target.value)}
                  placeholder="Store Name"
                  className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  //   value={discount}
                  //   onChange={(e) => setDiscount(e.target.value)}
                  placeholder="abc@email.com"
                  className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <fieldset className="p-4 border border-gray-300 rounded-lg">
              <legend className="text-lg font-semibold text-gray-800 px-2">
                Phone No
              </legend>
              <div>
                {phoneList.map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Phone No
                      </label>
                      <input
                        type="text"
                        value={item.phoneNo}
                        onChange={(e) =>
                          updatePhone(i, "phoneNo", e.target.value)
                        }
                        placeholder="Phone No"
                        className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Display Country
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={item.country}
                          onChange={(e) =>
                            updatePhone(i, "country", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Country</option>
                          <option value="">Pakistan</option>
                        </select>
                        <button
                          onClick={() => removePhone(i)}
                          title="Remove list"
                          className="text-white px-2  rounded-md bg-red-500 hover:bg-red-500 font-bold"
                        >
                          <X />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addPhone}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  + Add Phone
                </button>
              </div>
            </fieldset>
            <fieldset className="p-4 border border-gray-300 rounded-lg">
              <legend className="text-lg font-semibold text-gray-800 px-2">
                Address
              </legend>
              <div>
                {AddressList.map((item, i) => (
                  <div key={i} className=" mb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Country
                        </label>
                        <select
                          value={item.country}
                          onChange={(e) =>
                            updateAddress(i, "country", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Country</option>
                          <option value="">Pakistan</option>
                          <option value="">India</option>
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          City
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={item.city}
                            onChange={(e) =>
                              updateAddress(i, "city", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Country</option>
                            <option value="">Chakwal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={item.postalCode}
                          onChange={(e) =>
                            updateAddress(i, "postalCode", e.target.value)
                          }
                          placeholder="Postal Code"
                          className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Address
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.address}
                            onChange={(e) =>
                              updateAddress(i, "address", e.target.value)
                            }
                            placeholder="Address"
                            className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeAddress(i)}
                            title="Remove list"
                            className="text-white px-2  rounded-md bg-red-500 hover:bg-red-500 font-bold"
                          >
                            <X />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addAddress}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  + Add Address
                </button>
              </div>
            </fieldset>
            {/* HEADER IMAGES */}
            <fieldset className="p-4 border border-gray-300 rounded-lg">
              <legend className="text-lg font-semibold text-gray-800 px-2">
                Header Image
              </legend>

              <label className="block text-gray-700 font-medium mb-1">
                (Minimum 3 Images)
              </label>

              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleImageChange(e.dataTransfer.files);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`w-full p-4 border-2 flex flex-wrap gap-5 border-dashed rounded-md cursor-pointer 
                ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                `}
                onClick={() => handleClick()}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragEnter={() => setHoverIndex(i)}
                    onDragEnd={() => {
                      if (
                        dragIndex !== null &&
                        hoverIndex !== null &&
                        dragIndex !== hoverIndex
                      ) {
                        reorderImages(dragIndex, hoverIndex);
                      }
                      setDragIndex(null);
                      setHoverIndex(null);
                    }}
                    className={`relative w-24 h-24 rounded-md flex items-center justify-center
                      ${
                        hoverIndex === i ? "ring-2 ring-blue-500 scale-105" : ""
                      }
                      transition-all duration-150 bg-gray-200 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(i);
                    }}
                  >
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        className="w-full h-full object-cover rounded-md pointer-events-none"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">Empty</span>
                    )}
                    <span className="absolute -bottom-5 text-xs text-gray-600">
                      {i === 0 ? "Header (1200x400)" : `Image ${i + 1}`}
                    </span>
                  </div>
                ))}

                {/* ADD NEW BOX */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="w-24 h-24 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-sm"
                >
                  + Add
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e.target.files)}
                className="hidden"
              />
            </fieldset>
            <div>
              <label className=" mt-2 block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                rows={3}
                // value={description}
                // onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              // onClick={handleSave}
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

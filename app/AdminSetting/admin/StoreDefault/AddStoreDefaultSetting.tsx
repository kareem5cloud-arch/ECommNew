import StoreGetApi from "@/app/api/Controller/AdminController/Store/GetStore";
import AddDefaultStoreSettingApi from "@/app/api/Controller/AdminController/StoreDefaultSetting/AddDefaultStoreSetting";
import DeleteDefaultStoreSettingApi from "@/app/api/Controller/AdminController/StoreDefaultSetting/DeletImageStoreSetting";
import GetStoreDefaultSettingApi from "@/app/api/Controller/AdminController/StoreDefaultSetting/GetStoreDefaultSetting";
import { SendDataToApi } from "@/app/api/Controller/MiddleWare/CloudinaryUplaod";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import {
  ResponseGetDefaultStoreget,
  storeListResponse,
} from "@/app/api/Types/AdminSetting/StoreDefaultSetting/StoreDefaultSetting";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import FileInputGeneric from "@/app/ui/inputFiled/FileInputFiled";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

type BannerItem = {
  image: File;
  heading: string;
  subHeading: string;
};
type BannerItemText = {
  image: string;
  heading: string;
  subHeading: string;
};
type BannerItemTextWithID = {
  ID: string;
  image: string;
  heading: string;
  subHeading: string;
};

interface AddStorePorps {
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function AddStoreDefaultSetting({
  onShowMessage,
}: AddStorePorps) {
  const [StoreListDefault, setStoreListDefault] = useState<storeListResponse[]>(
    [],
  );
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [Twitter, setTwitter] = useState("");
  const [Linkdin, setLinkdin] = useState("");
  const [Youtube, setYoutube] = useState("");
  const [Instagram, setInstagram] = useState("");
  const [FaceBook, setFaceBook] = useState("");
  const [Heading, setHeading] = useState("");
  const [SubHeading, setSubHeading] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [logoUrl, setLogoUrl] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannerstext, setBannerstext] = useState<BannerItemText[]>([]);
  const [ResponseForIMagelist, setResponseForIMagelist] = useState<
    BannerItemTextWithID[]
  >([]);

  const uploadBanners = async () => {
    const uploaded = await Promise.all(
      banners.map(async (item) => {
        const res = await SendDataToApi(item.image);

        return {
          url: res.data,
          heading: item.heading,
          subHeading: item.subHeading,
        };
      }),
    );

    return uploaded;
  };
  const AddStoreDefauiltSetting = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const imageUrl = await uploadBanners();
      let logo;
      if (logoUrl) {
        logo = await SendDataToApi(logoUrl);
      }

      const formData = {
        logoUrl: logo?.data,
        twitter: Twitter,
        address: Address,
        storeID: StoreID,
        email: Email,
        phoneNo: PhoneNo,
        instagram: Instagram,
        linkdin: Linkdin,
        facebook: FaceBook,
        youtube: Youtube,
        imagelist: imageUrl.map((item) => ({
          url: item.url,
          headerText: item.heading,
          subHeadingText: item.subHeading,
          otherText: "",
        })),
      };
      const response = await AddDefaultStoreSettingApi(
        StoreID,
        formData,
        String(token),
      );
      if (response.status == 200) {
        await StoreDefaultget(StoreID);
        onShowMessage(response.data.message, "success");
        setBanners([]);
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const DeleteStoreImages = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await DeleteDefaultStoreSettingApi(ID, String(token));
    if (response.status == 200) {
      setResponseForIMagelist(
        ResponseForIMagelist.filter((item) => item.ID !== ID),
      );
    } else {
      setResponseForIMagelist(ResponseForIMagelist);
    }
  };
  const StoreDefaultget = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetStoreDefaultSettingApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetDefaultStoreget;
      setStoreListDefault(data.storeList);
    } else {
      setStoreListDefault([]);
    }
  };
  const Storeget = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await StoreGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
      const data2 = data.storeList.find((item) => item.defaultStore === true);
      if (data2) {
        setStoreName(data2.storeName);
        setStoreID(data2.storeID);
        await StoreDefaultget(data2.storeID);
      }
    } else {
      setStoreList([]);
    }
  };
  useEffect(() => {
    Storeget();
  }, []);

  const updateBannerField = (
    index: number,
    field: "heading" | "subHeading",
    value: string,
  ) => {
    const updated = [...banners];
    updated[index][field] = value;
    setBanners(updated);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const newBanners = Array.from(files).map((file) => ({
      image: file,
      heading: "",
      subHeading: "",
    }));

    setBanners((prev) => [...prev, ...newBanners]);
  };

  const deleteBanner = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (StoreListDefault && StoreListDefault.length > 0) {
      const data = StoreListDefault[0];

      setID(data.userID || "");
      setAddress(data.address || "");
      setEmail(data.email || "");
      setPhoneNo(data.phoneNo || "");
      setFaceBook(data.facebook || "");
      setInstagram(data.instagram || "");
      setLinkdin(data.linkdin || "");
      setTwitter(data.twitter || "");
      setYoutube(data.youtube || "");
      setUrl(data.logoUrl);
      setResponseForIMagelist(
        data.imagelist?.map((item) => ({
          ID: item.imageID || "",
          image: item.url,
          heading: item.headerText,
          subHeading: item.subHeadingText,
        })),
      );
    }
  }, [StoreListDefault]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-lg space-y-4">
          <InputFieldGeneric
            label="Store Name"
            type="text"
            required={false}
            placeholder="Enter StoreName"
            SateChange={StoreName}
            setSateChange={setStoreName}
            disabled={false}
            readonly={true}
          />
          <InputFieldGeneric
            label="Email"
            type="text"
            required={false}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
            disabled={false}
          />
          <InputFieldGeneric
            label="Phone No"
            type="text"
            required={false}
            placeholder="Enter PhoneNo"
            SateChange={PhoneNo}
            setSateChange={setPhoneNo}
            disabled={false}
          />
          <InputFieldGeneric
            label="Address"
            type="text"
            required={false}
            placeholder="Enter Address"
            SateChange={Address}
            setSateChange={setAddress}
            disabled={false}
          />
          <InputFieldGeneric
            label="Twitter"
            type="text"
            required={false}
            placeholder="Enter Twitter"
            SateChange={Twitter}
            setSateChange={setTwitter}
            disabled={false}
          />
          <InputFieldGeneric
            label="Youtube"
            type="text"
            required={false}
            placeholder="Enter Youtube"
            SateChange={Youtube}
            setSateChange={setYoutube}
            disabled={false}
          />
          <InputFieldGeneric
            label="Instagram"
            type="text"
            required={false}
            placeholder="Enter Instagram"
            SateChange={Instagram}
            setSateChange={setInstagram}
            disabled={false}
          />
          <InputFieldGeneric
            label="FaceBook"
            type="text"
            required={false}
            placeholder="Enter FaceBook"
            SateChange={FaceBook}
            setSateChange={setFaceBook}
            disabled={false}
          />
          <InputFieldGeneric
            label="Linkdin"
            type="text"
            required={false}
            placeholder="Enter Linkdin"
            SateChange={Linkdin}
            setSateChange={setLinkdin}
            disabled={false}
          />

          <FileInputGeneric label="Logo" onFileChange={setLogoUrl} />

          {logoUrl ? (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(logoUrl)}
                alt="Logo Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          ) : (
            <div className="mt-4">
              <img
                src={url}
                alt="Logo Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="flex justify-end">
            <ActionButton
              text="Save"
              update={false}
              loading={loading}
              loadingtext="Saving..."
              onClick={() => AddStoreDefauiltSetting()}
              disabled={false}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <div className="w-full p-5">
            {/* Upload Area */}
            <div className="relative w-full">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition" />
                </div>
                <p className="text-gray-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  PNG, JPG, JPEG, GIF up to 10MB
                </p>
              </label>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={URL.createObjectURL(item.image)}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                        Banner {index + 1}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteBanner(index)}
                      className="absolute top-3 right-3 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="p-4 space-y-3">
                    {/* Heading Field */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Heading
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter banner heading"
                          value={item.heading}
                          onChange={(e) =>
                            updateBannerField(index, "heading", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
                        />
                      </div>
                    </div>

                    {/* Sub Heading Field */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Sub Heading
                      </label>
                      <textarea
                        placeholder="Enter banner sub heading"
                        value={item.subHeading}
                        onChange={(e) =>
                          updateBannerField(index, "subHeading", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 mt-10">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Banner Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your homepage banners
                  </p>
                </div>
                <div className="bg-purple-50 text-purple-600 text-sm font-medium px-3 py-1 rounded-full">
                  {ResponseForIMagelist.length} Banners
                </div>
              </div>

              {/* Banner Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ResponseForIMagelist.map((item, index) => (
                  <div
                    key={item.ID}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                          Banner {index + 1}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => DeleteStoreImages(item.ID)}
                        className="absolute top-3 right-3 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition backdrop-blur-sm opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Heading Section */}
                      <div className="mb-3 pb-2 border-b border-gray-100">
                        <label className="block text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                          Heading
                        </label>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {item.heading || "—"}
                        </p>
                      </div>

                      {/* Sub Heading Section */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Sub Heading
                        </label>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.subHeading || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Divider Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

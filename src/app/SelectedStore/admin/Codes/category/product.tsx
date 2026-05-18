"use client";
import Barcode from "react-barcode";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Coins,
  CoinsIcon,
  Download,
  Pencil,
  Plus,
  Ticket,
  Trash,
  Upload,
  X,
} from "lucide-react";

import DeleteProductApi from "@/api/lib/product/DeleteProduct/DeleteProduct";
import GetProduct from "@/api/lib/product/GetProduct/GetProduct";
import { useRouter } from "next/navigation";
import { Product, ProductApiResponse } from "@/api/types/product/getProduct";
import Spinner from "@/component/spinner/page";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/country/countryget";
import GetCountry from "@/api/lib/country/countryList/countryListGet";
import GetCategoryMain from "@/api/lib/category/CategorySeller/CategoryMain";
import {
  CategoryMain,
  CategoryMainApiResponse,
} from "@/api/types/categoryTypes/CategoryMain";
import GetCategorySub from "@/api/lib/category/getCategorySub/categorySubGet";
import {
  CategorySub,
  CategorySubApiResponse,
} from "@/api/types/categoryTypes/CategorySub";
import GetFurtherSub from "@/api/lib/subCategory/GetSub/getSub";
import {
  FurtherSub,
  FurtherSubApiResponse,
} from "@/api/types/subCategory/getSub";
import html2canvas from "html2canvas";
import GetUnitByID from "@/api/lib/unit/unitGetByID/unitGetByID";
import { UnitIDApiResponse, UnitListID } from "@/api/types/unit/unitsGetByID";
import ModifyProductBasicInfo from "@/api/lib/product/ModifyProduct/ModifyBasicInfo/ModifyBasicInfo";
import ModifyProductVarinet from "@/api/lib/product/ModifyProduct/ModifyVarient/ModifyVarinet";
import {
  addVarinetPayload,
  modifyVarinetPayload,
} from "@/api/types/product/AddVarient";
import GetVarinet from "@/api/lib/product/ModifyProduct/ModifyVarient/GetVarient";
import {
  VariantList,
  VarinetApiResponse,
} from "@/api/types/product/getVarinet";
import DeleteVarinetApi from "@/api/lib/product/ModifyProduct/ModifyVarient/DeleteVarient";
import GetProductImages from "@/api/lib/product/ModifyProduct/ModifyImage/modifyImage";
import {
  ImageGetApiResponse,
  ImageListID,
} from "@/api/types/product/getImages";
import DeleteImageApi from "@/api/lib/product/ModifyProduct/ModifyImage/deleteImage";
import { SendDataToApi } from "@/api/OtherController/router";
import convertImageToWebPWithWatermark from "@/api/OtherController/webConverter";
import { ImageApiRequest, ImagesList } from "@/api/types/product/addImages";
import AddImageProduct from "@/api/lib/product/ModifyProduct/ModifyImage/addImages";
import {
  ResponseSupplierGetData,
  SupplierData,
} from "@/api/types/PosIntegration/Suppplier/addSupplier";
import GetSupplier from "@/api/lib/PosIntegration/Supplier/GetSupplier";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import ModifyProductVarinetAttribute from "@/api/lib/product/ModifyProduct/ModifyVarient/ModifyVarientModify";

interface CountryList {
  countryID: string;
  countryName: string;
}
interface Varient {
  varientName: string;
  varientAttributes: VarientAttribute[];
}
interface VarientAttribute {
  varientValue: string;
  qty: number;
  barcode: string;
  costPrice: number;
  salePrice: number;
}

export default function ProductCard({ storeID }: { storeID?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [productAbout, setProductAbout] = useState(false);
  const [varinetAbout, setVarinetAbout] = useState(false);
  const [showList, setShowList] = useState(false);
  const [isOpenVarinet, setIsOpenVarinet] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [imageAbout, setImageAbout] = useState(false);
  const [modify, setModify] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [ID, setID] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Depth, setDepth] = useState("");
  const [Weight, setWeight] = useState("");
  const [TotalQuantity, setTotalQuantity] = useState("");
  const [Threshold, setThreshold] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedOption, setSelectedOption] = useState("ShowinAllCountry");
  const [FeaturedProduct, setFeaturedProduct] = useState("");
  const [DisplayCountryID, setDisplayCountryID] = useState("");
  const [DisplayCountryName, setDisplayCountryName] = useState("");
  const [HideCountryID, setHideCountryID] = useState("");
  const [HideCountryName, setHideCountryName] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [listofCountry, setListofCountry] = useState<Countryget[]>([]);
  const [countryHideList, setCountryHideList] = useState<CountryList[]>([]);
  const [countryShowLis, setCountryShowList] = useState<CountryList[]>([]);
  const [getVarinetList, setGetVarinetList] = useState<VariantList[]>([]);
  const [supplierID, setSupplierID] = useState("");
  const [SupplierList, setSupplierList] = useState<SupplierData[]>([]);
  const [ImageList, setImageList] = useState<ImageListID[]>([]);
  const [CategoryMainID, setCategoryMainID] = useState("");
  const [CategorySubID, setCategorySubID] = useState("");
  const [FurtherCategorySubID, setFurtherCategorySubID] = useState("");
  const [UnitID, setUnitID] = useState("");
  const [catgeoryMainList, setCatgeoryMainList] = useState<CategoryMain[]>([]);
  const [catgeorySubList, setCatgeorySubList] = useState<CategorySub[]>([]);
  const [FurtherSubList, setFurtherSubList] = useState<FurtherSub[]>([]);
  const [UnitList, setUnitList] = useState<UnitListID[]>([]);
  const [purchaseID, setPurchaseID] = useState("");
  //VARIENT States
  const [listVarient, setListVarient] = useState<Varient[]>([]);
  const [mainVarientName, setMainVarientName] = useState("");
  const [currentAttributes, setCurrentAttributes] = useState<
    VarientAttribute[]
  >([]);
  const [newAttribute, setNewAttribute] = useState<VarientAttribute>({
    varientValue: "",
    qty: 0,
    barcode: "",
    costPrice: 0,
    salePrice: 0,
  });

  const [images, setImages] = useState<File[]>([]);

  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [productList, setProductList] = useState<Product[]>([]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    Record<string, number>
  >({});
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [selectedOption2, setSelectedOption2] = useState("OnlineStore");
  const [GettingVarinet, setGettingVarinet] = useState(false);
  const [selectedOption3, setSelectedOption3] = useState("No");
  const [adjustment, setAdjustment] = useState("");
  const [AmountPaid, setAmountPaid] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [Uploading, setUploading] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [ProductNameBarcode, setProductNameBarcode] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [readyToExport, setReadyToExport] = useState(false);
  const [Export, setExport] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);

  const exportpdf = async (
    barcode: string,
    productCode: string,
    salePrice: number,
  ) => {
    try {
      setExport(true);

      // ---------------- PDF SETUP ----------------
      // Label size: 50mm x 25mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [50, 25],
      });

      // ---------------- PRODUCT NAME (CENTERED) ----------------
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6);
      pdf.text(productCode, 25, 4, { align: "center" });

      // ---------------- PRICE (UNDER NAME, CENTERED) ----------------
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.text(`Rs ${salePrice.toLocaleString()}`, 25, 7, { align: "center" });

      // ---------------- HIGH-RES BARCODE GENERATION ----------------
      const barcodeCanvas = document.createElement("canvas");
      const scale = 3; // Increase for higher resolution
      const widthMM = 46;
      const heightMM = 11;
      barcodeCanvas.width = widthMM * scale;
      barcodeCanvas.height = heightMM * scale;

      JsBarcode(barcodeCanvas, barcode, {
        format: "CODE128",
        width: 1.1 * scale, // scale bar thickness
        height: 32 * scale, // scale barcode height
        displayValue: false,
        margin: 0,
      });

      const barcodeImage = barcodeCanvas.toDataURL("image/png");

      // ---------------- ADD BARCODE TO PDF (CENTERED) ----------------
      pdf.addImage(barcodeImage, "PNG", 2, 9, widthMM, heightMM);

      // ---------------- BARCODE NUMBER (CENTERED) ----------------
      pdf.setFontSize(5);
      pdf.text(barcode, 25, 22, { align: "center" });

      // ---------------- SAVE PDF ----------------
      const fileName = `${barcode}-${productCode}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExport(false);
    }
  };

  const fetchDatafroProduct = (
    ID: string,
    salePrice: number,
    barcode: string,
  ) => {
    const data = getVarinetList.find((item) =>
      item.varientAttributes.find((item2) => item2.attributeID === ID),
    );
    if (data) {
      const product = productList.find((item) =>
        item.variants.find((item2) => item2.varientID === data.varientID),
      );
      if (product) {
        setBarcode(barcode);
        setProductNameBarcode(product.productName);
        setSalePrice(String(salePrice));
        setReadyToExport(true);
      }
    }
  };
  useEffect(() => {
    if (readyToExport && barcode && ProductNameBarcode) {
      exportpdf(barcode, ProductNameBarcode, Number(SalePrice));
    }
  }, [readyToExport, barcode, ProductNameBarcode]);

  const getProduct = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return router.push("/sellerlogin");
      }
      const response = await GetProduct(token, String(storeID), page);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ProductApiResponse;
        console.log("Parsed data.list:", data.list);
        setProductList(data.list);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      } else {
        console.error("Unexpected status:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error in getProduct:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategroyMain = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCategoryMain(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCatgeoryMainList(data.categoryList);
      //getCategorySub(data.categoryList[0].categoryID); // now safe
      //setCategoryMainID(data.categoryList[0].categoryID);
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const SupplierGet = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await GetSupplier(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseSupplierGetData;
        setSupplierID(data.supplierList[0].supplierID);
        setSupplierList(
          data.supplierList.filter((item) => item.supplierName !== "SYSGEN"),
        );
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      // setResponseBack(3);
    }
  };
  useEffect(() => {
    SupplierGet();
    getProduct(1);
    getCategroyMain();
  }, []);

  const deleteProduct = async (productID: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setDeleting(true); // start spinner
    const formData = { productID };
    const response = await DeleteProductApi(formData, token);

    if (response.status === 200 || response.status === 201) {
      setID(""); // reset selected ID
      setIsOpen(false);
      await getProduct(1); // refresh list
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }

    setDeleting(false); // stop spinner
  };
  const handleDeleteImage = (indexToDelete: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };
  const fetchData = async (ID: string) => {
    const data = productList.find((item) => item.productID === ID);
    if (!data) return;

    // ✅ Set basic form info first
    setID(ID);
    setProductName(data.productName);
    setDescription(data.description);
    setFeaturedProduct(data.feturedProduct ? "Yes" : "No");
    setUnitID(data.unitID);
    setWidth(String(data.width) || "");
    setHeight(String(data.height) || "");
    setDepth(String(data.depth) || "");
    setWeight(String(data.weight) || "");
    setTotalQuantity(String(data.currentStock) || "");
    setThreshold(String(data.threshold) || "");
    setDiscount(String(data.discount) || "");

    if (data.showinCountry) {
      setSelectedOption("ShowinSomeCountry");
      setCountryShowList(data.countryList);
    } else if (data.notShowinCountry) {
      setSelectedOption("HideinSomeCountry");
      setCountryHideList(data.countryList);
    } else {
      setSelectedOption("ShowinAllCountry");
    }

    // ✅ Fetch categories and use returned arrays, not state
    const mainCategories = await getCategroyMain(); // return list
    setCategoryMainID(data.categoryID);

    if (catgeoryMainList.length > 0) {
      const subCategories = await getCategorySub(data.categoryID);
      setCategorySubID(data.subCategoryID);

      const furtherSubCategories = await getFurtherSub(data.subCategoryID);
      setFurtherCategorySubID(data.subCategoryDetailID);

      const units = await getUnits(data.subCategoryDetailID);
      setUnitID(data.unitID);
    }
  };

  const basicInfo = async () => {
    try {
      setLoading(true);
      let listCountry: { countryID: string }[] = [];
      if (selectedOption === "ShowinSomeCountry") {
        listCountry = countryShowLis.map((item) => ({
          countryID: item.countryID,
        }));
      } else if (selectedOption === "HideinSomeCountry") {
        listCountry = countryHideList.map((item) => ({
          countryID: item.countryID,
        }));
      }

      const formData = {
        productID: ID,
        storeID: (storeID as string) || "",
        categoryID: CategoryMainID,
        subCategoryDetailID: FurtherCategorySubID,
        subCategoryID: CategorySubID,
        unitID: UnitID,
        productName: productName,
        description: description,
        feturedProduct: FeaturedProduct === "Yes",
        width: Number(Width),
        height: Number(Height),
        depth: Number(Depth),
        weight: Number(Weight),
        percentage: 0,
        currentStock: Number(TotalQuantity),
        threshold: Number(Threshold),
        discount: Number(discount),
        showinAllCountry: selectedOption === "ShowinAllCountry",
        showinCountry: selectedOption === "ShowinSomeCountry",
        notShowinCountry: selectedOption === "HideinSomeCountry",
        listCountry: listCountry,
      };
      const token = localStorage.getItem("token");
      const response = await ModifyProductBasicInfo(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        // Reset logic...
        //setProductList([])
        setLoading(true);
        await getProduct(1);
        setLoading(false);
        setProductAbout(false);
        setCurrentStep(1);
        setProductName("");
        setDiscount("");
        setThreshold("");
        setTotalQuantity("");
        setWidth("");
        setHeight("");
        setDepth("");
        setWeight("");
        setDescription("");
        setCountryHideList([]);
        setCountryShowList([]);
        setSelectedOption("ShowinAllCountry");
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
      console.log(formData);
    } catch (error) {
      console.log("Error in basicInfo:", error);
    } finally {
      setLoading(false);
    }
  };

  const addVarient = async () => {
    const totalStock = listVarient.reduce((total, variant) => {
      return (
        total +
        variant.varientAttributes.reduce(
          (sum, attr) => sum + Number(attr.qty || 0),
          0,
        )
      );
    }, 0);

    const finalSupplierID =
      selectedOption3 === "Yes"
        ? supplierID
        : "DC4F35C5-8B69-454B-B3C5-75F16B2C54BE";

    const payload: addVarinetPayload = {
      invoiceNo: "",
      supplierID: finalSupplierID,
      purchaseDate: new Date().toISOString(),
      totalBill: Number(costPrice) || 0,
      amountPaid: Number(AmountPaid) || 0,
      adjustments: Number(adjustment) || 0,
      totalStock: totalStock,
      listVarient: listVarient,
    };

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      console.log(payload);
      const response = await ModifyProductVarinet(payload, ID, String(token));
      if (response.status === 200 || response.status === 201) {
        getProduct(1);
        getVarient(ID);
        setListVarient([]);
        setAmountPaid("");
        setAdjustment("");
        setShowList(false);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (error) {
      setUploading(false);
      console.log("Error in basicInfo:", error);
    } finally {
      setUploading(false);
    }
  };
  const ModifyVarient = async (
    NewID: string,
    barcode: string,
    costPrice: number,
    salePrice: number,
    qty: number,
    varientValue: string,
  ) => {
    const payload: modifyVarinetPayload = {
      varientValue: varientValue,
      qty: qty,
      costPrice: costPrice,
      salePrice: salePrice,
      barcode: barcode,
    };

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      console.log(payload);
      const response = await ModifyProductVarinetAttribute(
        payload,
        NewID,
        String(token),
      );
      if (response.status === 200 || response.status === 201) {
        getProduct(1);
        getVarient(ID);
        setListVarient([]);
        setAmountPaid("");
        setAdjustment("");
        setShowList(false);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (error) {
      setUploading(false);
      console.log("Error in basicInfo:", error);
    } finally {
      setUploading(false);
    }
  };
  // TypeScript version
  const handleVariantChange = (
    variantIndex: number, // index of the variant in getVarinetList
    attrIndex: number, // index of the attribute inside varientAttributes
    field: keyof VarientAttribute, // field to update: 'varientValue', 'barcode', 'qty', etc.
    value: string | number,
  ) => {
    setGetVarinetList((prev) => {
      // Make a shallow copy of the list
      const updated = [...prev];

      // Update the specific attribute of the specific variant
      updated[variantIndex].varientAttributes[attrIndex] = {
        ...updated[variantIndex].varientAttributes[attrIndex],
        [field]: value,
      };

      return updated;
    });
  };

  const getVarient = async (ID: string) => {
    try {
      setGettingVarinet(true);
      const token = localStorage.getItem("token");

      const response = await GetVarinet(String(token), ID);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as VarinetApiResponse;
        console.log(data);
        setGetVarinetList(data.vareintList);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (error) {
      console.log("Error in basicInfo:", error);
    } finally {
      setGettingVarinet(false);
    }
  };
  const deleteVarinet = async (varientID: string) => {
    const data = getVarinetList.find((item) => item.varientID === varientID);
    if (!data) return;

    const purchaseID = data.varientAttributes[0].billingDetail[0].purchaseID;

    const totalQuantity = data.varientAttributes.reduce(
      (total, attr) => total + Number(attr.qty || 0),
      0,
    );
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const payload = {
        purchaseID: purchaseID,
        productID: ID,
        varientID: varientID,
        totalQuantity: totalQuantity,
      };
      console.log(payload);
      const response = await DeleteVarinetApi(payload, String(token));
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setShowList(false);
        getProduct(1);
        setID("");
        setPurchaseID("");
        setIsOpenVarinet(false);
        setGetVarinetList((item) => item.filter((emp) => emp.varientID !== ID));
      }
      if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };
  const filteredProducts = (productList || []).filter((product) => {
    if (selectedOption2 === "Both") return true;
    if (selectedOption2 === "OnlineStore")
      return (
        product.storeSale === "OnlineStore" || product.storeSale === "Both"
      );
    if (selectedOption2 === "OfflineStore")
      return product.storeSale === "OfflineStore";
    return true;
  });

  if (loading) return <Spinner />;

  const hanldeAddShowCountry = () => {
    // const data = countryShowLis.find((item) => item.countryID === id);
    const updatedList = [
      ...countryShowLis,
      {
        countryID: DisplayCountryID,
        countryName: DisplayCountryName,
      },
    ];
    setDisplayCountryID("");
    setCountryShowList(updatedList);
  };

  const handleRemoveShowCountry = (index: number) => {
    setCountryShowList(countryShowLis.filter((_, i) => i !== index));
  };

  const hanldeAddHideCountry = () => {
    // const data = countryShowLis.find((item) => item.countryID === id);
    const updatedList = [
      ...countryHideList,
      {
        countryID: HideCountryID,
        countryName: HideCountryName,
      },
    ];
    setHideCountryID("");
    setCountryHideList(updatedList);
  };

  const handleRemoveHideCountry = (index: number) => {
    setCountryHideList(countryHideList.filter((_, i) => i !== index));
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

    const updatedList: Varient[] = [
      ...listVarient,
      {
        varientName: mainVarientName.trim(),
        varientAttributes: currentAttributes,
      },
    ];
    console.log(updatedList);
    setListVarient(updatedList);

    // Reset
    setMainVarientName("");
    setCurrentAttributes([]);
  };

  const costPrice = listVarient.reduce((total, variant) => {
    return (
      total +
      variant.varientAttributes.reduce((sum, attr) => sum + attr.costPrice, 0)
    );
  }, 0);

  // Add new attribute row to currentAttributes
  const handleAddAttribute = () => {
    if (!newAttribute.varientValue.trim()) {
      alert("Please enter Attribute Name");
      return;
    }
    setCurrentAttributes([...currentAttributes, newAttribute]);
    setNewAttribute({
      varientValue: "",
      qty: 0,
      costPrice: 0,
      barcode: "",
      salePrice: 0,
    });
  };

  // Update newAttribute inputs (for the input row)
  const handleNewAttributeChange = (
    field: keyof VarientAttribute,
    value: string | number,
  ) => {
    setNewAttribute({ ...newAttribute, [field]: value });
  };

  // Remove an attribute from currentAttributes by index
  const handleRemoveAttribute = (index: number) => {
    setCurrentAttributes(currentAttributes.filter((_, i) => i !== index));
  };

  //IMages Funtion

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const reorderImages = (from: number, to: number) => {
    const updated = [...images];
    const moved = updated.splice(from, 1)[0];
    updated.splice(to, 0, moved);
    setImages(updated);
  };
  const handleUploadAll = async () => {
    try {
      setLoading(true);

      const filesToUpload = images.filter((img): img is File => img !== null);

      if (filesToUpload.length === 0) {
        alert("No images to upload");
        return [];
      }

      const uploadedUrls = await sendMultipleImages(filesToUpload);

      if (!uploadedUrls || uploadedUrls.length === 0) {
        return [];
      }

      // Convert URLs to ImageApiRequest format
      const payload: ImageApiRequest = {
        imgList: uploadedUrls.map((url) => ({ url })),
      };

      // Call API to add images to product
      await addImages(payload);

      return uploadedUrls;
    } finally {
      setLoading(false);
    }
  };

  const sendMultipleImages = async (files: File[]) => {
    if (!files || files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    const watermark = "© My Watermark";
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Convert to WebP with watermark (your function)
      const webPBlob = await convertImageToWebPWithWatermark(file, watermark);

      if (!webPBlob) {
        alert(`Conversion failed for image ${file.name}`);
        continue;
      }

      // Upload to API
      const res = await SendDataToApi(webPBlob as unknown as File);
      if (res && res.data && res.data.secure_url) {
        uploadedUrls.push(res.data.secure_url);
      } else {
        alert(`Upload failed for image ${file.name}`);
      }
    }

    // Do something with URLs (e.g. set state or return)
    return uploadedUrls;
  };
  const addImages = async (payload: ImageApiRequest) => {
    // AddImageProduct
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await AddImageProduct(payload, String(token), ID);
      if (response.status === 200 || response.status === 201) {
        getProduct(1);
        getImage(ID);
        setID("");
        setIsOpenImage(false);
        setShowList(true);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (error) {
      setLoading(false);
      console.log("Error in basicInfo:", error);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageChange(e.dataTransfer.files);
  };

  const handleClick = () => fileInputRef.current?.click();

  //End Image funtion

  const getCountry = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setListofCountry(data.countryList);
    } else if (response.status === 401) return router.push("/sellerogin");
  };

  const getCategorySub = async (ID: string) => {
    const formData = {
      categoryID: ID,
      storeID: storeID,
    };
    const token = localStorage.getItem("token");
    const response = await GetCategorySub(String(token), formData);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategorySubApiResponse;
      setCatgeorySubList(data.categoryList);
      //setCategorySubID(data.categoryList[0].subCategoryID);
      //getFurtherSub(data.categoryList[0].subCategoryID);
      return data.categoryList;
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const getFurtherSub = async (ID: string) => {
    const token = localStorage.getItem("token");
    const formData = {
      subCategoryID: ID,
      storeID: storeID,
    };
    const response = await GetFurtherSub(String(token), formData);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as FurtherSubApiResponse;

      // Make sure every item has units array
      const safeList = data.categoryList.map((item) => ({
        ...item,
        units: Array.isArray(item.unit) ? item.unit : [],
      }));
      setFurtherSubList(safeList);
      //setFurtherCategorySubID(data.categoryList[0].subCategoryDetailID);
      //getUnits(data.categoryList[0].subCategoryDetailID);
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const getUnits = async (ID: string) => {
    const token = localStorage.getItem("token");
    const formData = {
      subCategoryDetailID: ID,
      storeID: storeID,
    };
    const response = await GetUnitByID(String(token), formData);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as UnitIDApiResponse;
      setUnitList(data.unitsList);
      setUnitID(data.unitsList[0].unitID);
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const getImage = async (item: string) => {
    const token = localStorage.getItem("token");
    const response = await GetProductImages(item, String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ImageGetApiResponse;
      console.log(data);
      setImageList(data.imagesList);
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const deleteImages = async (ID: string) => {
    const token = localStorage.getItem("token");
    const response = await DeleteImageApi(ID, String(token));
    if (response.status === 200 || response.status === 201) {
      setID("");
      getProduct(1);
      setIsOpenImage(false);
      setImageList((item) => item.filter((emp) => emp.urlID !== ID));
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  return (
    <>
      <div
        ref={printRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          padding: 20,
          backgroundColor: "white",
        }}
      >
        {barcode && (
          <Barcode
            value={barcode}
            renderer="svg" // 🔥 MOST IMPORTANT
            width={2} // bar thickness
            height={80} // barcode height
            margin={10}
            displayValue={true}
            fontSize={14}
            lineColor="#000"
            background="#fff"
          />
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Confirmation
            </h2>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete this record? <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(ID)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                disabled={deleting} // disable while loading
              >
                {deleting && <Spinner />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpenVarinet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Confirmation
            </h2>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete this record? <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsOpenVarinet(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteVarinet(ID)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                disabled={deleting} // disable while loading
              >
                {Uploading ? <Spinner /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpenImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Confirmation
            </h2>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete this record? <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsOpenImage(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteImages(ID)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                disabled={deleting} // disable while loading
              >
                {deleting && <Spinner />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {productAbout && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end items-end mb-4">
                <button
                  className="cursor-pointer"
                  onClick={() => setProductAbout(false)}
                >
                  {" "}
                  <X className="hover:text-red-600" />
                </button>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  {/* Step 1 */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm 
                                    ${
                                      currentStep === 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-black"
                                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`mx-2 text-sm font-medium ${
                      currentStep === 1 ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    Product Info
                  </span>

                  {/* Line to Step 2 */}
                  <div
                    className={`h-1 w-10 ${
                      currentStep === 2 ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>

                  {/* Step 2 */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm 
                                    ${
                                      currentStep === 2
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-black"
                                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`mx-2 text-sm font-medium ${
                      currentStep === 2 ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    Category Info
                  </span>
                </div>
              </div>
              {currentStep === 1 && (
                <fieldset className="p-4 border border-gray-300 rounded-lg">
                  <legend className="text-lg font-semibold text-gray-800 px-2">
                    Product Info
                  </legend>

                  {/* Row 1 */}
                  <div className="p-3 rounded-xl max-w-md">
                    <h2 className="text-md text-gray-800 mb-4">
                      Featured Product
                    </h2>

                    <div className="flex flex-wrap  gap-4 ">
                      {/* Option 1 */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="FeaturedProduct"
                          value="No"
                          checked={FeaturedProduct === "No"}
                          onChange={(e) => setFeaturedProduct("No")}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 text-sm font-medium">
                          No
                        </span>
                      </label>

                      {/* Option 2 */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="FeaturedProduct"
                          value="Yes"
                          checked={FeaturedProduct === "Yes"}
                          onChange={(e) => setFeaturedProduct("Yes")}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 text-sm font-medium">
                          Yes
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Discount
                      </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Enter discount (%)"
                        className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Total Quantity
                      </label>
                      <input
                        type="text"
                        value={TotalQuantity}
                        onChange={(e) => setTotalQuantity(e.target.value)}
                        placeholder="Enter Qunatity"
                        className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Threshold
                      </label>
                      <input
                        type="number"
                        value={Threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        placeholder="Enter Threshold"
                        className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {(selectedOption2 === "Both" ||
                    selectedOption2 === "OnlineStore") && (
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Width
                        </label>
                        <input
                          type="text"
                          value={Width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="Enter Width"
                          className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Height
                        </label>
                        <input
                          type="number"
                          value={Height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="Enter Height "
                          className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Depth
                        </label>
                        <input
                          value={Depth}
                          onChange={(e) => setDepth(e.target.value)}
                          type="number"
                          placeholder="Enter Depth "
                          className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Weight
                        </label>
                        <input
                          value={Weight}
                          onChange={(e) => setWeight(e.target.value)}
                          type="number"
                          placeholder="Enter Weight "
                          className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                  {(selectedOption2 === "Both" ||
                    selectedOption2 === "OnlineStore") && (
                    <div className="p-3 rounded-xl max-w-md">
                      <h2 className="text-md text-gray-800 mb-4">
                        Show in Country
                      </h2>

                      <div className="flex flex-wrap flex-col gap-4 ">
                        {/* Option 1 */}
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="ShowinCountry"
                            value="ShowinAllCountry"
                            checked={selectedOption === "ShowinAllCountry"}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            onClick={() => {
                              setCountryHideList([]);
                              setCountryShowList([]);
                            }}
                          />

                          <span className="ml-2 text-gray-700 text-sm font-medium">
                            Show in All Country
                          </span>
                        </label>

                        {/* Option 2 */}
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="ShowinCountry"
                            value="ShowinSomeCountry"
                            checked={selectedOption === "ShowinSomeCountry"}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            onClick={() => setCountryHideList([])}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 text-sm font-medium">
                            Show in Some Country
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="ShowinCountry"
                            value="HideinSomeCountry"
                            checked={selectedOption === "HideinSomeCountry"}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            onClick={() => setCountryShowList([])}
                          />
                          <span className="ml-2 text-gray-700 text-sm font-medium">
                            Hide in Some Country
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                  {selectedOption === "ShowinSomeCountry" && (
                    <>
                      <div className=" gap-4 mb-4">
                        <label className=" mt-2 block text-gray-700 font-medium mb-1">
                          Display Country
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={DisplayCountryID}
                            onChange={(e) => {
                              const id = e.target.value;
                              setDisplayCountryID(id);
                              const data = listofCountry.find(
                                (item) => item.countryID === id,
                              );
                              if (data) {
                                setDisplayCountryName(data.countryName);
                              }
                            }}
                            className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Country</option>
                            {listofCountry.map((item) => (
                              <option
                                key={item.countryID}
                                value={item.countryID}
                              >
                                {item.countryName}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => hanldeAddShowCountry()}
                            className="text-white rounded-md px-2 bg-yellow-500 hover:bg-yellow-600"
                          >
                            <Plus />
                          </button>
                        </div>
                      </div>
                      {countryShowLis.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex mx-2  mt-1 items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-300 shadow-sm"
                        >
                          <span>{item.countryName}</span>
                          <X
                            size={16}
                            className="cursor-pointer hover:text-red-500 transition"
                            onClick={() => handleRemoveShowCountry(index)}
                          />
                        </div>
                      ))}
                    </>
                  )}
                  {selectedOption === "HideinSomeCountry" && (
                    <>
                      <div className=" gap-4 mb-4">
                        <label className=" mt-2 block text-gray-700 font-medium mb-1">
                          Hide Country
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={HideCountryID}
                            onChange={(e) => {
                              const id = e.target.value;
                              setHideCountryID(id);
                              const data = listofCountry.find(
                                (item) => item.countryID === id,
                              );
                              if (data) {
                                setHideCountryName(data.countryName);
                              }
                            }}
                            className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Country</option>
                            {listofCountry.map((item) => (
                              <option
                                key={item.countryID}
                                value={item.countryID}
                              >
                                {item.countryName}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={hanldeAddHideCountry}
                            className="text-white rounded-md px-2 bg-yellow-500 hover:bg-yellow-600"
                          >
                            <Plus />
                          </button>
                        </div>
                      </div>
                      {countryHideList.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex mx-2  mt-1 items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-300 shadow-sm"
                        >
                          <span>{item.countryName}</span>
                          <X
                            size={16}
                            className="cursor-pointer hover:text-red-500 transition"
                            onClick={() => handleRemoveHideCountry(index)}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {/* Description */}
                  <div>
                    <label className=" mt-2 block text-gray-700 font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter product description"
                      className="w-full p-3 border border-gray-200 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </fieldset>
              )}
              {currentStep === 2 && (
                <fieldset className="p-4 border border-gray-300 rounded-lg">
                  <legend className="text-lg font-semibold text-gray-800 px-2">
                    Category Info
                  </legend>

                  {/* Main Category */}
                  <div className=" md:flex-row gap-4 mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Main Category
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      value={CategoryMainID}
                      onChange={(e) => {
                        setCategoryMainID(e.target.value);
                        getCategorySub(e.target.value);
                      }}
                    >
                      {catgeorySubList.length !== 0 ? (
                        <>
                          {catgeoryMainList.map((item) => (
                            <option
                              key={item.categoryID}
                              value={item.categoryID}
                              className="p-2"
                            >
                              {item.categoryName}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option> No Record Found</option>
                      )}
                    </select>
                  </div>

                  {CategoryMainID && (
                    <div className=" md:flex-row gap-4 mb-4">
                      <label className="block text-gray-700 font-medium mb-1">
                        Sub Category
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        value={CategorySubID}
                        onChange={(e) => {
                          {
                            setCategorySubID(e.target.value);
                            getFurtherSub(e.target.value);
                          }
                        }}
                      >
                        {catgeorySubList.length !== 0 ? (
                          <>
                            {catgeorySubList.map((item) => (
                              <option
                                key={item.subCategoryID}
                                value={item.subCategoryID}
                                className="p-2"
                              >
                                {item.subCategoryName}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option> No Record Found</option>
                        )}
                      </select>
                    </div>
                  )}
                  {CategorySubID && (
                    <div className=" md:flex-row gap-4 mb-4">
                      <label className="block text-gray-700 font-medium mb-1">
                        Further Sub Category
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        value={FurtherCategorySubID}
                        onChange={(e) => {
                          setFurtherCategorySubID(e.target.value);
                          getUnits(e.target.value);
                        }}
                      >
                        {FurtherSubList.length !== 0 ? (
                          <>
                            {FurtherSubList.map((item) => (
                              <option
                                key={item.subCategoryDetailID}
                                value={item.subCategoryDetailID}
                                className="p-2"
                              >
                                {item.name}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option> No Record Found</option>
                        )}
                      </select>
                    </div>
                  )}
                  {FurtherCategorySubID && (
                    <div className=" md:flex-row gap-4 mb-4">
                      <label className="block text-gray-700 font-medium mb-1">
                        Unit
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        value={UnitID}
                        onChange={(e) => {
                          setUnitID(e.target.value);
                        }}
                      >
                        {UnitList?.length > 0 ? (
                          UnitList.map((item) => (
                            <option key={item.unitID} value={item.unitID}>
                              {item.unitName}
                            </option>
                          ))
                        ) : (
                          <option>No Record Found</option>
                        )}
                      </select>
                    </div>
                  )}

                  {/* Image Upload */}
                </fieldset>
              )}
              {currentStep === 1 && (
                <div className="mt-6 flex justify-between gap-4">
                  <button
                    // onClick={() => setProductAbout(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-400 transition"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    Next
                    {/* {loading ? "Saving..." : "Save"} */}
                  </button>
                </div>
              )}
              {currentStep === 2 && (
                <div className="mt-6 flex justify-between gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => basicInfo()}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {varinetAbout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end items-end mb-4">
              <button
                className="cursor-pointer"
                onClick={() => {
                  setVarinetAbout(false);
                }}
              >
                {" "}
                <X className="hover:text-red-600" />
              </button>
            </div>
            <div className="sticky top-0 z-10 p-4 bg-white shadow-md flex justify-between items-center">
              <button
                onClick={() => setShowList(false)}
                className={`py-2 px-5 rounded-2xl font-semibold ${
                  !showList
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                } transition`}
              >
                Show List
              </button>
              <button
                onClick={() => setShowList(true)}
                className={`py-2 px-5 rounded-2xl font-semibold ${
                  showList
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                } transition`}
              >
                Add New
              </button>
            </div>
            {showList ? (
              <>
                <div className="p-3 rounded-xl max-w-md">
                  <h2 className="text-md text-gray-800 mb-4">Purchase</h2>

                  <div className="flex flex-wrap  gap-4 ">
                    {/* Option 1 */}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="supplier"
                        value="Yes"
                        checked={selectedOption3 === "Yes"}
                        onChange={(e) => setSelectedOption3("Yes")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        Yes
                      </span>
                    </label>

                    {/* Option 2 */}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="supplier"
                        value="No"
                        checked={selectedOption3 === "No"}
                        onChange={(e) => setSelectedOption3("No")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        No
                      </span>
                    </label>
                  </div>
                </div>
                {selectedOption3 === "Yes" && (
                  <div className=" md:flex-row gap-4 mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Supplier
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 shadow-sm rounded-md focus:ring-2 focus:ring-blue-500"
                      value={supplierID}
                      onChange={(e) => {
                        {
                          setSupplierID(e.target.value);
                        }
                      }}
                    >
                      {SupplierList.length !== 0 ? (
                        <>
                          {SupplierList.map((item) => (
                            <option
                              key={item.supplierID}
                              value={item.supplierID}
                              className="p-2"
                            >
                              {item.supplierName}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option> No Record Found</option>
                      )}
                    </select>
                  </div>
                )}

                <fieldset className="p-4 border border-gray-300 rounded-lg">
                  <legend className="text-lg font-semibold mb-4">
                    Variant Info
                  </legend>

                  {/* Input for Main Variant Name and button */}
                  <div className="flex gap-2 items-center mb-4">
                    <input
                      type="text"
                      placeholder="Enter Variant Name (Main)"
                      value={mainVarientName}
                      onChange={(e) => setMainVarientName(e.target.value)}
                      className="flex-grow p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddMainVariant}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save Variant
                    </button>
                  </div>

                  {/* Table of current attributes (sub-variants) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-300 rounded">
                      <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                          <th className="px-4 py-2">Attribute Name</th>
                          <th className="px-4 py-2">Qty</th>
                          <th className="px-4 py-2">CP</th>
                          <th className="px-4 py-2">SP</th>
                          <th className="px-4 py-2">Barcode</th>
                          <th className="px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Existing attributes */}
                        {currentAttributes.map((attr, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-300 odd:bg-white even:bg-gray-50"
                          >
                            <td className="px-4 py-2">{attr.varientValue}</td>
                            <td className="px-4 py-2">{attr.qty}</td>
                            <td className="px-4 py-2">{attr.costPrice}</td>
                            <td className="px-4 py-2">{attr.salePrice}</td>
                            <td className="px-4 py-2">{attr.barcode}</td>
                            <td className="px-4 py-2">
                              <button
                                className="px-2 py-1 bg-red-600 text-white rounded"
                                onClick={() => handleRemoveAttribute(i)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Row for adding new attribute */}
                        <tr>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              placeholder="Attribute Name"
                              value={newAttribute.varientValue}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "varientValue",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min={0}
                              value={newAttribute.qty}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "qty",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={newAttribute.costPrice}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "costPrice",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={newAttribute.salePrice}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "salePrice",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={newAttribute.barcode}
                              onChange={(e) =>
                                handleNewAttributeChange(
                                  "barcode",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={handleAddAttribute}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
                              title="Add Attribute"
                            >
                              <Plus className="mr-1" />
                              Add
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </fieldset>
                {selectedOption3 === "Yes" && (
                  <fieldset className="p-4 border border-gray-300 rounded-lg">
                    <legend className="text-lg font-semibold text-gray-800 px-2">
                      Billing Information
                    </legend>
                    <div className="md:col-span-2">
                      {" "}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        {" "}
                        {/* Total Bill */}{" "}
                        <div>
                          {" "}
                          <label className="block text-gray-700 font-medium mb-2">
                            {" "}
                            Total Bill{" "}
                          </label>{" "}
                          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                            {" "}
                            <Coins
                              className="text-gray-400 mr-2"
                              size={18}
                            />{" "}
                            <input
                              type="number"
                              value={costPrice}
                              name="totalBill"
                              placeholder="Enter Total Bill"
                              className="w-full bg-transparent outline-none text-gray-900"
                            />{" "}
                          </div>{" "}
                        </div>{" "}
                        {/* Adjustment */}{" "}
                        <div>
                          {" "}
                          <label className="block text-gray-700 font-medium mb-2">
                            {" "}
                            Adjustment{" "}
                          </label>{" "}
                          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                            {" "}
                            <Coins
                              className="text-gray-400 mr-2"
                              size={18}
                            />{" "}
                            <input
                              value={adjustment}
                              type="number"
                              onChange={(e) => setAdjustment(e.target.value)}
                              name="adjustment"
                              placeholder="Enter Adjustment"
                              className="w-full bg-transparent outline-none text-gray-900"
                            />{" "}
                          </div>{" "}
                        </div>{" "}
                        {/* Amount Paid */}{" "}
                        <div>
                          {" "}
                          <label className="block text-gray-700 font-medium mb-2">
                            {" "}
                            Amount Paid{" "}
                          </label>{" "}
                          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                            {" "}
                            <Coins
                              className="text-gray-400 mr-2"
                              size={18}
                            />{" "}
                            <input
                              value={AmountPaid}
                              type="number"
                              onChange={(e) => setAmountPaid(e.target.value)}
                              name="amountPaid"
                              placeholder="Enter Amount Paid"
                              className="w-full bg-transparent outline-none text-gray-900"
                            />{" "}
                          </div>{" "}
                        </div>{" "}
                        {/* Remaining Balance */}{" "}
                        <div>
                          {" "}
                          <label className="block text-gray-700 font-medium mb-2">
                            {" "}
                            Remaining Balance{" "}
                          </label>{" "}
                          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                            {" "}
                            <CoinsIcon
                              className="text-gray-400 mr-2"
                              size={18}
                            />{" "}
                            <input
                              type="number"
                              value={
                                Number(costPrice) -
                                  Number(AmountPaid) -
                                  Number(adjustment) || 0
                              }
                              name="remainingBalance"
                              placeholder="Auto Calculated"
                              readOnly
                              className="w-full bg-transparent outline-none text-gray-900"
                            />{" "}
                          </div>{" "}
                        </div>{" "}
                        {/* Total Payable */}{" "}
                        <div className=" ">
                          {" "}
                          <label className="block text-gray-700 font-medium mb-2">
                            {" "}
                            Total Payable{" "}
                          </label>{" "}
                          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                            {" "}
                            <Coins
                              className="text-gray-400 mr-2"
                              size={18}
                            />{" "}
                            <input
                              type="number"
                              name="totalPayable"
                              placeholder="Enter Total Payable"
                              className="w-full bg-transparent outline-none text-gray-900"
                            />{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>
                  </fieldset>
                )}
                <button
                  onClick={addVarient}
                  className="px-2 py-2 w-full bg-green-600 hover:bg-green-700 rounded-md text-white mt-4"
                >
                  {Uploading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                {GettingVarinet ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <>
                    {getVarinetList.length > 0 ? (
                      <div className="space-y-4 mt-3">
                        {getVarinetList.map((item, itemIndex) => (
                          <div
                            key={item.varientID}
                            className="border border-gray-200 rounded-lg shadow-sm bg-white"
                          >
                            {/* Header */}
                            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-lg">
                              <h3 className="text-base font-semibold text-gray-800 capitalize">
                                {item.variantName}
                              </h3>
                            </div>

                            {/* Editable Attributes Table */}
                            <div className="px-4 py-3 overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="text-xs font-semibold text-gray-600 border-b">
                                    <th className="text-left px-4 py-2">
                                      Value
                                    </th>
                                    <th className="text-left px-4 py-2">
                                      BarCode
                                    </th>
                                    <th className="text-left px-4 py-2">Qty</th>
                                    <th className="text-left px-4 py-2">
                                      Cost Price
                                    </th>
                                    <th className="text-left px-4 py-2">
                                      Sale Price
                                    </th>
                                    <th className="text-left px-4 py-2">
                                      Action
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {item.varientAttributes.map(
                                    (attr, attrIndex) => (
                                      <tr
                                        key={attr.attributeID}
                                        className="text-sm border-b last:border-b-0"
                                      >
                                        {/* Variant Value */}
                                        <td className="px-4 py-2">
                                          <input
                                            type="text"
                                            value={attr.varientValue}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                itemIndex,
                                                attrIndex,
                                                "varientValue",
                                                e.target.value,
                                              )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                          />
                                        </td>

                                        {/* Barcode */}
                                        <td className="px-4 py-2">
                                          <input
                                            type="text"
                                            value={attr.barcode}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                itemIndex,
                                                attrIndex,
                                                "barcode",
                                                e.target.value,
                                              )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                          />
                                        </td>

                                        {/* Qty */}
                                        <td className="px-4 py-2">
                                          <input
                                            type="number"
                                            value={attr.qty}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                itemIndex,
                                                attrIndex,
                                                "qty",
                                                Number(e.target.value),
                                              )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                          />
                                        </td>

                                        {/* Cost Price */}
                                        <td className="px-4 py-2">
                                          <input
                                            type="number"
                                            value={attr.costPrice}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                itemIndex,
                                                attrIndex,
                                                "costPrice",
                                                Number(e.target.value),
                                              )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                          />
                                        </td>

                                        {/* Sale Price */}
                                        <td className="px-4 py-2">
                                          <input
                                            type="number"
                                            value={attr.salePrice}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                itemIndex,
                                                attrIndex,
                                                "salePrice",
                                                Number(e.target.value),
                                              )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                          />
                                        </td>

                                        {/* Action Button */}
                                        <td className=" flex gap-2 px-4 py-2">
                                          <button
                                            onClick={() =>
                                              ModifyVarient(
                                                attr.attributeID,
                                                attr.barcode,
                                                attr.costPrice,
                                                attr.salePrice,
                                                attr.qty,
                                                attr.varientValue,
                                              )
                                            }
                                            className="px-2 py-1 bg-yellow-600 text-white rounded"
                                          >
                                            <Pencil />
                                          </button>
                                          <button
                                            className="px-2 py-1 bg-green-600 text-white rounded"
                                            onClick={() =>
                                              fetchDatafroProduct(
                                                attr.attributeID,
                                                attr.salePrice,
                                                attr.barcode,
                                              )
                                            }
                                          >
                                            {Export ? (
                                              <Spinner />
                                            ) : (
                                              <Download />
                                            )}
                                          </button>
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 mt-4">
                        No Record Found
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {imageAbout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setImageList([]); // clear only new images
                  setImages([]);
                  setImageAbout(false);
                }}
              >
                <X className="w-6 h-6 hover:text-red-600 transition" />
              </button>
            </div>

            {/* Tabs */}
            <div className="sticky top-0 z-10 p-4 bg-white shadow-md flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  setShowList(true);
                  setImages([]);
                }}
                className={`py-2 px-5 rounded-2xl font-semibold ${
                  showList
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                } transition`}
              >
                Show List
              </button>
              <button
                onClick={() => setShowList(false)}
                className={`py-2 px-5 rounded-2xl font-semibold ${
                  !showList
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                } transition`}
              >
                Add New
              </button>
            </div>

            {/* Show Existing Images */}
            {showList ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ImageList.length > 0 ? (
                  ImageList.map((img) => (
                    <div
                      key={img.urlID}
                      className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <img
                        src={img.url}
                        alt="Product"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => deleteImages(img.urlID)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        title="Delete Image"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No images found.</p>
                )}
              </div>
            ) : (
              <>
                <fieldset className="p-4 border border-gray-300 rounded-lg">
                  <legend className="text-lg font-semibold text-gray-800 px-2">
                    Product Image
                  </legend>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Product Images
                    </label>
                    <div
                      onClick={handleClick}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      className={`w-full p-4 border-2 flex  justify-center gap-5 border-dashed rounded-md cursor-pointer text-center ${
                        isDragOver
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex flex-wrap gap-4">
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
                            className={`relative w-20 h-20 rounded-md 
      ${hoverIndex === i ? "ring-2 ring-blue-500 scale-105" : ""}
      transition-all duration-150`}
                          >
                            {/* ❌ Delete Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(i);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white 
                 rounded-full w-5 h-5 flex items-center 
                 justify-center text-xs hover:bg-red-600 
                 shadow-md"
                            >
                              ✕
                            </button>

                            <img
                              src={URL.createObjectURL(img)}
                              className="w-full h-full object-cover rounded-md"
                              alt={`Product ${i + 1}`}
                            />

                            <span className="absolute -bottom-5 text-xs text-gray-600">
                              {i === 0 ? "Header Image" : `Image ${i + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </fieldset>
                <button
                  onClick={() => {
                    handleUploadAll();
                  }}
                  className="px-2 py-2 w-full bg-green-600 hover:bg-green-700 rounded-md text-white mt-4"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* ---------- DROPDOWN ---------- */}
        <div className="p-3 rounded-xl max-w-md">
          <h2 className="text-md text-gray-800 mb-2">Store Sale</h2>
          <select
            value={selectedOption2}
            onChange={(e) => setSelectedOption2(e.target.value)}
            className="w-full rounded-lg border p-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select store sale type
            </option>
            <option value="OnlineStore">Online Store</option>
            <option value="OfflineStore">Offline Store</option>
          </select>
        </div>

        {/* ---------- OFFLINE STORE CARDS ---------- */}
        {/* ---------- OFFLINE STORE ---------- */}
        {(() => {
          const offlineProducts = filteredProducts.filter(
            (p) => p.storeSale === "OfflineStore",
          );

          if (offlineProducts.length > 0) {
            return (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Offline Store
                </h2>
                <div className="space-y-4">
                  {offlineProducts.map((product) => {
                    const selectedVarIndex =
                      selectedVariantIndex[product.productID] ?? 0;
                    const selectedVariantValue =
                      product.variants?.[0]?.variantValues?.[selectedVarIndex];
                    const originalAmount = Number(
                      selectedVariantValue?.salePrice || 0,
                    );

                    return (
                      <div
                        key={product.productID}
                        className="p-4 border w-full border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                      >
                        {/* Product Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {product.productName}
                          </h3>
                          <p className="text-gray-600">
                            Discount: {product.discount}%
                          </p>
                          <p className="text-gray-600">
                            Price: {originalAmount}-/
                          </p>
                          {product.variants?.[0] && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium">
                                {product.variants[0].variantName}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {product.variants[0].variantValues.map(
                                  (attr, idx) => (
                                    <button
                                      key={attr.attributeID}
                                      onClick={() =>
                                        setSelectedVariantIndex((prev) => ({
                                          ...prev,
                                          [product.productID]: idx,
                                        }))
                                      }
                                      disabled={attr.qty <= 0}
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        selectedVarIndex === idx
                                          ? "bg-blue-600 text-white"
                                          : attr.qty > 0
                                            ? "bg-gray-900 text-white hover:bg-gray-700"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                      }`}
                                    >
                                      {attr.varientValue}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Edit/Delete Buttons */}
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              fetchData(product.productID);
                              setProductAbout(true);
                              getCountry();
                              getProduct(1);
                            }}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(product.productID);
                            }}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            <p className="text-gray-500 text-center mt-4">No records found</p>;
          }
        })()}

        {/* ---------- ONLINE STORE / BOTH CARDS ---------- */}

        {(() => {
          const onlineProducts = filteredProducts.filter(
            (p) => p.storeSale !== "OfflineStore",
          );

          if (onlineProducts.length === 0) {
            return (
              <p className="text-gray-500 text-center mt-4">No records found</p>
            );
          }

          return (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Online Store / Both
              </h2>

              <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                <table className="min-w-full text-sm">
                  {/* HEADER */}
                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr className="text-slate-700">
                      <th className="p-4 text-left font-semibold border-b border-slate-200">
                        Images
                      </th>
                      <th className="p-4 text-left font-semibold border-b border-slate-200">
                        Product Info
                      </th>
                      <th className="p-4 text-left font-semibold border-b border-slate-200">
                        Variants
                      </th>
                      <th className="p-4 text-center font-semibold border-b border-slate-200">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {onlineProducts.map((product, rowIdx) => {
                      /* PRICE CALCULATION */
                      let originalAmount = 0;
                      product.variants?.forEach((variant, variantIdx) => {
                        const key = `${product.productID}-${variantIdx}`;
                        const selectedIdx = selectedVariantIndex[key] ?? 0;
                        const selectedValue =
                          variant.variantValues?.[selectedIdx];
                        originalAmount += Number(selectedValue?.salePrice ?? 0);
                      });

                      const discount = Number(product.discount ?? 0);
                      const finalPrice =
                        originalAmount - (originalAmount * discount) / 100;

                      const mainImageIndex =
                        selectedProductImageIndex[product.productID] ?? 0;

                      const mainImageUrl =
                        product.images?.[mainImageIndex]?.url ||
                        "/placeholder-image.jpg";

                      return (
                        <tr
                          key={product.productID}
                          className={`border-b border-slate-200 transition ${
                            rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"
                          } hover:bg-blue-50`}
                        >
                          {/* IMAGES */}
                          <td className="p-2 w-64">
                            <div className="relative flex justify-center">
                              <div className=" p-2 rounded-xl shadow-sm">
                                <img
                                  src={mainImageUrl}
                                  alt={product.productName}
                                  className="w-15 h-15 object-cover"
                                />
                              </div>

                              <button
                                title="Edit Images"
                                onClick={() => {
                                  setImageAbout(true);
                                  getImage(product.productID);
                                  setID(product.productID);
                                }}
                                className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full shadow"
                              >
                                <Camera size={12} />
                              </button>
                            </div>
                          </td>

                          {/* PRODUCT INFO */}
                          <td className="p-4 max-w-lg">
                            <div className="flex justify-between gap-4">
                              <div>
                                <h3 className="text-base font-semibold text-slate-800">
                                  {product.productName}
                                </h3>

                                <div
                                  className="mt-1 text-slate-600 w-80 prose prose-sm max-w-none h-5 overflow-y-hidden"
                                  dangerouslySetInnerHTML={{
                                    __html: product.description,
                                  }}
                                />

                                <div className="mt-3 flex items-center gap-2">
                                  {discount > 0 && (
                                    <span className="text-slate-400 line-through">
                                      {originalAmount.toFixed(2)}-/
                                    </span>
                                  )}
                                  <span className="text-emerald-600 font-bold text-base">
                                    {finalPrice.toFixed(2)}-/
                                  </span>
                                </div>
                              </div>
                              {loading ? (
                                <button
                                  title="Edit Product"
                                  // onClick={() => {
                                  //   setProductAbout(true);
                                  //   fetchData(product.productID);
                                  //   getCountry();
                                  //   getCategroyMain();
                                  // }}
                                  disabled
                                  className="h-fit bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl shadow"
                                >
                                  <Pencil size={14} />
                                </button>
                              ) : (
                                <button
                                  title="Edit Product"
                                  onClick={() => {
                                    setProductAbout(true);
                                    fetchData(product.productID);
                                    getCountry();
                                    getCategroyMain();
                                  }}
                                  className="h-fit bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl shadow"
                                >
                                  <Pencil size={14} />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* VARIANTS */}
                          <td className="p-4">
                            <div className="space-y-3">
                              {product.variants?.map((variant, variantIdx) => {
                                const key = `${product.productID}-${variantIdx}`;
                                const selectedIdx =
                                  selectedVariantIndex[key] ?? 0;

                                return (
                                  <div
                                    key={variant.varientID}
                                    className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm"
                                  >
                                    <p className="font-semibold text-slate-700 mb-2">
                                      {variant.variantName}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                      {variant.variantValues.map((v, idx) => (
                                        <button
                                          key={v.attributeID}
                                          onClick={() =>
                                            setSelectedVariantIndex((prev) => ({
                                              ...prev,
                                              [key]: idx,
                                            }))
                                          }
                                          disabled={v.qty <= 0}
                                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                            selectedIdx === idx
                                              ? "bg-blue-600 text-white"
                                              : v.qty > 0
                                                ? "bg-slate-800 text-white hover:bg-slate-900"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                          }`}
                                        >
                                          {v.varientValue}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          {/* ACTIONS */}
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                title="Variant"
                                onClick={() => {
                                  setVarinetAbout(true);
                                  fetchData(product.productID);
                                  setID(product.productID);
                                  setShowList(false);
                                  getVarient(product.productID);
                                }}
                                className="action-btn px-2 py-2 rounded-md  text-white bg-yellow-500 hover:bg-yellow-600"
                              >
                                {GettingVarinet ? (
                                  <Spinner />
                                ) : (
                                  <Pencil size={20} />
                                )}
                              </button>

                              <button
                                title="Delete"
                                onClick={() => {
                                  setID(product.productID);
                                  setIsOpen(true);
                                }}
                                className="action-btn px-2 py-2 rounded-md  text-white bg-red-500 hover:bg-red-600"
                              >
                                <Trash size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="w-full flex justify-center items-center gap-4 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => getProduct(currentPage - 1)}
                  className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => getProduct(currentPage + 1)}
                  className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}

import axios from "axios";
export async function SendDataToApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (response.status == 200 || response.status == 201) {
      return {
        message: "Image uploaded successfully",
        data: response.data,
      };
    } else {
      return {
        error: "Failed to upload image",
        status: response.status,
      };
    }
  } catch (error: any) {
    return {
      message: error.message || "Unknown error",
      status: 500,
    };
  }
}

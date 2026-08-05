import axios from "axios";

export async function SendDataToApi(file: File) {
  const formData = new FormData();

  const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "daz8ajhg3";
  const NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "my_preset";
  formData.append("file", file);
  formData.append(
    "upload_preset",
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
  );

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200 || response.status === 201) {
      return {
        message: "Image uploaded successfully",
        data: response.data.secure_url,
      };
    }

    return {
      error: "Failed to upload image",
      data: String(response.status),
    };
  } catch (error: any) {
    return {
      message: error.message || "Unknown error",
      data: String(500),
    };
  }
}

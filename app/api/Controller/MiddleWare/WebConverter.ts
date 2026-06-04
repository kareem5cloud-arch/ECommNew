export default async function convertImageToWebPWithWatermark(
  file: File,
  watermarkText: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Set watermark style
        ctx.font = "48px Arial";
        ctx.fillStyle = "rgba(128, 128, 128, 0.5)"; // white with 50% opacity
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";

        // Position watermark at bottom-right with 10px padding
        ctx.fillText(watermarkText, canvas.width - 10, canvas.height - 10);

        // Export canvas to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Conversion to WebP failed"));
            }
          },
          "image/webp",
          0.8,
        );
      };

      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };

    reader.onerror = () => {
      reject(new Error("File reading failed"));
    };

    reader.readAsDataURL(file);
  });
}

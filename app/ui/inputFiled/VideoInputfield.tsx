import { useState } from "react";

interface GenericFileInputProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
  maxDurationSeconds?: number;
  minDurationSeconds?: number;
  onFileChange: (file: File | null) => void;
}

export default function FileVideoInputGeneric({
  label,
  required = false,
  disabled = false,
  accept = "image/*",
  maxSizeMB,
  maxDurationSeconds,
  minDurationSeconds,
  onFileChange,
}: GenericFileInputProps) {
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("");
      onFileChange(null);
      return;
    }

    // Check file size
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB} MB.`);
      onFileChange(null);
      e.target.value = "";
      return;
    }

    // Only check duration for videos
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");

      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);

        const duration = video.duration;

        if (maxDurationSeconds !== undefined && duration > maxDurationSeconds) {
          setError(
            `Video duration must be less than ${maxDurationSeconds} seconds.`,
          );
          onFileChange(null);
          e.target.value = "";
          return;
        }

        if (minDurationSeconds !== undefined && duration < minDurationSeconds) {
          setError(
            `Video duration must be at least ${minDurationSeconds} seconds.`,
          );
          onFileChange(null);
          e.target.value = "";
          return;
        }

        setError("");
        onFileChange(file);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        setError("Unable to read this video.");
        onFileChange(null);
        e.target.value = "";
      };

      video.src = URL.createObjectURL(file);

      return;
    }

    // Valid non-video file
    setError("");
    onFileChange(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2 mt-2">
        {label}
        {required && <span className="text-red-600 text-lg ml-1">*</span>}
      </label>

      <input
        type="file"
        disabled={disabled}
        accept={accept}
        onChange={handleFileChange}
        className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

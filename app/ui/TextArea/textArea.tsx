interface GenericInputProps {
  label?: string;
  placeholder?: string;
  onClick?: () => void;
  setSateChange: (data: string) => void;
  SateChange: string;
  required: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export default function TextAreaFieldGeneric({
  label,
  placeholder,
  setSateChange,
  onClick,
  required = false,
  SateChange,
  disabled = false,
  readonly,
}: GenericInputProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 mt-2">
          {label}
          {required && <span className="text-red-600 text-lg ml-1">*</span>}
        </label>
        <textarea
          onClick={onClick}
          value={SateChange}
          onChange={(e) => setSateChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
          placeholder={placeholder}
          readOnly={readonly}
        />
      </div>
    </>
  );
}

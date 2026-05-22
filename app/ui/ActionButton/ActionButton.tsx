interface PrimaryButtonProps {
  text: string;
  update?: boolean;
  loading?: boolean;
  loadingtext: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ActionButton({
  text,
  update,
  loading,
  loadingtext,
  onClick,
  disabled,
}: PrimaryButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg`}
      >
        {update ? loadingtext : text}
      </button>
    </>
  );
}

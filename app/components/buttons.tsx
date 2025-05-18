import { ButtonHTMLAttributes } from "react";

export function AddButton({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="bg-green-500 hover:bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded transition-colors disabled:opacity-50"
      {...props}
    >
      +
    </button>
  );
}

export function RemoveButton({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded transition-colors disabled:opacity-50"
      {...props}
    >
      -
    </button>
  );
}

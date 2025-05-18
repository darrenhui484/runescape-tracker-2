import { Skill } from "~/types/character";

export const PrayerTokenDisplay: React.FC<{
  status: "unavailable" | "inactive" | "active";
  onClick: () => void;
  slotNumber: number;
}> = ({ status, onClick, slotNumber }) => {
  let content = "🔒"; // Unavailable
  let bgColor = "bg-gray-300";
  let textColor = "text-gray-500";
  let title = `Prayer Token Slot ${slotNumber} - Unavailable`;

  if (status === "inactive") {
    content = "❖"; // Inactive symbol (e.g., white star from PDF)
    bgColor = "bg-gray-200 hover:bg-gray-300";
    textColor = "text-gray-700";
    title = `Activate Prayer Token ${slotNumber}`;
  } else if (status === "active") {
    content = "🌟"; // Active symbol (e.g., yellow star from PDF)
    bgColor = "bg-yellow-400 hover:bg-yellow-500";
    textColor = "text-yellow-900";
    title = `Deactivate Prayer Token ${slotNumber}`;
  }

  const isDisabled = status === "unavailable";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold 
                 border-2 border-yellow-700/50 transition-colors
                 ${bgColor} ${textColor} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      aria-label={title}
    >
      {content}
    </button>
  );
};

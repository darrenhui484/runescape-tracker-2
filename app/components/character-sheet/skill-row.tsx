import {
  CharacterSheetData,
  getLevel,
  getSkillImageUrl,
} from "~/types/character";
import { AddButton, RemoveButton } from "../buttons";
import Counter from "../counter";

const MAX_XP_SLOTS = 2;

export const InteractiveSkillRow: React.FC<{
  name: keyof CharacterSheetData["skills"];
  totalXp: number;
  onXpChange: (newXp: number) => void;
}> = ({ name, totalXp, onXpChange }) => {
  const handleXpInputChange = (delta: number) => {
    let newTotalXp = totalXp + delta;
    if (newTotalXp < 0) {
      return;
    }

    onXpChange(newTotalXp);
  };

  return (
    <div className="flex justify-between items-center py-1.5 border-b border-yellow-700/30 last:border-b-0">
      {/* Skill Name and Icon */}
      <div className="flex items-center gap-2 w-2/5">
        <img
          src={getSkillImageUrl(name)}
          alt={`${name} icon`}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain" // Adjust size as needed
        />
        <span className="font-semibold capitalize text-sm sm:text-base">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 w-3/5 justify-end">
        {/* XP Dots */}
        <div className="flex gap-1">
          {Array.from({ length: MAX_XP_SLOTS }).map((_, index) => (
            <div
              key={index}
              className={`text-lg sm:text-xl p-0 bg-transparent border-none cursor-pointer transition-colors
                ${
                  index < totalXp % 3
                    ? "text-yellow-900"
                    : "text-yellow-700/40 hover:text-yellow-900/70"
                }`}
            >
              ●
            </div>
          ))}
        </div>

        <Counter
          onIncrement={() => handleXpInputChange(1)}
          onDecrement={() => handleXpInputChange(-1)}
        >
          {getLevel(totalXp)}
        </Counter>
      </div>
    </div>
  );
};

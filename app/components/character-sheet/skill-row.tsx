import { Skill } from "~/types/character";
const MAX_XP_SLOTS = 2;

export const InteractiveSkillRow: React.FC<{
  name: string;
  skill: Skill;
  onXpChange: (newXp: number) => void;
  onLevelChange: (newLevel: number) => void;
}> = ({ name, skill, onXpChange, onLevelChange }) => {
  // This internal function handles the logic of updating XP and potentially leveling up,
  // then calls the appropriate props to update the parent component's state.
  const processSkillUpdate = (newXpCandidate: number, currentLevel: number) => {
    let finalXp = newXpCandidate;
    let finalLevel = currentLevel;

    // Check for level up condition
    if (finalXp > MAX_XP_SLOTS) {
      // e.g., if MAX_XP_SLOTS is 2, and newXpCandidate becomes 3
      finalLevel += 1; // Increment level
      finalXp = 0; // Reset XP for the new level
    }

    // Call parent handlers only if values actually changed to prevent unnecessary re-renders
    if (finalXp !== skill.xp) {
      onXpChange(finalXp);
    }
    if (finalLevel !== skill.level) {
      onLevelChange(finalLevel);
    }
  };

  const handleXpDotClick = (xpDotIndex: number) => {
    // xpDotIndex is 0-based (0 for the first dot, 1 for the second dot).
    // Clicking a dot means the player wants to have *that many* XP points filled.
    // So, if they click the first dot (index 0), target XP is 1.
    // If they click the second dot (index 1), target XP is 2.
    let targetXpFilled = xpDotIndex + 1;

    // If the user clicks the dot that is already the highest filled XP dot,
    // we interpret this as "unchecking" that dot.
    // So, XP becomes the count of dots *before* this one.
    if (skill.xp === targetXpFilled) {
      targetXpFilled = xpDotIndex; // Or targetXpFilled - 1, effectively unfilling the last dot
    }

    // Ensure XP is within valid bounds before processing (0 to MAX_XP_SLOTS, or MAX_XP_SLOTS + 1 to trigger level up)
    targetXpFilled = Math.max(0, Math.min(targetXpFilled, MAX_XP_SLOTS + 1));

    processSkillUpdate(targetXpFilled, skill.level);
  };

  const handleLevelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newLevel = parseInt(e.target.value, 10);
    if (isNaN(newLevel) || newLevel < 1) {
      newLevel = 1; // Default to 1 if input is invalid or less than 1
    }
    // When level is manually changed, game rules might dictate XP reset.
    // For this implementation, we'll keep current XP unless it would cause an immediate level up.
    // If you want XP to reset on manual level change, set skill.xp to 0 here.
    processSkillUpdate(skill.xp, newLevel);
  };

  return (
    <div className="flex justify-between items-center py-1.5 border-b border-yellow-700/30 last:border-b-0">
      {/* Skill Name and Icon */}
      <div className="flex items-center gap-2 w-2/5">
        <img
          src={skill.iconUrl}
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
            <button
              type="button"
              key={index}
              onClick={() => handleXpDotClick(index)}
              className={`text-lg sm:text-xl p-0 bg-transparent border-none cursor-pointer transition-colors
                ${
                  index < skill.xp
                    ? "text-yellow-900"
                    : "text-yellow-700/40 hover:text-yellow-900/70"
                }`}
              aria-label={`Set ${name} XP dot ${index + 1}`}
              title={`Set ${name} XP to ${index + 1}`}
            >
              ●
            </button>
          ))}
        </div>
        {/* Level Input */}
        <div className="flex items-center">
          <span className="text-xs sm:text-sm mr-1">Lvl:</span>
          <input
            type="number"
            value={skill.level}
            onChange={handleLevelInputChange}
            className="text-sm sm:text-base font-bold w-10 sm:w-12 text-center bg-white border border-yellow-700/30 rounded px-0.5 py-0 focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
            min="1"
            max="99" // Typical RuneScape max level
            aria-label={`${name} level`}
          />
        </div>
      </div>
    </div>
  );
};

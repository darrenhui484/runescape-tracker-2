// app/components/CharacterSheetDisplay.tsx (Now Editable)
import React, { useState, useEffect } from "react";
import type { CharacterSheetData, Skill } from "~/types/character";
import { SKILL_ORDER, RESOURCE_ORDER } from "~/types/character";

interface EditableCharacterSheetProps {
  initialData: CharacterSheetData;
  onSave: (data: CharacterSheetData) => void; // Callback to trigger saving
}

const MAX_XP_SLOTS = 2;

const InteractiveSkillRow: React.FC<{
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
      <span className="font-semibold capitalize text-sm sm:text-base w-2/5">
        {name}
      </span>
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

// New component for a single Prayer Token
const PrayerTokenDisplay: React.FC<{
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

export default function EditableCharacterSheet({
  initialData,
  onSave,
}: EditableCharacterSheetProps) {
  const [sheet, setSheet] = useState<CharacterSheetData>(initialData);

  useEffect(() => {
    // Sync with external changes & update prayer token availability based on prayer level
    const newSheet = { ...initialData };
    let updated = false;

    // Logic to unlock prayer token slots based on Prayer level
    if (
      newSheet.skills.prayer.level >= 1 &&
      newSheet.prayerTokens.slot1 === "unavailable"
    ) {
      newSheet.prayerTokens.slot1 = "inactive";
      updated = true;
    }
    if (
      newSheet.skills.prayer.level >= 4 &&
      newSheet.prayerTokens.slot2 === "unavailable"
    ) {
      newSheet.prayerTokens.slot2 = "inactive";
      updated = true;
    }
    if (
      newSheet.skills.prayer.level >= 7 &&
      newSheet.prayerTokens.slot3 === "unavailable"
    ) {
      newSheet.prayerTokens.slot3 = "inactive";
      updated = true;
    }
    // If prayer level drops below unlock thresholds, tokens should revert to unavailable
    // (This logic might be more complex if tokens, once unlocked, remain available but inactive)
    // For simplicity, let's assume they become unavailable if level drops.
    if (
      newSheet.skills.prayer.level < 7 &&
      newSheet.prayerTokens.slot3 !== "unavailable"
    ) {
      newSheet.prayerTokens.slot3 = "unavailable";
      updated = true;
    }
    if (
      newSheet.skills.prayer.level < 4 &&
      newSheet.prayerTokens.slot2 !== "unavailable"
    ) {
      newSheet.prayerTokens.slot2 = "unavailable";
      updated = true;
    }
    // Slot 1 typically remains available if prayer level >= 1

    setSheet(updated ? { ...newSheet } : initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? parseInt(value, 10) || 0
        : value;
    setSheet((prev) => ({ ...prev, [name]: val }));
  };

  const handleNestedChange = <
    K extends keyof CharacterSheetData,
    NK extends keyof CharacterSheetData[K]
  >(
    parentKey: K,
    childKey: NK,
    value: CharacterSheetData[K][NK]
  ) => {
    setSheet((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [childKey]: value,
      },
    }));
  };

  const handleSkillXpChange = (
    skillName: keyof CharacterSheetData["skills"],
    newXp: number
  ) => {
    const currentSkill = sheet.skills[skillName];
    handleNestedChange("skills", skillName, { ...currentSkill, xp: newXp });
  };
  const handleSkillLevelChange = (
    skillName: keyof CharacterSheetData["skills"],
    newLevel: number
  ) => {
    setSheet((prev) => {
      const newSkills = {
        ...prev.skills,
        [skillName]: { ...prev.skills[skillName], level: newLevel, xp: 0 }, // Reset XP on manual level change for simplicity
      };

      // If prayer level changed, re-evaluate token availability
      let newPrayerTokens = { ...prev.prayerTokens };
      if (skillName === "prayer") {
        if (newLevel >= 1 && newPrayerTokens.slot1 === "unavailable")
          newPrayerTokens.slot1 = "inactive";
        if (newLevel >= 4 && newPrayerTokens.slot2 === "unavailable")
          newPrayerTokens.slot2 = "inactive";
        if (newLevel >= 7 && newPrayerTokens.slot3 === "unavailable")
          newPrayerTokens.slot3 = "inactive";

        if (newLevel < 7 && newPrayerTokens.slot3 !== "unavailable")
          newPrayerTokens.slot3 = "unavailable";
        if (newLevel < 4 && newPrayerTokens.slot2 !== "unavailable")
          newPrayerTokens.slot2 = "unavailable";
        if (newLevel < 1 && newPrayerTokens.slot1 !== "unavailable")
          newPrayerTokens.slot1 = "unavailable"; // Though level usually min 1
      }

      return { ...prev, skills: newSkills, prayerTokens: newPrayerTokens };
    });
  };

  const handlePrayerTokenClick = (
    slot: keyof CharacterSheetData["prayerTokens"]
  ) => {
    setSheet((prev) => {
      const currentStatus = prev.prayerTokens[slot];
      if (currentStatus === "unavailable") return prev; // Should not happen if button is disabled

      const newStatus = currentStatus === "inactive" ? "active" : "inactive";
      return {
        ...prev,
        prayerTokens: {
          ...prev.prayerTokens,
          [slot]: newStatus,
        },
      };
    });
  };

  const handleWoundClick = (increment: boolean) => {
    const maxWounds = sheet.sideQuestsCompletedCount >= 5 ? 4 : 3;
    let newWounds = sheet.wounds + (increment ? 1 : -1);
    newWounds = Math.max(0, Math.min(newWounds, maxWounds));
    setSheet((prev) => ({ ...prev, wounds: newWounds }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sheet); // Call the onSave prop passed from the parent route
  };

  // Styling constants (same as before)
  const sectionClasses =
    "border border-yellow-700/60 p-3 bg-yellow-50/50 rounded-md shadow-sm";
  const headerClasses =
    "text-lg font-semibold mt-0 mb-3 text-yellow-900/90 border-b-2 border-yellow-700/40 pb-1.5 uppercase text-center";
  const inputBaseClasses =
    "p-1 border border-yellow-700/40 rounded bg-white text-yellow-950 focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600 disabled:bg-gray-200";
  const numberInputClasses = `${inputBaseClasses} w-16 sm:w-20 text-center`;
  const textInputClasses = `${inputBaseClasses} w-full`;

  const maxWounds = sheet.sideQuestsCompletedCount >= 5 ? 4 : 3;

  // The JSX will be almost identical to CharacterSheetForm,
  // as it now needs to be interactive.
  // It will be wrapped in a <form onSubmit={handleSubmit}>
  return (
    <form
      onSubmit={handleSubmit}
      className="font-[custom-serif] bg-yellow-100 border-[5px] border-yellow-800 p-3 sm:p-5 max-w-5xl mx-auto my-6 shadow-2xl text-yellow-950/90 text-sm sm:text-base"
    >
      {/* Header with Editable Character Name */}
      <div className="text-center mb-4 pb-2 border-b-[3px] border-yellow-800">
        <input
          type="text"
          name="characterName" // Used by handleChange
          value={sheet.characterName}
          onChange={handleChange}
          className="text-2xl sm:text-3xl font-bold bg-transparent text-center w-full border-none focus:ring-0 placeholder-yellow-700/50"
          placeholder="Enter Character Name"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Col 1: Wounds, Cape Objectives, Resources, GP (Now with inputs/buttons) */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          {/* Wounds (Interactive) */}
          <div className={sectionClasses}>
            <h3 className={headerClasses}>WOUNDS</h3>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => handleWoundClick(false)}
                className="px-2 py-0.5 text-lg border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                disabled={sheet.wounds <= 0}
              >
                -
              </button>
              {Array.from({ length: maxWounds }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl sm:text-3xl ${
                    i < sheet.wounds ? "text-red-600" : "text-gray-300"
                  }`}
                >
                  {i < sheet.wounds ? "💔" : "❤️"}
                </span>
              ))}
              <button
                type="button"
                onClick={() => handleWoundClick(true)}
                className="px-2 py-0.5 text-lg border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                disabled={sheet.wounds >= maxWounds}
              >
                +
              </button>
            </div>
          </div>
          {/* Cape Objectives (Interactive - Checkboxes) */}
          <div className={sectionClasses}>
            <h3 className={headerClasses}>CAPE OBJECTIVES</h3>
            <ul className="list-none p-0 m-0 space-y-1 text-xs sm:text-sm">
              {Object.entries(sheet.capeObjectives).map(([key, value]) => (
                <li key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`cape-${key}`}
                    // name will be tricky with handleNestedChange, so directly call it
                    checked={value}
                    onChange={(e) =>
                      handleNestedChange(
                        "capeObjectives",
                        key as keyof CharacterSheetData["capeObjectives"],
                        e.target.checked
                      )
                    }
                    className="mr-2 h-4 w-4 accent-yellow-700"
                  />
                  <label
                    htmlFor={`cape-${key}`}
                    className="capitalize-first cursor-pointer"
                  >
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()
                      .replace("level8", "Level 8")
                      .replace("level3", "Level 3")}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {/* Resources (Interactive - Inputs) */}
          <div className={sectionClasses}>
            <h3 className={headerClasses}>RESOURCES</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:text-sm">
              {RESOURCE_ORDER.map((key) => (
                <div key={key} className="flex justify-between items-center">
                  <label htmlFor={`res-${key}`} className="capitalize">
                    {key}:
                  </label>
                  <input
                    type="number"
                    id={`res-${key}`}
                    value={sheet.resources[key]}
                    onChange={(e) =>
                      handleNestedChange(
                        "resources",
                        key,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className={`${numberInputClasses} w-12`}
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* GP (Interactive - Input) */}
          <div className={sectionClasses}>
            <h3 className={headerClasses}>GP</h3>
            <input
              type="number"
              name="gp" // Used by handleChange
              value={sheet.gp}
              onChange={handleChange}
              className={`${textInputClasses} text-center font-bold text-lg`}
              min="0"
            />
          </div>
        </div>

        {/* Col 2: Death Tally, Side Quests (Interactive - Inputs) */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <div className={sectionClasses}>
            <h3 className={headerClasses}>DEATH TALLY</h3>
            <input
              type="number"
              name="deathTally" // Used by handleChange
              value={sheet.deathTally}
              onChange={handleChange}
              className={`${textInputClasses} text-center font-bold text-lg`}
              min="0"
            />
          </div>
          <div className={sectionClasses}>
            <h3 className={headerClasses}>SIDE QUESTS</h3>
            <input
              type="number"
              name="sideQuestsCompletedCount" // Used by handleChange
              value={sheet.sideQuestsCompletedCount}
              onChange={handleChange}
              className={`${textInputClasses} text-center font-bold text-lg`}
              min="0"
            />
            <h4 className="text-sm font-semibold mt-3 mb-1 text-yellow-900/80 text-center">
              Perks:
            </h4>
            <ul className="list-none p-0 m-0 text-xs sm:text-sm space-y-0.5 text-center">
              <li
                className={
                  sheet.sideQuestsCompletedCount >= 5
                    ? "text-green-700 font-semibold"
                    : "text-gray-500"
                }
              >
                +1 Wound (5 SQs)
              </li>
              <li
                className={
                  sheet.sideQuestsCompletedCount >= 8
                    ? "text-green-700 font-semibold"
                    : "text-gray-500"
                }
              >
                Free Teleport (8 SQs)
              </li>
              <li
                className={
                  sheet.sideQuestsCompletedCount >= 12
                    ? "text-green-700 font-semibold"
                    : "text-gray-500"
                }
              >
                +1 Boss Equip (12 SQs)
              </li>
            </ul>
          </div>
        </div>

        {/* Col 3: Skills (Includes Prayer Skill now) */}
        <div className={`${sectionClasses} lg:col-span-3`}>
          <h3 className={headerClasses}>SKILLS</h3>
          <div className="space-y-0.5">
            {SKILL_ORDER.map(
              (
                key // SKILL_ORDER now includes 'prayer'
              ) => (
                <InteractiveSkillRow
                  key={key}
                  name={key}
                  skill={sheet.skills[key]}
                  onXpChange={(newXp) => handleSkillXpChange(key, newXp)} // Make sure these handlers exist
                  onLevelChange={(newLevel) =>
                    handleSkillLevelChange(key, newLevel)
                  } // And are correctly updating the sheet state
                />
              )
            )}
          </div>
        </div>

        {/* Col 4: PRAYER TOKENS and Static Info */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          {/* PRAYER TOKEN SECTION */}
          <div className={sectionClasses}>
            <h3 className={headerClasses}>PRAYER TOKENS</h3>
            <p className="text-xs text-center mb-2 text-yellow-800/80">
              (Unlock at Prayer Lvl 1, 4, 7)
            </p>
            <div className="flex justify-around items-center py-2">
              <PrayerTokenDisplay
                slotNumber={1}
                status={sheet.prayerTokens.slot1}
                onClick={() => handlePrayerTokenClick("slot1")}
              />
              <PrayerTokenDisplay
                slotNumber={2}
                status={sheet.prayerTokens.slot2}
                onClick={() => handlePrayerTokenClick("slot2")}
              />
              <PrayerTokenDisplay
                slotNumber={3}
                status={sheet.prayerTokens.slot3}
                onClick={() => handlePrayerTokenClick("slot3")}
              />
            </div>
            {/* The image also shows a slot for the Prayer RS token on the 1-10 track.
                This is visually represented by the Prayer skill's level in the InteractiveSkillRow.
                The "active prayer token" circle (5 in the PDF) is conceptual and covered by the PrayerTokenDisplay.
            */}
          </div>

          {/* ... (Static Info sections: Turn Reference, Exploring Province/Capital, Logo - as before) ... */}
        </div>

        {/* Col 5: Static Info (Remains display-only) */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <div
            className={`${sectionClasses} bg-yellow-100/80 text-xs sm:text-sm`}
          >
            <h3 className={`${headerClasses} text-sm sm:text-base`}>
              TURN REFERENCE
            </h3>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Move/Teleport</li>
              <li>Action/Explore</li>
              <li>Bonus Action</li>
            </ol>
            <p className="italic mt-1.5 pt-1 border-t border-yellow-700/30 text-[0.7rem] sm:text-xs">
              Capital End Turn: +1 Escalation
            </p>
            <p className="italic mt-1 pt-1 border-t border-yellow-700/30 text-[0.7rem] sm:text-xs">
              Capital Bank: Freely move items.
            </p>
          </div>
          <div
            className={`${sectionClasses} bg-yellow-100/80 text-xs sm:text-sm`}
          >
            <h3 className={`${headerClasses} text-sm sm:text-base`}>
              EXPLORING PROVINCE
            </h3>
            <p>Draw exploration card. Forage or Skill per icon.</p>
          </div>
          <div
            className={`${sectionClasses} bg-yellow-100/80 text-xs sm:text-sm`}
          >
            <h3 className={`${headerClasses} text-sm sm:text-base`}>
              EXPLORING CAPITAL
            </h3>
            <p>Gain XP by discarding GP per skill. May forage.</p>
          </div>
          <div className="mt-auto text-center font-bold p-2 text-yellow-900/70 text-sm sm:text-base">
            RUNESCAPE KINGDOMS
          </div>
        </div>
      </div>

      {/* Save Button (Now part of this component's form) */}
      <div className="mt-5 sm:mt-6 text-center">
        <button
          type="submit" // This button now submits the form of this component
          className="px-6 py-2.5 bg-yellow-700 text-white font-bold rounded-lg hover:bg-yellow-800 transition-colors shadow-md text-sm sm:text-base"
        >
          Save Character
        </button>
      </div>
    </form>
  );
}

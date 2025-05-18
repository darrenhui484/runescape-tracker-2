import { CharacterSheetData, getRunecraftingTier } from "~/types/character";
import { ClanBankData } from "~/types/character";
import { useState, useEffect } from "react";
import { CharacterHeader } from "./header";
import { WoundsSection } from "./wounds";
import { CapeObjectivesSection } from "./cape-objectives";
import { CharacterResourcesSection } from "./resources";
import { GPSection } from "./gp";
import { DeathTallySection } from "./deaths";
import { ClanBankSection } from "./clan-bank";
import { SideQuestsSection } from "./side-quests";
import { StaticInfoSection } from "./static-info";
import { SkillsSection } from "./skills";
import { SpecialTokensSection } from "./special-skills";
import { numberInputClasses, textInputClasses } from "./style";

interface EditableCharacterSheetProps {
  initialData: CharacterSheetData;
  initialClanBankData: ClanBankData;
  onSave: (data: CharacterSheetData) => void; // Renamed from onSaveSheet for clarity
  onSaveClanBank: (data: ClanBankData) => void;
}

export default function EditableCharacterSheet({
  initialData,
  initialClanBankData,
  onSave,
  onSaveClanBank,
}: EditableCharacterSheetProps) {
  const [sheet, setSheet] = useState<CharacterSheetData>(initialData);
  const [clanBank, setClanBank] = useState<ClanBankData>(initialClanBankData);

  // ... (useEffect hooks for syncing sheet and clanBank with props - crucial)
  useEffect(() => {
    /* ... logic for updating sheet and its special tokens based on initialData.skills levels ... */ setSheet(
      initialData
    );
  }, [initialData]);
  useEffect(() => {
    setClanBank(initialClanBankData);
  }, [initialClanBankData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sheet);
  };

  const maxWounds = sheet.sideQuestsCompletedCount >= 5 ? 4 : 3;

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

      let newAvailableSummoningTokens = prev.availableSummoningTokens;
      if (skillName === "summoning") {
        let maxTokensForNewLevel = 0;
        if (newLevel >= 7) maxTokensForNewLevel = 3;
        else if (newLevel >= 4) maxTokensForNewLevel = 2;
        else if (newLevel >= 1) maxTokensForNewLevel = 1;

        // Grant tokens if level up allows for more.
        // Player doesn't lose tokens if level drops in this simple model,
        // but they can't gain more than their current level allows.
        // This assumes `availableSummoningTokens` is manually decremented when a token is "used".
        if (newAvailableSummoningTokens < maxTokensForNewLevel) {
          newAvailableSummoningTokens = maxTokensForNewLevel;
        }
        // Cap it if it somehow exceeds max (e.g. dev error or data corruption)
        newAvailableSummoningTokens = Math.min(
          newAvailableSummoningTokens,
          maxTokensForNewLevel
        );
      }

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

      return {
        ...prev,
        skills: newSkills,
        availableSummoningTokens: newAvailableSummoningTokens,
        prayerTokens: newPrayerTokens,
      };
    });
  };

  const handleWoundClick = (increment: boolean) => {
    const maxWounds = sheet.sideQuestsCompletedCount >= 5 ? 4 : 3;
    let newWounds = sheet.wounds + (increment ? 1 : -1);
    newWounds = Math.max(0, Math.min(newWounds, maxWounds));
    setSheet((prev) => ({ ...prev, wounds: newWounds }));
  };

  // --- Handlers for Clan Bank ---
  const handleClanBankResourceChange = (
    resourceName: keyof ClanBankData["resources"],
    change: number // Can be positive (deposit) or negative (withdraw)
  ) => {
    setClanBank((prevBank) => {
      const currentAmount = prevBank.resources[resourceName] || 0;
      const newAmount = Math.max(0, currentAmount + change); // Ensure not negative
      const updatedResources = {
        ...prevBank.resources,
        [resourceName]: newAmount,
      };
      const updatedBank = { ...prevBank, resources: updatedResources };
      // Immediately call onSaveClanBank to persist the change
      onSaveClanBank(updatedBank);
      return updatedBank; // Update local state
    });
  };

  // --- Handlers for moving items between Character and Clan Bank ---
  const moveResourceToBank = (
    resourceName: keyof CharacterSheetData["resources"]
  ) => {
    const characterAmount = sheet.resources[resourceName] || 0;
    if (characterAmount > 0) {
      // Decrease character resource
      setSheet((prevSheet) => ({
        ...prevSheet,
        resources: {
          ...prevSheet.resources,
          [resourceName]: characterAmount - 1,
        },
      }));
      // Increase clan bank resource
      handleClanBankResourceChange(resourceName, 1);
      // Note: onSaveSheet will be called when the main "Save Character" is clicked.
      // onSaveClanBank is called immediately by handleClanBankResourceChange.
    }
  };

  const moveResourceFromBank = (
    resourceName: keyof CharacterSheetData["resources"]
  ) => {
    const bankAmount = clanBank.resources[resourceName] || 0;
    if (bankAmount > 0) {
      // Decrease clan bank resource
      handleClanBankResourceChange(resourceName, -1);
      // Increase character resource
      setSheet((prevSheet) => {
        const currentCharacterAmount = prevSheet.resources[resourceName] || 0;
        return {
          ...prevSheet,
          resources: {
            ...prevSheet.resources,
            [resourceName]: currentCharacterAmount + 1,
          },
        };
      });
    }
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

  // Handler to manually adjust available summoning tokens (e.g., when one is "used" or "returned")
  const adjustAvailableSummoningTokens = (change: number) => {
    setSheet((prev) => {
      const currentSummoningLevel = prev.skills.summoning?.level || 1;
      let maxTokensForLevel = 0;
      if (currentSummoningLevel >= 7) maxTokensForLevel = 3;
      else if (currentSummoningLevel >= 4) maxTokensForLevel = 2;
      else if (currentSummoningLevel >= 1) maxTokensForLevel = 1;

      let newCount = prev.availableSummoningTokens + change;
      newCount = Math.max(0, Math.min(newCount, maxTokensForLevel)); // Cannot go below 0 or above max for current level
      return { ...prev, availableSummoningTokens: newCount };
    });
  };

  // Handler to manually adjust available Rune tokens
  const adjustAvailableRuneTokens = (change: number) => {
    setSheet((prev) => {
      // Max runes from a single bonus action depends on tier, but total available isn't strictly capped by tier here.
      // However, a player likely wouldn't hoard too many if they can only place based on tier.
      // Let's cap it at a reasonable number for UI sanity, e.g., 10, or remove cap.
      const currentTier = getRunecraftingTier(
        prev.skills.runecrafting?.level || 1
      );
      // The number of tokens they can *place* on a spell is tier (1, 2, or 3).
      // The number they can *gain* from the bonus action is tier.
      // The number they can *hold* is not explicitly limited in rules shown, but let's add a soft cap.
      const MAX_HOLDABLE_RUNES = 9; // Arbitrary soft cap for UI
      let newCount = prev.availableRuneTokens + change;
      newCount = Math.max(0, Math.min(newCount, MAX_HOLDABLE_RUNES));
      return { ...prev, availableRuneTokens: newCount };
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="font-[custom-serif] bg-yellow-100 border-[5px] border-yellow-800 p-3 sm:p-5 max-w-5xl mx-auto my-6 shadow-2xl text-yellow-950/90 text-sm sm:text-base"
    >
      <CharacterHeader
        characterName={sheet.characterName}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Col 1 */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <WoundsSection
            wounds={sheet.wounds}
            maxWounds={maxWounds}
            onWoundClick={handleWoundClick}
          />
          <CapeObjectivesSection
            capeObjectives={sheet.capeObjectives}
            onCapeObjectiveChange={(key, value) =>
              handleNestedChange("capeObjectives", key, value)
            }
          />
          <CharacterResourcesSection
            resources={sheet.resources}
            onResourceChange={(key, value) =>
              handleNestedChange("resources", key, value)
            }
            onMoveToBank={moveResourceToBank}
            numberInputClasses={numberInputClasses}
          />
          <GPSection
            gp={sheet.gp}
            onChange={handleChange}
            textInputClasses={textInputClasses}
          />
        </div>

        {/* Col 2 */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <DeathTallySection
            deathTally={sheet.deathTally}
            onChange={handleChange}
            textInputClasses={textInputClasses}
          />
          <SideQuestsSection
            sideQuestsCompletedCount={sheet.sideQuestsCompletedCount}
            onChange={handleChange}
            textInputClasses={textInputClasses}
          />
          <ClanBankSection
            clanBankResources={clanBank.resources}
            onResourceChange={handleClanBankResourceChange}
            onMoveFromBank={moveResourceFromBank}
            numberInputClasses={numberInputClasses}
          />
        </div>

        {/* Col 3 */}
        <SkillsSection
          skills={sheet.skills}
          onSkillXpChange={handleSkillXpChange}
          onSkillLevelChange={handleSkillLevelChange}
        />

        {/* Col 4 */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <SpecialTokensSection
            sheet={sheet}
            onPrayerTokenClick={handlePrayerTokenClick}
            onAdjustSummoningTokens={adjustAvailableSummoningTokens}
            onAdjustRuneTokens={adjustAvailableRuneTokens}
          />
          <StaticInfoSection />
        </div>
      </div>

      <div className="mt-5 sm:mt-6 text-center">
        <button
          type="submit"
          className="px-6 py-2.5 bg-yellow-700 text-white font-bold rounded-lg hover:bg-yellow-800 transition-colors shadow-md text-sm sm:text-base"
        >
          Save Character
        </button>
      </div>
    </form>
  );
}

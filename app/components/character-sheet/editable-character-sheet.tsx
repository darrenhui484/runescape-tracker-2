import {
  CharacterSheetData,
  getLevel,
  getRunecraftingTier,
} from "~/types/character";
import { ClanBankData } from "~/types/character";
import { useState, useEffect } from "react";
import { CharacterHeader } from "./header";
import { WoundsSection } from "./wounds";
import { CapeObjectivesSection } from "./cape-objectives";
import { CharacterResourcesSection } from "./resources";
import { GPSection } from "./gp";
import { Deaths } from "./deaths";
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
  const [sheet, _setSheet] = useState<CharacterSheetData>(initialData);
  const setSheet: React.Dispatch<React.SetStateAction<CharacterSheetData>> = (
    sheetOrFunction:
      | CharacterSheetData
      | ((prevSheet: CharacterSheetData) => CharacterSheetData)
  ) => {
    _setSheet(sheetOrFunction);

    if (typeof sheetOrFunction === "function") {
      const updatedSheet = sheetOrFunction(sheet);
      onSave(updatedSheet);
    } else {
      onSave(sheetOrFunction);
    }
  };
  const [clanBank, setClanBank] = useState<ClanBankData>(initialClanBankData);

  const maxWounds = sheet.sideQuestsCompletedCount >= 5 ? 4 : 3;

  function handleCharacterNameChange(name: string) {
    setSheet((prev) => ({ ...prev, characterName: name }));
  }

  const handleIntChange = (newValue: number, key: keyof CharacterSheetData) => {
    if (newValue < 0) return;
    setSheet((prev) => ({ ...prev, [key]: newValue }));
  };

  function handleGpChange(newValue: number) {
    if (newValue < 0) return;
    const have15Coins = sheet.capeObjectives.have15Coins || newValue >= 15;
    setSheet((prev) => ({
      ...prev,
      gp: newValue,
      capeObjectives: { ...prev.capeObjectives, have15Coins: have15Coins },
    }));
  }

  function handleSideQuestChange(newValue: number) {
    if (newValue < 0) return;
    const complete4SideQuests = newValue >= 4;
    setSheet((prev) => ({
      ...prev,
      sideQuestsCompletedCount: newValue,
      capeObjectives: {
        ...prev.capeObjectives,
        complete4SideQuests: complete4SideQuests,
      },
    }));
  }

  function handleResourceChange(
    key: keyof CharacterSheetData["resources"],
    newValue: number
  ) {
    if (newValue < 0) return;

    setSheet((prev) => {
      const newState = {
        ...prev,
        resources: { ...prev.resources, [key]: newValue },
      };

      let oneOfEachResource = newState.capeObjectives.oneOfEachResource;
      if (!oneOfEachResource) {
        // Check if all resources are present only if the cape is not already obtained
        oneOfEachResource = true;
        for (const resource of Object.keys(newState.resources)) {
          if (resource === "lobster" || resource === "ration") {
            continue;
          }
          if (
            newState.resources[
              resource as keyof CharacterSheetData["resources"]
            ] === 0
          ) {
            oneOfEachResource = false;
            break;
          }
        }
      }

      return {
        ...newState,
        capeObjectives: {
          ...prev.capeObjectives,
          oneOfEachResource: oneOfEachResource,
        },
      };
    });
  }

  const handleSkillXpChange = (
    skillName: keyof CharacterSheetData["skills"],
    newXp: number
  ) => {
    setSheet((prev) => {
      let newAvailableSummoningTokens = prev.availableSummoningTokens;
      if (skillName === "summoning") {
        let newLevel = getLevel(newXp);
        let maxTokensForNewLevel = 0;
        if (newLevel >= 7) maxTokensForNewLevel = 3;
        else if (newLevel >= 4) maxTokensForNewLevel = 2;
        else if (newLevel >= 1) maxTokensForNewLevel = 1;

        if (newAvailableSummoningTokens < maxTokensForNewLevel) {
          newAvailableSummoningTokens = maxTokensForNewLevel;
        }

        newAvailableSummoningTokens = Math.min(
          newAvailableSummoningTokens,
          maxTokensForNewLevel
        );
      }

      // If prayer level changed, re-evaluate token availability
      let newPrayerTokens = { ...prev.prayerTokens };
      if (skillName === "prayer") {
        let newLevel = getLevel(newXp);
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

      const level8InAnySkill =
        prev.capeObjectives.level8InAnySkill || getLevel(newXp) >= 8;

      const newState = {
        ...prev,
        skills: {
          ...prev.skills,
          [skillName]: newXp,
        },
        availableSummoningTokens: newAvailableSummoningTokens,
        prayerTokens: newPrayerTokens,
      };

      let level3InEightSkills = prev.capeObjectives.level3InEightSkills;
      if (!level3InEightSkills) {
        // Check if 8 skills are level 3 or higher
        let skillsGreaterThan3Count = 0;
        for (const skill of Object.keys(newState.skills)) {
          const skillXp =
            newState.skills[skill as keyof CharacterSheetData["skills"]];
          if (getLevel(skillXp) >= 3) {
            skillsGreaterThan3Count++;
            if (skillsGreaterThan3Count >= 8) {
              level3InEightSkills = true;
              break;
            }
          }
        }
      }

      return {
        ...newState,
        capeObjectives: {
          ...prev.capeObjectives,
          level8InAnySkill: level8InAnySkill,
          level3InEightSkills: level3InEightSkills,
        },
      };
    });
  };

  function handleWoundClick(increment: boolean) {
    let newWounds = sheet.wounds + (increment ? 1 : -1);
    newWounds = Math.max(0, Math.min(newWounds, maxWounds));
    setSheet((prev) => ({ ...prev, wounds: newWounds }));
  }

  // --- Handlers for Clan Bank ---
  function handleClanBankResourceChange(
    resourceName: keyof ClanBankData["resources"],
    change: number // Can be positive (deposit) or negative (withdraw)
  ) {
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
  }

  // --- Handlers for moving items between Character and Clan Bank ---
  function moveResourceToBank(
    resourceName: keyof CharacterSheetData["resources"]
  ) {
    const characterAmount = sheet.resources[resourceName];
    if (characterAmount < 0) {
      throw new Error("Illegal State: Character resource count is negative");
    }
    if (characterAmount === 0) {
      return;
    }

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

  function moveResourceFromBank(
    resourceName: keyof CharacterSheetData["resources"]
  ) {
    const bankAmount = clanBank.resources[resourceName];
    if (bankAmount < 0) {
      throw new Error("Illegal State: Clan bank resource count is negative");
    }
    if (bankAmount === 0) {
      return;
    }

    // Decrease clan bank resource
    handleClanBankResourceChange(resourceName, -1);
    // Increase character resource
    setSheet((prevSheet) => {
      const currentCharacterAmount = prevSheet.resources[resourceName];
      return {
        ...prevSheet,
        resources: {
          ...prevSheet.resources,
          [resourceName]: currentCharacterAmount + 1,
        },
      };
    });
  }

  function handlePrayerTokenClick(
    slot: keyof CharacterSheetData["prayerTokens"]
  ) {
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
  }

  // Handler to manually adjust available summoning tokens (e.g., when one is "used" or "returned")
  function adjustAvailableSummoningTokens(change: number) {
    setSheet((prev) => {
      const currentSummoningLevel = getLevel(prev.skills.summoning || 0);
      let maxTokensForLevel = 0;
      if (currentSummoningLevel >= 7) maxTokensForLevel = 3;
      else if (currentSummoningLevel >= 4) maxTokensForLevel = 2;
      else if (currentSummoningLevel >= 1) maxTokensForLevel = 1;

      let newCount = prev.availableSummoningTokens + change;
      newCount = Math.max(0, Math.min(newCount, maxTokensForLevel)); // Cannot go below 0 or above max for current level
      return { ...prev, availableSummoningTokens: newCount };
    });
  }

  return (
    <form className="font-[custom-serif] bg-yellow-100 border-[5px] border-yellow-800 p-3 sm:p-5 max-w-5xl mx-auto my-6 shadow-2xl text-yellow-950/90 text-sm sm:text-base">
      <CharacterHeader
        characterName={sheet.characterName}
        onChange={handleCharacterNameChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Col 1 */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <WoundsSection
            wounds={sheet.wounds}
            maxWounds={maxWounds}
            onWoundClick={handleWoundClick}
          />
          <CapeObjectivesSection capeObjectives={sheet.capeObjectives} />
          <CharacterResourcesSection
            resources={sheet.resources}
            onResourceChange={(key, value) => handleResourceChange(key, value)}
            onMoveToBank={moveResourceToBank}
          />
          <GPSection
            gp={sheet.gp}
            onGPChange={(newGp) => handleGpChange(newGp)}
          />
        </div>

        {/* Col 2 */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <Deaths
            deaths={sheet.deaths}
            onChange={(newDeaths) => handleIntChange(newDeaths, "deaths")}
          />
          <SideQuestsSection
            sideQuestsCompletedCount={sheet.sideQuestsCompletedCount}
            onChange={(newSideQuestsCompletedCount) =>
              handleSideQuestChange(newSideQuestsCompletedCount)
            }
          />
          <ClanBankSection
            clanBankResources={clanBank.resources}
            onResourceChange={handleClanBankResourceChange}
            onMoveFromBank={moveResourceFromBank}
          />
        </div>

        {/* Col 3 */}
        <SkillsSection
          skills={sheet.skills}
          onSkillXpChange={handleSkillXpChange}
        />

        {/* Col 4 */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
          <SpecialTokensSection
            sheet={sheet}
            onPrayerTokenClick={handlePrayerTokenClick}
            onAdjustSummoningTokens={adjustAvailableSummoningTokens}
            // Max runes from a single bonus action depends on tier, but total available isn't strictly capped by tier here.
            // However, a player likely wouldn't hoard too many if they can only place based on tier.
            // The number of tokens they can *place* on a spell is tier (1, 2, or 3).
            // The number they can *gain* from the bonus action is tier.
            // The number they can *hold* is not explicitly limited in rules shown
            onAdjustRuneTokens={(change) =>
              handleIntChange(change, "availableRuneTokens")
            }
          />
          <StaticInfoSection />
        </div>
      </div>
    </form>
  );
}

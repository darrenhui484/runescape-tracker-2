import { CharacterSheetData, getRunecraftingTier } from "~/types/character";
import { SectionProps, SheetSection } from "./sheet-section";
import { PrayerTokenDisplay } from "./prayer-token-display";
import { SummoningTokenIcon } from "./summoning-token-icon";

interface SpecialTokensSectionProps {
  sheet: CharacterSheetData; // Pass the whole sheet for various derived values
  onPrayerTokenClick: (slot: keyof CharacterSheetData["prayerTokens"]) => void;
  onAdjustSummoningTokens: (change: number) => void;
  onAdjustRuneTokens: (change: number) => void;
}
export const SpecialTokensSection: React.FC<
  SpecialTokensSectionProps &
    Omit<
      SectionProps,
      "title" | "children" | "sectionClasses" | "headerClasses"
    >
> = ({
  sheet,
  onPrayerTokenClick,
  onAdjustSummoningTokens,
  onAdjustRuneTokens,
}) => {
  const currentRunecraftingTier = getRunecraftingTier(
    sheet.skills.runecrafting?.level || 1
  );

  return (
    <>
      {/* PRAYER TOKEN SECTION */}
      <SheetSection title="PRAYER TOKENS">
        <p className="text-xs text-center mb-2 text-yellow-800/80">
          (Unlock at Prayer Lvl 1, 4, 7)
        </p>
        <div className="flex justify-around items-center py-2">
          <PrayerTokenDisplay
            slotNumber={1}
            status={sheet.prayerTokens.slot1}
            onClick={() => onPrayerTokenClick("slot1")}
          />
          <PrayerTokenDisplay
            slotNumber={2}
            status={sheet.prayerTokens.slot2}
            onClick={() => onPrayerTokenClick("slot2")}
          />
          <PrayerTokenDisplay
            slotNumber={3}
            status={sheet.prayerTokens.slot3}
            onClick={() => onPrayerTokenClick("slot3")}
          />
        </div>
      </SheetSection>

      {/* SUMMONING TOKEN SECTION */}
      <SheetSection title="SUMMONING TOKENS">
        <p className="text-xs text-center mb-2 text-purple-800/80">
          (Earn 1st at Lvl 1, 2nd at Lvl 4, 3rd at Lvl 7)
        </p>
        <div className="flex justify-around items-center py-2">
          <SummoningTokenIcon
            tokenNumber={1}
            isAvailable={sheet.availableSummoningTokens >= 1}
          />
          <SummoningTokenIcon
            tokenNumber={2}
            isAvailable={sheet.availableSummoningTokens >= 2}
          />
          <SummoningTokenIcon
            tokenNumber={3}
            isAvailable={sheet.availableSummoningTokens >= 3}
          />
        </div>
        <p className="text-xs text-center mt-2 text-purple-800/80">
          Available on skill card: {sheet.availableSummoningTokens}
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => onAdjustSummoningTokens(-1)}
            className="text-xs px-2 py-0.5 border rounded bg-gray-200 hover:bg-gray-300"
            disabled={sheet.availableSummoningTokens <= 0}
          >
            Use Token
          </button>
          <button
            type="button"
            onClick={() => onAdjustSummoningTokens(1)}
            className="text-xs px-2 py-0.5 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Return/Gain
          </button>
        </div>
      </SheetSection>

      {/* RUNECRAFTING TIER & TOKENS SECTION */}
      <SheetSection title="RUNECRAFTING">
        <div className="text-center space-y-2">
          <p className="text-sm text-sky-700/90">
            Current Tier:{" "}
            <span className="font-bold text-lg">{currentRunecraftingTier}</span>
          </p>
          <p className="text-xs text-sky-700/80">
            (T1: Lvl 1-3, T2: Lvl 4-6, T3: Lvl 7+)
          </p>
          <div className="mt-2">
            <p className="text-sm font-semibold text-sky-800">
              Available Rune Tokens:
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => onAdjustRuneTokens(-1)}
                className="px-3 py-1 text-lg font-bold border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                disabled={sheet.availableRuneTokens <= 0}
              >
                -
              </button>
              <span className="text-2xl font-bold text-sky-600 w-8 text-center">
                {sheet.availableRuneTokens}
              </span>
              <button
                type="button"
                onClick={() => onAdjustRuneTokens(1)}
                className="px-3 py-1 text-lg font-bold border rounded-md bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <p className="text-xs mt-1 text-sky-700/80">
              Max gain per Bonus Action: Tier
            </p>
          </div>
        </div>
      </SheetSection>
    </>
  );
};

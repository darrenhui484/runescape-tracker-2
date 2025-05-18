import { ClanBankData, RESOURCE_ORDER } from "~/types/character";
import { SectionProps, SheetSection } from "./sheet-section";

interface ClanBankSectionProps {
  clanBankResources: ClanBankData["resources"];
  onResourceChange: (
    key: keyof ClanBankData["resources"],
    change: number
  ) => void;
  onMoveFromBank: (key: keyof ClanBankData["resources"]) => void;
  numberInputClasses: string;
}
export const ClanBankSection: React.FC<
  ClanBankSectionProps & Omit<SectionProps, "title" | "children">
> = ({
  clanBankResources,
  onResourceChange,
  onMoveFromBank,
  numberInputClasses,
  ...rest
}) => (
  <SheetSection title="🏦 CLAN BANK" {...rest}>
    <div className="grid grid-cols-1 gap-y-1.5 text-xs sm:text-sm">
      {RESOURCE_ORDER.map((key) => (
        <div
          key={`bank-res-${key}`}
          className="flex justify-between items-center"
        >
          <label htmlFor={`bank-res-${key}-val`} className="capitalize w-1/2">
            {key}:
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMoveFromBank(key)}
              title={`Take 1 ${key} from Clan Bank`}
              className="px-1 text-xs border rounded hover:bg-gray-100"
              disabled={(clanBankResources[key] || 0) <= 0}
            >
              👤←
            </button>
            <input
              type="number"
              id={`bank-res-${key}-val`}
              value={clanBankResources[key]}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                const currentVal = clanBankResources[key] || 0;
                onResourceChange(key, val - currentVal); // Pass the delta
              }}
              className={`${numberInputClasses} w-10`}
              min="0"
            />
          </div>
        </div>
      ))}
    </div>
  </SheetSection>
);

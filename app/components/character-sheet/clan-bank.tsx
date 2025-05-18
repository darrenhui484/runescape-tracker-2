import {
  ClanBankData,
  getResourceImageUrl,
  RESOURCE_ORDER,
} from "~/types/character";
import { SheetSection } from "./sheet-section";
import Counter from "../counter";

interface ClanBankSectionProps {
  clanBankResources: ClanBankData["resources"];
  onResourceChange: (
    key: keyof ClanBankData["resources"],
    change: number
  ) => void;
  onMoveFromBank: (key: keyof ClanBankData["resources"]) => void;
}
export const ClanBankSection: React.FC<ClanBankSectionProps> = ({
  clanBankResources,
  onResourceChange,
  onMoveFromBank,
}) => (
  <SheetSection title="🏦 CLAN BANK">
    <div className="grid grid-cols-1 gap-y-1.5 text-xs sm:text-sm">
      {RESOURCE_ORDER.map((key) => (
        <div
          key={`bank-res-${key}`}
          className="flex justify-between items-center"
        >
          <img
            src={getResourceImageUrl(key)}
            alt={key}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
          <label
            htmlFor={`bank-res-${key}-val`}
            className="w-1/2 font-semibold capitalize text-sm sm:text-base"
          >
            {key}
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
            <Counter
              onIncrement={() => onResourceChange(key, 1)}
              onDecrement={() => onResourceChange(key, -1)}
            >
              {clanBankResources[key]}
            </Counter>
          </div>
        </div>
      ))}
    </div>
  </SheetSection>
);

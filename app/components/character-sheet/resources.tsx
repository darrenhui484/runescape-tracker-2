import { CharacterSheetData, getResourceImageUrl, RESOURCE_ORDER } from "~/types/character";
import { SheetSection } from "./sheet-section";
import Counter from "../counter";

interface CharacterResourcesSectionProps {
  resources: CharacterSheetData["resources"];
  onResourceChange: (key: keyof CharacterSheetData["resources"], value: number) => void;
  onMoveToBank: (key: keyof CharacterSheetData["resources"]) => void;
}
export const CharacterResourcesSection: React.FC<CharacterResourcesSectionProps> = ({
  resources,
  onResourceChange,
  onMoveToBank,
}) => (
  <SheetSection title="Your Resources">
    <div className="grid grid-cols-1 gap-y-2 text-xs sm:text-sm">
      {RESOURCE_ORDER.map((key) => (
        <div key={`char-res-${key}`} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={getResourceImageUrl(key)} alt={key} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            <label htmlFor={`char-res-${key}-val`} className="w-1/2 font-semibold capitalize text-sm sm:text-base">
              {key}
            </label>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMoveToBank(key)}
              title={`Move 1 ${key} to Clan Bank`}
              className="px-1 text-xs border rounded hover:bg-gray-100"
              disabled={resources[key] <= 0}
            >
              ➔🏦
            </button>
            <Counter
              onIncrement={() => onResourceChange(key, resources[key] + 1)}
              onDecrement={() => onResourceChange(key, resources[key] - 1)}
            >
              {resources[key]}
            </Counter>
          </div>
        </div>
      ))}
    </div>
  </SheetSection>
);

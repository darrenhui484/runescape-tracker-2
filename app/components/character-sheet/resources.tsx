import { CharacterSheetData, RESOURCE_ORDER } from "~/types/character";
import { SectionProps, SheetSection } from "./sheet-section";

interface CharacterResourcesSectionProps {
  resources: CharacterSheetData["resources"];
  onResourceChange: (
    key: keyof CharacterSheetData["resources"],
    value: number
  ) => void;
  onMoveToBank: (key: keyof CharacterSheetData["resources"]) => void;
  numberInputClasses: string;
}
export const CharacterResourcesSection: React.FC<
  CharacterResourcesSectionProps & Omit<SectionProps, "title" | "children">
> = ({
  resources,
  onResourceChange,
  onMoveToBank,
  numberInputClasses,
  ...rest
}) => (
  <SheetSection title="Your Resources" {...rest}>
    <div className="grid grid-cols-1 gap-y-1.5 text-xs sm:text-sm">
      {RESOURCE_ORDER.map((key) => (
        <div
          key={`char-res-${key}`}
          className="flex justify-between items-center"
        >
          <label htmlFor={`char-res-${key}-val`} className="capitalize w-1/2">
            {key}:
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMoveToBank(key)}
              title={`Move 1 ${key} to Clan Bank`}
              className="px-1 text-xs border rounded hover:bg-gray-100"
              disabled={(resources[key] || 0) <= 0}
            >
              ➔🏦
            </button>
            <input
              type="number"
              id={`char-res-${key}-val`}
              value={resources[key]}
              onChange={(e) =>
                onResourceChange(key, parseInt(e.target.value, 10) || 0)
              }
              className={`${numberInputClasses} w-10`}
              min="0"
            />
          </div>
        </div>
      ))}
    </div>
  </SheetSection>
);

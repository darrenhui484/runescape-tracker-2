import { CharacterSheetData } from "~/types/character";
import { SectionProps, SheetSection } from "./sheet-section";

interface CapeObjectivesSectionProps {
  capeObjectives: CharacterSheetData["capeObjectives"];
  onCapeObjectiveChange: (
    key: keyof CharacterSheetData["capeObjectives"],
    value: boolean
  ) => void;
}
export const CapeObjectivesSection: React.FC<
  CapeObjectivesSectionProps & Omit<SectionProps, "title" | "children">
> = ({ capeObjectives, onCapeObjectiveChange, ...rest }) => (
  <SheetSection title="CAPE OBJECTIVES" {...rest}>
    <ul className="list-none p-0 m-0 space-y-1 text-xs sm:text-sm">
      {Object.entries(capeObjectives).map(([key, value]) => (
        <li key={key} className="flex items-center">
          <input
            type="checkbox"
            id={`cape-${key}`}
            checked={value}
            onChange={(e) =>
              onCapeObjectiveChange(
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
  </SheetSection>
);

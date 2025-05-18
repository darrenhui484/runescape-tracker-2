import { CharacterSheetData } from "~/types/character";
import { SheetSection } from "./sheet-section";

interface CapeObjectivesSectionProps {
  capeObjectives: CharacterSheetData["capeObjectives"];
}
export const CapeObjectivesSection: React.FC<CapeObjectivesSectionProps> = ({
  capeObjectives,
}) => (
  <SheetSection title="CAPE OBJECTIVES">
    <ul className="list-none p-0 m-0 space-y-1 text-xs sm:text-sm">
      {Object.entries(capeObjectives).map(([key, value]) => (
        <li key={key} className="flex items-center">
          <input
            readOnly
            type="checkbox"
            id={`cape-${key}`}
            checked={value}
            className="mr-2 h-4 w-4 accent-yellow-700"
          />
          <label htmlFor={`cape-${key}`}>{key}</label>
        </li>
      ))}
    </ul>
  </SheetSection>
);

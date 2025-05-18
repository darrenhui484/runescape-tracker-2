import { SectionProps, SheetSection } from "./sheet-section";

interface SideQuestsSectionProps {
  sideQuestsCompletedCount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textInputClasses: string;
}
export const SideQuestsSection: React.FC<
  SideQuestsSectionProps & Omit<SectionProps, "title" | "children">
> = ({ sideQuestsCompletedCount, onChange, textInputClasses, ...rest }) => (
  <SheetSection title="SIDE QUESTS" {...rest}>
    <input
      type="number"
      name="sideQuestsCompletedCount"
      value={sideQuestsCompletedCount}
      onChange={onChange}
      className={`${textInputClasses} text-center font-bold text-lg`}
      min="0"
    />
    <h4 className="text-sm font-semibold mt-3 mb-1 text-yellow-900/80 text-center">
      Perks:
    </h4>
    <ul className="list-none p-0 m-0 text-xs sm:text-sm space-y-0.5 text-center">
      <li
        className={
          sideQuestsCompletedCount >= 5
            ? "text-green-700 font-semibold"
            : "text-gray-500"
        }
      >
        +1 Wound (5 SQs)
      </li>
      <li
        className={
          sideQuestsCompletedCount >= 8
            ? "text-green-700 font-semibold"
            : "text-gray-500"
        }
      >
        Free Teleport (8 SQs)
      </li>
      <li
        className={
          sideQuestsCompletedCount >= 12
            ? "text-green-700 font-semibold"
            : "text-gray-500"
        }
      >
        +1 Boss Equip (12 SQs)
      </li>
    </ul>
  </SheetSection>
);

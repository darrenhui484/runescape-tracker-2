import Counter from "../counter";
import { SheetSection } from "./sheet-section";

interface SideQuestsSectionProps {
  sideQuestsCompletedCount: number;
  onChange: (newSideQuestsCompletedCount: number) => void;
}
export const SideQuestsSection: React.FC<SideQuestsSectionProps> = ({
  sideQuestsCompletedCount,
  onChange,
}) => (
  <SheetSection title="SIDE QUESTS">
    <Counter
      onIncrement={() => onChange(sideQuestsCompletedCount + 1)}
      onDecrement={() => onChange(sideQuestsCompletedCount - 1)}
    >
      {sideQuestsCompletedCount}
    </Counter>

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

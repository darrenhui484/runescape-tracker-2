import { AddButton, RemoveButton } from "../buttons";
import Counter from "../counter";
import { SectionProps, SheetSection } from "./sheet-section";

interface WoundsSectionProps {
  wounds: number;
  maxWounds: number;
  onWoundClick: (increment: boolean) => void;
}
export const WoundsSection: React.FC<WoundsSectionProps> = ({
  wounds,
  maxWounds,
  onWoundClick,
}) => (
  <SheetSection title="WOUNDS">
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      <Counter
        onIncrement={() => onWoundClick(true)}
        onDecrement={() => onWoundClick(false)}
      >
        {Array.from({ length: maxWounds }).map((_, i) => (
          <span
            key={i}
            className={`text-2xl sm:text-3xl ${
              i < wounds ? "text-red-600" : "text-gray-300"
            }`}
          >
            {i < wounds ? "💔" : "❤️"}
          </span>
        ))}
      </Counter>
    </div>
  </SheetSection>
);

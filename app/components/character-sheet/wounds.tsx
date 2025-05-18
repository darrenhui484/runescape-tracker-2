import { SectionProps, SheetSection } from "./sheet-section";

interface WoundsSectionProps {
  wounds: number;
  maxWounds: number;
  onWoundClick: (increment: boolean) => void;
}
export const WoundsSection: React.FC<
  WoundsSectionProps & Omit<SectionProps, "title" | "children">
> = ({ wounds, maxWounds, onWoundClick, ...rest }) => (
  <SheetSection title="WOUNDS" {...rest}>
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onWoundClick(false)}
        className="px-2 py-0.5 text-lg border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        disabled={wounds <= 0}
      >
        -
      </button>
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
      <button
        type="button"
        onClick={() => onWoundClick(true)}
        className="px-2 py-0.5 text-lg border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        disabled={wounds >= maxWounds}
      >
        +
      </button>
    </div>
  </SheetSection>
);

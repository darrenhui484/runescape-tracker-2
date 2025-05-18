import Counter from "../counter";
import { SheetSection } from "./sheet-section";

interface GPSectionProps {
  gp: number;
  onGPChange: (newGp: number) => void;
}
export const GPSection: React.FC<GPSectionProps> = ({
  gp,
  onGPChange,
}) => (
  <SheetSection title="GP">
    <Counter
      onIncrement={() => onGPChange(gp + 1)}
      onDecrement={() => onGPChange(gp - 1)}
    >
      {gp}
    </Counter>
  </SheetSection>
);

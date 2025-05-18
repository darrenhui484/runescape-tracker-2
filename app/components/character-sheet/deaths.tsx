import Counter from "../counter";
import { SheetSection } from "./sheet-section";

interface DeathsProps {
  deaths: number;
  onChange: (newDeaths: number) => void;
}
export const Deaths: React.FC<DeathsProps> = ({
  deaths,
  onChange,
}) => (
  <SheetSection title="DEATHS">
    <Counter
      onIncrement={() => onChange(deaths + 1)}
      onDecrement={() => onChange(deaths - 1)}
    >
      {deaths}
    </Counter>
  </SheetSection>
);

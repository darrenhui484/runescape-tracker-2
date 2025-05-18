import { SectionProps, SheetSection } from "./sheet-section";

interface DeathTallySectionProps {
  deathTally: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textInputClasses: string;
}
export const DeathTallySection: React.FC<
  DeathTallySectionProps & Omit<SectionProps, "title" | "children">
> = ({ deathTally, onChange, textInputClasses, ...rest }) => (
  <SheetSection title="DEATH TALLY" {...rest}>
    <input
      type="number"
      name="deathTally"
      value={deathTally}
      onChange={onChange}
      className={`${textInputClasses} text-center font-bold text-lg`}
      min="0"
    />
  </SheetSection>
);

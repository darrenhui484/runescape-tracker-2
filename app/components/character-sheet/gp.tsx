import { SectionProps, SheetSection } from "./sheet-section";

interface GPSectionProps {
  gp: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textInputClasses: string;
}
export const GPSection: React.FC<
  GPSectionProps & Omit<SectionProps, "title" | "children">
> = ({ gp, onChange, textInputClasses, ...rest }) => (
  <SheetSection title="GP" {...rest}>
    <input
      type="number"
      name="gp"
      value={gp}
      onChange={onChange}
      className={`${textInputClasses} text-center font-bold text-lg`}
      min="0"
    />
  </SheetSection>
);

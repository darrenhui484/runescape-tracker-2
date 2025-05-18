import { headerClasses, sectionClasses } from "./style";

export interface SectionProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export const SheetSection: React.FC<SectionProps> = ({
  title,
  children,
  className,
}) => (
  <div className={`${sectionClasses} ${className || ""}`}>
    <h3 className={headerClasses}>{title}</h3>
    {children}
  </div>
);

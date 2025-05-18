import { headerClasses, sectionClasses } from "./style";
import { useState } from "react";

export interface SectionProps {
  title: string;
  className?: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export const SheetSection: React.FC<SectionProps> = ({
  title,
  children,
  className,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`${sectionClasses} ${className || ""}`}>
      <div className={`${headerClasses} flex items-center justify-between`}>
        <h3>{title}</h3>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${title} section`}
        >
          {isCollapsed ? "▼" : "▲"}
        </button>
      </div>
      {!isCollapsed && children}
    </div>
  );
};

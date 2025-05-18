import { SheetSection } from "./sheet-section";
import { headerClasses, sectionClasses } from "./style";

export const StaticInfoSection: React.FC = () => (
  <>
    <SheetSection
      title="TURN REFERENCE"
      sectionClasses={`${sectionClasses} bg-yellow-100/80`}
      headerClasses={`${headerClasses} text-sm sm:text-base`}
    >
      <ol className="list-decimal list-inside space-y-0.5 text-xs sm:text-sm">
        <li>Move/Teleport</li>
        <li>Action/Explore</li>
        <li>Bonus Action</li>
      </ol>
      <p className="italic mt-1.5 pt-1 border-t border-yellow-700/30 text-[0.7rem] sm:text-xs">
        Capital End Turn: +1 Escalation
      </p>
      <p className="italic mt-1 pt-1 border-t border-yellow-700/30 text-[0.7rem] sm:text-xs">
        Capital Bank: Freely move items.
      </p>
    </SheetSection>
    <SheetSection
      title="EXPLORING PROVINCE"
      sectionClasses={`${sectionClasses} bg-yellow-100/80`}
      headerClasses={`${headerClasses} text-sm sm:text-base`}
    >
      <p className="text-xs sm:text-sm">
        Draw exploration card. Forage or Skill per icon.
      </p>
    </SheetSection>
    <SheetSection
      title="EXPLORING CAPITAL"
      sectionClasses={`${sectionClasses} bg-yellow-100/80`}
      headerClasses={`${headerClasses} text-sm sm:text-base`}
    >
      <p className="text-xs sm:text-sm">
        Gain XP by discarding GP per skill. May forage.
      </p>
    </SheetSection>
    <div className="mt-auto text-center font-bold p-2 text-yellow-900/70 text-sm sm:text-base">
      RUNESCAPE KINGDOMS
    </div>
  </>
);

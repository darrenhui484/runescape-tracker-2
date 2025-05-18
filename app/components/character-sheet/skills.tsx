import { CharacterSheetData, SKILL_ORDER } from "~/types/character";
import { SectionProps, SheetSection } from "./sheet-section";
import { InteractiveSkillRow } from "./skill-row";

// --- Skills Section ---
interface SkillsSectionProps {
  skills: CharacterSheetData["skills"];
  onSkillXpChange: (
    skillName: keyof CharacterSheetData["skills"],
    newXp: number
  ) => void;
}
export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onSkillXpChange,
}) => (
  <SheetSection title="SKILLS" className="lg:col-span-3">
    <div className="space-y-0.5">
      {SKILL_ORDER.map((key) => (
        <InteractiveSkillRow
          key={key}
          name={key}
          totalXp={skills[key]}
          onXpChange={(newXp) => onSkillXpChange(key, newXp)}
        />
      ))}
    </div>
  </SheetSection>
);

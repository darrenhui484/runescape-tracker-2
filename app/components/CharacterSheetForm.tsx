// // app/components/CharacterSheetForm.tsx
// import React, { useState, useEffect } from 'react';
// import type { CharacterSheetData, Skill } from '~/types/character';
// import { SKILL_ORDER, RESOURCE_ORDER } from '~/types/character';

// interface CharacterSheetFormProps {
//   initialData: CharacterSheetData;
//   onSave: (data: CharacterSheetData) => void; // This prop will trigger the save
// }

// const MAX_XP_SLOTS = 2;

// // InteractiveSkillRow component as defined in the "fix XP dots" response
// const InteractiveSkillRow: React.FC<{ /* ... props ... */ }> = ({ name, skill, onXpChange, onLevelChange }) => {
//     // ... implementation from "fix XP dots" ...
//     const updateSkillState = (newXp: number, newLevel: number) => { /* ... calls onXpChange, onLevelChange ... */ };
//     const handleXpClick = (xpSlotIndex: number) => { /* ... calls updateSkillState ... */ };
//     const handleLevelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... calls updateSkillState ... */ };
//     return ( /* ... JSX for skill row with buttons and input ... */ );
// };


// export default function CharacterSheetForm({ initialData, onSave }: CharacterSheetFormProps) {
//   const [sheet, setSheet] = useState<CharacterSheetData>(initialData);

//   useEffect(() => {
//     setSheet(initialData);
//   }, [initialData]);

//   // handleChange, handleNestedChange, handleSkillXpChange, handleSkillLevelChange, handleWoundClick
//   // ... (These handlers update the local `sheet` state as defined in previous interactive examples) ...
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { /* ... */ };
//   const handleNestedChange = <K extends keyof CharacterSheetData, NK extends keyof CharacterSheetData[K]>( /* ... */ ) => { /* ... */ };
//   const handleSkillXpChange = (skillName: keyof CharacterSheetData['skills'], newXp: number) => { /* ... */ };
//   const handleSkillLevelChange = (skillName: keyof CharacterSheetData['skills'], newLevel: number) => { /* ... */ };
//   const handleWoundClick = (increment: boolean) => { /* ... */ };


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(sheet); // CRUCIAL: Call the onSave prop with the current sheet data
//   };

//   // ... (The full JSX for the form, including the "Save Character" button of type="submit")
//   // This JSX should be the interactive one from the "fix XP dots" response or the "restart" example
//   // that included the full form layout.
//   // For example:
//    const sectionClasses = "border border-yellow-700/60 p-3 bg-yellow-50/50 rounded-md shadow-sm";
//    const headerClasses = "text-lg font-semibold mt-0 mb-3 text-yellow-900/90 border-b-2 border-yellow-700/40 pb-1.5 uppercase text-center";

//   return (
//      <form onSubmit={handleSubmit} className="font-[custom-serif] bg-yellow-100 ...">
//          {/* ... All the input fields and sections for characterName, wounds, skills, etc. ... */}
//          {/* Example Skills Section (ensure all other sections are also there) */}
//          <div className={`${sectionClasses} lg:col-span-3`}>
//            <h3 className={headerClasses}>SKILLS</h3>
//            <div className="space-y-0.5">
//              {SKILL_ORDER.map(key => (
//                <InteractiveSkillRow
//                  key={key}
//                  name={key}
//                  skill={sheet.skills[key]}
//                  onXpChange={(newXp) => handleSkillXpChange(key, newXp)}
//                  onLevelChange={(newLevel) => handleSkillLevelChange(key, newLevel)}
//                />
//              ))}
//            </div>
//          </div>
//          {/* ... other columns and sections ... */}
//          <div className="mt-5 sm:mt-6 text-center">
//              <button type="submit" className="px-6 py-2.5 bg-yellow-700 text-white font-bold ...">
//              Save Character
//              </button>
//          </div>
//      </form>
//   );
// }
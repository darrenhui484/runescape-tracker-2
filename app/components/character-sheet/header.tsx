interface CharacterHeaderProps {
  characterName: string;
  onChange: (name: string) => void;
}
export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  characterName,
  onChange,
}) => (
  <div className="text-center mb-4 pb-2 border-b-[3px] border-yellow-800">
    <input
      type="text"
      name="characterName"
      value={characterName}
      onChange={(e) => onChange(e.target.value)}
      className="text-2xl sm:text-3xl font-bold bg-transparent text-center w-full border-none focus:ring-0 placeholder-yellow-700/50"
      placeholder="Enter Character Name"
    />
  </div>
);

export const SummoningTokenIcon: React.FC<{
  isAvailable: boolean;
  tokenNumber: number;
}> = ({ isAvailable, tokenNumber }) => {
  // The image shows numbered circles for the tokens on the skill card.
  // These aren't active/inactive but rather indicate *possession* of the token.
  // When a familiar is summoned, a token moves from here to the familiar card.
  // We'll represent them as "filled" if `availableSummoningTokens >= tokenNumber`
  return (
    <div
      title={`Summoning Token ${tokenNumber} ${
        isAvailable ? "Available" : "Not Yet Earned/Used"
      }`}
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold 
                   border-2 border-purple-700/70 transition-all
                   ${
                     isAvailable
                       ? "bg-purple-500 text-white shadow-md"
                       : "bg-gray-300 text-gray-500 opacity-60"
                   }`}
    >
      {/* The image shows 1, 2, 3 on the tokens, let's use that as an example.
            The separate "Summoning Token" (5 on the PDF) is just one of these available tokens
            ready to be moved. Our `availableSummoningTokens` count tracks this.
        */}
      {tokenNumber}
    </div>
  );
};

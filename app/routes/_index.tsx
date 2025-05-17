// app/routes/_index.tsx
import React, { useState, useEffect } from 'react';
import EditableCharacterSheet from '~/components/CharacterSheetDisplay'; // Using the editable component
import type { CharacterSheetData, ClanBankData } from '~/types/character';
import {
  getDefaultCharacterSheet,
  LOCAL_STORAGE_KEY as CHARACTER_SHEET_KEY, // Rename for clarity
  getDefaultClanBank,
  CLAN_BANK_LOCAL_STORAGE_KEY
} from '~/types/character';

export default function Index() {
  const [sheetData, setSheetData] = useState<CharacterSheetData | null>(null);
  const [clanBankData, setClanBankData] = useState<ClanBankData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load Character Sheet
      const savedSheetJson = localStorage.getItem(CHARACTER_SHEET_KEY);
      if (savedSheetJson) {
        try {
          setSheetData(JSON.parse(savedSheetJson) as CharacterSheetData);
        } catch (error) {
          console.error("Error parsing character sheet:", error);
          setSheetData(getDefaultCharacterSheet());
        }
      } else {
        setSheetData(getDefaultCharacterSheet());
      }

      // Load Clan Bank
      const savedClanBankJson = localStorage.getItem(CLAN_BANK_LOCAL_STORAGE_KEY);
      if (savedClanBankJson) {
        try {
          setClanBankData(JSON.parse(savedClanBankJson) as ClanBankData);
        } catch (error) {
          console.error("Error parsing clan bank:", error);
          setClanBankData(getDefaultClanBank());
        }
      } else {
        setClanBankData(getDefaultClanBank());
      }
      setIsLoaded(true);
    }
  }, []); // Load once on mount

  const handleSaveSheet = (dataToSave: CharacterSheetData) => {
    if (typeof window !== 'undefined') {
      try {
        const updatedData = { ...dataToSave, lastUpdated: new Date().toISOString() };
        localStorage.setItem(CHARACTER_SHEET_KEY, JSON.stringify(updatedData));
        setSheetData(updatedData); // Update state
        alert('Character Sheet Saved!');
      } catch (error) { console.error("Error saving character sheet:", error); alert('Failed to save character sheet.'); }
    }
  };

  const handleSaveClanBank = (dataToSave: ClanBankData) => {
    if (typeof window !== 'undefined') {
      try {
        const updatedData = { ...dataToSave, lastUpdated: new Date().toISOString() };
        localStorage.setItem(CLAN_BANK_LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
        setClanBankData(updatedData); // Update state
        // No alert here as it might be too noisy for every bank transaction
        console.log('Clan Bank Saved!');
      } catch (error) { console.error("Error saving clan bank:", error); alert('Failed to save clan bank.'); }
    }
  };

  if (!isLoaded || !sheetData || !clanBankData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <p className="text-xl text-yellow-700">Loading Data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6">
      <EditableCharacterSheet
        initialData={sheetData}
        initialClanBankData={clanBankData}
        onSave={handleSaveSheet}
        onSaveClanBank={handleSaveClanBank}
      />
      {/* ... (Optional Clear Data buttons for testing) ... */}
    </main>
  );
}
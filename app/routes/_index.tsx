// app/routes/_index.tsx
import React, { useState, useEffect } from 'react';
import EditableCharacterSheet from '~/components/CharacterSheetDisplay'; // Use the now editable component
import type { CharacterSheetData } from '~/types/character';
import { getDefaultCharacterSheet, LOCAL_STORAGE_KEY } from '~/types/character';

export default function Index() {
  const [sheetData, setSheetData] = useState<CharacterSheetData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSheetJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSheetJson) {
        try {
          const parsedSheet = JSON.parse(savedSheetJson) as CharacterSheetData;
          // Simplified load (as per your request to remove merging, but be mindful of risks)
          setSheetData(parsedSheet);
        } catch (error) {
          console.error("Error parsing saved character sheet, using default:", error);
          setSheetData(getDefaultCharacterSheet());
        }
      } else {
        setSheetData(getDefaultCharacterSheet());
      }
      setIsLoaded(true);
    }
  }, []);

  const handleSaveSheet = (dataToSave: CharacterSheetData) => {
    if (typeof window !== 'undefined') {
      try {
        const updatedData = { ...dataToSave, lastUpdated: new Date().toISOString() };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
        setSheetData(updatedData); // Important: Update the state in _index.tsx as well
                                  // This ensures if initialData prop changes, the child syncs.
        alert('Character Sheet Saved!');
      } catch (error) {
        console.error("Error saving character sheet:", error);
        alert('Failed to save character sheet.');
      }
    }
  };

  if (!isLoaded || !sheetData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <p className="text-xl text-yellow-700">Loading Character Sheet...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6">
      <EditableCharacterSheet
        initialData={sheetData}
        onSave={handleSaveSheet} // Pass the save handler
      />
      <div className="text-center mt-4">
        <button
          onClick={() => {
            if (window.confirm("Clear saved data and show default sheet? This will erase current data.")) {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              setSheetData(getDefaultCharacterSheet()); // Update UI immediately
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Saved Data & Reset
        </button>
      </div>
    </main>
  );
}
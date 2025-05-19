import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import EditableCharacterSheet from "~/components/character-sheet/editable-character-sheet";
import type { CharacterSheetData, ClanBankData } from "~/types/character";
import {
  getDefaultCharacterSheet,
  LOCAL_STORAGE_KEY as CHARACTER_SHEET_KEY,
  getDefaultClanBank,
  CLAN_BANK_LOCAL_STORAGE_KEY,
} from "~/types/character";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");
  const username = url.searchParams.get("username");
  if (!roomId || !username) {
    return redirect(`${url.origin}/login`);
  }
  return { roomId, username };
}

export default function Index() {
  const [sheetData, _setSheetData] = useState<CharacterSheetData>(getDefaultCharacterSheet());
  const [clanBankData, _setClanBankData] = useState<ClanBankData>(getDefaultClanBank());
  const { roomId, username } = useLoaderData<typeof loader>();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io();
    socket.emit("join", roomId, username);
    socket.on("bank-change", (bankResources) => {
      setClanBankData(bankResources);
    });
    setSocket(socket);
    return () => {
      socket.off("bank-change");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const savedSheetJson = localStorage.getItem(CHARACTER_SHEET_KEY);
    if (savedSheetJson) {
      setSheetData(JSON.parse(savedSheetJson) as CharacterSheetData);
    }

    const savedClanBankJson = localStorage.getItem(CLAN_BANK_LOCAL_STORAGE_KEY);
    if (savedClanBankJson) {
      setClanBankData(JSON.parse(savedClanBankJson) as ClanBankData);
    }
  }, []);

  function setSheetData(sheetOrFunction: CharacterSheetData | ((prevSheet: CharacterSheetData) => CharacterSheetData)) {
    let updatedData: CharacterSheetData;
    if (typeof sheetOrFunction === "function") {
      const updatedSheet = sheetOrFunction(sheetData);
      updatedData = saveToLocalStorage(updatedSheet, CHARACTER_SHEET_KEY);
    } else {
      updatedData = saveToLocalStorage(sheetOrFunction, CHARACTER_SHEET_KEY);
    }
    _setSheetData(updatedData);
  }

  function setClanBankData(clanBankOrFunction: ClanBankData | ((prevBank: ClanBankData) => ClanBankData)) {
    let updatedData: ClanBankData;
    if (typeof clanBankOrFunction === "function") {
      const updatedBank = clanBankOrFunction(clanBankData);
      updatedData = saveToLocalStorage(updatedBank, CLAN_BANK_LOCAL_STORAGE_KEY);
    } else {
      updatedData = saveToLocalStorage(clanBankOrFunction, CLAN_BANK_LOCAL_STORAGE_KEY);
    }
    _setClanBankData(updatedData);
  }

  if (!sheetData || !clanBankData || !socket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <p className="text-xl text-yellow-700">Loading Data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6">
      <div>
        <EditableCharacterSheet
          socket={socket}
          roomId={roomId}
          sheet={sheetData}
          clanBank={clanBankData}
          setSheet={setSheetData}
          setClanBank={setClanBankData}
        />
      </div>
    </main>
  );
}

function saveToLocalStorage<T>(data: T, key: string) {
  const updatedData = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(updatedData));

  return updatedData;
}

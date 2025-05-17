// app/types/character.ts
export interface Skill {
  level: number;
  xp: number; // 0, 1, or 2
}

export interface PrayerTokenStatus {
  // We might have a few slots for prayer tokens. Let's assume 3 for now based on description.
  // Each can be 'inactive', 'active', or 'unavailable' (if not yet earned)
  slot1: "unavailable" | "inactive" | "active";
  slot2: "unavailable" | "inactive" | "active";
  slot3: "unavailable" | "inactive" | "active";
}

export interface CharacterSheetData {
  characterName: string;
  wounds: number;
  deathTally: number;
  gp: number;
  skills: {
    melee: Skill;
    ranged: Skill;
    magic: Skill;
    defence: Skill;
    thieving: Skill;
    gathering: Skill;
    crafting: Skill;
    cooking: Skill;
    prayer: Skill;
  };
  resources: {
    fish: number;
    wood: number;
    meat: number;
    stone: number;
    herb: number;
    leather: number;
    vegetable: number;
    thread: number;
    egg: number;
    metal: number;
    flour: number;
    fruit: number;
  };
  capeObjectives: {
    level8InAnySkill: boolean;
    level3InEightSkills: boolean;
    have15Coins: boolean;
    oneOfEachResource: boolean;
    complete4SideQuests: boolean;
  };
  sideQuestsCompletedCount: number;
  lastUpdated?: string;
  prayerTokens: PrayerTokenStatus;
}

export const SKILL_ORDER: (keyof CharacterSheetData["skills"])[] = [
  "melee",
  "ranged",
  "magic",
  "defence",
  "thieving",
  "gathering",
  "crafting",
  "cooking",
  "prayer"
];

export const RESOURCE_ORDER: (keyof CharacterSheetData["resources"])[] = [
  "fish",
  "wood",
  "meat",
  "stone",
  "herb",
  "leather",
  "vegetable",
  "thread",
  "egg",
  "metal",
  "flour",
  "fruit",
];

export const getDefaultCharacterSheet = (
  name: string = "Adventurer"
): CharacterSheetData => ({
  characterName: name,
  wounds: 0,
  deathTally: 0,
  gp: 10,
  skills: {
    melee: { level: 1, xp: 0 },
    ranged: { level: 1, xp: 0 },
    magic: { level: 1, xp: 0 },
    defence: { level: 1, xp: 0 },
    thieving: { level: 1, xp: 0 },
    gathering: { level: 1, xp: 0 },
    crafting: { level: 1, xp: 0 },
    cooking: { level: 1, xp: 1 }, // Default Skiller XP per FAQ
    prayer: { level: 1, xp: 0 }
  },
  resources: {
    fish: 0,
    wood: 0,
    meat: 0,
    stone: 0,
    herb: 0,
    leather: 0,
    vegetable: 0,
    thread: 0,
    egg: 0,
    metal: 0,
    flour: 0,
    fruit: 0,
  },
  capeObjectives: {
    level8InAnySkill: false,
    level3InEightSkills: false,
    have15Coins: false,
    oneOfEachResource: false,
    complete4SideQuests: false,
  },
  prayerTokens: { // Default state for prayer tokens
    slot1: 'unavailable', // Initially unavailable, earned at level 1
    slot2: 'unavailable', // Earned later
    slot3: 'unavailable', // Earned later
  },
  sideQuestsCompletedCount: 0,
  lastUpdated: new Date().toISOString(),
});

export const LOCAL_STORAGE_KEY = "rskoe-character-sheet-display-v1";

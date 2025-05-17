// app/types/character.ts
export interface Skill {
  level: number;
  xp: number; // 0, 1, or 2
  iconUrl?: string;
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
    summoning: Skill;
    runecrafting: Skill;
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
  availableSummoningTokens: number;
  /** Number of available Rune tokens the player has, not yet placed on spell cards. */
  availableRuneTokens: number;
}

export interface ClanBankData {
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
    // You could add GP to the clan bank if the game rules support it
    // gp?: number;
  };
  lastUpdated?: string;
}

export const getDefaultClanBank = (): ClanBankData => ({
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
    // gp: 0,
  },
  lastUpdated: new Date().toISOString(),
});

export const CLAN_BANK_LOCAL_STORAGE_KEY = "rskoe-clan-bank-v1";

export const SKILL_ORDER: (keyof CharacterSheetData["skills"])[] = [
  "melee",
  "ranged",
  "magic",
  "defence",
  "thieving",
  "gathering",
  "crafting",
  "cooking",
  "prayer",
  "summoning",
  "runecrafting",
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

export const DEFAULT_SKILL_ICON_PLACEHOLDER =
  "/icons/default-skill-placeholder.svg";

const EXTERNAL_IMAGES = {
  SKILLS: {
    MELEE: "https://runescape.wiki/images/Attack_detail.png?346f8",
    RANGED: "https://runescape.wiki/images/Ranged_detail.png?346f8",
    MAGIC: "https://runescape.wiki/images/Magic_detail.png?346f8",
    DEFENCE: "https://runescape.wiki/images/Defence_detail.png?346f8",
    THIEVING: "https://runescape.wiki/images/Thieving_detail.png?346f8",
    GATHERING: "https://oldschool.runescape.wiki/images/Inventory.png?d4795",
    CRAFTING: "https://runescape.wiki/images/Crafting_detail.png?346f8",
    COOKING: "https://runescape.wiki/images/Cooking_detail.png?346f8",
    PRAYER: "https://runescape.wiki/images/Prayer_detail.png?346f8",
    SUMMONING: "https://runescape.wiki/images/Summoning_detail.png?346f8",
    RUNECRAFTING: "https://runescape.wiki/images/Runecrafting_detail.png?346f8",
  },
  RESOURCES: {},
};

export const getDefaultCharacterSheet = (
  name: string = "Adventurer"
): CharacterSheetData => ({
  characterName: name,
  wounds: 0,
  deathTally: 0,
  gp: 10,
  skills: {
    melee: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.MELEE },
    ranged: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.RANGED },
    magic: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.MAGIC },
    defence: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.DEFENCE },
    thieving: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.THIEVING },
    gathering: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.GATHERING },
    crafting: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.CRAFTING },
    cooking: { level: 1, xp: 1, iconUrl: EXTERNAL_IMAGES.SKILLS.COOKING },
    prayer: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.PRAYER },
    summoning: { level: 1, xp: 0, iconUrl: EXTERNAL_IMAGES.SKILLS.SUMMONING },
    runecrafting: {
      level: 1,
      xp: 0,
      iconUrl: EXTERNAL_IMAGES.SKILLS.RUNECRAFTING,
    },
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
  prayerTokens: {
    // Default state for prayer tokens
    slot1: "unavailable", // Initially unavailable, earned at level 1
    slot2: "unavailable", // Earned later
    slot3: "unavailable", // Earned later
  },
  availableSummoningTokens: 0, // Starts with 0, gains 1st at Summoning level 1
  availableRuneTokens: 0, // Starts with 0 Rune tokens
  sideQuestsCompletedCount: 0,
  lastUpdated: new Date().toISOString(),
});

// Helper function to determine Runecrafting Tier based on level
export const getRunecraftingTier = (level: number): 1 | 2 | 3 => {
  if (level >= 7) return 3; // Tier 3 at level 7+
  if (level >= 4) return 2; // Tier 2 at level 4-6
  return 1; // Tier 1 at level 1-3
};

export const LOCAL_STORAGE_KEY = "rskoe-character-sheet-display-v1";

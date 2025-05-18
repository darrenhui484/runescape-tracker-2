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
  deaths: number;
  gp: number;
  skills: {
    melee: number;
    ranged: number;
    magic: number;
    defence: number;
    thieving: number;
    gathering: number;
    crafting: number;
    cooking: number;
    prayer: number;
    summoning: number;
    runecrafting: number;
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
    lobster: number;
    ration: number;
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

export type ClanBankData = {
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
    lobster: number;
    ration: number;
    // You could add GP to the clan bank if the game rules support it
    // gp?: number;
  };
  lastUpdated?: string;
};

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
    lobster: 0,
    ration: 0,
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
  "lobster",
  "ration",
];

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
  RESOURCES: {
    FISH: "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Fish.png",
    WOOD: "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Wood.png",
    MEAT: "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Meat.png",
    STONE:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Stone.png",
    HERB: "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Herb.png",
    LEATHER:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Leather.png",
    VEGETABLE:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Vegetable.png",
    THREAD:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Thread.png",
    EGG: "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Egg.png",
    METAL:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Metal.png",
    FLOUR:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Flour.png",
    FRUIT:
      "https://raw.githubusercontent.com/darrenhui484/runescape-tracker/refs/heads/main/public/resource/Fruit.png",
    LOBSTER: "https://runescape.wiki/images/Lobster.png?48782",
    RATION: "https://runescape.wiki/images/Pork_pie.png?467bc",
  },
} as const;

export const getResourceImageUrl = (
  resourceName: keyof CharacterSheetData["resources"]
) => {
  return EXTERNAL_IMAGES.RESOURCES[
    resourceName.toUpperCase() as keyof typeof EXTERNAL_IMAGES.RESOURCES
  ];
};

export const getSkillImageUrl = (
  skillName: keyof CharacterSheetData["skills"]
) => {
  return EXTERNAL_IMAGES.SKILLS[
    skillName.toUpperCase() as keyof typeof EXTERNAL_IMAGES.SKILLS
  ];
};

export const getLevel = (xp: number) => {
  return Math.floor(xp / 3);
};

export const getDefaultCharacterSheet = (
  name: string = "Adventurer"
): CharacterSheetData => ({
  characterName: name,
  wounds: 0,
  deaths: 0,
  gp: 0,
  skills: {
    melee: 0,
    ranged: 0,
    magic: 0,
    defence: 0,
    thieving: 0,
    gathering: 0,
    crafting: 0,
    cooking: 0,
    prayer: 0,
    summoning: 0,
    runecrafting: 0,
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
    lobster: 0,
    ration: 0,
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

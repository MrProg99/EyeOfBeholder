const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let currentMonsters = [];
let summonedAllies = [];
let inCombat = false;
let hasGameStarted = false;
let chestEventActive = false;
let isGameOver = false;
const discoveredChestFloors = new Set();
let summonedAllyEntityIdCounter = 1;
const PARTY_SIZE = 3;
const AVAILABLE_PARTY_CLASSES = [
    {
        key: 'Warrior',
        label: 'Guerrier',
        summary: 'Frontline solide, controle et execution.'
    },
    {
        key: 'Mage',
        label: 'Mage',
        summary: 'Degats de sorts, feu, glace, AOE.'
    },
    {
        key: 'Rogue',
        label: 'Rogue',
        summary: 'Rapide, agressif et precis.'
    },
    {
        key: 'Archer',
        label: 'Archer',
        summary: 'Tir a distance, marquage de cible et pression constante.'
    },
    {
        key: 'Necromancer',
        label: 'Necromancien',
        summary: 'Magie noire: drain, affaiblissement et invocation.'
    },
    {
        key: 'Druid',
        label: 'Druide',
        summary: 'Soutien: totems, protection et soins de groupe.'
    }
];
const DEFAULT_PARTY_CLASSES = ['Warrior', 'Mage', 'Rogue'];
let selectedPartyClasses = [...DEFAULT_PARTY_CLASSES];
let splashPartySelectionNotice = '';
const SUMMON_DEFINITIONS = {
    skeleton: {
        id: 'skeleton',
        name: 'Squelette',
        image: 'Images/Skelette.png',
        manaCost: 18,
        cooldownTurns: 2
    },
    healing_totem: {
        id: 'healing_totem',
        name: 'Totem de soin',
        image: 'Images/totem.png',
        manaCost: 20,
        maxPerCaster: 1
    },
    death_totem: {
        id: 'death_totem',
        name: 'Totem de mort',
        image: 'Images/TotamMort.png',
        manaCost: 22,
        maxPerCaster: 1
    }
};
const MONSTER_DROP_CHANCE = 0.35;
const POTION_DROP_CHANCE = 0.15;
const SHAMAN_ENCOUNTER_CHANCE = 0.3;
const KOBOLD_WARBAND_ENCOUNTER_CHANCE = 0.24;
const MAX_MONSTERS_IN_COMBAT = 8;
const INITIAL_REST_RATIONS = 3;
const SAVE_STORAGE_KEY = 'eye_of_beholder_save_v1';
const SAVE_SCHEMA_VERSION = 1;
let availableRestRations = INITIAL_REST_RATIONS;
const MONSTER_TURN_VISUAL_DELAY_MS = 1500;
const PERCEPTION_EVENT_BASE_CHANCE = 0.05;
const PERCEPTION_EVENT_PER_POINT = 0.0125;
const PERCEPTION_EVENT_MAX_CHANCE = 0.7;
const PERCEPTION_EVENT_WEIGHTS = {
    chest: 0.45,
    surprise: 0,
    trap: 0.55
};
const CHEST_ROGUE_OPEN_BASE_CHANCE = 0.45;
const CHEST_ROGUE_OPEN_PERCEPTION_BONUS = 0.02;
const CHEST_ROGUE_OPEN_MAX_CHANCE = 0.92;
const CHEST_BRUTE_FORCE_TRAP_CHANCE = 0.7;
const CHEST_BRUTE_FORCE_FAIL_CHANCE = 0.22;
const CHEST_BRUTE_FORCE_TRAP_MIN_DAMAGE = 18;
const CHEST_BRUTE_FORCE_TRAP_MAX_DAMAGE = 30;
const MONSTER_PORTRAITS = {
    Goblin: 'Images/Goblin.png',
    Orc: 'Images/Orc.png',
    Troll: 'Images/Troll.png',
    Shaman: 'Images/Shaman.png',
    Kobold: 'Images/Kobold.png',
    'Chef kobold': 'Images/ChefKobold.png',
    'Slime verte': 'Images/SlimeVerte.png',
    'Golem de glace': 'Images/GolemGlace.png',
    'Golem de feu': 'Images/GolemFeu.png',
    'Chevalier spectrale': 'Images/ChevalierSpectrale.png',
    'Reine araignee': 'Images/ReineAraignee.png',
    Araignee: 'Images/Spider.png',
    'Bebe araignee': 'Images/Spider.png'
};
const pendingDamageHighlights = {
    characters: new Set(),
    monsters: new Set(),
    summons: new Set()
};
const pendingDamageValues = {
    characters: new Map(),
    monsters: new Map(),
    summons: new Map()
};
let combatTurnOrder = [];
let combatTurnCursor = 0;
let monsterTurnTimeoutId = null;
const INITIATIVE_BASE = {
    classes: {
        Warrior: 11,
        Mage: 10,
        Rogue: 14,
        Archer: 13,
        Necromancer: 9,
        Druid: 10
    },
    monsters: {
        Goblin: 13,
        Orc: 9,
        Troll: 7,
        Shaman: 12,
        Kobold: 14,
        'Chef kobold': 11,
        'Slime verte': 10,
        Araignee: 11,
        'Bebe araignee': 14,
        'Golem de glace': 8,
        'Golem de feu': 8,
        'Chevalier spectrale': 10,
        'Reine araignee': 12
    }
};
const NECRO_SOUL_THEFT_PASSIVE_ID = 'necro_obscur';
const NECRO_SOUL_THEFT_HEALTH_GAIN = 5;
const NECRO_SOUL_THEFT_MANA_GAIN = 10;
const BOSS_RELIC_STAT_FIELDS = {
    minDamage: 'minDamage',
    maxDamage: 'maxDamage',
    damageBonus: 'damageBonus',
    defense: 'defenseBonus',
    strength: 'strengthBonus',
    intelligence: 'intelligenceBonus',
    vitality: 'vitalityBonus',
    perception: 'perceptionBonus',
    magic: 'magicBonus'
};
const BOSS_RELIC_RESISTANCE_FIELDS = {
    physicalResistance: 'physicalResistanceBonus',
    magicResistance: 'magicResistanceBonus',
    fireResistance: 'fireResistanceBonus',
    iceResistance: 'iceResistanceBonus',
    poisonResistance: 'poisonResistanceBonus'
};
const BOSS_RELIC_DEFINITIONS = {
    green_slime: {
        tier: 1,
        type: 'ring',
        rarity: 'rare',
        names: ['Anneau du limon ancien', 'Noyau visqueux', 'Goutte primordiale'],
        guaranteed: {
            vitality: 2,
            perception: 1,
            poisonResistance: 8
        },
        randomRanges: [
            { stat: 'vitality', min: 0, max: 2 },
            { stat: 'perception', min: 0, max: 2 },
            { stat: 'strength', min: 0, max: 1 },
            { stat: 'magic', min: 0, max: 1 },
            { stat: 'physicalResistance', min: 2, max: 6 },
            { stat: 'manaRegenBonus', min: 0, max: 1 }
        ]
    },
    ice_golem: {
        tier: 2,
        type: 'boots',
        rarity: 'epic',
        names: ['Bottes du glacier brise', 'Pas du colosse de givre', 'Empreinte cryomancienne'],
        guaranteed: {
            vitality: 3,
            magic: 2,
            iceResistance: 12
        },
        randomRanges: [
            { stat: 'intelligence', min: 1, max: 3 },
            { stat: 'magic', min: 0, max: 2 },
            { stat: 'strength', min: 0, max: 2 },
            { stat: 'perception', min: 0, max: 2 },
            { stat: 'fireResistance', min: 4, max: 10 },
            { stat: 'manaRegenBonus', min: 1, max: 3 }
        ]
    },
    fire_golem: {
        tier: 3,
        type: 'armor',
        rarity: 'epic',
        names: ['Cuirasse du brasier ancien', 'Carapace de magma', 'Coeur de fournaise'],
        guaranteed: {
            strength: 3,
            vitality: 3,
            magic: 2,
            fireResistance: 14
        },
        randomRanges: [
            { stat: 'strength', min: 1, max: 3 },
            { stat: 'vitality', min: 1, max: 3 },
            { stat: 'magic', min: 1, max: 3 },
            { stat: 'intelligence', min: 0, max: 2 },
            { stat: 'physicalResistance', min: 4, max: 10 },
            { stat: 'manaRegenBonus', min: 1, max: 3 }
        ]
    },
    spectral_knight: {
        tier: 4,
        type: 'weapon',
        rarity: 'epic',
        names: ['Lame des lamentations', 'Espadon du voile spectral', 'Tranchant des ames perdues'],
        guaranteed: {
            minDamage: 7,
            maxDamage: 11,
            strength: 4,
            vitality: 4,
            perception: 2,
            magicResistance: 16
        },
        randomRanges: [
            { stat: 'damageBonus', min: 1, max: 3 },
            { stat: 'strength', min: 2, max: 4 },
            { stat: 'vitality', min: 2, max: 4 },
            { stat: 'magic', min: 1, max: 3 },
            { stat: 'intelligence', min: 1, max: 3 },
            { stat: 'physicalResistance', min: 5, max: 12 },
            { stat: 'manaRegenBonus', min: 1, max: 3 }
        ]
    },
    spider_queen: {
        tier: 5,
        type: 'ring',
        rarity: 'epic',
        names: ['Diademe de la reine venimeuse', 'Anneau de la matrone abyssale', 'Joyau de la toile noire'],
        guaranteed: {
            intelligence: 4,
            magic: 4,
            perception: 3,
            poisonResistance: 20
        },
        randomRanges: [
            { stat: 'intelligence', min: 2, max: 4 },
            { stat: 'magic', min: 2, max: 4 },
            { stat: 'vitality', min: 1, max: 3 },
            { stat: 'strength', min: 1, max: 3 },
            { stat: 'magicResistance', min: 8, max: 14 },
            { stat: 'manaRegenBonus', min: 2, max: 4 }
        ]
    }
};
const SOUND_EFFECTS = {
    swordHit1: 'Sound/sword_hit1.wav',
    swordHit2: 'Sound/sword_hit2.wav',
    swordHit3: 'Sound/sword_hit3.wav',
    swordHit4: 'Sound/sword_hit4.wav',
    swordHit5: 'Sound/sword_hit5.wav',
    swordHit6: 'Sound/sword_hit6.wav',
    swordHit7: 'Sound/sword_hit7.mp3',
    spell1: 'Sound/spell_1.wav',
    spell2: 'Sound/spell_2.wav',
    spell3: 'Sound/spell_3.wav',
    spell4: 'Sound/spell_4.wav',
    spell5: 'Sound/spell_5.wav',
    spell6: 'Sound/spell_6.wav',
    monsterDeath: 'Sound/monster-death.mp3'
};
const SWORD_HIT_EFFECT_KEYS = [
    'swordHit1',
    'swordHit2',
    'swordHit3',
    'swordHit4',
    'swordHit5',
    'swordHit6',
    'swordHit7'
];
const SPELL_CAST_EFFECT_KEYS = [
    'spell1',
    'spell2',
    'spell3',
    'spell4',
    'spell5',
    'spell6'
];
const soundEffectBank = {};
Object.entries(SOUND_EFFECTS).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    soundEffectBank[key] = audio;
});
const DUNGEON_MAP_MUSIC_PATH = 'Sound/Dungeon.mp3';
const DUNGEON_MAP_MUSIC_VOLUME = 0.32;
const dungeonMapMusic = new Audio(DUNGEON_MAP_MUSIC_PATH);
dungeonMapMusic.preload = 'auto';
dungeonMapMusic.loop = true;
dungeonMapMusic.volume = DUNGEON_MAP_MUSIC_VOLUME;
const DUNGEON_COMBAT_MUSIC_PATHS = ['Sound/Battle1.mp3', 'Sound/Battle2.mp3'];
const DUNGEON_COMBAT_MUSIC_VOLUME = 0.34;
const dungeonCombatMusicTracks = DUNGEON_COMBAT_MUSIC_PATHS.map((path) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = DUNGEON_COMBAT_MUSIC_VOLUME;
    return audio;
});
let activeCombatMusicTrackIndex = -1;

function shouldPlayDungeonMapMusic() {
    return hasGameStarted && !inCombat && !isGameOver && !document.hidden;
}

function shouldPlayCombatMusic() {
    return hasGameStarted && inCombat && !isGameOver && !document.hidden;
}

function playDungeonMapMusic() {
    if (!dungeonMapMusic.paused) {
        return;
    }
    const playPromise = dungeonMapMusic.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Ignore autoplay or transient playback errors.
        });
    }
}

function pauseDungeonMapMusic() {
    if (dungeonMapMusic.paused) {
        return;
    }
    dungeonMapMusic.pause();
}

function pickRandomCombatMusicTrackIndex() {
    if (dungeonCombatMusicTracks.length === 0) {
        return -1;
    }
    if (dungeonCombatMusicTracks.length === 1) {
        return 0;
    }
    let randomIndex = Math.floor(Math.random() * dungeonCombatMusicTracks.length);
    if (randomIndex === activeCombatMusicTrackIndex) {
        randomIndex = (randomIndex + 1) % dungeonCombatMusicTracks.length;
    }
    return randomIndex;
}

function prepareCombatMusicForNewFight() {
    const nextTrackIndex = pickRandomCombatMusicTrackIndex();
    if (nextTrackIndex < 0) {
        return;
    }
    activeCombatMusicTrackIndex = nextTrackIndex;
    const selectedTrack = dungeonCombatMusicTracks[activeCombatMusicTrackIndex];
    if (selectedTrack) {
        selectedTrack.currentTime = 0;
    }
}

function pauseCombatMusic() {
    dungeonCombatMusicTracks.forEach((track) => {
        if (!track.paused) {
            track.pause();
        }
    });
}

function stopCombatMusic() {
    pauseCombatMusic();
    dungeonCombatMusicTracks.forEach((track) => {
        track.currentTime = 0;
    });
    activeCombatMusicTrackIndex = -1;
}

function playActiveCombatMusicTrack() {
    if (activeCombatMusicTrackIndex < 0 || activeCombatMusicTrackIndex >= dungeonCombatMusicTracks.length) {
        return;
    }
    dungeonCombatMusicTracks.forEach((track, index) => {
        if (index !== activeCombatMusicTrackIndex && !track.paused) {
            track.pause();
        }
    });
    const activeTrack = dungeonCombatMusicTracks[activeCombatMusicTrackIndex];
    if (!activeTrack || !activeTrack.paused) {
        return;
    }
    const playPromise = activeTrack.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Ignore autoplay or transient playback errors.
        });
    }
}

function syncCombatMusic() {
    if (shouldPlayCombatMusic()) {
        playActiveCombatMusicTrack();
        return;
    }
    pauseCombatMusic();
}

function syncDungeonMapMusic() {
    if (shouldPlayDungeonMapMusic()) {
        playDungeonMapMusic();
    } else {
        pauseDungeonMapMusic();
    }
    syncCombatMusic();
}

function resizeCanvasToViewport() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    if (canvas.width === width && canvas.height === height) {
        return;
    }
    canvas.width = width;
    canvas.height = height;
}


function usesManaResource(character) {
    if (!character || !character.classType) {
        return false;
    }
    if (typeof classUsesMana === 'function') {
        return classUsesMana(character.classType);
    }
    return character.classType === 'Mage' || character.classType === 'Necromancer' || character.classType === 'Druid';
}

const ACTION_MANA_COSTS = Object.freeze({
    'Magic Missile': 10,
    'Boule de feu': 20,
    'Lance de glace': 12,
    'Pluie de feu': 30,
    'Drain de vie': 14,
    Affaiblissement: 12,
    'Malediction funeste': 18,
    Protection: 16,
    'Soin de groupe': 22,
    Renouveau: 26
});
const COMBAT_ACTION_ICON_PATHS = Object.freeze({
    Attaquer: 'Images/Action_Attaquer.png',
    'Coup d epee': 'Images/Action_Attaquer.png',
    'Attaque rapide': 'Images/Action_Attaquer.png',
    'Attaque normale': 'Images/Action_AttaqueArc.png',
    'Attaque ciblee': 'Images/Action_Cible.png',
    'Fleche perforante': 'Images/Action_FlechePerforante.png',
    'Fleche empoisonnee': 'Images/Action_flechePoison.png',
    'Attaque au baton': 'Images/Action_Attaquer.png',
    'Coup de baton': 'Images/Action_Attaquer.png',
    Assomer: 'Images/Action_Assomer.png',
    Backstab: 'Images/Action_Backstab.png',
    Bloquer: 'Images/Action_Bloquer.png',
    Provocation: 'Images/Action_Provocation.png',
    'Boule de feu': 'Images/Action_fireball.png',
    'Lance de glace': 'Images/Action_lanceGlace.png',
    'Magic Missile': 'Images/action_MagicMissile.png',
    Affaiblissement: 'Images/Action_Affaiblissement.png',
    'Drain de vie': 'Images/Action_Draindevie.png',
    'Malediction funeste': 'Images/Action_Malediction.png',
    'Pluie de feu': 'Images/Action_Pluiedefeu.png',
    Protection: 'Images/Action_protection.png',
    'Soin de groupe': 'Images/Action_soinGroupe.png',
    'Invocation de squelette': 'Images/Action_Squelette.png',
    'Invocation de totem': 'Images/Action_TotemVie.png',
    'Invocation de totem de mort': 'Images/Action_TotemMort.png',
    'Boire une potion': 'Images/Action_Potion.png'
});
const COMBAT_STATUS_ICON_PATHS = Object.freeze({
    fire: 'Images/Etat_feu.png',
    ice: 'Images/Etat_glace.png',
    poison: 'Images/Etat_poison.png',
    weakened: 'Images/Etat_affaibli.png',
    marked: 'Images/Etat_marque.png',
    webbed: 'Images/Etat_toile.png',
    protection: 'Images/Etat_protection.png',
    provocation: 'Images/Etat_provoquer.png'
});

function getActionManaCost(action) {
    if (typeof action !== 'string' || action.length === 0) {
        return 0;
    }
    if (action === 'Invocation de squelette') {
        return Math.max(0, Math.floor((SUMMON_DEFINITIONS.skeleton && SUMMON_DEFINITIONS.skeleton.manaCost) || 0));
    }
    if (action === 'Invocation de totem') {
        return Math.max(0, Math.floor((SUMMON_DEFINITIONS.healing_totem && SUMMON_DEFINITIONS.healing_totem.manaCost) || 0));
    }
    if (action === 'Invocation de totem de mort') {
        return Math.max(0, Math.floor((SUMMON_DEFINITIONS.death_totem && SUMMON_DEFINITIONS.death_totem.manaCost) || 0));
    }
    return Math.max(0, Math.floor(ACTION_MANA_COSTS[action] || 0));
}

function hasEnoughManaForAction(character, action) {
    const manaCost = getActionManaCost(action);
    if (manaCost <= 0) {
        return true;
    }
    const currentMana = Math.max(0, Math.floor(Number(character && character.mana) || 0));
    return currentMana >= manaCost;
}

function getCombatActionIconPath(action) {
    if (typeof action !== 'string' || action.length === 0) {
        return '';
    }
    return COMBAT_ACTION_ICON_PATHS[action] || '';
}

function normalizeCombatStatusTurns(value) {
    return Math.max(0, Math.floor(Number(value) || 0));
}

function getCombatPortraitStatusEntries(entity, options = {}) {
    const entries = [];
    if (!entity || typeof entity !== 'object') {
        return entries;
    }

    const treatAsMonster = Boolean(options.treatAsMonster);
    const pushStatusEntry = (key, turns, label) => {
        const iconPath = COMBAT_STATUS_ICON_PATHS[key];
        const normalizedTurns = normalizeCombatStatusTurns(turns);
        if (!iconPath || normalizedTurns <= 0) {
            return;
        }
        const entry = {
            key,
            turns: normalizedTurns,
            label: String(label || key)
        };
        const existing = entries.find((candidate) => candidate.key === key);
        if (!existing) {
            entries.push(entry);
            return;
        }
        if (entry.turns > existing.turns) {
            existing.turns = entry.turns;
            existing.label = entry.label;
        }
    };

    if (typeof entity.isBurning === 'function' && entity.isBurning()) {
        pushStatusEntry('fire', entity.burnTurns, 'Brulure');
    }

    if (treatAsMonster) {
        if (typeof entity.isPoisoned === 'function' && entity.isPoisoned()) {
            pushStatusEntry('poison', entity.poisonTurns, 'Poison');
        }
        if (typeof entity.isStunned === 'function' && entity.isStunned()) {
            pushStatusEntry('ice', entity.stunnedTurns, 'Etourdi');
        }
        if (typeof entity.hasAttackWeakness === 'function' && entity.hasAttackWeakness()) {
            pushStatusEntry('weakened', entity.attackWeakenTurns, 'Affaibli');
        }
        if (typeof entity.isMarked === 'function' && entity.isMarked()) {
            pushStatusEntry('marked', entity.damageTakenVulnerabilityTurns, 'Marque');
        }
        return entries;
    }

    if (typeof entity.isPoisoned === 'function' && entity.isPoisoned()) {
        pushStatusEntry('poison', entity.poisonTurns, 'Poison');
    }
    if (typeof entity.isInfected === 'function' && entity.isInfected()) {
        pushStatusEntry('poison', entity.infectionTurns, 'Infection');
    }
    if (typeof entity.isColdNumb === 'function' && entity.isColdNumb()) {
        pushStatusEntry('ice', entity.coldNumbTurns, 'Engourdi');
    }
    if (typeof entity.isStunned === 'function' && entity.isStunned()) {
        pushStatusEntry('ice', entity.stunnedTurns, 'Etourdi');
    }
    if (typeof entity.hasAttackWeakness === 'function' && entity.hasAttackWeakness()) {
        pushStatusEntry('weakened', entity.attackWeakenTurns, 'Affaibli');
    }
    if (typeof entity.isWebbed === 'function' && entity.isWebbed()) {
        pushStatusEntry('webbed', entity.webbedTurns, 'Toile');
    }
    if (typeof entity.hasProtectionShield === 'function' && entity.hasProtectionShield()) {
        pushStatusEntry('protection', entity.protectionShieldTurns, 'Protection');
    }
    if (typeof entity.hasProvocationActive === 'function' && entity.hasProvocationActive()) {
        pushStatusEntry('provocation', entity.provocationTurns, 'Provocation');
    }
    if (typeof entity.isMarked === 'function' && entity.isMarked()) {
        pushStatusEntry('marked', entity.damageTakenVulnerabilityTurns, 'Marque');
    }

    return entries;
}

function buildCombatPortraitStatusIconsHtml(statusEntries) {
    if (!Array.isArray(statusEntries) || statusEntries.length === 0) {
        return '';
    }
    const iconsHtml = statusEntries.map((entry) => {
        const iconPath = COMBAT_STATUS_ICON_PATHS[entry.key];
        const turns = normalizeCombatStatusTurns(entry.turns);
        if (!iconPath || turns <= 0) {
            return '';
        }
        const turnLabel = turns > 1 ? 'tours' : 'tour';
        const tooltip = `${entry.label}: ${turns} ${turnLabel}`;
        return `
            <div class="combat-status-icon-slot" title="${tooltip}">
                <img class="combat-status-icon" src="${iconPath}" alt="${entry.label}">
                <span class="combat-status-turns">${turns}</span>
            </div>
        `;
    }).join('');
    if (!iconsHtml) {
        return '';
    }
    return `<div class="combat-status-icons">${iconsHtml}</div>`;
}

function formatRateAsPercent(rate) {
    const safeRate = Math.max(0, Math.min(1, Number(rate) || 0));
    return `${Math.round(safeRate * 100)}%`;
}

function buildBackstabActionHint(character) {
    if (!character || typeof character.getBackstabSuccessChance !== 'function') {
        return '';
    }

    const safePerception = Math.max(0, Math.floor(Number(character.perception) || 0));
    const backstabRank = typeof character.getSkillRank === 'function'
        ? Math.max(0, Math.floor(character.getSkillRank('rogue_backstab')))
        : 0;
    const rankBonusPercent = backstabRank > 1 ? ((backstabRank - 1) * 3) : 0;
    const chanceWithoutStun = character.getBackstabSuccessChance(null);
    const chanceWithStun = character.getBackstabSuccessChance({ stunnedTurns: 1 });

    return `Chance sans etourdissement: ${formatRateAsPercent(chanceWithoutStun)} | Chance cible etourdie: ${formatRateAsPercent(chanceWithStun)} | Per: ${safePerception}, Rang: ${backstabRank} | Formule: 15% + 2.5% Per + ${rankBonusPercent}% rang +20% si cible etourdie`;
}

function buildCombatActionHint(action, manaCost = 0, disabledReason = '', character = null) {
    const hintParts = [String(action || 'Action')];
    if (manaCost > 0) {
        hintParts.push(`Cout: ${manaCost} mana`);
    }
    if (action === 'Backstab') {
        const backstabHint = buildBackstabActionHint(character);
        if (backstabHint) {
            hintParts.push(backstabHint);
        }
    }
    if (action === 'Attaque ciblee') {
        hintParts.push('Marque la cible: +35% degats subis pendant 2 tours');
    }
    if (action === 'Fleche perforante') {
        hintParts.push('Ignore totalement l armure de la cible');
    }
    if (action === 'Fleche empoisonnee') {
        hintParts.push('Applique un poison (degats sur la duree)');
    }
    if (disabledReason) {
        hintParts.push(disabledReason);
    }
    return hintParts.join(' - ');
}

function setCombatActionButtonVisual(button, action, hint = '', indicatorText = '') {
    if (!button) {
        return;
    }
    const actionLabel = String(action || 'Action');
    const buttonHint = typeof hint === 'string' && hint.length > 0 ? hint : actionLabel;
    button.classList.add('combat-action-btn');
    button.title = buttonHint;
    button.setAttribute('aria-label', buttonHint);
    button.textContent = '';

    const iconPath = getCombatActionIconPath(actionLabel);
    if (!iconPath) {
        button.classList.remove('combat-action-with-icon');
        button.textContent = actionLabel;
        return;
    }

    const icon = document.createElement('img');
    icon.className = 'combat-action-icon';
    icon.src = iconPath;
    icon.alt = actionLabel;
    icon.addEventListener('error', () => {
        button.classList.remove('combat-action-with-icon');
        button.textContent = actionLabel;
    }, { once: true });
    button.appendChild(icon);
    button.classList.add('combat-action-with-icon');
    if (typeof indicatorText === 'string' && indicatorText.length > 0) {
        const indicator = document.createElement('span');
        indicator.className = 'combat-action-indicator';
        indicator.textContent = indicatorText;
        button.appendChild(indicator);
        button.classList.add('combat-action-has-indicator');
    }
}

function setCombatCenterActionsLayout(centerActions, mode = 'list') {
    if (!centerActions) {
        return;
    }
    if (mode === 'icon-grid') {
        centerActions.style.gridTemplateColumns = 'repeat(auto-fit, minmax(70px, max-content))';
        centerActions.style.justifyContent = 'start';
        centerActions.style.alignContent = 'start';
        centerActions.style.overflowY = 'auto';
        return;
    }
    centerActions.style.gridTemplateColumns = '1fr';
    centerActions.style.justifyContent = 'stretch';
    centerActions.style.alignContent = 'start';
    centerActions.style.overflowY = 'auto';
}

class SummonedAlly {
    constructor(name, health, attack, defense, options = {}) {
        this.entityType = 'summon';
        this.entityId = `sum-${summonedAllyEntityIdCounter++}`;
        this.summonType = options.summonType || 'generic';
        this.ownerEntityId = options.ownerEntityId || '';
        this.ownerName = options.ownerName || '';
        this.name = name;
        this.image = options.image || '';
        this.health = Math.max(1, Math.floor(health || 1));
        this.maxHealth = this.health;
        this.attack = Math.max(1, Math.floor(attack || 1));
        this.defense = Math.max(0, Math.floor(defense || 0));
        this.damageResistances = (typeof window !== 'undefined' && typeof window.normalizeDamageResistanceMap === 'function')
            ? window.normalizeDamageResistanceMap(options.damageResistances || {})
            : {
                physical: 0,
                magic: 0,
                fire: 0,
                ice: 0,
                poison: 0
            };
        this.healPerTurn = Math.max(0, Math.floor(options.healPerTurn || 0));
        this.damagePerTurn = Math.max(0, Math.floor(options.damagePerTurn || 0));
        this.attackWeakenAmount = 0;
        this.attackWeakenTurns = 0;
        this.burnDamage = 0;
        this.burnTurns = 0;
        this.burnAppliedThisTurn = false;
    }

    getCurrentAttack() {
        return Math.max(1, this.attack - this.attackWeakenAmount);
    }

    hasAttackWeakness() {
        return this.attackWeakenAmount > 0 && this.attackWeakenTurns > 0;
    }

    applyAttackWeakness(amount, turns) {
        const weaknessAmount = Math.max(1, Math.floor(amount || 0));
        const weaknessTurns = Math.max(1, Math.floor(turns || 0));
        if (weaknessAmount <= 0 || weaknessTurns <= 0) {
            return false;
        }
        this.attackWeakenAmount = Math.max(this.attackWeakenAmount, weaknessAmount);
        this.attackWeakenTurns = Math.max(this.attackWeakenTurns, weaknessTurns);
        return true;
    }

    getAttackWeaknessText() {
        if (!this.hasAttackWeakness()) {
            return '';
        }
        const turnLabel = this.attackWeakenTurns > 1 ? 'tours' : 'tour';
        return `Affaibli: -${this.attackWeakenAmount} attaque (${this.attackWeakenTurns} ${turnLabel})`;
    }

    applyBurn(damage, turns) {
        const burnDamage = Math.max(1, Math.floor(damage || 0));
        const burnTurns = Math.max(1, Math.floor(turns || 0));
        this.burnDamage = Math.max(this.burnDamage, burnDamage);
        this.burnTurns = Math.max(this.burnTurns, burnTurns);
        this.burnAppliedThisTurn = true;
        return this.burnTurns;
    }

    isBurning() {
        return this.burnDamage > 0 && this.burnTurns > 0;
    }

    getBurnStatusText() {
        if (!this.isBurning()) {
            return '';
        }
        const turnLabel = this.burnTurns > 1 ? 'tours' : 'tour';
        return `Brulure: ${this.burnDamage} degats/tour (${this.burnTurns} ${turnLabel})`;
    }

    getDamageResistance(damageType) {
        const normalizedType = (typeof window !== 'undefined' && typeof window.normalizeDamageType === 'function')
            ? window.normalizeDamageType(damageType)
            : String(damageType || 'physical').toLowerCase();
        const value = this.damageResistances[normalizedType];
        if (typeof window !== 'undefined' && typeof window.normalizeDamageResistanceValue === 'function') {
            return window.normalizeDamageResistanceValue(value);
        }
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return 0;
        }
        return Math.max(-100, Math.min(90, Math.round(numericValue)));
    }

    takeDamage(damage, options = {}) {
        const armorFormula = (typeof window !== 'undefined' && typeof window.calculateDamageWithArmor === 'function')
            ? window.calculateDamageWithArmor
            : (rawDamage, armorValue) => {
                const normalizedRawDamage = Math.max(1, Math.floor(rawDamage || 0));
                const normalizedArmor = Math.max(0, Math.floor(armorValue || 0));
                const reductionRatio = normalizedArmor / (normalizedArmor + 20);
                return Math.max(1, Math.round(normalizedRawDamage * (1 - reductionRatio)));
            };
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        const damageType = (typeof window !== 'undefined' && typeof window.normalizeDamageType === 'function')
            ? window.normalizeDamageType(normalizedOptions.damageType || 'physical')
            : String(normalizedOptions.damageType || 'physical').toLowerCase();
        const resistancePercent = this.getDamageResistance(damageType);
        const resolver = (typeof window !== 'undefined' && typeof window.resolveDamageWithType === 'function')
            ? window.resolveDamageWithType
            : (rawDamage, context = {}) => {
                const reducedByArmor = armorFormula(rawDamage, context.armorValue || 0);
                const resistance = Number(context.resistancePercent || 0);
                return Math.max(1, Math.round(reducedByArmor * (1 - (resistance / 100))));
            };
        const finalDamage = resolver(damage, {
            armorValue: this.defense,
            damageType,
            resistancePercent
        });
        this.health -= finalDamage;
        if (finalDamage > 0 && typeof window.queueDamageFlash === 'function') {
            window.queueDamageFlash(this, finalDamage);
        }
        if (this.health <= 0) {
            this.health = 0;
        }
        return finalDamage;
    }

    consumeTurnEffects() {
        const logs = [];

        if (this.hasAttackWeakness()) {
            this.attackWeakenTurns -= 1;
            if (this.attackWeakenTurns <= 0) {
                this.attackWeakenTurns = 0;
                this.attackWeakenAmount = 0;
                logs.push(`${this.name} n'est plus affaibli.`);
            }
        }

        if (this.isBurning()) {
            if (this.burnAppliedThisTurn) {
                this.burnAppliedThisTurn = false;
            } else {
                const burnDamageTaken = this.takeDamage(this.burnDamage, { damageType: 'fire' });

                this.burnTurns = Math.max(0, this.burnTurns - 1);
                const turnLabel = this.burnTurns > 1 ? 'tours restants' : 'tour restant';
                if (this.burnTurns > 0) {
                    logs.push(`${this.name} subit ${burnDamageTaken} degats de brulure (${this.burnTurns} ${turnLabel}).`);
                } else {
                    logs.push(`${this.name} subit ${burnDamageTaken} degats de brulure.`);
                    this.burnDamage = 0;
                }
                if (!this.isAlive()) {
                    logs.push(`${this.name} s'effondre en cendres.`);
                } else if (this.burnTurns === 0) {
                    logs.push(`${this.name} n'est plus en feu.`);
                }
            }
        }

        return logs;
    }

    isAlive() {
        return this.health > 0;
    }
}

function createSkeletonSummonForCaster(caster) {
    const magic = Math.max(0, Math.floor(caster && caster.magic ? caster.magic : 0));
    const summonPowerMultiplier = caster && typeof caster.getSkillPowerMultiplier === 'function'
        ? Math.max(1, caster.getSkillPowerMultiplier('Invocation de squelette'))
        : 1;
    const maxHealth = Math.max(1, Math.round((18 + (magic * 3)) * summonPowerMultiplier));
    const attack = Math.max(1, Math.round((3 + Math.max(1, Math.floor(magic * 0.9))) * summonPowerMultiplier));
    const defense = Math.max(0, Math.round(Math.floor(magic / 5) * summonPowerMultiplier));
    const ownerName = caster && caster.name ? caster.name : 'Necromancien';
    const definition = SUMMON_DEFINITIONS.skeleton;
    const summonName = `${definition.name} de ${ownerName}`;
    return new SummonedAlly(summonName, maxHealth, attack, defense, {
        summonType: definition.id,
        ownerEntityId: caster && caster.entityId ? caster.entityId : '',
        ownerName,
        image: definition.image
    });
}

function createHealingTotemForCaster(caster) {
    const magic = Math.max(0, Math.floor(caster && caster.magic ? caster.magic : 0));
    const summonPowerMultiplier = caster && typeof caster.getSkillPowerMultiplier === 'function'
        ? Math.max(1, caster.getSkillPowerMultiplier('Invocation de totem'))
        : 1;
    const maxHealth = Math.max(1, Math.round((14 + Math.max(1, Math.floor(magic * 0.6))) * summonPowerMultiplier));
    const attack = 1;
    const defense = 1;
    const healPerTurn = Math.max(1, Math.round((5 + Math.max(1, Math.floor(magic * 0.35))) * summonPowerMultiplier));
    const ownerName = caster && caster.name ? caster.name : 'Druide';
    const definition = SUMMON_DEFINITIONS.healing_totem;
    const summonName = `${definition.name} de ${ownerName}`;
    return new SummonedAlly(summonName, maxHealth, attack, defense, {
        summonType: definition.id,
        ownerEntityId: caster && caster.entityId ? caster.entityId : '',
        ownerName,
        image: definition.image,
        healPerTurn
    });
}

function createDeathTotemForCaster(caster) {
    const magic = Math.max(0, Math.floor(caster && caster.magic ? caster.magic : 0));
    const summonPowerMultiplier = caster && typeof caster.getSkillPowerMultiplier === 'function'
        ? Math.max(1, caster.getSkillPowerMultiplier('Invocation de totem de mort'))
        : 1;
    const maxHealth = Math.max(1, Math.round((14 + Math.max(1, Math.floor(magic * 0.6))) * summonPowerMultiplier));
    const attack = 1;
    const defense = 1;
    const damagePerTurn = Math.max(1, Math.round((4 + Math.max(1, Math.floor(magic * 0.35))) * summonPowerMultiplier));
    const ownerName = caster && caster.name ? caster.name : 'Druide';
    const definition = SUMMON_DEFINITIONS.death_totem;
    const summonName = `${definition.name} de ${ownerName}`;
    return new SummonedAlly(summonName, maxHealth, attack, defense, {
        summonType: definition.id,
        ownerEntityId: caster && caster.entityId ? caster.entityId : '',
        ownerName,
        image: definition.image,
        damagePerTurn
    });
}

function getAliveSummonedAllies() {
    return summonedAllies.filter((ally) => ally && typeof ally.isAlive === 'function' && ally.isAlive());
}

function clearQueuedSummonDamageById(entityId) {
    if (!entityId) {
        return;
    }
    pendingDamageHighlights.summons.delete(entityId);
    pendingDamageValues.summons.delete(entityId);
}

function cleanupDefeatedSummonedAllies() {
    if (!Array.isArray(summonedAllies) || summonedAllies.length === 0) {
        return 0;
    }

    const removedEntityIds = [];
    summonedAllies = summonedAllies.filter((ally) => {
        const isAlive = Boolean(ally && typeof ally.isAlive === 'function' && ally.isAlive());
        if (!isAlive && ally && ally.entityId) {
            removedEntityIds.push(ally.entityId);
        }
        return isAlive;
    });

    removedEntityIds.forEach((entityId) => clearQueuedSummonDamageById(entityId));
    return removedEntityIds.length;
}

function cleanupDefeatedCombatParticipants() {
    cleanupDefeatedSummonedAllies();

    if (!Array.isArray(combatTurnOrder) || combatTurnOrder.length === 0) {
        combatTurnCursor = 0;
        return;
    }

    const cursorBeforeCleanup = combatTurnCursor;
    const activeEntityBeforeCleanup = combatTurnOrder[cursorBeforeCleanup] || null;
    combatTurnOrder = combatTurnOrder.filter((entity) => (
        entity
        && typeof entity.isAlive === 'function'
        && entity.isAlive()
    ));

    if (combatTurnOrder.length === 0) {
        combatTurnCursor = 0;
        return;
    }

    if (activeEntityBeforeCleanup && typeof activeEntityBeforeCleanup.isAlive === 'function' && activeEntityBeforeCleanup.isAlive()) {
        const preservedIndex = combatTurnOrder.indexOf(activeEntityBeforeCleanup);
        if (preservedIndex >= 0) {
            combatTurnCursor = preservedIndex;
            return;
        }
    }

    combatTurnCursor = ((combatTurnCursor % combatTurnOrder.length) + combatTurnOrder.length) % combatTurnOrder.length;
}

function getAliveCombatAllies() {
    return [
        ...getAliveCharacters(),
        ...getAliveSummonedAllies()
    ];
}

function getProvocationTarget(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return null;
    }
    const tauntingWarriors = candidates.filter((entity) => (
        entity
        && entity.entityType === 'character'
        && entity.classType === 'Warrior'
        && typeof entity.isAlive === 'function'
        && entity.isAlive()
        && typeof entity.hasProvocationActive === 'function'
        && entity.hasProvocationActive()
    ));
    if (tauntingWarriors.length === 0) {
        return null;
    }
    tauntingWarriors.sort((left, right) => {
        const leftTurns = Math.max(0, Math.floor(Number(left.provocationTurns) || 0));
        const rightTurns = Math.max(0, Math.floor(Number(right.provocationTurns) || 0));
        return rightTurns - leftTurns;
    });
    return tauntingWarriors[0] || null;
}

function pickMonsterAttackTarget(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return null;
    }
    const livingCandidates = candidates.filter((entity) => (
        entity
        && typeof entity.isAlive === 'function'
        && entity.isAlive()
    ));
    if (livingCandidates.length === 0) {
        return null;
    }
    const provocationTarget = getProvocationTarget(livingCandidates);
    if (provocationTarget) {
        return provocationTarget;
    }
    return livingCandidates[Math.floor(Math.random() * livingCandidates.length)];
}

function getActiveSummonCountForCaster(caster, summonType) {
    if (!caster || !caster.entityId) {
        return 0;
    }
    return summonedAllies.filter((ally) => (
        ally
        && ally.ownerEntityId === caster.entityId
        && (!summonType || ally.summonType === summonType)
        && typeof ally.isAlive === 'function'
        && ally.isAlive()
    )).length;
}

function registerSummonedAlly(ally) {
    if (!ally || typeof ally.isAlive !== 'function') {
        return false;
    }
    summonedAllies.push(ally);
    if (inCombat) {
        ally.combatInitiative = rollInitiative(ally);
        combatTurnOrder.push(ally);
    }
    return true;
}

function summonSkeletonForCharacter(caster) {
    if (!caster || caster.classType !== 'Necromancer') {
        return { success: false, message: 'Seul le necromancien peut invoquer un squelette.' };
    }
    const definition = SUMMON_DEFINITIONS.skeleton;
    if (!definition) {
        return { success: false, message: 'Invocation indisponible.' };
    }

    const cooldownTurns = Math.max(0, Math.floor(definition.cooldownTurns || 0));
    if (typeof caster.canUseSkeletonSummon === 'function' && !caster.canUseSkeletonSummon()) {
        const remainingTurns = Math.max(0, Math.floor(caster.skeletonSummonCooldownTurns || 0));
        return { success: false, message: `${caster.name} ne peut pas encore invoquer de squelette (${remainingTurns} tours restants).` };
    }

    const manaCost = Math.max(0, Math.floor(definition.manaCost || 0));
    if ((caster.mana || 0) < manaCost) {
        return { success: false, message: `${caster.name} n'a pas assez de mana pour Invocation de squelette.` };
    }

    const skeleton = createSkeletonSummonForCaster(caster);
    if (!registerSummonedAlly(skeleton)) {
        return { success: false, message: 'L invocation a echoue.' };
    }

    caster.mana -= manaCost;
    if (cooldownTurns > 0 && typeof caster.setSkeletonSummonCooldown === 'function') {
        caster.setSkeletonSummonCooldown(cooldownTurns);
    }
    return {
        success: true,
        summon: skeleton,
        manaCost,
        message: `${caster.name} invoque ${skeleton.name} !`
    };
}

function summonTotemForCharacter(caster) {
    if (!caster || caster.classType !== 'Druid') {
        return { success: false, message: 'Seul le druide peut invoquer un totem.' };
    }
    const definition = SUMMON_DEFINITIONS.healing_totem;
    if (!definition) {
        return { success: false, message: 'Invocation indisponible.' };
    }

    const manaCost = Math.max(0, Math.floor(definition.manaCost || 0));
    if ((caster.mana || 0) < manaCost) {
        return { success: false, message: `${caster.name} n'a pas assez de mana pour Invocation de totem.` };
    }

    const maxPerCaster = Math.max(0, Math.floor(definition.maxPerCaster || 0));
    if (maxPerCaster > 0) {
        const activeTotemCount = getActiveSummonCountForCaster(caster, definition.id);
        if (activeTotemCount >= maxPerCaster) {
            return { success: false, message: `${caster.name} a deja un totem actif.` };
        }
    }

    const totem = createHealingTotemForCaster(caster);
    if (!registerSummonedAlly(totem)) {
        return { success: false, message: 'L invocation a echoue.' };
    }

    caster.mana -= manaCost;
    return {
        success: true,
        summon: totem,
        manaCost,
        message: `${caster.name} invoque ${totem.name} !`
    };
}

function summonDeathTotemForCharacter(caster) {
    if (!caster || caster.classType !== 'Druid') {
        return { success: false, message: 'Seul le druide peut invoquer un totem de mort.' };
    }
    const definition = SUMMON_DEFINITIONS.death_totem;
    if (!definition) {
        return { success: false, message: 'Invocation indisponible.' };
    }

    const manaCost = Math.max(0, Math.floor(definition.manaCost || 0));
    if ((caster.mana || 0) < manaCost) {
        return { success: false, message: `${caster.name} n'a pas assez de mana pour Invocation de totem de mort.` };
    }

    const maxPerCaster = Math.max(0, Math.floor(definition.maxPerCaster || 0));
    if (maxPerCaster > 0) {
        const activeTotemCount = getActiveSummonCountForCaster(caster, definition.id);
        if (activeTotemCount >= maxPerCaster) {
            return { success: false, message: `${caster.name} a deja un totem de mort actif.` };
        }
    }

    const totem = createDeathTotemForCaster(caster);
    if (!registerSummonedAlly(totem)) {
        return { success: false, message: 'L invocation a echoue.' };
    }

    caster.mana -= manaCost;
    return {
        success: true,
        summon: totem,
        manaCost,
        message: `${caster.name} invoque ${totem.name} !`
    };
}

function sanitizePartyClassSelection(selection) {
    const validClassKeys = new Set(AVAILABLE_PARTY_CLASSES.map((entry) => entry.key));
    const normalized = [];
    if (Array.isArray(selection)) {
        selection.forEach((classKey) => {
            if (!validClassKeys.has(classKey) || normalized.includes(classKey)) {
                return;
            }
            normalized.push(classKey);
        });
    }
    if (normalized.length === PARTY_SIZE) {
        return normalized;
    }
    return [...DEFAULT_PARTY_CLASSES];
}

function cloneSerializableSaveData(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        return null;
    }
}

function getSaveStorage() {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        return window.localStorage || null;
    } catch (error) {
        return null;
    }
}

function canPersistGameProgress() {
    const hasCompleteParty = Array.isArray(characters) && characters.length === PARTY_SIZE;
    return hasGameStarted && hasCompleteParty && !isGameOver && !inCombat && !chestEventActive;
}

function buildGameSaveState() {
    const dungeonFloors = cloneSerializableSaveData(dungeon.floors);
    const savedCharacters = cloneSerializableSaveData(characters);
    const savedPartySelection = cloneSerializableSaveData(selectedPartyClasses);
    const inventorySource = (typeof partyInventory !== 'undefined' && Array.isArray(partyInventory))
        ? partyInventory
        : [];
    const savedInventory = cloneSerializableSaveData(inventorySource);

    if (!Array.isArray(dungeonFloors) || !Array.isArray(savedCharacters) || savedCharacters.length !== PARTY_SIZE) {
        return null;
    }

    const currentFloor = Math.max(0, Math.floor(Number(dungeon.currentFloor) || 0));
    const currentRoomX = Math.max(0, Math.floor(Number(dungeon.currentRoom && dungeon.currentRoom.x) || 0));
    const currentRoomY = Math.max(0, Math.floor(Number(dungeon.currentRoom && dungeon.currentRoom.y) || 0));

    return {
        schemaVersion: SAVE_SCHEMA_VERSION,
        savedAt: Date.now(),
        selectedPartyClasses: Array.isArray(savedPartySelection) ? savedPartySelection : [...DEFAULT_PARTY_CLASSES],
        availableRestRations: Math.max(0, Math.floor(Number(availableRestRations) || 0)),
        discoveredChestFloors: Array.from(discoveredChestFloors),
        summonedAllyEntityIdCounter: Math.max(1, Math.floor(Number(summonedAllyEntityIdCounter) || 1)),
        dungeon: {
            floors: dungeonFloors,
            currentFloor,
            currentRoom: { x: currentRoomX, y: currentRoomY }
        },
        characters: savedCharacters,
        partyInventory: Array.isArray(savedInventory) ? savedInventory : []
    };
}

function saveGameProgressIfPossible(reason = 'autosave') {
    if (!canPersistGameProgress()) {
        return false;
    }

    const storage = getSaveStorage();
    if (!storage) {
        return false;
    }

    const state = buildGameSaveState();
    if (!state) {
        return false;
    }

    try {
        storage.setItem(SAVE_STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (error) {
        console.warn('Sauvegarde impossible:', reason, error);
        return false;
    }
}

function clearSavedGameProgress() {
    const storage = getSaveStorage();
    if (!storage) {
        return;
    }
    try {
        storage.removeItem(SAVE_STORAGE_KEY);
    } catch (error) {
        console.warn('Suppression de sauvegarde impossible:', error);
    }
}

function readSavedGameState() {
    const storage = getSaveStorage();
    if (!storage) {
        return null;
    }

    let rawSave = null;
    try {
        rawSave = storage.getItem(SAVE_STORAGE_KEY);
    } catch (error) {
        return null;
    }
    if (!rawSave) {
        return null;
    }

    let parsedSave = null;
    try {
        parsedSave = JSON.parse(rawSave);
    } catch (error) {
        clearSavedGameProgress();
        return null;
    }

    if (!parsedSave || typeof parsedSave !== 'object') {
        clearSavedGameProgress();
        return null;
    }
    if (parsedSave.schemaVersion !== SAVE_SCHEMA_VERSION) {
        return null;
    }
    if (!parsedSave.dungeon || !Array.isArray(parsedSave.characters) || parsedSave.characters.length !== PARTY_SIZE) {
        clearSavedGameProgress();
        return null;
    }
    if (parsedSave.inCombat === true) {
        return null;
    }

    return parsedSave;
}

function hasSavedGameProgress() {
    return Boolean(readSavedGameState());
}

function restorePartyInventoryFromSave(savedInventory) {
    if (typeof partyInventory === 'undefined' || !Array.isArray(partyInventory)) {
        return;
    }
    partyInventory.length = 0;
    if (!Array.isArray(savedInventory)) {
        return;
    }
    savedInventory.forEach((stack) => {
        const clonedStack = cloneSerializableSaveData(stack);
        if (!clonedStack || typeof clonedStack !== 'object') {
            return;
        }
        partyInventory.push(clonedStack);
    });
}

function restoreCharactersFromSave(savedCharacters, fallbackPartyClasses) {
    if (!Array.isArray(savedCharacters) || savedCharacters.length !== PARTY_SIZE) {
        return false;
    }

    characters.length = 0;
    const fallbackClasses = Array.isArray(fallbackPartyClasses) ? fallbackPartyClasses : DEFAULT_PARTY_CLASSES;

    for (let i = 0; i < savedCharacters.length; i += 1) {
        const savedCharacter = savedCharacters[i];
        if (!savedCharacter || typeof savedCharacter !== 'object') {
            return false;
        }

        const savedClassType = typeof savedCharacter.classType === 'string' ? savedCharacter.classType : '';
        const classType = AVAILABLE_PARTY_CLASSES.some((entry) => entry.key === savedClassType)
            ? savedClassType
            : (fallbackClasses[i] || DEFAULT_PARTY_CLASSES[i % DEFAULT_PARTY_CLASSES.length]);
        const fallbackName = `Hero${i + 1}`;
        const name = typeof savedCharacter.name === 'string' && savedCharacter.name.trim()
            ? savedCharacter.name.trim().slice(0, 24)
            : fallbackName;
        const character = createCharacter(name, classType);
        if (!character) {
            return false;
        }

        const clonedCharacter = cloneSerializableSaveData(savedCharacter);
        if (!clonedCharacter || typeof clonedCharacter !== 'object') {
            return false;
        }
        Object.assign(character, clonedCharacter);
        character.name = name;
        character.classType = classType;

        if (character.classType === 'Mage') {
            const skillRanks = character.skillRanks && typeof character.skillRanks === 'object'
                ? character.skillRanks
                : {};
            const oldHealRank = Math.max(0, Math.floor(Number(skillRanks.mage_soin) || 0));
            const currentIceRank = Math.max(0, Math.floor(Number(skillRanks.mage_lance_glace) || 0));
            if (oldHealRank > 0) {
                skillRanks.mage_lance_glace = Math.max(currentIceRank, oldHealRank);
                delete skillRanks.mage_soin;
            }
            character.skillRanks = skillRanks;
        }

        if (!character.equipment || typeof character.equipment !== 'object') {
            character.equipment = {
                weapon: null,
                offhand: null,
                ring: null,
                armor: null,
                boots: null
            };
        } else {
            const equipmentDefaults = {
                weapon: null,
                offhand: null,
                ring: null,
                armor: null,
                boots: null
            };
            character.equipment = { ...equipmentDefaults, ...character.equipment };
        }
    }

    return true;
}

function loadSavedGameProgress() {
    const savedGame = readSavedGameState();
    if (!savedGame) {
        return false;
    }

    const savedPartySelection = sanitizePartyClassSelection(savedGame.selectedPartyClasses);
    selectedPartyClasses = [...savedPartySelection];

    if (!restoreCharactersFromSave(savedGame.characters, savedPartySelection)) {
        clearSavedGameProgress();
        return false;
    }
    restorePartyInventoryFromSave(savedGame.partyInventory);

    const savedDungeon = savedGame.dungeon || {};
    const savedFloors = cloneSerializableSaveData(savedDungeon.floors);
    if (!Array.isArray(savedFloors) || savedFloors.length === 0) {
        clearSavedGameProgress();
        return false;
    }

    dungeon.floors = savedFloors;
    const maxFloorIndex = Math.max(0, dungeon.floors.length - 1);
    dungeon.currentFloor = Math.max(0, Math.min(maxFloorIndex, Math.floor(Number(savedDungeon.currentFloor) || 0)));

    const savedRoom = savedDungeon.currentRoom && typeof savedDungeon.currentRoom === 'object'
        ? savedDungeon.currentRoom
        : { x: 0, y: 0 };
    const roomX = Math.max(0, Math.min(3, Math.floor(Number(savedRoom.x) || 0)));
    const roomY = Math.max(0, Math.min(2, Math.floor(Number(savedRoom.y) || 0)));
    dungeon.currentRoom = { x: roomX, y: roomY };

    availableRestRations = Math.max(0, Math.floor(Number(savedGame.availableRestRations) || 0));
    discoveredChestFloors.clear();
    if (Array.isArray(savedGame.discoveredChestFloors)) {
        savedGame.discoveredChestFloors.forEach((floorIndex) => {
            const normalized = Math.floor(Number(floorIndex) || 0);
            if (normalized >= 0) {
                discoveredChestFloors.add(normalized);
            }
        });
    }

    summonedAllyEntityIdCounter = Math.max(1, Math.floor(Number(savedGame.summonedAllyEntityIdCounter) || 1));

    isGameOver = false;
    inCombat = false;
    chestEventActive = false;
    currentMonsters = [];
    summonedAllies = [];
    combatTurnOrder = [];
    combatTurnCursor = 0;
    clearDamageFlashQueue();
    clearMonsterTurnTimeout();
    stopCombatMusic();
    hasGameStarted = true;

    const gameOverModal = document.getElementById('game-over-modal');
    if (gameOverModal) {
        gameOverModal.style.display = 'none';
    }
    const combatModal = document.getElementById('combat-modal');
    if (combatModal) {
        combatModal.style.display = 'none';
    }
    const chestModal = document.getElementById('chest-modal');
    if (chestModal) {
        chestModal.style.display = 'none';
    }
    const levelUpModal = document.getElementById('level-up-modal');
    if (levelUpModal) {
        levelUpModal.style.display = 'none';
    }
    const inventoryModal = document.getElementById('inventory-modal');
    if (inventoryModal) {
        inventoryModal.style.display = 'none';
    }

    updateCharacterUI();
    updateUI();
    render();
    logMessage('Sauvegarde chargee (hors combat).');
    checkLevelUps();
    saveGameProgressIfPossible('load-resync');
    return true;
}

function createKoboldWarbandEncounter() {
    const chief = createMonster('kobold_chief');
    const firstKobold = createMonster('kobold');
    const secondKobold = createMonster('kobold');
    return [chief, firstKobold, secondKobold].filter(Boolean);
}

function initGame(selection = DEFAULT_PARTY_CLASSES) {
    const partySelection = sanitizePartyClassSelection(selection);
    selectedPartyClasses = [...partySelection];
    characters.length = 0;
    currentMonsters = [];
    summonedAllies = [];
    inCombat = false;
    chestEventActive = false;
    isGameOver = false;
    combatTurnOrder = [];
    combatTurnCursor = 0;
    clearDamageFlashQueue();
    clearMonsterTurnTimeout();
    stopCombatMusic();

    if (Array.isArray(dungeon.floors)) {
        dungeon.floors = [];
    }
    dungeon.currentFloor = 0;
    dungeon.currentRoom = { x: 0, y: 0 };
    if (typeof dungeon.generateTower === 'function') {
        dungeon.generateTower();
    }

    discoveredChestFloors.clear();
    availableRestRations = INITIAL_REST_RATIONS;
    summonedAllyEntityIdCounter = 1;
    const gameOverModal = document.getElementById('game-over-modal');
    if (gameOverModal) {
        gameOverModal.style.display = 'none';
    }
    for (let i = 0; i < PARTY_SIZE; i += 1) {
        const classType = partySelection[i];
        createCharacter(`Hero${i + 1}`, classType);
    }

    resizeCanvasToViewport();
    updateUI();
    render();
    syncDungeonMapMusic();
    saveGameProgressIfPossible('new-game-start');
}

function updateUI() {
    logMessage(`Étage ${dungeon.currentFloor + 1}, Salle ${dungeon.currentRoom.x + dungeon.currentRoom.y * 4 + 1}`);
    const room = dungeon.getCurrentRoom();
    
    // First, create monster(s) if needed
    if (room.type === 'monster' && currentMonsters.length === 0) {
        const count = Math.max(1, Math.floor(room.monsterCount || 0) || 1);
        room.monsterCount = count;
        currentMonsters = [];

        const forcedMonsterType = typeof room.forcedMonsterType === 'string' ? room.forcedMonsterType : '';
        if (forcedMonsterType) {
            if (forcedMonsterType === 'kobold_warband') {
                const warband = createKoboldWarbandEncounter();
                currentMonsters.push(...warband);
                room.monsterCount = currentMonsters.length;
            } else {
                for (let i = 0; i < count; i += 1) {
                    currentMonsters.push(createMonster(forcedMonsterType));
                }
            }
        } else {
            const hasKoboldWarband = Math.random() < KOBOLD_WARBAND_ENCOUNTER_CHANCE;
            if (hasKoboldWarband) {
                const warband = createKoboldWarbandEncounter();
                currentMonsters.push(...warband);
                room.monsterCount = currentMonsters.length;
            } else {
                const hasShaman = Math.random() < SHAMAN_ENCOUNTER_CHANCE;
                if (hasShaman) {
                    currentMonsters.push(createMonster('shaman'));
                }
                while (currentMonsters.length < count) {
                    currentMonsters.push(createMonster());
                }
                // Randomize order so the shaman is not always first
                for (let i = currentMonsters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [currentMonsters[i], currentMonsters[j]] = [currentMonsters[j], currentMonsters[i]];
                }
            }
        }
        const names = currentMonsters.map(m => m.name).join(', ');
        logMessage(`${currentMonsters.length} monstre(s) apparaissent: ${names}`);
    }
    
    // Then manage combat state
    if (room.type === 'monster' && currentMonsters.length > 0) {
        if (!inCombat) {
            startCombat();
        }
    } else {
        if (inCombat) {
            endCombat();
        }
    }
    
    updateStairsButton(room);
    if (!inCombat) {
        updateRestButton(room);
    }
    updateMap();
    syncDungeonMapMusic();
    saveGameProgressIfPossible('update-ui');
}

function getMonsterPortraitPath(monster) {
    if (!monster || !monster.name) {
        return '';
    }
    if (typeof monster.image === 'string' && monster.image) {
        return monster.image;
    }
    if (typeof monster.isShaman === 'function' && monster.isShaman()) {
        return MONSTER_PORTRAITS.Shaman;
    }
    return MONSTER_PORTRAITS[monster.name] || '';
}

function getRandomIntInclusive(minValue, maxValue) {
    const min = Math.floor(Math.min(minValue, maxValue));
    const max = Math.floor(Math.max(minValue, maxValue));
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomEntry(entries, fallbackValue = '') {
    if (!Array.isArray(entries) || entries.length === 0) {
        return fallbackValue;
    }
    const index = Math.floor(Math.random() * entries.length);
    return entries[index];
}

function buildBossRelicItem(bossType) {
    const definition = BOSS_RELIC_DEFINITIONS[bossType];
    if (!definition) {
        return null;
    }

    const item = {
        name: pickRandomEntry(definition.names, `Relique de ${bossType}`),
        type: definition.type || 'ring',
        rarity: definition.rarity || 'rare',
        attackBonus: 0,
        minDamage: 0,
        maxDamage: 0,
        damageBonus: 0,
        defenseBonus: 0,
        strengthBonus: 0,
        intelligenceBonus: 0,
        vitalityBonus: 0,
        perceptionBonus: 0,
        magicBonus: 0,
        physicalResistanceBonus: 0,
        magicResistanceBonus: 0,
        fireResistanceBonus: 0,
        iceResistanceBonus: 0,
        poisonResistanceBonus: 0,
        manaRegenBonus: 0,
        excludeFromDropPool: true,
        isBossRelic: true,
        bossTier: Math.max(1, Math.floor(definition.tier || 1)),
        bossKey: bossType
    };

    const guaranteed = definition.guaranteed || {};
    Object.keys(guaranteed).forEach((statKey) => {
        const value = Math.max(0, Math.floor(guaranteed[statKey] || 0));
        if (value <= 0) {
            return;
        }
        if (statKey === 'manaRegenBonus') {
            item.manaRegenBonus += value;
            return;
        }
        const field = BOSS_RELIC_STAT_FIELDS[statKey];
        if (field && typeof item[field] === 'number') {
            item[field] += value;
            return;
        }
        const resistanceField = BOSS_RELIC_RESISTANCE_FIELDS[statKey];
        if (resistanceField && typeof item[resistanceField] === 'number') {
            item[resistanceField] += value;
        }
    });

    const randomRanges = Array.isArray(definition.randomRanges) ? definition.randomRanges : [];
    randomRanges.forEach((range) => {
        if (!range || typeof range !== 'object') {
            return;
        }
        const roll = getRandomIntInclusive(Number(range.min || 0), Number(range.max || 0));
        if (roll <= 0) {
            return;
        }
        if (range.stat === 'manaRegenBonus') {
            item.manaRegenBonus += roll;
            return;
        }
        const field = BOSS_RELIC_STAT_FIELDS[range.stat];
        if (field && typeof item[field] === 'number') {
            item[field] += roll;
            return;
        }
        const resistanceField = BOSS_RELIC_RESISTANCE_FIELDS[range.stat];
        if (resistanceField && typeof item[resistanceField] === 'number') {
            item[resistanceField] += roll;
        }
    });

    return item;
}

function getBossTypeForEncounter(room, defeatedMonsters) {
    if (!Array.isArray(defeatedMonsters) || defeatedMonsters.length === 0) {
        return '';
    }

    const roomForcedType = room && typeof room.forcedMonsterType === 'string' ? room.forcedMonsterType : '';
    if (roomForcedType && BOSS_RELIC_DEFINITIONS[roomForcedType]) {
        const hasMatchingDefeatedMonster = defeatedMonsters.some((monster) => monster && monster.monsterType === roomForcedType);
        if (hasMatchingDefeatedMonster) {
            return roomForcedType;
        }
    }

    let selectedBossType = '';
    let selectedTier = -1;
    Object.keys(BOSS_RELIC_DEFINITIONS).forEach((bossType) => {
        const hasBossMonster = defeatedMonsters.some((monster) => monster && monster.monsterType === bossType);
        if (!hasBossMonster) {
            return;
        }
        const tier = Math.max(0, Math.floor(BOSS_RELIC_DEFINITIONS[bossType].tier || 0));
        if (tier > selectedTier) {
            selectedTier = tier;
            selectedBossType = bossType;
        }
    });
    return selectedBossType;
}

function grantBossRelicLoot(room, defeatedMonsters) {
    if (typeof addGeneratedItemToPartyInventory !== 'function') {
        return null;
    }

    const bossType = getBossTypeForEncounter(room, defeatedMonsters);
    if (!bossType) {
        return null;
    }

    const relicItem = buildBossRelicItem(bossType);
    if (!relicItem) {
        return null;
    }

    const addedRelic = addGeneratedItemToPartyInventory(relicItem, { idPrefix: `boss_${bossType}_relic` });
    if (!addedRelic) {
        return null;
    }

    const rarityLabels = {
        common: 'Commun',
        rare: 'Rare',
        epic: 'Epique'
    };
    const rarityLabel = rarityLabels[addedRelic.rarity] || 'Rare';
    const relicName = typeof formatItemNameWithBonuses === 'function'
        ? formatItemNameWithBonuses(addedRelic)
        : addedRelic.name;
    logMessage(`Relique de boss obtenue: [${rarityLabel}] ${relicName}.`);
    return addedRelic;
}

function getCharacterPortraitPath(character) {
    if (!character || !character.classType) {
        return '';
    }
    if (typeof CHARACTER_PORTRAITS !== 'undefined' && CHARACTER_PORTRAITS[character.classType]) {
        return CHARACTER_PORTRAITS[character.classType];
    }
    return '';
}

function queueDamageFlash(entity, damageAmount = 0) {
    if (!entity || !entity.entityId || !entity.entityType) {
        return;
    }
    const buckets = entity.entityType === 'character'
        ? { highlights: pendingDamageHighlights.characters, values: pendingDamageValues.characters }
        : entity.entityType === 'monster'
            ? { highlights: pendingDamageHighlights.monsters, values: pendingDamageValues.monsters }
            : entity.entityType === 'summon'
                ? { highlights: pendingDamageHighlights.summons, values: pendingDamageValues.summons }
            : null;
    if (!buckets) {
        return;
    }

    buckets.highlights.add(entity.entityId);
    const normalizedDamage = Math.max(0, Math.floor(damageAmount || 0));
    if (normalizedDamage > 0) {
        const previousDamage = buckets.values.get(entity.entityId) || 0;
        buckets.values.set(entity.entityId, previousDamage + normalizedDamage);
    }
}

function consumeDamageEvent(entity) {
    if (!entity || !entity.entityId || !entity.entityType) {
        return { shouldAnimate: false, damageAmount: 0 };
    }
    const buckets = entity.entityType === 'character'
        ? { highlights: pendingDamageHighlights.characters, values: pendingDamageValues.characters }
        : entity.entityType === 'monster'
            ? { highlights: pendingDamageHighlights.monsters, values: pendingDamageValues.monsters }
            : entity.entityType === 'summon'
                ? { highlights: pendingDamageHighlights.summons, values: pendingDamageValues.summons }
            : null;

    if (!buckets) {
        return { shouldAnimate: false, damageAmount: 0 };
    }

    const shouldAnimate = buckets.highlights.has(entity.entityId);
    if (shouldAnimate) {
        buckets.highlights.delete(entity.entityId);
    }

    const damageAmount = buckets.values.get(entity.entityId) || 0;
    if (damageAmount > 0) {
        buckets.values.delete(entity.entityId);
    }

    return { shouldAnimate, damageAmount };
}

function clearDamageFlashQueue() {
    pendingDamageHighlights.characters.clear();
    pendingDamageHighlights.monsters.clear();
    pendingDamageHighlights.summons.clear();
    pendingDamageValues.characters.clear();
    pendingDamageValues.monsters.clear();
    pendingDamageValues.summons.clear();
}

function clearMonsterTurnTimeout() {
    if (monsterTurnTimeoutId !== null) {
        clearTimeout(monsterTurnTimeoutId);
        monsterTurnTimeoutId = null;
    }
}

function hasAliveMonsters() {
    return currentMonsters.some((monster) => monster.isAlive());
}

function handleMonsterDefeatPassiveEffects(defeatedMonster) {
    if (!defeatedMonster || !Array.isArray(characters) || characters.length === 0) {
        return;
    }

    const defeatedMonsterName = typeof defeatedMonster.name === 'string' && defeatedMonster.name.length > 0
        ? defeatedMonster.name
        : 'un monstre';

    characters.forEach((character) => {
        if (
            !character
            || character.classType !== 'Necromancer'
            || typeof character.isAlive !== 'function'
            || !character.isAlive()
            || typeof character.getPassiveRank !== 'function'
            || character.getPassiveRank(NECRO_SOUL_THEFT_PASSIVE_ID) <= 0
        ) {
            return;
        }

        const maxHealth = Math.max(1, Math.floor(Number(character.maxHealth) || 1));
        const maxMana = Math.max(0, Math.floor(Number(character.maxMana) || 0));
        const beforeHealth = Math.max(0, Math.floor(Number(character.health) || 0));
        const beforeMana = Math.max(0, Math.floor(Number(character.mana) || 0));

        character.health = Math.min(maxHealth, beforeHealth + NECRO_SOUL_THEFT_HEALTH_GAIN);
        character.mana = Math.min(maxMana, beforeMana + NECRO_SOUL_THEFT_MANA_GAIN);

        const restoredHealth = Math.max(0, character.health - beforeHealth);
        const restoredMana = Math.max(0, character.mana - beforeMana);
        if (restoredHealth <= 0 && restoredMana <= 0) {
            return;
        }

        logMessage(
            `${character.name} vole l ame de ${defeatedMonsterName} et recupere ${restoredHealth} PV et ${restoredMana} mana.`
        );
    });
}

function resolveMonsterDeathSplits() {
    if (!Array.isArray(currentMonsters) || currentMonsters.length === 0) {
        return false;
    }

    let spawnedAny = false;
    currentMonsters.forEach((monster) => {
        if (!monster || typeof monster.getDeathSplitChildren !== 'function') {
            return;
        }

        const childOverridesList = monster.getDeathSplitChildren();
        if (!Array.isArray(childOverridesList) || childOverridesList.length === 0) {
            return;
        }

        const forcedChildType = monster.monsterType
            || ((typeof monster.isGreenSlime === 'function' && monster.isGreenSlime()) ? 'green_slime' : null);
        if (!forcedChildType) {
            return;
        }

        let spawnedCount = 0;
        childOverridesList.forEach((childOverrides) => {
            const childMonster = createMonster(forcedChildType, childOverrides || {});
            if (registerSummonedMonster(childMonster)) {
                spawnedCount += 1;
            }
        });

        if (spawnedCount > 0) {
            spawnedAny = true;
            const canSplitAgain = childOverridesList.some((entry) => Math.max(0, Math.floor(entry.splitRemainingGenerations || 0)) > 0);
            const splitSuffix = canSplitAgain ? ' Elles pourront encore se diviser.' : '';
            logMessage(`${monster.name} se divise en ${spawnedCount} slimes !${splitSuffix}`);
        }
    });

    return spawnedAny;
}

function getEntityInitiativeBase(entity) {
    if (!entity) {
        return 10;
    }
    if (entity.entityType === 'character') {
        return INITIATIVE_BASE.classes[entity.classType] || 10;
    }
    if (entity.entityType === 'monster') {
        if (typeof entity.isShaman === 'function' && entity.isShaman()) {
            return INITIATIVE_BASE.monsters.Shaman;
        }
        return INITIATIVE_BASE.monsters[entity.name] || 9;
    }
    if (entity.entityType === 'summon') {
        return 12;
    }
    return 10;
}

function rollInitiative(entity) {
    return getEntityInitiativeBase(entity) + Math.floor(Math.random() * 10) + 1;
}

function buildCombatTurnOrder() {
    const participants = [
        ...getAliveCharacters(),
        ...getAliveSummonedAllies(),
        ...currentMonsters.filter((monster) => monster.isAlive())
    ];

    participants.forEach((entity) => {
        entity.combatInitiative = rollInitiative(entity);
    });

    participants.sort((a, b) => {
        if (b.combatInitiative !== a.combatInitiative) {
            return b.combatInitiative - a.combatInitiative;
        }
        if (a.entityType !== b.entityType) {
            return a.entityType === 'character' ? -1 : 1;
        }
        return a.entityId.localeCompare(b.entityId);
    });

    combatTurnOrder = participants;
    combatTurnCursor = 0;
}

function getActiveCombatEntity() {
    if (!combatTurnOrder.length) {
        return null;
    }

    for (let i = 0; i < combatTurnOrder.length; i++) {
        const idx = (combatTurnCursor + i) % combatTurnOrder.length;
        const entity = combatTurnOrder[idx];
        if (entity && entity.isAlive()) {
            combatTurnCursor = idx;
            return entity;
        }
    }
    return null;
}

function moveToNextCombatTurn() {
    if (!combatTurnOrder.length) {
        return;
    }
    combatTurnCursor = (combatTurnCursor + 1) % combatTurnOrder.length;
}

function getTurnOrderPreview() {
    const ordered = [];
    if (!combatTurnOrder.length) {
        return ordered;
    }
    for (let i = 0; i < combatTurnOrder.length; i++) {
        const idx = (combatTurnCursor + i) % combatTurnOrder.length;
        const entity = combatTurnOrder[idx];
        if (entity && entity.isAlive()) {
            ordered.push(entity);
        }
    }
    return ordered;
}

function getEntityPortraitPath(entity) {
    if (!entity) {
        return '';
    }
    if (entity.entityType === 'character') {
        return getCharacterPortraitPath(entity);
    }
    if (entity.entityType === 'monster') {
        return getMonsterPortraitPath(entity);
    }
    if (entity.entityType === 'summon') {
        return typeof entity.image === 'string' ? entity.image : '';
    }
    return '';
}

function renderCombatTurnOrder(activeEntity) {
    const list = document.getElementById('combat-turn-order-list');
    if (!list) {
        return;
    }

    const preview = getTurnOrderPreview();
    list.innerHTML = '';
    if (!preview.length) {
        list.innerHTML = '<div class="turn-order-empty">Aucun combattant</div>';
        return;
    }

    preview.forEach((entity) => {
        const row = document.createElement('div');
        row.className = `turn-order-item turn-order-${entity.entityType}`;
        if (entity === activeEntity) {
            row.classList.add('active');
        }

        const portraitPath = getEntityPortraitPath(entity);
        const initiative = typeof entity.combatInitiative === 'number' ? entity.combatInitiative : '-';
        row.innerHTML = `
            ${portraitPath ? `<img class="turn-order-portrait" src="${portraitPath}" alt="${entity.name}">` : ''}
            <div class="turn-order-meta">
                <div class="turn-order-name">${entity.name}</div>
                <div class="turn-order-initiative">Init ${initiative}</div>
            </div>
        `;
        list.appendChild(row);
    });
}

window.queueDamageFlash = queueDamageFlash;
window.summonSkeletonForCharacter = summonSkeletonForCharacter;
window.summonTotemForCharacter = summonTotemForCharacter;
window.summonDeathTotemForCharacter = summonDeathTotemForCharacter;
window.handleMonsterDefeatPassiveEffects = handleMonsterDefeatPassiveEffects;
window.playSoundEffect = function playSoundEffect(effectKey, options = {}) {
    const baseAudio = soundEffectBank[effectKey];
    if (!baseAudio) {
        return;
    }
    const volume = typeof options.volume === 'number' ? options.volume : 0.8;
    const soundClone = baseAudio.cloneNode();
    soundClone.volume = Math.max(0, Math.min(1, volume));
    const playPromise = soundClone.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Ignore autoplay or transient playback errors.
        });
    }
};
window.playRandomSwordHit = function playRandomSwordHit(options = {}) {
    if (!SWORD_HIT_EFFECT_KEYS.length) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * SWORD_HIT_EFFECT_KEYS.length);
    const effectKey = SWORD_HIT_EFFECT_KEYS[randomIndex];
    window.playSoundEffect(effectKey, options);
};
window.playRandomSpellCast = function playRandomSpellCast(options = {}) {
    if (!SPELL_CAST_EFFECT_KEYS.length) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * SPELL_CAST_EFFECT_KEYS.length);
    const effectKey = SPELL_CAST_EFFECT_KEYS[randomIndex];
    window.playSoundEffect(effectKey, options);
};

function getRestButtonLabel() {
    const rationWord = availableRestRations > 1 ? 'rations' : 'ration';
    return `Se Reposer (${availableRestRations} ${rationWord})`;
}

function configureMainScreenIconButtons() {
    const iconButtonConfigs = [
        { id: 'move-up', hint: 'Deplacement vers le haut' },
        { id: 'move-down', hint: 'Deplacement vers le bas' },
        { id: 'move-left', hint: 'Deplacement vers la gauche' },
        { id: 'move-right', hint: 'Deplacement vers la droite' },
        { id: 'open-bestiary', hint: 'Ouvrir le bestiaire' },
        { id: 'rest', hint: 'Se reposer' }
    ];
    iconButtonConfigs.forEach((config) => {
        const button = document.getElementById(config.id);
        if (!button) {
            return;
        }
        button.classList.add('main-ui-icon-btn');
        button.title = config.hint;
        button.setAttribute('aria-label', config.hint);
    });
}

function updateRestButton() {
    const restButton = document.getElementById('rest');
    if (!restButton) {
        return;
    }
    const restLabel = getRestButtonLabel();
    restButton.style.display = 'block';
    restButton.textContent = restLabel;
    restButton.dataset.rations = String(Math.max(0, availableRestRations));
    restButton.title = availableRestRations > 0
        ? `${restLabel} - Utiliser 1 ration pour restaurer le groupe.`
        : `${restLabel} - Aucune ration disponible.`;
    restButton.setAttribute('aria-label', restLabel);
}

function updateStairsButton(room) {
    const stairsButton = document.getElementById('climb-stairs');
    if (room.hasStairs) {
        stairsButton.style.display = 'block';
    } else {
        stairsButton.style.display = 'none';
    }
}

function startCombat() {
    if (isGameOver) {
        return;
    }
    inCombat = true;
    prepareCombatMusicForNewFight();
    clearDamageFlashQueue();
    clearMonsterTurnTimeout();
    buildCombatTurnOrder();
    setMovementEnabled(false);
    document.getElementById('combat-modal').style.display = 'flex';
    syncDungeonMapMusic();
    // Clear previous combat modal log so old combat messages don't remain
    const combatLog = document.getElementById('combat-modal-log');
    if (combatLog) combatLog.innerHTML = '';
    logMessage('Combat au tour par tour commence.');
    const initiativeSummary = combatTurnOrder
        .map((entity) => `${entity.name}(${entity.combatInitiative})`)
        .join(' > ');
    logMessage(`Ordre d initiative: ${initiativeSummary}`);
    
    // Call immediately
    advanceCombatFlow();
}

function endCombat() {
    inCombat = false;
    stopCombatMusic();
    characters.forEach((char) => {
        if (char && typeof char.resetSkillCooldownsAfterCombat === 'function') {
            char.resetSkillCooldownsAfterCombat();
        }
    });
    currentMonsters = [];
    summonedAllies = [];
    combatTurnOrder = [];
    combatTurnCursor = 0;
    clearDamageFlashQueue();
    clearMonsterTurnTimeout();
    setMovementEnabled(true);
    document.getElementById('combat-modal').style.display = 'none';
    updateCharacterUI();
    syncDungeonMapMusic();
    checkLevelUps();
    saveGameProgressIfPossible('end-combat');
}

function triggerGameOver() {
    if (isGameOver) {
        return;
    }

    isGameOver = true;
    hasGameStarted = false;
    inCombat = false;
    stopCombatMusic();
    chestEventActive = false;
    currentMonsters = [];
    summonedAllies = [];
    combatTurnOrder = [];
    combatTurnCursor = 0;
    clearDamageFlashQueue();
    clearMonsterTurnTimeout();
    setMovementEnabled(false);

    const restButton = document.getElementById('rest');
    if (restButton) {
        restButton.disabled = true;
    }

    const combatModal = document.getElementById('combat-modal');
    if (combatModal) {
        combatModal.style.display = 'none';
    }
    const chestModal = document.getElementById('chest-modal');
    if (chestModal) {
        chestModal.style.display = 'none';
    }
    const levelUpModal = document.getElementById('level-up-modal');
    if (levelUpModal) {
        levelUpModal.style.display = 'none';
    }
    const inventoryModal = document.getElementById('inventory-modal');
    if (inventoryModal) {
        inventoryModal.style.display = 'none';
    }

    logMessage('Tous les personnages sont morts! La partie est terminee.');

    const gameOverModal = document.getElementById('game-over-modal');
    if (gameOverModal) {
        gameOverModal.style.display = 'flex';
    }
    syncDungeonMapMusic();
    clearSavedGameProgress();
}

function checkLevelUps() {
    const levelingChars = characters.filter(c => c.pendingLevelUp);
    if (levelingChars.length > 0) {
        showLevelUpModal(levelingChars[0]);
    }
}

function showLevelUpModal(char) {
    const modal = document.getElementById('level-up-modal');
    const info = document.getElementById('level-up-info');
    const choices = document.getElementById('level-up-choices');
    const pointsToSpend = typeof char.getCurrentLevelUpStatPointBudget === 'function'
        ? Math.max(0, Math.floor(char.getCurrentLevelUpStatPointBudget() || 0))
        : Math.max(0, Math.floor(char.unspentStatPoints || 0));
    if (pointsToSpend <= 0) {
        char.pendingLevelUp = false;
        checkLevelUps();
        return;
    }
    const pendingLevelUpSteps = typeof char.getPendingLevelUpStepCount === 'function'
        ? Math.max(1, Math.floor(char.getPendingLevelUpStepCount() || 1))
        : 1;
    const displayedLevel = typeof char.getCurrentLevelUpStepLevel === 'function'
        ? Math.max(1, Math.floor(char.getCurrentLevelUpStepLevel() || char.level))
        : char.level;

    const progressionType = typeof char.getLevelUpProgressionType === 'function'
        ? char.getLevelUpProgressionType()
        : (char.level % 2 === 0 ? 'passive' : 'skill');
    const progressionChoices = typeof char.getAvailableLevelUpChoices === 'function'
        ? char.getAvailableLevelUpChoices()
        : [];
    const progressionLabel = progressionType === 'passive' ? 'passif' : 'skill';
    const progressionRuleText = progressionType === 'passive'
        ? 'Niveau pair: choisissez un passif (ou son amelioration).'
        : 'Niveau impair: choisissez un skill (ou son amelioration).';
    const multiStepText = pendingLevelUpSteps > 1
        ? ` Il reste ${pendingLevelUpSteps} montées de niveau a traiter.`
        : '';
    info.textContent = `${char.name} (${char.classType}) - niveau ${displayedLevel}. Distribuez ${pointsToSpend} points de statistiques. ${progressionRuleText}${multiStepText}`;
    choices.innerHTML = '';

    const statKeys = ['strength', 'intelligence', 'vitality', 'perception', 'magic'];
    const statLabels = {
        strength: 'Force',
        intelligence: 'Intelligence',
        vitality: 'Vitalite',
        perception: 'Perception',
        magic: 'Magie'
    };
    const statDescriptions = {
        strength: '+1% dommages par point',
        intelligence: '+1 mana max par point',
        vitality: '+2 PV max par point',
        perception: '+1% chance de coup critique par point',
        magic: '+0.5% dommages de sorts par point'
    };
    const allocation = {
        strength: 0,
        intelligence: 0,
        vitality: 0,
        perception: 0,
        magic: 0
    };
    const valueNodes = {};
    const plusButtons = {};
    const minusButtons = {};
    let selectedProgressionChoice = null;

    const summary = document.createElement('div');
    summary.className = 'level-up-points-remaining';
    choices.appendChild(summary);

    const statList = document.createElement('div');
    statList.className = 'level-up-stat-list';
    choices.appendChild(statList);

    statKeys.forEach((key) => {
        const row = document.createElement('div');
        row.className = 'level-up-stat-row';

        const label = document.createElement('div');
        label.className = 'level-up-stat-label';
        label.innerHTML = `<strong>${statLabels[key]}</strong><span>${statDescriptions[key]}</span>`;

        const controls = document.createElement('div');
        controls.className = 'level-up-stat-controls';

        const minus = document.createElement('button');
        minus.type = 'button';
        minus.textContent = '-';
        minus.addEventListener('click', () => {
            if (allocation[key] <= 0) {
                return;
            }
            allocation[key] -= 1;
            refreshLevelUpView();
        });

        const value = document.createElement('span');
        value.className = 'level-up-stat-value';
        value.textContent = '0';

        const plus = document.createElement('button');
        plus.type = 'button';
        plus.textContent = '+';
        plus.addEventListener('click', () => {
            const spent = statKeys.reduce((sum, statKey) => sum + allocation[statKey], 0);
            if (spent >= pointsToSpend) {
                return;
            }
            allocation[key] += 1;
            refreshLevelUpView();
        });

        controls.appendChild(minus);
        controls.appendChild(value);
        controls.appendChild(plus);
        row.appendChild(label);
        row.appendChild(controls);
        statList.appendChild(row);

        valueNodes[key] = value;
        plusButtons[key] = plus;
        minusButtons[key] = minus;
    });

    const progressionSection = document.createElement('div');
    progressionSection.className = 'level-up-progression-section';

    const progressionHeading = document.createElement('h3');
    progressionHeading.className = 'level-up-progression-title';
    progressionHeading.textContent = `Choix ${progressionLabel}`;
    progressionSection.appendChild(progressionHeading);

    const progressionSubtitle = document.createElement('p');
    progressionSubtitle.className = 'level-up-progression-subtitle';
    progressionSubtitle.textContent = progressionRuleText;
    progressionSection.appendChild(progressionSubtitle);

    const progressionList = document.createElement('div');
    progressionList.className = 'level-up-progression-list';
    progressionSection.appendChild(progressionList);

    const progressionSelection = document.createElement('div');
    progressionSelection.className = 'level-up-progression-selected';
    progressionSection.appendChild(progressionSelection);

    if (progressionChoices.length === 0) {
        const noChoice = document.createElement('div');
        noChoice.className = 'level-up-progression-empty';
        noChoice.textContent = 'Aucun choix disponible pour ce niveau.';
        progressionList.appendChild(noChoice);
        progressionSelection.textContent = 'Aucun choix requis.';
    } else {
        progressionChoices.forEach((choice) => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'level-up-progression-option';
            const rankText = `Rang ${choice.nextRank}/${choice.maxRank}`;
            const descriptionText = choice.description ? ` - ${choice.description}` : '';
            optionButton.innerHTML = `<strong>${choice.name}</strong> <span>${choice.typeLabel} (${rankText})${descriptionText}</span>`;
            optionButton.addEventListener('click', () => {
                selectedProgressionChoice = {
                    track: choice.track,
                    id: choice.id
                };
                const optionButtons = progressionList.querySelectorAll('.level-up-progression-option');
                optionButtons.forEach((button) => {
                    button.classList.remove('selected');
                });
                optionButton.classList.add('selected');
                progressionSelection.textContent = `Selection: ${choice.name} (${rankText})`;
                refreshLevelUpView();
            });
            progressionList.appendChild(optionButton);
        });
        progressionSelection.textContent = `Selection requise: choisissez un ${progressionLabel}.`;
    }

    choices.appendChild(progressionSection);

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'level-up-confirm';
    confirmButton.textContent = 'Confirmer le niveau';
    confirmButton.addEventListener('click', () => {
        const success = typeof char.completeLevelUp === 'function'
            ? char.completeLevelUp(allocation, selectedProgressionChoice)
            : false;
        if (!success) {
            return;
        }
        modal.style.display = 'none';
        updateCharacterUI();
        if (typeof updateCombatUI === 'function') {
            updateCombatUI();
        }
        saveGameProgressIfPossible('level-up');
        checkLevelUps();
    });
    choices.appendChild(confirmButton);

    function refreshLevelUpView() {
        const spent = statKeys.reduce((sum, statKey) => sum + allocation[statKey], 0);
        const remaining = pointsToSpend - spent;
        summary.textContent = `Points restants: ${remaining}`;
        statKeys.forEach((key) => {
            valueNodes[key].textContent = String(allocation[key]);
            minusButtons[key].disabled = allocation[key] <= 0;
            plusButtons[key].disabled = remaining <= 0;
        });
        const progressionReady = progressionChoices.length === 0 || Boolean(selectedProgressionChoice);
        confirmButton.disabled = remaining !== 0 || !progressionReady;
    }

    refreshLevelUpView();
    modal.style.display = 'flex';
}

function updateCombatUI() {
    const monsterDiv = document.getElementById('combat-modal-monster');
    const centerInfo = document.getElementById('combat-modal-center-info');
    const activeDiv = document.getElementById('combat-modal-active');
    const centerActions = document.getElementById('combat-modal-center-actions');
    const charsDiv = document.getElementById('combat-modal-characters');

    // Ensure modal elements exist before manipulating
    if (!monsterDiv || !centerInfo || !activeDiv || !centerActions || !charsDiv) {
        console.warn('updateCombatUI: some combat modal elements are missing');
        return;
    }

    cleanupDefeatedCombatParticipants();

    // Clear previous content
    monsterDiv.innerHTML = '';
    // keep centerInfo container but clear active area and log
    activeDiv.innerHTML = '';
    const combatLog = document.getElementById('combat-modal-log');
    if (combatLog) {
        // do not clear log here (preserve history) â€” leave content
    }
    centerActions.innerHTML = '';
    setCombatCenterActionsLayout(centerActions, 'list');
    charsDiv.innerHTML = '';

    // Validate combat state
    if (!currentMonsters || currentMonsters.length === 0) {
        monsterDiv.innerHTML = '<p>Pas de monstre</p>';
        return;
    }
    const aliveMonsters = currentMonsters.filter(m => m.isAlive());
    if (aliveMonsters.length === 0) {
        monsterDiv.innerHTML = '<p>Tous les monstres sont morts</p>';
        return;
    }

    const aliveChars = getAliveCharacters();
    if (aliveChars.length === 0) {
        centerInfo.innerHTML = '<p>Tous les personnages sont morts</p>';
        return;
    }

    const activeEntity = getActiveCombatEntity();
    renderCombatTurnOrder(activeEntity);
    if (!activeEntity) {
        activeDiv.innerHTML = '<p>Aucun tour disponible.</p>';
        centerActions.innerHTML = '';
        return;
    }
    const activeChar = activeEntity.entityType === 'character' ? activeEntity : null;
    const activeSummon = activeEntity.entityType === 'summon' ? activeEntity : null;

    // Monster top info â€” list monsters with their index
    monsterDiv.innerHTML = '';
    aliveMonsters.forEach((m, idx) => {
        const md = document.createElement('div');
        md.className = 'combat-monster-row';
        if (m === activeEntity) {
            md.classList.add('active-turn');
        }
        const roleTags = [];
        if (typeof m.isShaman === 'function' && m.isShaman()) {
            roleTags.push('Shaman');
        }
        if (typeof m.isKoboldChief === 'function' && m.isKoboldChief()) {
            roleTags.push('Chef');
        }
        if (typeof m.isKobold === 'function' && m.isKobold()) {
            roleTags.push('Kobold');
        }
        if (typeof m.isSpider === 'function' && m.isSpider()) {
            roleTags.push('Araignee');
        }
        if (typeof m.isSpiderling === 'function' && m.isSpiderling()) {
            roleTags.push('Bebe');
        }
        if (typeof m.isSpiderQueen === 'function' && m.isSpiderQueen()) {
            roleTags.push('Boss');
        }
        const roleText = roleTags.length > 0 ? ` | ${roleTags.join(', ')}` : '';
        const stunText = (typeof m.isStunned === 'function' && m.isStunned()) ? ` | Etourdi: ${m.stunnedTurns} tours` : '';
        const burnText = (typeof m.isBurning === 'function' && m.isBurning()) ? ` | Brulure: ${m.burnTurns} tours` : '';
        const poisonText = (typeof m.isPoisoned === 'function' && m.isPoisoned()) ? ` | Poison: ${m.poisonTurns} tours` : '';
        const markedText = (typeof m.isMarked === 'function' && m.isMarked())
            ? ` | ${typeof m.getMarkedStatusText === 'function' ? m.getMarkedStatusText() : 'Marque'}`
            : '';
        const weakenText = (typeof m.getAttackWeaknessText === 'function' && m.hasAttackWeakness && m.hasAttackWeakness())
            ? ` | ${m.getAttackWeaknessText()}`
            : '';
        const displayedMonsterAttack = typeof m.getCurrentAttack === 'function' ? m.getCurrentAttack() : m.attack;
        const manaText = (typeof m.isShaman === 'function' && m.isShaman() && (m.maxMana || 0) > 0)
            ? ` | Mana: ${m.mana}/${m.maxMana}`
            : '';
        const portraitPath = getMonsterPortraitPath(m);
        const effectTextFallback = portraitPath ? '' : `${stunText}${burnText}${poisonText}${markedText}${weakenText}`;
        const damageEvent = consumeDamageEvent(m);
        const portraitClass = `combat-monster-portrait${damageEvent.shouldAnimate ? ' damage-hit' : ''}`;
        const damageNumberHtml = damageEvent.damageAmount > 0
            ? `<div class="combat-damage-number">-${damageEvent.damageAmount}</div>`
            : '';
        const monsterStatusIconsHtml = buildCombatPortraitStatusIconsHtml(
            getCombatPortraitStatusEntries(m, { treatAsMonster: true })
        );
        const monsterHealthPercent = m.maxHealth > 0 ? Math.max(0, Math.min(100, Math.round((m.health / m.maxHealth) * 100))) : 0;
        md.innerHTML = `
            ${portraitPath ? `
            <div class="combat-portrait-wrap">
                <img class="${portraitClass}" src="${portraitPath}" alt="${m.name}">
                ${damageNumberHtml}
                ${monsterStatusIconsHtml}
            </div>
            ` : ''}
            <div class="combat-monster-details">
                <strong>[${idx + 1}] ${m.name}</strong>${roleText}${effectTextFallback}<br>
                PV: ${m.health}/${m.maxHealth}${manaText} - Att: ${displayedMonsterAttack} Def: ${m.defense}
                <div class="resource-bars compact">
                    <div class="resource-block">
                        <div class="resource-bar"><div class="resource-fill resource-fill-health" style="width: ${monsterHealthPercent}%;"></div></div>
                    </div>
                </div>
            </div>
        `;
        monsterDiv.appendChild(md);
    });

    // Center info + action buttons depend on whose turn it is
    if (!activeChar) {
        if (activeSummon) {
            activeDiv.style.display = 'block';
            activeDiv.innerHTML = `<div><strong>Tour de ${activeEntity.name}</strong><br>L'invocation agit automatiquement...</div>`;
            centerActions.innerHTML = '<button type="button" disabled>Tour de l invocation...</button>';
        } else {
            activeDiv.innerHTML = '';
            activeDiv.style.display = 'none';
            centerActions.innerHTML = '';
        }
    } else {
        activeDiv.innerHTML = '';
        activeDiv.style.display = 'none';
        setCombatCenterActionsLayout(centerActions, 'icon-grid');

        const abilities = activeChar.getAbilities();
        abilities.forEach(action => {
            const btn = document.createElement('button');
            btn.type = 'button';
            let disabledReason = '';

            if (action === 'Assomer' && typeof activeChar.canUseAssomer === 'function' && !activeChar.canUseAssomer()) {
                disabledReason = `Recharge: ${activeChar.assomerCooldownTurns} tours`;
            }

            if (action === 'Provocation' && typeof activeChar.canUseProvocation === 'function' && !activeChar.canUseProvocation()) {
                disabledReason = `Recharge: ${activeChar.coupDeMortCooldownTurns} tours`;
            }

            if (action === 'Backstab' && typeof activeChar.canUseBackstab === 'function' && !activeChar.canUseBackstab()) {
                disabledReason = `Recharge: ${activeChar.backstabCooldownTurns} tours`;
            }

            if (action === 'Attaque ciblee' && typeof activeChar.canUseTargetedShot === 'function' && !activeChar.canUseTargetedShot()) {
                disabledReason = `Recharge: ${activeChar.targetedShotCooldownTurns} tours`;
            }

            if (action === 'Invocation de squelette' && typeof activeChar.canUseSkeletonSummon === 'function' && !activeChar.canUseSkeletonSummon()) {
                disabledReason = `Recharge: ${activeChar.skeletonSummonCooldownTurns} tours`;
            }

            if (
                (action === 'Invocation de totem' || action === 'Invocation de totem de mort')
                && activeChar.classType === 'Druid'
            ) {
                const totemDefinition = action === 'Invocation de totem'
                    ? SUMMON_DEFINITIONS.healing_totem
                    : SUMMON_DEFINITIONS.death_totem;
                const maxPerCaster = Math.max(0, Math.floor(totemDefinition && totemDefinition.maxPerCaster ? totemDefinition.maxPerCaster : 0));
                if (maxPerCaster > 0) {
                    const activeTotems = getActiveSummonCountForCaster(activeChar, totemDefinition.id);
                    if (activeTotems >= maxPerCaster) {
                        disabledReason = 'Totem deja actif';
                    }
                }
            }

            const actionManaCost = getActionManaCost(action);
            if (!disabledReason && actionManaCost > 0 && !hasEnoughManaForAction(activeChar, action)) {
                disabledReason = `Mana requis: ${actionManaCost}`;
            }

            const actionHint = buildCombatActionHint(action, actionManaCost, disabledReason, activeChar);
            const actionIndicator = action === 'Backstab' && typeof activeChar.getBackstabSuccessChance === 'function'
                ? formatRateAsPercent(activeChar.getBackstabSuccessChance(null))
                : '';
            setCombatActionButtonVisual(btn, action, actionHint, actionIndicator);
            if (disabledReason) {
                btn.disabled = true;
                centerActions.appendChild(btn);
                return;
            }

            // Route non-attack actions to their dedicated handlers
            if (action === 'Protection' && activeChar.classType === 'Druid') {
                btn.addEventListener('click', () => showProtectionTargetSelection(activeChar));
            } else if (
                (action === 'Invocation de totem' || action === 'Invocation de totem de mort')
                && activeChar.classType === 'Druid'
            ) {
                btn.addEventListener('click', () => handleCombatAction(action));
            } else if (action === 'Soin de groupe' && activeChar.classType === 'Druid') {
                btn.addEventListener('click', () => handleCombatAction(action));
            } else if (action === 'Garde du fer' || action === 'Evasion' || action === 'Renouveau' || action === 'Provocation') {
                btn.addEventListener('click', () => handleCombatAction(action));
            } else if (action === 'Invocation de squelette' && activeChar.classType === 'Necromancer') {
                btn.addEventListener('click', () => handleCombatAction(action));
            } else if (action === 'Bloquer') {
                btn.addEventListener('click', () => handleCombatAction(action));
            } else if (action === 'Pluie de feu' && activeChar.classType === 'Mage') {
                // AOE spell handled directly
                btn.addEventListener('click', () => castRainOfFire(activeChar));
            } else {
                // Attack-type action: open monster target selection if more than one
                btn.addEventListener('click', () => {
                    if (aliveMonsters.length > 1) {
                        showMonsterTargetSelection(activeChar, action);
                    } else {
                        // single monster -> perform directly
                        const target = aliveMonsters[0];
                        const result = activeChar.performAction(action, target);
                        handleCharacterActionResult(activeChar, result, true);
                    }
                });
            }
            centerActions.appendChild(btn);
        });

        const combatPotions = typeof getCombatPotionsForCharacter === 'function'
            ? getCombatPotionsForCharacter(activeChar)
            : [];
        const potionActionLabel = 'Boire une potion';
        const potionButton = document.createElement('button');
        potionButton.type = 'button';
        const potionHint = combatPotions.length > 0
            ? `${potionActionLabel} - ${combatPotions.length} disponible(s)`
            : `${potionActionLabel} - aucune potion disponible`;
        setCombatActionButtonVisual(potionButton, potionActionLabel, potionHint);
        if (combatPotions.length === 0) {
            potionButton.disabled = true;
        } else {
            potionButton.addEventListener('click', () => showCombatPotionSelection(activeChar));
        }
        centerActions.appendChild(potionButton);
    }

    // Bottom: show all allies stats (personnages + invocations)
    const displayedAllies = [
        ...characters,
        ...getAliveSummonedAllies()
    ];
    displayedAllies.forEach((ally) => {
        const mini = document.createElement('div');
        mini.className = 'character-mini';
        if (ally.entityType === 'summon') {
            mini.classList.add('summoned-ally-mini');
        }
        const portraitPath = getEntityPortraitPath(ally);
        const damageEvent = consumeDamageEvent(ally);
        const hasInfectionTint = typeof ally.isInfected === 'function' && ally.isInfected();
        const portraitClass = `combat-character-portrait${damageEvent.shouldAnimate ? ' damage-hit' : ''}${hasInfectionTint ? ' status-infected' : ''}`;
        const damageNumberHtml = damageEvent.damageAmount > 0
            ? `<div class="combat-damage-number">-${damageEvent.damageAmount}</div>`
            : '';
        const allyStatusIconsHtml = buildCombatPortraitStatusIconsHtml(
            getCombatPortraitStatusEntries(ally, { treatAsMonster: false })
        );
        const healthPercent = ally.maxHealth > 0 ? Math.max(0, Math.min(100, Math.round((ally.health / ally.maxHealth) * 100))) : 0;
        const manaPercent = ally.maxMana > 0 ? Math.max(0, Math.min(100, Math.round((ally.mana / ally.maxMana) * 100))) : 0;
        const resourceBarsHtml = `
            <div class="resource-bars compact">
                <div class="resource-block">
                    <div class="resource-row"><span>PV</span><span>${ally.health}/${ally.maxHealth}</span></div>
                    <div class="resource-bar"><div class="resource-fill resource-fill-health" style="width: ${healthPercent}%;"></div></div>
                </div>
                ${usesManaResource(ally) ? `
                <div class="resource-block">
                    <div class="resource-row"><span>Mana</span><span>${ally.mana}/${ally.maxMana}</span></div>
                    <div class="resource-bar"><div class="resource-fill resource-fill-mana" style="width: ${manaPercent}%;"></div></div>
                </div>
                ` : ''}
            </div>
        `;
        const isActiveTurn = ally === activeEntity;
        if (isActiveTurn) {
            mini.classList.add('active-turn');
        }
        const allyRoleText = ally.entityType === 'summon'
            ? (
                ally.summonType === 'healing_totem' || ally.summonType === 'death_totem'
                    ? `Totem (${ally.ownerName || 'allie'})`
                    : `Invocation (${ally.ownerName || 'allie'})`
            )
            : ally.classType;
        const miniStatuses = [];
        const miniWeaknessText = typeof ally.getAttackWeaknessText === 'function' ? ally.getAttackWeaknessText() : '';
        if (!portraitPath && miniWeaknessText) {
            miniStatuses.push(miniWeaknessText);
        }
        const miniWebText = typeof ally.getWebStatusText === 'function' ? ally.getWebStatusText() : '';
        if (!portraitPath && miniWebText) {
            miniStatuses.push(miniWebText);
        }
        const miniColdNumbText = typeof ally.getColdNumbStatusText === 'function' ? ally.getColdNumbStatusText() : '';
        if (!portraitPath && miniColdNumbText) {
            miniStatuses.push(miniColdNumbText);
        }
        const miniBurnText = typeof ally.getBurnStatusText === 'function' ? ally.getBurnStatusText() : '';
        if (!portraitPath && miniBurnText) {
            miniStatuses.push(miniBurnText);
        }
        const miniInfectionText = typeof ally.getInfectionStatusText === 'function' ? ally.getInfectionStatusText() : '';
        if (!portraitPath && miniInfectionText) {
            miniStatuses.push(miniInfectionText);
        }
        const miniProtectionText = typeof ally.getProtectionStatusText === 'function' ? ally.getProtectionStatusText() : '';
        if (!portraitPath && miniProtectionText) {
            miniStatuses.push(miniProtectionText);
        }
        const miniProvocationText = typeof ally.getProvocationStatusText === 'function' ? ally.getProvocationStatusText() : '';
        if (!portraitPath && miniProvocationText) {
            miniStatuses.push(miniProvocationText);
        }
        const miniStatusHtml = miniStatuses.length > 0
            ? `
            <div class="combat-character-statuses">
                ${miniStatuses.map((statusText) => `<div class="combat-character-status">${statusText}</div>`).join('')}
            </div>
            `
            : '';
        mini.innerHTML = `
            ${portraitPath ? `
            <div class="combat-portrait-wrap">
                <img class="${portraitClass}" src="${portraitPath}" alt="${allyRoleText}">
                ${damageNumberHtml}
                ${allyStatusIconsHtml}
            </div>
            ` : ''}
            <div class="combat-character-summary-row">
                <div class="combat-character-identity">
                    <strong class="combat-character-name">${ally.name}</strong>
                    <div class="combat-character-role">${allyRoleText}</div>
                </div>
                <div class="combat-character-bars">
                    ${resourceBarsHtml}
                </div>
            </div>
            ${miniStatusHtml}
        `;
        if (!ally.isAlive()) {
            mini.style.opacity = '0.5';
        }
        charsDiv.appendChild(mini);
    });

    render();
}

function getAliveCharacters() {
    return characters.filter(c => c.isAlive());
}

function applyCharacterTurnEffects(character) {
    if (!character || typeof character.consumeTurnEffects !== 'function') {
        return;
    }
    const logs = character.consumeTurnEffects();
    logs.forEach((entry) => logMessage(entry));
}

function applyMonsterTurnEffects(monster) {
    if (!monster || typeof monster.consumeTurnEffects !== 'function') {
        return;
    }
    const logs = monster.consumeTurnEffects();
    logs.forEach((entry) => logMessage(entry));
}

function applySummonedAllyTurnEffects(ally) {
    if (!ally || typeof ally.consumeTurnEffects !== 'function') {
        return;
    }
    const logs = ally.consumeTurnEffects();
    logs.forEach((entry) => logMessage(entry));
}

function applyWeaponContactEffectsToSummonedAlly(ally, monster) {
    if (!ally || !monster || !monster.isAlive()) {
        return [];
    }
    const contactMessages = [];

    const contactFireDamage = Math.max(0, Math.floor(monster.weaponContactFireDamage || 0));
    if (contactFireDamage > 0) {
        const fireDamageTaken = ally.takeDamage(contactFireDamage, { damageType: 'fire' });
        contactMessages.push(`${ally.name} subit ${fireDamageTaken} degats de feu`);
    }

    const burnTurns = Math.max(0, Math.floor(monster.weaponContactBurnTurns || 0));
    const burnDamage = Math.max(0, Math.floor(monster.weaponContactBurnDamage || 0));
    if (burnTurns > 0 && burnDamage > 0 && typeof ally.applyBurn === 'function') {
        ally.applyBurn(burnDamage, burnTurns);
        const burnTurnLabel = burnTurns > 1 ? 'tours' : 'tour';
        contactMessages.push(`${ally.name} est brule (${burnTurns} ${burnTurnLabel})`);
    }

    return contactMessages;
}

function performSummonedAllyTurnEntity(ally) {
    if (!ally || !ally.isAlive()) {
        return;
    }

    if (typeof ally.consumeTurnEffects === 'function' && typeof ally.isBurning === 'function' && ally.isBurning()) {
        // Burn damage is handled by consumeTurnEffects below.
    }

    if (ally.summonType === 'healing_totem') {
        const aliveCharacters = getAliveCharacters();
        const healPerTurn = Math.max(1, Math.floor(ally.healPerTurn || 0));
        let totalRestored = 0;
        let healedAny = false;

        aliveCharacters.forEach((character) => {
            const beforeHealth = character.health;
            character.health = Math.min(character.maxHealth, character.health + healPerTurn);
            const restored = Math.max(0, character.health - beforeHealth);
            if (restored > 0) {
                healedAny = true;
                totalRestored += restored;
                logMessage(`${ally.name} soigne ${character.name} de ${restored} PV.`);
            }
        });

        if (!healedAny) {
            logMessage(`${ally.name} diffuse une aura de soin, mais personne n'a besoin de soins.`);
        } else {
            logMessage(`${ally.name} restaure ${totalRestored} PV au groupe.`);
        }

        applySummonedAllyTurnEffects(ally);
        if (!ally.isAlive()) {
            logMessage(`${ally.name} est detruit.`);
        }
        return;
    }

    if (ally.summonType === 'death_totem') {
        const aliveMonsters = currentMonsters.filter((monster) => monster.isAlive());
        const damagePerTurn = Math.max(1, Math.floor(ally.damagePerTurn || 0));
        let totalDamage = 0;

        if (aliveMonsters.length === 0) {
            logMessage(`${ally.name} pulse, mais aucun ennemi n'est present.`);
        } else {
            aliveMonsters.forEach((monster) => {
                const damage = monster.takeDamage(damagePerTurn, { damageType: 'magic' });
                totalDamage += damage;
                logMessage(`${ally.name} frappe ${monster.name} pour ${damage} degats.`);
            });
            logMessage(`${ally.name} inflige ${totalDamage} degats au total.`);
        }

        applySummonedAllyTurnEffects(ally);
        if (!ally.isAlive()) {
            logMessage(`${ally.name} est detruit.`);
        }
        return;
    }

    const aliveMonsters = currentMonsters.filter((monster) => monster.isAlive());
    if (aliveMonsters.length === 0) {
        applySummonedAllyTurnEffects(ally);
        return;
    }

    const target = aliveMonsters[Math.floor(Math.random() * aliveMonsters.length)];
    const rawDamage = Math.max(1, (typeof ally.getCurrentAttack === 'function' ? ally.getCurrentAttack() : ally.attack));
    const damage = target.takeDamage(rawDamage, { damageType: 'physical' });
    const contactMessages = applyWeaponContactEffectsToSummonedAlly(ally, target);
    const contactSuffix = contactMessages.length > 0 ? ` ${contactMessages.join(' et ')}.` : '';
    logMessage(`${ally.name} attaque ${target.name} pour ${damage} degats.${contactSuffix}`);

    applySummonedAllyTurnEffects(ally);
    if (!ally.isAlive()) {
        logMessage(`${ally.name} est detruit.`);
    }
}

function performMonsterTurnEntity(monster) {
    if (!monster || !monster.isAlive()) {
        return;
    }

    if (typeof monster.consumeBurnTurn === 'function') {
        const burnDamage = monster.consumeBurnTurn();
        if (burnDamage > 0) {
            const turnLabel = monster.burnTurns > 1 ? 'tours restants' : 'tour restant';
            if (monster.burnTurns > 0) {
                logMessage(`${monster.name} subit ${burnDamage} degats de brulure (${monster.burnTurns} ${turnLabel}).`);
            } else {
                logMessage(`${monster.name} subit ${burnDamage} degats de brulure.`);
            }
            if (!monster.isAlive()) {
                logMessage(`${monster.name} succombe aux flammes.`);
                return;
            }
        }
    }

    if (typeof monster.consumePoisonTurn === 'function') {
        const poisonDamage = monster.consumePoisonTurn();
        if (poisonDamage > 0) {
            const turnLabel = monster.poisonTurns > 1 ? 'tours restants' : 'tour restant';
            if (monster.poisonTurns > 0) {
                logMessage(`${monster.name} subit ${poisonDamage} degats de poison (${monster.poisonTurns} ${turnLabel}).`);
            } else {
                logMessage(`${monster.name} subit ${poisonDamage} degats de poison.`);
            }
            if (!monster.isAlive()) {
                logMessage(`${monster.name} succombe au poison.`);
                return;
            }
        }
    }

    if (typeof monster.isStunned === 'function' && monster.isStunned()) {
        logMessage(`${monster.name} est etourdi et ne peut pas agir.`);
        if (typeof monster.consumeStunTurn === 'function') {
            monster.consumeStunTurn();
        } else {
            monster.stunnedTurns = Math.max(0, (monster.stunnedTurns || 0) - 1);
        }
        applyMonsterTurnEffects(monster);
        return;
    }

    const aliveChars = getAliveCharacters();
    if (aliveChars.length === 0) {
        return;
    }
    const alliedTargets = getAliveCombatAllies();
    if (alliedTargets.length === 0) {
        return;
    }

    const aliveMonsters = currentMonsters.filter((m) => m.isAlive());
    const usedKoboldChiefAction = (typeof monster.isKoboldChief === 'function' && monster.isKoboldChief())
        ? performKoboldChiefAction(monster, aliveMonsters)
        : false;
    const usedSpiderAction = (typeof monster.isSpider === 'function' && monster.isSpider())
        ? performSpiderAction(monster, aliveMonsters, aliveChars)
        : false;
    const usedShamanAction = (typeof monster.isShaman === 'function' && monster.isShaman())
        ? performShamanAction(monster, aliveMonsters, aliveChars)
        : false;
    const usedSpiderQueenAction = (typeof monster.isSpiderQueen === 'function' && monster.isSpiderQueen())
        ? performSpiderQueenAction(monster, aliveMonsters, alliedTargets, aliveChars)
        : false;
    if (typeof monster.isSpectralKnight === 'function' && monster.isSpectralKnight()) {
        performSpectralKnightAction(monster, aliveChars);
    }

    if (!usedKoboldChiefAction && !usedSpiderAction && !usedShamanAction && !usedSpiderQueenAction) {
        performMonsterBasicAttack(monster, alliedTargets);
    }
    applyMonsterTurnEffects(monster);
}

function advanceCombatFlow() {
    if (!inCombat) {
        return;
    }

    cleanupDefeatedCombatParticipants();

    if (getAliveCharacters().length === 0) {
        triggerGameOver();
        return;
    }

    resolveMonsterDeathSplits();
    if (!hasAliveMonsters()) {
        handleVictory();
        return;
    }

    const activeEntity = getActiveCombatEntity();
    if (!activeEntity) {
        updateCombatUI();
        return;
    }

    if (activeEntity.entityType === 'monster') {
        updateCombatUI();
        if (monsterTurnTimeoutId !== null) {
            return;
        }
        monsterTurnTimeoutId = window.setTimeout(() => {
            monsterTurnTimeoutId = null;
            if (!inCombat) {
                return;
            }
            const currentActiveEntity = getActiveCombatEntity();
            if (currentActiveEntity !== activeEntity) {
                advanceCombatFlow();
                return;
            }

            performMonsterTurnEntity(activeEntity);
            resolveMonsterDeathSplits();
            updateCharacterUI();

            if (getAliveCharacters().length === 0) {
                triggerGameOver();
                return;
            }
            if (!hasAliveMonsters()) {
                handleVictory();
                return;
            }

            moveToNextCombatTurn();
            advanceCombatFlow();
        }, MONSTER_TURN_VISUAL_DELAY_MS);
        return;
    }

    if (activeEntity.entityType === 'summon') {
        updateCombatUI();
        if (monsterTurnTimeoutId !== null) {
            return;
        }
        monsterTurnTimeoutId = window.setTimeout(() => {
            monsterTurnTimeoutId = null;
            if (!inCombat) {
                return;
            }
            const currentActiveEntity = getActiveCombatEntity();
            if (currentActiveEntity !== activeEntity) {
                advanceCombatFlow();
                return;
            }

            performSummonedAllyTurnEntity(activeEntity);
            resolveMonsterDeathSplits();
            updateCharacterUI();

            if (getAliveCharacters().length === 0) {
                triggerGameOver();
                return;
            }
            if (!hasAliveMonsters()) {
                handleVictory();
                return;
            }

            moveToNextCombatTurn();
            advanceCombatFlow();
        }, 450);
        return;
    }

    if (activeEntity.entityType === 'character' && typeof activeEntity.isWebbed === 'function' && activeEntity.isWebbed()) {
        const remainingTurns = typeof activeEntity.consumeWebbedTurn === 'function' ? activeEntity.consumeWebbedTurn() : 0;
        if (remainingTurns > 0) {
            const turnLabel = remainingTurns > 1 ? 'tours restants' : 'tour restant';
            logMessage(`${activeEntity.name} est bloque par une toile et passe son tour (${remainingTurns} ${turnLabel}).`);
        } else {
            logMessage(`${activeEntity.name} est bloque par une toile et passe son tour.`);
        }
        applyCharacterTurnEffects(activeEntity);
        updateCharacterUI();
        render();
        moveToNextCombatTurn();
        advanceCombatFlow();
        return;
    }

    updateCombatUI();
}

function finishCharacterAction(activeChar, shouldCheckVictory) {
    if (activeChar && typeof activeChar.clearCoupDeMortFollowUp === 'function') {
        activeChar.clearCoupDeMortFollowUp();
    }
    if (activeChar && typeof activeChar.clearAssassinationFollowUp === 'function') {
        activeChar.clearAssassinationFollowUp();
    }
    applyCharacterTurnEffects(activeChar);
    resolveMonsterDeathSplits();
    updateCharacterUI();
    render();

    if (!hasAliveMonsters()) {
        handleVictory();
        return;
    }

    moveToNextCombatTurn();
    advanceCombatFlow();
}

function showHealTargetSelection(activeChar) {
    const centerActions = document.getElementById('combat-modal-center-actions');
    const combatLog = document.getElementById('combat-modal-log');
    setCombatCenterActionsLayout(centerActions, 'list');
    centerActions.innerHTML = '';

    // Allow selecting any alive character (including self)
    const possibleTargets = characters.filter(c => c.isAlive());
    possibleTargets.forEach(t => {
        const b = document.createElement('button');
        b.textContent = `${t.name} (${t.health}/${t.maxHealth})`;
        b.addEventListener('click', () => {
            const result = activeChar.performAction('Soin', null, t);
            logMessage(result);
            finishCharacterAction(activeChar, false);
        });
        centerActions.appendChild(b);
    });

    // Add a cancel button to go back to action buttons
    const cancel = document.createElement('button');
    cancel.textContent = 'Annuler';
    cancel.addEventListener('click', () => {
        updateCombatUI();
    });
    centerActions.appendChild(cancel);
}

function showProtectionTargetSelection(activeChar) {
    const centerActions = document.getElementById('combat-modal-center-actions');
    if (!centerActions) {
        return;
    }
    setCombatCenterActionsLayout(centerActions, 'list');
    centerActions.innerHTML = '';

    const possibleTargets = characters.filter((character) => character.isAlive());
    possibleTargets.forEach((targetCharacter) => {
        const button = document.createElement('button');
        const protectionText = (typeof targetCharacter.getProtectionStatusText === 'function' && targetCharacter.getProtectionStatusText())
            ? ` | ${targetCharacter.getProtectionStatusText()}`
            : '';
        button.textContent = `${targetCharacter.name} (${targetCharacter.health}/${targetCharacter.maxHealth})${protectionText}`;
        button.addEventListener('click', () => {
            const result = activeChar.performAction('Protection', null, targetCharacter);
            logMessage(result);
            finishCharacterAction(activeChar, false);
        });
        centerActions.appendChild(button);
    });

    const cancel = document.createElement('button');
    cancel.textContent = 'Annuler';
    cancel.addEventListener('click', () => {
        updateCombatUI();
    });
    centerActions.appendChild(cancel);
}

function showCombatPotionSelection(activeChar) {
    const centerActions = document.getElementById('combat-modal-center-actions');
    if (!centerActions) {
        return;
    }
    setCombatCenterActionsLayout(centerActions, 'list');
    centerActions.innerHTML = '';

    const potions = typeof getCombatPotionsForCharacter === 'function'
        ? getCombatPotionsForCharacter(activeChar)
        : [];

    if (potions.length === 0) {
        const empty = document.createElement('button');
        empty.type = 'button';
        empty.disabled = true;
        empty.textContent = 'Aucune potion disponible';
        centerActions.appendChild(empty);
    }

    potions.forEach((potion) => {
        const potionButton = document.createElement('button');
        potionButton.type = 'button';

        const isHealthPotion = potion.consumableKind === 'health';
        const isManaPotion = potion.consumableKind === 'mana';
        const effectText = isHealthPotion
            ? `+${potion.healAmount} PV`
            : isManaPotion
                ? `+${potion.manaAmount} Mana`
                : '';

        let unavailableReason = '';
        if (isHealthPotion && activeChar.health >= activeChar.maxHealth) {
            unavailableReason = 'PV deja au maximum';
        } else if (isManaPotion && activeChar.mana >= activeChar.maxMana) {
            unavailableReason = 'Mana deja au maximum';
        }

        potionButton.textContent = `${potion.name}${effectText ? ` (${effectText})` : ''} x${potion.quantity}`;
        if (unavailableReason) {
            potionButton.disabled = true;
            potionButton.textContent += ` - ${unavailableReason}`;
        } else {
            potionButton.addEventListener('click', () => {
                if (typeof usePotionInCombat !== 'function') {
                    logMessage('Impossible d utiliser les potions pour le moment.');
                    updateCombatUI();
                    return;
                }
                const result = usePotionInCombat(activeChar, potion.id);
                logMessage(result.message);
                updateCharacterUI();
                if (result.success) {
                    finishCharacterAction(activeChar, false);
                    return;
                }
                updateCombatUI();
            });
        }

        centerActions.appendChild(potionButton);
    });

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Annuler';
    cancel.addEventListener('click', () => updateCombatUI());
    centerActions.appendChild(cancel);
}

function showMonsterTargetSelection(activeChar, action) {
    const centerActions = document.getElementById('combat-modal-center-actions');
    setCombatCenterActionsLayout(centerActions, 'list');
    centerActions.innerHTML = '';
    const aliveMonsters = currentMonsters.filter(m => m.isAlive());
    aliveMonsters.forEach((m, idx) => {
        const b = document.createElement('button');
        b.textContent = `[${idx+1}] ${m.name} (${m.health}/${m.maxHealth})`;
        b.addEventListener('click', () => {
            const result = activeChar.performAction(action, m);
            handleCharacterActionResult(activeChar, result, true);
        });
        centerActions.appendChild(b);
    });
    const cancel = document.createElement('button');
    cancel.textContent = 'Annuler';
    cancel.addEventListener('click', () => updateCombatUI());
    centerActions.appendChild(cancel);
}

function castRainOfFire(activeChar) {
    const aliveMonsters = currentMonsters.filter(m => m.isAlive());
    if (aliveMonsters.length === 0) return;
    if (activeChar.mana < 30) {
        logMessage(`${activeChar.name} n'a pas assez de mana pour Pluie de feu.`);
        return;
    }
    activeChar.mana -= 30;
    if (typeof window.playRandomSpellCast === 'function') {
        window.playRandomSpellCast({ volume: 0.78 });
    }
    const spellDamageScaler = typeof activeChar.scaleSpellDamage === 'function'
        ? activeChar.scaleSpellDamage.bind(activeChar)
        : (value) => value;
    const burnDamagePerTurn = spellDamageScaler(4, 'Pluie de feu');
    const burnTurns = 2;
    // Damage to each monster
    aliveMonsters.forEach(m => {
        const rawDamage = spellDamageScaler(12, 'Pluie de feu');
        const damage = m.takeDamage(rawDamage, { damageType: 'fire' });
        let burnText = '';
        if (
            typeof m.applyBurn === 'function'
            && typeof m.isAlive === 'function'
            && m.isAlive()
        ) {
            m.applyBurn(burnDamagePerTurn, burnTurns);
            burnText = ` et applique Brulure (${burnTurns} tours)`;
        }
        logMessage(`${activeChar.name} lance Pluie de feu sur ${m.name} pour ${damage} degats${burnText}.`);
    });
    finishCharacterAction(activeChar, true);
}

function showCoupDeMortFollowUpTargetSelection(activeChar, aliveMonsters) {
    const centerActions = document.getElementById('combat-modal-center-actions');
    if (!centerActions) {
        return false;
    }
    setCombatCenterActionsLayout(centerActions, 'list');
    centerActions.innerHTML = '';
    const activeDiv = document.getElementById('combat-modal-active-character');
    if (activeDiv) {
        activeDiv.innerHTML = `<div><strong>${activeChar.name}</strong> (${activeChar.classType})<br>Coup de mort: choisissez une nouvelle cible pour l'enchainement.</div>`;
    }

    aliveMonsters.forEach((monster, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `[${index + 1}] ${monster.name} (${monster.health}/${monster.maxHealth})`;
        button.addEventListener('click', () => {
            const result = typeof activeChar.performCoupDeMortFollowUp === 'function'
                ? activeChar.performCoupDeMortFollowUp(monster)
                : `${activeChar.name} ne peut pas enchainer ce coup.`;
            handleCharacterActionResult(activeChar, result, true);
        });
        centerActions.appendChild(button);
    });
    return true;
}

function tryHandleCoupDeMortFollowUp(activeChar) {
    if (!activeChar || typeof activeChar.hasPendingCoupDeMortFollowUp !== 'function' || !activeChar.hasPendingCoupDeMortFollowUp()) {
        return false;
    }
    if (typeof activeChar.isAlive === 'function' && !activeChar.isAlive()) {
        if (typeof activeChar.clearCoupDeMortFollowUp === 'function') {
            activeChar.clearCoupDeMortFollowUp();
        }
        return false;
    }

    const aliveMonsters = currentMonsters.filter((monster) => monster && monster.isAlive());
    if (aliveMonsters.length === 0) {
        if (typeof activeChar.clearCoupDeMortFollowUp === 'function') {
            activeChar.clearCoupDeMortFollowUp();
        }
        return false;
    }

    const shown = showCoupDeMortFollowUpTargetSelection(activeChar, aliveMonsters);
    if (!shown && typeof activeChar.clearCoupDeMortFollowUp === 'function') {
        activeChar.clearCoupDeMortFollowUp();
    }
    return shown;
}

function showAssassinationFollowUpTargetSelection(activeChar, aliveMonsters) {
    const centerActions = document.getElementById('combat-modal-center-actions');
    if (!centerActions) {
        return false;
    }
    setCombatCenterActionsLayout(centerActions, 'list');
    centerActions.innerHTML = '';
    const activeDiv = document.getElementById('combat-modal-active-character');
    if (activeDiv) {
        activeDiv.innerHTML = `<div><strong>${activeChar.name}</strong> (${activeChar.classType})<br>Assasination: choisissez une nouvelle cible.</div>`;
    }

    aliveMonsters.forEach((monster, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `[${index + 1}] ${monster.name} (${monster.health}/${monster.maxHealth})`;
        button.addEventListener('click', () => {
            const result = typeof activeChar.performAssassinationFollowUp === 'function'
                ? activeChar.performAssassinationFollowUp(monster)
                : `${activeChar.name} ne peut pas enchainer Assasination.`;
            handleCharacterActionResult(activeChar, result, true);
        });
        centerActions.appendChild(button);
    });
    return true;
}

function tryHandleAssassinationFollowUp(activeChar) {
    if (!activeChar || typeof activeChar.hasPendingAssassinationFollowUp !== 'function' || !activeChar.hasPendingAssassinationFollowUp()) {
        return false;
    }
    if (typeof activeChar.isAlive === 'function' && !activeChar.isAlive()) {
        if (typeof activeChar.clearAssassinationFollowUp === 'function') {
            activeChar.clearAssassinationFollowUp();
        }
        return false;
    }

    const aliveMonsters = currentMonsters.filter((monster) => monster && monster.isAlive());
    if (aliveMonsters.length === 0) {
        if (typeof activeChar.clearAssassinationFollowUp === 'function') {
            activeChar.clearAssassinationFollowUp();
        }
        return false;
    }

    const shown = showAssassinationFollowUpTargetSelection(activeChar, aliveMonsters);
    if (!shown && typeof activeChar.clearAssassinationFollowUp === 'function') {
        activeChar.clearAssassinationFollowUp();
    }
    return shown;
}

function handleCharacterActionResult(activeChar, actionResult, shouldCheckVictory = true) {
    logMessage(actionResult);

    const hasCoupDeMortFollowUp = Boolean(
        activeChar
        && typeof activeChar.hasPendingCoupDeMortFollowUp === 'function'
        && activeChar.hasPendingCoupDeMortFollowUp()
    );
    const hasAssassinationFollowUp = !hasCoupDeMortFollowUp && Boolean(
        activeChar
        && typeof activeChar.hasPendingAssassinationFollowUp === 'function'
        && activeChar.hasPendingAssassinationFollowUp()
    );

    if (hasCoupDeMortFollowUp || hasAssassinationFollowUp) {
        updateCharacterUI();
        updateCombatUI();

        if (hasCoupDeMortFollowUp && tryHandleCoupDeMortFollowUp(activeChar)) {
            return;
        }
        if (hasAssassinationFollowUp && tryHandleAssassinationFollowUp(activeChar)) {
            return;
        }
    }
    finishCharacterAction(activeChar, shouldCheckVictory);
}

function handleCombatAction(action) {
    const activeEntity = getActiveCombatEntity();
    if (!activeEntity || activeEntity.entityType !== 'character') {
        return;
    }
    const activeChar = activeEntity;

    // If action targets monsters and there are multiple, open selection
    const aliveMonsters = currentMonsters.filter(m => m.isAlive());
    const nonTargetedActions = new Set([
        'Bloquer',
        'Provocation',
        'Invocation de squelette',
        'Invocation de totem',
        'Invocation de totem de mort',
        'Soin de groupe',
        'Protection',
        'Garde du fer',
        'Evasion',
        'Renouveau'
    ]);
    const isAttack = !nonTargetedActions.has(action);
    if (isAttack && aliveMonsters.length > 1) {
        showMonsterTargetSelection(activeChar, action);
        return;
    }

    // If single monster, perform directly
    let target = null;
    if (aliveMonsters.length === 1) target = aliveMonsters[0];

    const result = activeChar.performAction(action, target);
    handleCharacterActionResult(activeChar, result, Boolean(target));
}

function logRiposteOutcome(riposteOutcome) {
    if (!riposteOutcome || typeof riposteOutcome !== 'object') {
        return;
    }
    const defenderName = riposteOutcome.defenderName || 'Le defenseur';
    const attackerName = riposteOutcome.attackerName || 'l agresseur';
    const damage = Math.max(0, Math.floor(Number(riposteOutcome.damage) || 0));
    const criticalText = typeof riposteOutcome.criticalText === 'string' ? riposteOutcome.criticalText : '';
    logMessage(`${defenderName} riposte sur ${attackerName} et inflige ${damage} degats.${criticalText}`);
    if (riposteOutcome.attackerDefeated) {
        logMessage(`${attackerName} succombe a la riposte de ${defenderName}.`);
    }
}

function performMonsterBasicAttack(monster, aliveChars) {
    if (!aliveChars || aliveChars.length === 0) {
        return;
    }
    const attacksPerTurn = Math.max(1, Math.floor(monster.attacksPerTurn || 1));
    for (let hitIndex = 0; hitIndex < attacksPerTurn; hitIndex += 1) {
        if (!monster || !monster.isAlive()) {
            return;
        }
        const availableTargets = aliveChars.filter((entity) => entity.isAlive());
        if (availableTargets.length === 0) {
            return;
        }

        const target = pickMonsterAttackTarget(availableTargets);
        if (!target) {
            return;
        }
        const attackValue = typeof monster.getCurrentAttack === 'function' ? monster.getCurrentAttack() : monster.attack;
        const rawDamage = Math.max(1, attackValue);
        const damageContext = {
            damageType: 'physical',
            attacker: monster,
            enableRiposte: true
        };
        const damage = target.takeDamage(rawDamage, damageContext);
        const hitPrefix = attacksPerTurn > 1 ? ` [Coup ${hitIndex + 1}/${attacksPerTurn}]` : '';
        logMessage(`${monster.name}${hitPrefix} attaque ${target.name} pour ${damage} degats.`);
        logRiposteOutcome(damageContext.riposteOutcome);
        if (!target.isAlive() && target.entityType === 'summon') {
            logMessage(`${target.name} est detruit.`);
        }
        if (!monster.isAlive()) {
            return;
        }
    }
}

function performSpectralKnightAction(spectralKnight, aliveChars) {
    if (!spectralKnight || typeof spectralKnight.isSpectralKnight !== 'function' || !spectralKnight.isSpectralKnight()) {
        return false;
    }

    const deathCryChance = Number.isFinite(spectralKnight.deathCryChance)
        ? Math.max(0, Math.min(1, Number(spectralKnight.deathCryChance)))
        : 0;
    const shouldCastDeathCry = deathCryChance > 0 && Math.random() < deathCryChance;
    const canCastDeathCry = Boolean(
        shouldCastDeathCry
        && typeof spectralKnight.canUseDeathCry === 'function'
        && spectralKnight.canUseDeathCry()
    );

    if (!canCastDeathCry) {
        return false;
    }

    const rawDamage = Math.max(1, Math.floor(spectralKnight.deathCryDamage || 0));
    if (rawDamage <= 0) {
        return false;
    }

    let touchedAnyHero = false;
    aliveChars.forEach((hero) => {
        if (!hero || !hero.isAlive()) {
            return;
        }
        const damage = hero.takeDamage(rawDamage, { damageType: 'magic' });
        touchedAnyHero = true;
        logMessage(`${spectralKnight.name} lance Cri de la mort sur ${hero.name} et inflige ${damage} degats.`);
    });

    if (!touchedAnyHero) {
        return false;
    }
    if (typeof spectralKnight.startDeathCryCooldown === 'function') {
        spectralKnight.startDeathCryCooldown();
    }
    return true;
}

function performSpiderQueenAction(spiderQueen, aliveMonsters, aliveAllies, aliveChars) {
    if (!spiderQueen || typeof spiderQueen.isSpiderQueen !== 'function' || !spiderQueen.isSpiderQueen()) {
        return false;
    }

    const livingHeroes = Array.isArray(aliveChars) ? aliveChars.filter((entity) => entity && entity.isAlive()) : [];
    const livingAllies = Array.isArray(aliveAllies) ? aliveAllies.filter((entity) => entity && entity.isAlive()) : [];
    const livingMonsters = Array.isArray(aliveMonsters) ? aliveMonsters.filter((entity) => entity && entity.isAlive()) : [];
    if (livingAllies.length === 0) {
        return false;
    }

    const pickRandomLivingTarget = (entities) => {
        return pickMonsterAttackTarget(entities);
    };

    const cloudChanceWeight = Number.isFinite(spiderQueen.poisonCloudChance)
        ? Math.max(0, Number(spiderQueen.poisonCloudChance))
        : 0.3;
    const summonChanceWeight = Number.isFinite(spiderQueen.summonChance)
        ? Math.max(0, Number(spiderQueen.summonChance))
        : 0.25;
    const drainChanceWeight = Number.isFinite(spiderQueen.lifeDrainChance)
        ? Math.max(0, Number(spiderQueen.lifeDrainChance))
        : 0.25;
    const canUsePoisonCloud = Boolean(
        livingHeroes.length > 0
        && spiderQueen.poisonCloudDamage > 0
        && typeof spiderQueen.canUsePoisonCloud === 'function'
        && spiderQueen.canUsePoisonCloud()
    );
    const canDrainLife = Boolean(livingAllies.length > 0 && spiderQueen.lifeDrainDamage > 0);
    const summonCount = Math.max(1, Math.floor(spiderQueen.summonCount || 1));
    const summonType = spiderQueen.summonType || 'spiderling';
    const canSummonSpiderling = Boolean(
        summonCount > 0
        && livingMonsters.length + summonCount <= MAX_MONSTERS_IN_COMBAT
        && summonType
    );
    const canVenomBite = livingAllies.length > 0;

    const actionCandidates = [];
    if (canUsePoisonCloud) {
        actionCandidates.push({ key: 'poison_cloud', weight: Math.max(0.01, cloudChanceWeight) });
    }
    if (canSummonSpiderling) {
        actionCandidates.push({ key: 'summon_spiderlings', weight: Math.max(0.01, summonChanceWeight) });
    }
    if (canDrainLife) {
        actionCandidates.push({ key: 'life_drain', weight: Math.max(0.01, drainChanceWeight) });
    }
    if (canVenomBite) {
        actionCandidates.push({ key: 'venom_bite', weight: 1 });
    }
    if (actionCandidates.length === 0) {
        return false;
    }

    let roll = Math.random() * actionCandidates.reduce((sum, candidate) => sum + candidate.weight, 0);
    let selectedAction = actionCandidates[actionCandidates.length - 1].key;
    for (let i = 0; i < actionCandidates.length; i += 1) {
        roll -= actionCandidates[i].weight;
        if (roll <= 0) {
            selectedAction = actionCandidates[i].key;
            break;
        }
    }

    if (selectedAction === 'poison_cloud') {
        const rawCloudDamage = Math.max(1, Math.floor(spiderQueen.poisonCloudDamage || 0));
        const infectionChance = Number.isFinite(spiderQueen.poisonCloudInfectionChance)
            ? Math.max(0, Math.min(1, Number(spiderQueen.poisonCloudInfectionChance)))
            : 0;
        const infectionDamage = Math.max(1, Math.floor(spiderQueen.poisonCloudInfectionDamage || 0));
        const infectionTurns = Math.max(1, Math.floor(spiderQueen.poisonCloudInfectionTurns || 0));
        let touchedAnyHero = false;

        logMessage(`${spiderQueen.name} libere un Nuage de poison sur le groupe !`);
        livingHeroes.forEach((hero) => {
            if (!hero || !hero.isAlive()) {
                return;
            }
            const damage = hero.takeDamage(rawCloudDamage, { damageType: 'poison' });
            touchedAnyHero = true;
            let suffix = '';
            if (infectionChance > 0 && typeof hero.applyInfection === 'function' && Math.random() < infectionChance) {
                hero.applyInfection(infectionDamage, infectionTurns);
                suffix = ` ${hero.name} est infecte (${infectionTurns} tours).`;
            }
            logMessage(`${spiderQueen.name} empoisonne ${hero.name} pour ${damage} degats.${suffix}`);
        });

        if (touchedAnyHero && typeof spiderQueen.startPoisonCloudCooldown === 'function') {
            spiderQueen.startPoisonCloudCooldown();
            return true;
        }
    }

    if (selectedAction === 'summon_spiderlings') {
        let summonedCount = 0;
        for (let i = 0; i < summonCount; i += 1) {
            const spiderling = createMonster(summonType);
            if (registerSummonedMonster(spiderling)) {
                summonedCount += 1;
            }
        }
        if (summonedCount > 0) {
            const label = summonedCount > 1 ? 'bebes araignees' : 'bebe araignee';
            logMessage(`${spiderQueen.name} invoque ${summonedCount} ${label} !`);
            return true;
        }
    }

    if (selectedAction === 'life_drain') {
        const target = pickRandomLivingTarget(livingAllies);
        if (target) {
            const rawDrainDamage = Math.max(1, Math.floor(spiderQueen.lifeDrainDamage || 0));
            const damage = target.takeDamage(rawDrainDamage, { damageType: 'magic' });
            const healRatio = Number.isFinite(spiderQueen.lifeDrainHealRatio)
                ? Math.max(0, Math.min(1, Number(spiderQueen.lifeDrainHealRatio)))
                : 0.6;
            const healAmount = Math.max(1, Math.round(damage * healRatio));
            const beforeHealth = spiderQueen.health;
            spiderQueen.health = Math.min(spiderQueen.maxHealth, spiderQueen.health + healAmount);
            const restored = Math.max(0, spiderQueen.health - beforeHealth);
            logMessage(`${spiderQueen.name} draine ${damage} PV de ${target.name} et recupere ${restored} PV.`);
            if (!target.isAlive() && target.entityType === 'summon') {
                logMessage(`${target.name} est detruit.`);
            }
            return true;
        }
    }

    const biteTarget = pickRandomLivingTarget(livingAllies);
    if (!biteTarget) {
        return false;
    }
    const attackValue = typeof spiderQueen.getCurrentAttack === 'function'
        ? spiderQueen.getCurrentAttack()
        : spiderQueen.attack;
    const biteDamageBonus = Math.max(0, Math.floor(spiderQueen.venomBiteDamageBonus || 0));
    const rawBiteDamage = Math.max(1, attackValue + biteDamageBonus);
    const biteDamageContext = {
        damageType: 'poison',
        attacker: spiderQueen,
        enableRiposte: true
    };
    const biteDamage = biteTarget.takeDamage(rawBiteDamage, biteDamageContext);
    let biteSuffix = '';
    const venomInfectionChance = Number.isFinite(spiderQueen.venomBiteInfectionChance)
        ? Math.max(0, Math.min(1, Number(spiderQueen.venomBiteInfectionChance)))
        : 0;
    const venomInfectionDamage = Math.max(1, Math.floor(spiderQueen.venomBiteInfectionDamage || 0));
    const venomInfectionTurns = Math.max(1, Math.floor(spiderQueen.venomBiteInfectionTurns || 0));
    if (venomInfectionChance > 0 && typeof biteTarget.applyInfection === 'function' && Math.random() < venomInfectionChance) {
        biteTarget.applyInfection(venomInfectionDamage, venomInfectionTurns);
        biteSuffix = ` ${biteTarget.name} est infecte (${venomInfectionTurns} tours).`;
    }
    logMessage(`${spiderQueen.name} utilise Morsure venimeuse sur ${biteTarget.name} et inflige ${biteDamage} degats.${biteSuffix}`);
    logRiposteOutcome(biteDamageContext.riposteOutcome);
    if (!biteTarget.isAlive() && biteTarget.entityType === 'summon') {
        logMessage(`${biteTarget.name} est detruit.`);
    }
    return true;
}

function performKoboldChiefAction(chief, aliveMonsters) {
    if (!chief || typeof chief.isKoboldChief !== 'function' || !chief.isKoboldChief()) {
        return false;
    }

    if (chief.spawnIntervalTurns <= 0) {
        return false;
    }

    chief.spawnCountdownTurns = Math.max(0, (chief.spawnCountdownTurns || chief.spawnIntervalTurns) - 1);
    if (chief.spawnCountdownTurns > 0) {
        return false;
    }

    const summonType = chief.summonType || 'kobold';
    const summonCount = Math.max(1, Math.floor(chief.summonCount || 2));
    const availableSlots = Math.max(0, MAX_MONSTERS_IN_COMBAT - aliveMonsters.length);
    if (availableSlots <= 0) {
        chief.spawnCountdownTurns = chief.spawnIntervalTurns;
        return false;
    }

    const targetSummonCount = Math.min(summonCount, availableSlots);
    let spawnedCount = 0;
    for (let i = 0; i < targetSummonCount; i += 1) {
        const koboldReinforcement = createMonster(summonType);
        if (registerSummonedMonster(koboldReinforcement)) {
            spawnedCount += 1;
        }
    }

    chief.spawnCountdownTurns = chief.spawnIntervalTurns;
    if (spawnedCount <= 0) {
        return false;
    }

    const label = spawnedCount > 1 ? 'kobolds' : 'kobold';
    logMessage(`${chief.name} appelle a l aide et ${spawnedCount} ${label} rejoignent le combat !`);
    return true;
}

function registerSummonedMonster(monster) {
    if (!monster || typeof monster.isAlive !== 'function') {
        return false;
    }
    currentMonsters.push(monster);
    if (inCombat) {
        monster.combatInitiative = rollInitiative(monster);
        combatTurnOrder.push(monster);
    }
    return true;
}

function getMostInjuredMonster(monsters) {
    let target = null;
    let highestMissingHealth = 0;
    monsters.forEach((monster) => {
        const missingHealth = monster.maxHealth - monster.health;
        if (missingHealth > highestMissingHealth) {
            highestMissingHealth = missingHealth;
            target = monster;
        }
    });
    return target;
}

function performShamanAction(shaman, aliveMonsters, aliveChars) {
    const healTarget = getMostInjuredMonster(aliveMonsters);
    const healCost = Math.max(0, Math.floor(shaman.healManaCost || 0));
    const weakenCost = Math.max(0, Math.floor(shaman.weakenManaCost || 0));
    const canSpendMana = (cost) => Math.max(0, Math.floor(shaman.mana || 0)) >= Math.max(0, Math.floor(cost || 0));
    const consumeMana = (cost) => {
        const normalizedCost = Math.max(0, Math.floor(cost || 0));
        if (normalizedCost <= 0) {
            return true;
        }
        if (!canSpendMana(normalizedCost)) {
            return false;
        }
        shaman.mana -= normalizedCost;
        return true;
    };
    const getManaSuffix = () => ((shaman.maxMana || 0) > 0 ? ` (Mana ${shaman.mana}/${shaman.maxMana})` : '');

    const canHeal = Boolean(
        healTarget
        && healTarget.health < healTarget.maxHealth
        && shaman.healPower > 0
        && canSpendMana(healCost)
    );
    const canWeaken = Boolean(
        aliveChars.length > 0
        && shaman.weakenPower > 0
        && shaman.weakenTurns > 0
        && canSpendMana(weakenCost)
    );
    const actionRoll = Math.random();

    if (canHeal && actionRoll < 0.45) {
        if (!consumeMana(healCost)) {
            return false;
        }
        const beforeHealth = healTarget.health;
        healTarget.health = Math.min(healTarget.maxHealth, healTarget.health + shaman.healPower);
        const restored = healTarget.health - beforeHealth;
        if (restored > 0) {
            logMessage(`${shaman.name} soigne ${healTarget.name} de ${restored} PV.${getManaSuffix()}`);
            return true;
        }
    }

    if (canWeaken && actionRoll < 0.85) {
        const target = pickMonsterAttackTarget(aliveChars);
        if (!target) {
            return false;
        }
        if (typeof target.applyAttackWeakness === 'function') {
            if (!consumeMana(weakenCost)) {
                return false;
            }
            target.applyAttackWeakness(shaman.weakenPower, shaman.weakenTurns);
            const weaknessText = typeof target.getAttackWeaknessText === 'function' ? target.getAttackWeaknessText() : '';
            logMessage(`${shaman.name} lance Affaiblissement sur ${target.name}. ${weaknessText}${getManaSuffix()}`);
            return true;
        }
    }

    if (healTarget && healTarget.health < healTarget.maxHealth && shaman.healPower > 0 && consumeMana(healCost)) {
        const beforeHealth = healTarget.health;
        healTarget.health = Math.min(healTarget.maxHealth, healTarget.health + shaman.healPower);
        const restored = healTarget.health - beforeHealth;
        if (restored > 0) {
            logMessage(`${shaman.name} soigne ${healTarget.name} de ${restored} PV.${getManaSuffix()}`);
            return true;
        }
    }

    return false;
}

function performSpiderAction(spider, aliveMonsters, aliveChars) {
    if (!spider || typeof spider.isSpider !== 'function' || !spider.isSpider()) {
        return false;
    }

    if (spider.spawnIntervalTurns > 0) {
        spider.spawnCountdownTurns = Math.max(0, (spider.spawnCountdownTurns || spider.spawnIntervalTurns) - 1);
        if (spider.spawnCountdownTurns <= 0) {
            if (aliveMonsters.length >= MAX_MONSTERS_IN_COMBAT) {
                spider.spawnCountdownTurns = spider.spawnIntervalTurns;
            } else {
                const spiderling = createMonster('spiderling');
                if (registerSummonedMonster(spiderling)) {
                    spider.spawnCountdownTurns = spider.spawnIntervalTurns;
                    logMessage(`${spider.name} pond un Bebe araignee !`);
                    return true;
                }
            }
        }
    }

    const webTargets = aliveChars.filter((character) => !character.isWebbed || !character.isWebbed());
    const targets = webTargets.length > 0 ? webTargets : aliveChars;
    const canUseWeb = spider.webTurns > 0 && targets.length > 0;
    if (canUseWeb && Math.random() < 0.45) {
        const target = pickMonsterAttackTarget(targets);
        if (!target) {
            return false;
        }
        if (typeof target.applyWebbed === 'function') {
            target.applyWebbed(spider.webTurns);
            logMessage(`${spider.name} lance une toile sur ${target.name} et l'immobilise pour ${spider.webTurns} tours.`);
            return true;
        }
    }

    return false;
}

function handleVictory() {
    const defeatedMonsters = [...currentMonsters];
    logMessage(`Tous les monstres sont vaincus!`);
    // Award XP equal to sum of maxHealth of monsters
    const xp = currentMonsters.reduce((s, m) => s + (m.maxHealth || 0), 0);
    const aliveCharacters = getAliveCharacters();
    if (xp > 0 && aliveCharacters.length > 0) {
        logMessage(`Experience gagnee: ${xp} XP par personnage vivant.`);
    }
    aliveCharacters.forEach((char) => {
        char.gainExperience(xp);
        if (xp > 0) {
            logMessage(`${char.name} gagne ${xp} XP.`);
        }
    });
    grantLootFromDefeatedMonsters(defeatedMonsters);
    dungeon.getCurrentRoom().type = 'empty';
    updateCharacterUI();
    updateMap();
    endCombat();
}

function getLootItemDisplayName(item) {
    if (!item) {
        return 'Objet inconnu';
    }
    if (typeof formatItemNameWithBonuses === 'function') {
        return formatItemNameWithBonuses(item);
    }
    return item.name || 'Objet';
}

function addLootItemToParty(baseItem, options = {}) {
    if (!baseItem || typeof baseItem !== 'object') {
        return null;
    }
    const idPrefix = options && typeof options.idPrefix === 'string' ? options.idPrefix : 'loot';
    const canRollElementalWeaponBonus = baseItem.type === 'weapon'
        && typeof maybeCreateElementalWeaponLootItem === 'function'
        && typeof addGeneratedItemToPartyInventory === 'function';

    if (canRollElementalWeaponBonus) {
        const elementalWeapon = maybeCreateElementalWeaponLootItem(baseItem);
        if (elementalWeapon) {
            const generatedItem = addGeneratedItemToPartyInventory(
                {
                    ...elementalWeapon,
                    id: ''
                },
                { idPrefix: `${idPrefix}_${baseItem.id || 'weapon'}_element` }
            );
            if (generatedItem) {
                return generatedItem;
            }
        }
    }

    if (typeof addItemToPartyInventory !== 'function' || !baseItem.id) {
        return null;
    }
    return addItemToPartyInventory(baseItem.id);
}

function grantLootFromDefeatedMonsters(defeatedMonsters) {
    const lootedItems = [];
    const room = typeof dungeon.getCurrentRoom === 'function' ? dungeon.getCurrentRoom() : null;
    const bossRelicLoot = grantBossRelicLoot(room, defeatedMonsters);
    if (bossRelicLoot) {
        lootedItems.push(bossRelicLoot);
    }

    if (typeof getInventoryDropPool !== 'function' || typeof addItemToPartyInventory !== 'function') {
        return;
    }

    const dropPool = getInventoryDropPool();
    if (!dropPool || dropPool.length === 0) {
        return;
    }

    const isPotionItem = (item) => Boolean(
        item
        && item.type === 'consumable'
        && (item.consumableKind === 'health' || item.consumableKind === 'mana')
    );
    const equipmentDropPool = dropPool.filter((item) => !isPotionItem(item));
    const potionDropPool = dropPool.filter((item) => isPotionItem(item));

    const rarityLabels = {
        common: 'Commun',
        rare: 'Rare',
        epic: 'Epique'
    };
    defeatedMonsters.forEach(() => {
        if (equipmentDropPool.length === 0 || Math.random() > MONSTER_DROP_CHANCE) {
            return;
        }
        const randomItem = equipmentDropPool[Math.floor(Math.random() * equipmentDropPool.length)];
        const addedItem = addLootItemToParty(randomItem, { idPrefix: 'monster_loot' });
        if (addedItem) {
            lootedItems.push(addedItem);
        }
    });

    if (potionDropPool.length > 0 && Math.random() < POTION_DROP_CHANCE) {
        const randomPotion = potionDropPool[Math.floor(Math.random() * potionDropPool.length)];
        const addedPotion = addLootItemToParty(randomPotion, { idPrefix: 'monster_potion' });
        if (addedPotion) {
            lootedItems.push(addedPotion);
        }
    }

    if (lootedItems.length === 0) {
        logMessage('Aucun objet trouve sur les monstres.');
        return;
    }

    const groupedLoot = {};
    lootedItems.forEach((item) => {
        const rarity = rarityLabels[item.rarity] || 'Commun';
        const key = `[${rarity}] ${getLootItemDisplayName(item)}`;
        groupedLoot[key] = (groupedLoot[key] || 0) + 1;
    });

    const lootSummary = Object.entries(groupedLoot)
        .map(([itemName, quantity]) => (quantity > 1 ? `${itemName} x${quantity}` : itemName))
        .join(', ');

    logMessage(`Butin recupere: ${lootSummary}.`);
}

function updateMap() {
    const mapDiv = document.getElementById('map');
    const mapTitle = document.getElementById('map-panel-title');
    if (mapTitle) {
        mapTitle.textContent = `Plan de l'etage - Etage ${dungeon.currentFloor + 1}`;
    }
    mapDiv.innerHTML = '';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            const roomDiv = document.createElement('div');
            roomDiv.className = 'room';
            if (x === dungeon.currentRoom.x && y === dungeon.currentRoom.y) {
                roomDiv.classList.add('current');
            }
            const room = dungeon.floors[dungeon.currentFloor][y * 4 + x];
            if (room.hasStairs) {
                roomDiv.classList.add('stairs');
            }
            if (room.type === 'monster') {
                roomDiv.classList.add('monster');
                if (typeof room.monsterCount === 'number' && room.monsterCount > 0) {
                    roomDiv.textContent = String(room.monsterCount);
                }
            }
            if (room.type === 'rest') {
                roomDiv.classList.add('rest');
            }
            mapDiv.appendChild(roomDiv);
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e1e1e');
    gradient.addColorStop(0.6, '#111');
    gradient.addColorStop(1, '#090909');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#2d2d2d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.2);
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.2);
    ctx.lineTo(canvas.width * 0.95, canvas.height * 0.5);
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.8);
    ctx.lineTo(canvas.width * 0.2, canvas.height * 0.8);
    ctx.lineTo(canvas.width * 0.05, canvas.height * 0.5);
    ctx.closePath();
    ctx.stroke();

    const room = dungeon.getCurrentRoom();
    const roomLabels = {
        empty: 'Exploration',
        monster: 'Presence hostile',
        rest: 'Zone de repos'
    };

    ctx.fillStyle = '#d8d8d8';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(roomLabels[room.type] || 'Exploration', 24, canvas.height - 54);

    if (room.hasStairs) {
        ctx.fillStyle = '#f0a04a';
        ctx.font = '20px Arial';
        ctx.fillText('Escalier disponible', 24, canvas.height - 24);
    }

    const aliveMonsters = currentMonsters.filter(m => m.isAlive());
    if (aliveMonsters.length > 0) {
        const m = aliveMonsters[0];
        ctx.fillStyle = '#ff9d7a';
        ctx.font = '18px Arial';
        ctx.fillText(`Monstre: ${m.name} (${m.health}/${m.maxHealth})`, 24, 38);
    }
}

function setMovementEnabled(enabled) {
    document.getElementById('move-up').disabled = !enabled;
    document.getElementById('move-down').disabled = !enabled;
    document.getElementById('move-left').disabled = !enabled;
    document.getElementById('move-right').disabled = !enabled;
    document.getElementById('climb-stairs').disabled = !enabled;
}

function isMovementLocked() {
    const moveUpButton = document.getElementById('move-up');
    return !moveUpButton || moveUpButton.disabled;
}

function getPartyPerceptionScore() {
    const aliveChars = getAliveCharacters();
    if (!aliveChars || aliveChars.length === 0) {
        return 0;
    }

    const totalPerception = aliveChars.reduce((sum, character) => sum + Math.max(0, character.perception || 0), 0);
    const averagePerception = totalPerception / aliveChars.length;
    const bestPerception = aliveChars.reduce((best, character) => Math.max(best, Math.max(0, character.perception || 0)), 0);

    return Math.round((averagePerception + bestPerception) / 2);
}

function getPerceptionDetectionChance() {
    const perceptionScore = getPartyPerceptionScore();
    const rawChance = PERCEPTION_EVENT_BASE_CHANCE + (perceptionScore * PERCEPTION_EVENT_PER_POINT);
    const chance = Math.max(PERCEPTION_EVENT_BASE_CHANCE, Math.min(PERCEPTION_EVENT_MAX_CHANCE, rawChance));
    return { perceptionScore, chance };
}

function getCurrentFloorIndexForEvents() {
    if (!dungeon || typeof dungeon.currentFloor !== 'number') {
        return 0;
    }
    return Math.max(0, Math.floor(dungeon.currentFloor));
}

function hasChestEventBeenDiscoveredOnCurrentFloor() {
    return discoveredChestFloors.has(getCurrentFloorIndexForEvents());
}

function markChestEventDiscoveredOnCurrentFloor() {
    discoveredChestFloors.add(getCurrentFloorIndexForEvents());
}

function getChestModalElements() {
    return {
        modal: document.getElementById('chest-modal'),
        description: document.getElementById('chest-modal-description'),
        options: document.getElementById('chest-modal-options')
    };
}

function restoreMovementAfterChestEvent() {
    if (isGameOver) {
        setMovementEnabled(false);
        return;
    }
    if (inCombat || !hasGameStarted) {
        return;
    }
    if (getAliveCharacters().length <= 0) {
        setMovementEnabled(false);
        return;
    }
    setMovementEnabled(true);
}

function closePerceptionChestModal() {
    const { modal, options, description } = getChestModalElements();
    chestEventActive = false;
    if (modal) {
        modal.style.display = 'none';
    }
    if (options) {
        options.innerHTML = '';
    }
    if (description) {
        description.textContent = '';
    }
    restoreMovementAfterChestEvent();
}

function grantChestLootReward() {
    if (typeof getInventoryDropPool !== 'function' || typeof addItemToPartyInventory !== 'function') {
        return null;
    }

    const dropPool = getInventoryDropPool();
    if (!Array.isArray(dropPool) || dropPool.length === 0) {
        return null;
    }

    const reward = dropPool[Math.floor(Math.random() * dropPool.length)];
    if (!reward || !reward.id) {
        return null;
    }

    return addLootItemToParty(reward, { idPrefix: 'chest_loot' });
}

function getRogueChestOpenChance(rogue) {
    const roguePerception = Math.max(0, Math.floor(rogue && rogue.perception ? rogue.perception : 0));
    const rawChance = CHEST_ROGUE_OPEN_BASE_CHANCE + (roguePerception * CHEST_ROGUE_OPEN_PERCEPTION_BONUS);
    return Math.max(0.2, Math.min(CHEST_ROGUE_OPEN_MAX_CHANCE, rawChance));
}

function finalizeChestResolution() {
    updateCharacterUI();
    render();
    closePerceptionChestModal();
    if (getAliveCharacters().length === 0) {
        triggerGameOver();
        return;
    }
    saveGameProgressIfPossible('chest-resolution');
}

function resolveRogueChestAttempt(rogue, openChance) {
    if (!rogue || !rogue.isAlive()) {
        logMessage('Le voleur n est pas en etat d ouvrir le coffre.');
        finalizeChestResolution();
        return;
    }

    if (Math.random() <= openChance) {
        const addedItem = grantChestLootReward();
        if (addedItem) {
            logMessage(`${rogue.name} crochete le coffre et trouve ${getLootItemDisplayName(addedItem)}.`);
        } else {
            logMessage(`${rogue.name} ouvre le coffre, mais il est vide.`);
        }
    } else {
        logMessage(`${rogue.name} rate le mecanisme. Le coffre se bloque et devient inutilisable.`);
    }

    finalizeChestResolution();
}

function resolveChestBruteForceAttempt(character) {
    if (!character || !character.isAlive()) {
        logMessage('Ce personnage ne peut pas tenter d ouvrir le coffre.');
        finalizeChestResolution();
        return;
    }

    const attemptRoll = Math.random();
    if (attemptRoll < CHEST_BRUTE_FORCE_TRAP_CHANCE) {
        const trapRawDamage = CHEST_BRUTE_FORCE_TRAP_MIN_DAMAGE
            + Math.floor(Math.random() * (CHEST_BRUTE_FORCE_TRAP_MAX_DAMAGE - CHEST_BRUTE_FORCE_TRAP_MIN_DAMAGE + 1));
        const damageTaken = character.takeDamage(trapRawDamage, { damageType: 'physical' });
        logMessage(`${character.name} declenche un piege en forcant le coffre et subit ${damageTaken} degats.`);
        logMessage('Le coffre est casse et ne contient plus rien.');
        finalizeChestResolution();
        return;
    }

    if (attemptRoll < CHEST_BRUTE_FORCE_TRAP_CHANCE + CHEST_BRUTE_FORCE_FAIL_CHANCE) {
        logMessage(`${character.name} force la serrure, mais le mecanisme casse le coffre.`);
        logMessage('Le coffre devient inutilisable.');
        finalizeChestResolution();
        return;
    }

    const addedItem = grantChestLootReward();
    if (addedItem) {
        logMessage(`${character.name} force le coffre et recupere ${getLootItemDisplayName(addedItem)}.`);
    } else {
        logMessage(`${character.name} ouvre le coffre, mais il est vide.`);
    }
    finalizeChestResolution();
}

function openPerceptionChestModal(perceptionScore) {
    const aliveChars = getAliveCharacters();
    if (!aliveChars || aliveChars.length === 0) {
        return;
    }

    const { modal, description, options } = getChestModalElements();
    if (!modal || !description || !options) {
        const fallbackReward = grantChestLootReward();
        if (fallbackReward) {
            logMessage(`Vous ouvrez le coffre et trouvez ${getLootItemDisplayName(fallbackReward)}.`);
            updateCharacterUI();
        } else {
            logMessage('Le coffre est ancien et vide.');
        }
        return;
    }

    chestEventActive = true;
    setMovementEnabled(false);
    modal.style.display = 'flex';
    description.textContent = `Perception (${perceptionScore}) : vous trouvez un coffre cache.`;
    options.innerHTML = '';

    const rogue = aliveChars.find((character) => character.classType === 'Rogue');
    if (rogue) {
        const rogueOpenChance = getRogueChestOpenChance(rogue);
        const rogueButton = document.createElement('button');
        rogueButton.type = 'button';
        rogueButton.textContent = `Ouvrir avec ${rogue.name} (${Math.round(rogueOpenChance * 100)}% de chance)`;
        rogueButton.addEventListener('click', () => resolveRogueChestAttempt(rogue, rogueOpenChance));
        options.appendChild(rogueButton);
    } else {
        const bruteForceHint = document.createElement('p');
        bruteForceHint.textContent = 'Aucun voleur: une tentative forcee est tres risquee.';
        options.appendChild(bruteForceHint);

        aliveChars.forEach((character) => {
            const attemptButton = document.createElement('button');
            attemptButton.type = 'button';
            attemptButton.className = 'chest-danger';
            attemptButton.textContent = `Forcer avec ${character.name}`;
            attemptButton.addEventListener('click', () => resolveChestBruteForceAttempt(character));
            options.appendChild(attemptButton);
        });
    }

    const leaveButton = document.createElement('button');
    leaveButton.type = 'button';
    leaveButton.textContent = 'Laisser le coffre';
    leaveButton.addEventListener('click', () => {
        logMessage('Vous laissez le coffre intact et continuez votre route.');
        closePerceptionChestModal();
    });
    options.appendChild(leaveButton);
}

function triggerPerceptionChestEvent(perceptionScore) {
    markChestEventDiscoveredOnCurrentFloor();
    logMessage(`Perception (${perceptionScore}) : vous reperez un coffre cache.`);
    openPerceptionChestModal(perceptionScore);
}

function triggerPerceptionTrapEvent(perceptionScore) {
    const aliveChars = getAliveCharacters();
    if (!aliveChars || aliveChars.length === 0) {
        return;
    }

    logMessage(`Perception (${perceptionScore}) : vous reperez un piege, mais il se declenche partiellement.`);

    const baseTrapDamage = 10 + Math.floor(Math.random() * 8);
    aliveChars.forEach((character) => {
        const reducedDamage = Math.max(1, Math.round(baseTrapDamage * 0.6));
        const damageTaken = character.takeDamage(reducedDamage, { damageType: 'physical' });
        logMessage(`${character.name} subit ${damageTaken} degats du piege.`);
    });

    updateCharacterUI();
    if (getAliveCharacters().length === 0) {
        triggerGameOver();
    }
}

function rollPerceptionEventOnMove() {
    const room = dungeon.getCurrentRoom();
    if (!room || room.type !== 'empty') {
        return;
    }

    const aliveChars = getAliveCharacters();
    if (!aliveChars || aliveChars.length === 0) {
        return;
    }

    const { perceptionScore, chance } = getPerceptionDetectionChance();
    if (Math.random() > chance) {
        return;
    }

    const chestAlreadyDiscovered = hasChestEventBeenDiscoveredOnCurrentFloor();
    if (!chestAlreadyDiscovered) {
        const eventRoll = Math.random();
        if (eventRoll < PERCEPTION_EVENT_WEIGHTS.chest) {
            triggerPerceptionChestEvent(perceptionScore);
            return;
        }
        triggerPerceptionTrapEvent(perceptionScore);
        return;
    }

    triggerPerceptionTrapEvent(perceptionScore);
}

function tryMoveParty(dx, dy) {
    if (isGameOver) {
        return false;
    }
    if (!hasGameStarted) {
        return false;
    }
    if (chestEventActive) {
        return false;
    }
    if (!dungeon.move(dx, dy)) {
        return false;
    }
    currentMonsters = [];
    summonedAllies = [];
    inCombat = false;
    const destinationRoom = dungeon.getCurrentRoom();
    if (destinationRoom && destinationRoom.type === 'monster') {
        saveGameProgressIfPossible('before-combat-room');
    }
    rollPerceptionEventOnMove();
    if (isGameOver) {
        return true;
    }
    updateUI();
    render();
    return true;
}

function isTypingInInput(target) {
    if (!target) {
        return false;
    }
    const tagName = typeof target.tagName === 'string' ? target.tagName.toUpperCase() : '';
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable;
}

// Event listeners
document.getElementById('move-up').addEventListener('click', () => {
    tryMoveParty(0, -1);
});

document.getElementById('move-down').addEventListener('click', () => {
    tryMoveParty(0, 1);
});

document.getElementById('move-left').addEventListener('click', () => {
    tryMoveParty(-1, 0);
});

document.getElementById('move-right').addEventListener('click', () => {
    tryMoveParty(1, 0);
});

window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || isTypingInInput(event.target) || isMovementLocked()) {
        return;
    }

    let moved = false;
    if (event.key === 'ArrowUp') {
        moved = tryMoveParty(0, -1);
    } else if (event.key === 'ArrowDown') {
        moved = tryMoveParty(0, 1);
    } else if (event.key === 'ArrowLeft') {
        moved = tryMoveParty(-1, 0);
    } else if (event.key === 'ArrowRight') {
        moved = tryMoveParty(1, 0);
    } else {
        return;
    }

    if (moved) {
        event.preventDefault();
    }
});

const openBestiaryButton = document.getElementById('open-bestiary');
if (openBestiaryButton) {
    openBestiaryButton.addEventListener('click', () => {
        const bestiaryTab = window.open('bestiary.html', '_blank');
        if (!bestiaryTab) {
            // Fallback if popups/new tabs are blocked by the browser.
            window.location.href = 'bestiary.html';
        }
    });
}

document.getElementById('climb-stairs').addEventListener('click', () => {
    if (isGameOver) {
        return;
    }
    if (chestEventActive) {
        return;
    }
    if (dungeon.climbStairs()) {
        currentMonsters = [];
        summonedAllies = [];
        updateUI();
        render();
        logMessage('Vous montez Ã  l\'Ã©tage suivant!');
    } else {
        logMessage('Pas d\'escalier ici.');
    }
});

document.getElementById('rest').addEventListener('click', () => {
    if (isGameOver) {
        return;
    }
    if (inCombat) {
        return;
    }
    if (chestEventActive) {
        return;
    }
    if (availableRestRations <= 0) {
        logMessage('Vous n avez plus de ration pour vous reposer.');
        updateRestButton();
        return;
    }

    const confirmUseRation = window.confirm(`Utiliser 1 ration pour vous reposer ?\nRations restantes: ${availableRestRations}`);
    if (!confirmUseRation) {
        return;
    }

    availableRestRations = Math.max(0, availableRestRations - 1);
    characters.forEach(char => {
        char.health = char.maxHealth;
        if (usesManaResource(char)) {
            char.mana = char.maxMana;
        }
        if (typeof char.hasAttackWeakness === 'function' && char.hasAttackWeakness()) {
            char.attackWeakenAmount = 0;
            char.attackWeakenTurns = 0;
        }
        if (typeof char.isColdNumb === 'function' && char.isColdNumb()) {
            char.coldNumbTurns = 0;
            char.coldNumbDamageMultiplier = 1;
            char.coldNumbAppliedThisTurn = false;
        }
        if (typeof char.isBurning === 'function' && char.isBurning()) {
            char.burnDamage = 0;
            char.burnTurns = 0;
            char.burnAppliedThisTurn = false;
        }
        if (typeof char.isInfected === 'function' && char.isInfected()) {
            char.infectionDamage = 0;
            char.infectionTurns = 0;
            char.infectionAppliedThisTurn = false;
        }
        if (typeof char.hasProtectionShield === 'function' && char.hasProtectionShield()) {
            char.protectionShieldValue = 0;
            char.protectionShieldTurns = 0;
            char.protectionShieldAppliedThisTurn = false;
        }
    });
    updateCharacterUI();
    updateRestButton();
    const rationWord = availableRestRations > 1 ? 'rations' : 'ration';
    logMessage(`Vous vous reposez et restaurez votre sante, votre mana et retirez les affaiblissements, brulures, infections et protections temporaires. (${availableRestRations} ${rationWord} restante${availableRestRations > 1 ? 's' : ''})`);
    saveGameProgressIfPossible('rest');
});

// Debug code removed
window.addEventListener('resize', () => {
    resizeCanvasToViewport();
    render();
});

document.addEventListener('visibilitychange', () => {
    syncDungeonMapMusic();
    if (document.hidden) {
        saveGameProgressIfPossible('visibility-hidden');
    }
});

window.addEventListener('pagehide', () => {
    saveGameProgressIfPossible('pagehide');
});

function startGameFromSplash() {
    const splashScreen = document.getElementById('splash-screen');
    const hideSplashScreen = () => {
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
    };

    if (hasSavedGameProgress()) {
        const resumeSavedGame = window.confirm('Une sauvegarde hors combat existe.\nOK: reprendre cette partie\nAnnuler: demarrer une nouvelle partie');
        if (resumeSavedGame) {
            const didLoad = loadSavedGameProgress();
            if (didLoad) {
                hideSplashScreen();
                return;
            }
            clearSavedGameProgress();
        } else {
            clearSavedGameProgress();
        }
    }

    if (selectedPartyClasses.length !== PARTY_SIZE) {
        updateSplashPartySelectionStatus();
        return;
    }

    hideSplashScreen();
    hasGameStarted = true;
    initGame(selectedPartyClasses);
}

function updateSplashPartySelectionStatus() {
    const statusNode = document.getElementById('splash-party-status');
    const continueButton = document.getElementById('splash-continue');
    const selectedCount = selectedPartyClasses.length;
    const hasSave = hasSavedGameProgress();
    const isReady = selectedCount === PARTY_SIZE;
    const canContinue = isReady || hasSave;

    if (continueButton) {
        continueButton.disabled = !canContinue;
        continueButton.textContent = hasSave ? 'Continuer (sauvegarde)' : 'Continuer';
    }

    if (!statusNode) {
        return;
    }

    statusNode.classList.toggle('ready', canContinue);
    if (splashPartySelectionNotice) {
        statusNode.textContent = splashPartySelectionNotice;
        return;
    }
    if (hasSave) {
        statusNode.textContent = 'Sauvegarde detectee: vous pouvez reprendre votre partie.';
        return;
    }
    if (canContinue) {
        statusNode.textContent = `Groupe pret: ${selectedPartyClasses.length}/${PARTY_SIZE}`;
        return;
    }
    statusNode.textContent = `Choisissez ${PARTY_SIZE} personnages (${selectedCount}/${PARTY_SIZE})`;
}

function toggleSplashPartyClass(classKey) {
    const isAlreadySelected = selectedPartyClasses.includes(classKey);
    if (isAlreadySelected) {
        selectedPartyClasses = selectedPartyClasses.filter((selectedKey) => selectedKey !== classKey);
        splashPartySelectionNotice = '';
        renderSplashPartySelection();
        return;
    }

    if (selectedPartyClasses.length >= PARTY_SIZE) {
        splashPartySelectionNotice = `Maximum ${PARTY_SIZE} personnages. Deselectionnez-en un pour changer.`;
        updateSplashPartySelectionStatus();
        return;
    }

    selectedPartyClasses = [...selectedPartyClasses, classKey];
    splashPartySelectionNotice = '';
    renderSplashPartySelection();
}

function renderSplashPartySelection() {
    const selectionContainer = document.getElementById('splash-party-selection');
    if (!selectionContainer) {
        return;
    }

    selectionContainer.innerHTML = '';
    AVAILABLE_PARTY_CLASSES.forEach((classEntry) => {
        const classCard = document.createElement('button');
        classCard.type = 'button';
        classCard.className = 'splash-class-card';
        if (selectedPartyClasses.includes(classEntry.key)) {
            classCard.classList.add('selected');
        }

        const portraitPath = (typeof CHARACTER_PORTRAITS !== 'undefined' && CHARACTER_PORTRAITS[classEntry.key])
            ? CHARACTER_PORTRAITS[classEntry.key]
            : '';
        classCard.innerHTML = `
            ${portraitPath ? `<img class="splash-class-portrait" src="${portraitPath}" alt="${classEntry.label}">` : ''}
            <div class="splash-class-text">
                <strong>${classEntry.label}</strong>
                <span>${classEntry.summary}</span>
            </div>
        `;
        classCard.addEventListener('click', () => toggleSplashPartyClass(classEntry.key));
        selectionContainer.appendChild(classCard);
    });

    updateSplashPartySelectionStatus();
}

const splashContinueButton = document.getElementById('splash-continue');
if (splashContinueButton) {
    splashContinueButton.addEventListener('click', startGameFromSplash);
}

const gameOverRestartButton = document.getElementById('game-over-restart');
if (gameOverRestartButton) {
    gameOverRestartButton.addEventListener('click', () => {
        window.location.reload();
    });
}

configureMainScreenIconButtons();
selectedPartyClasses = sanitizePartyClassSelection(selectedPartyClasses);
renderSplashPartySelection();

const EQUIPMENT_SLOTS = ['weapon', 'offhand', 'ring', 'armor', 'boots'];
const EQUIPMENT_SLOT_LABELS = {
    weapon: 'Arme',
    offhand: 'Main gauche',
    ring: 'Anneau',
    armor: 'Armure',
    boots: 'Bottes',
    consumable: 'Consommable'
};
const ITEM_RARITIES = ['common', 'rare', 'epic'];
const ITEM_RARITY_LABELS = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Epique'
};
const ITEM_RARITY_CLASSES = {
    common: 'rarity-common',
    rare: 'rarity-rare',
    epic: 'rarity-epic'
};
const CHARACTER_PORTRAITS = {
    Warrior: 'Images/Guerrier.png',
    Mage: 'Images/Mage.png',
    Rogue: 'Images/Voleur.png',
    Necromancer: 'Images/Necromancien.png',
    Druid: 'Images/Duide.png'
};
const INVENTORY_ITEM_ICONS = {
    weapon_sword: 'Images/epee.png',
    weapon_dagger: 'Images/Dague.png',
    weapon_staff: 'Images/Baton.png',
    offhand_shield: 'Images/bouclier.png',
    ring: 'Images/anneau.png',
    armor_leather: 'Images/ArmureCuir.png',
    armor_chain: 'Images/CotteDeMaille.png',
    armor_robe: 'Images/Robe.png',
    boots: 'Images/Botte.png',
    potion_health: 'Images/PotionRouge.png',
    potion_mana: 'Images/PotionBleu.png'
};
const MANA_USING_CLASSES = new Set(['Mage', 'Necromancer', 'Druid']);

const partyInventory = [
    { id: 'weapon_iron_sword', name: 'Epee en fer', type: 'weapon', attackBonus: 3, defenseBonus: 0, strengthBonus: 3, rarity: 'common', quantity: 1 },
    { id: 'weapon_thief_dagger', name: 'Dague de voleur', type: 'weapon', attackBonus: 2, defenseBonus: 0, strengthBonus: 2, perceptionBonus: 1, rarity: 'common', quantity: 1 },
    { id: 'weapon_shadow_dagger', name: 'Dague de l ombre', type: 'weapon', attackBonus: 3, defenseBonus: 0, strengthBonus: 2, perceptionBonus: 2, rarity: 'rare', quantity: 1 },
    { id: 'weapon_short_sword_bronze', name: 'Epee courte en bronze', type: 'weapon', attackBonus: 2, defenseBonus: 0, strengthBonus: 2, rarity: 'common', quantity: 1 },
    { id: 'weapon_short_sword_steel', name: 'Epee courte en acier', type: 'weapon', attackBonus: 4, defenseBonus: 0, strengthBonus: 4, perceptionBonus: 1, rarity: 'rare', quantity: 1 },
    { id: 'weapon_oak_staff', name: 'Baton renforce', type: 'weapon', attackBonus: 2, defenseBonus: 1, strengthBonus: 1, intelligenceBonus: 1, magicBonus: 2, rarity: 'rare', quantity: 1 },
    { id: 'ring_guard', name: 'Anneau de garde', type: 'ring', attackBonus: 0, defenseBonus: 1, vitalityBonus: 1, physicalResistanceBonus: 6, rarity: 'common', quantity: 2 },
    { id: 'ring_rage', name: 'Anneau de rage', type: 'ring', attackBonus: 2, defenseBonus: 0, strengthBonus: 2, magicBonus: 1, rarity: 'rare', quantity: 1 },
    { id: 'armor_leather', name: 'Armure de cuir', type: 'armor', attackBonus: 0, defenseBonus: 2, vitalityBonus: 2, rarity: 'common', quantity: 1 },
    { id: 'armor_chain', name: 'Cotte de mailles', type: 'armor', attackBonus: 0, defenseBonus: 4, vitalityBonus: 4, physicalResistanceBonus: 10, rarity: 'epic', quantity: 1 },
    { id: 'shield_guard_rare', name: 'Bouclier de garde', type: 'offhand', defenseBonus: 1, vitalityBonus: 1, physicalResistanceBonus: 14, rarity: 'rare', quantity: 0 },
    { id: 'shield_bastion_epic', name: 'Bouclier bastion', type: 'offhand', defenseBonus: 2, vitalityBonus: 2, physicalResistanceBonus: 20, rarity: 'epic', quantity: 0 },
    { id: 'boots_traveler', name: 'Bottes de voyage', type: 'boots', attackBonus: 0, defenseBonus: 1, vitalityBonus: 1, perceptionBonus: 1, rarity: 'common', quantity: 1 },
    { id: 'boots_scout', name: 'Bottes d eclaireur', type: 'boots', attackBonus: 1, defenseBonus: 1, strengthBonus: 1, perceptionBonus: 2, rarity: 'rare', quantity: 1 },
    { id: 'potion_health', name: 'Potion de vie', type: 'consumable', consumableKind: 'health', healAmount: 35, rarity: 'common', quantity: 3 },
    { id: 'potion_mana', name: 'Potion de mana', type: 'consumable', consumableKind: 'mana', manaAmount: 25, rarity: 'common', quantity: 2 }
];

const STARTING_EQUIPMENT_KITS = {
    Warrior: [
        { id: 'starter_warrior_weapon', name: 'Epee d entrainement', type: 'weapon', attackBonus: 1, defenseBonus: 0, strengthBonus: 1, rarity: 'common' },
        { id: 'starter_warrior_shield', name: 'Bouclier use', type: 'offhand', attackBonus: 0, defenseBonus: 0, physicalResistanceBonus: 10, rarity: 'common' },
        { id: 'starter_warrior_armor', name: 'Tunique de recrue', type: 'armor', attackBonus: 0, defenseBonus: 1, vitalityBonus: 1, rarity: 'common' },
        { id: 'starter_warrior_ring', name: 'Anneau de cuivre', type: 'ring', attackBonus: 0, defenseBonus: 0, rarity: 'common' },
        { id: 'starter_warrior_boots', name: 'Bottes usees', type: 'boots', attackBonus: 0, defenseBonus: 0, rarity: 'common' }
    ],
    Mage: [
        { id: 'starter_mage_weapon', name: 'Baton d apprenti', type: 'weapon', attackBonus: 1, defenseBonus: 0, intelligenceBonus: 1, magicBonus: 1, rarity: 'common' },
        { id: 'starter_mage_armor', name: 'Robe simple', type: 'armor', attackBonus: 0, defenseBonus: 0, rarity: 'common' },
        { id: 'starter_mage_ring', name: 'Anneau arcanique', type: 'ring', attackBonus: 0, defenseBonus: 0, intelligenceBonus: 1, magicBonus: 1, manaRegenBonus: 5, rarity: 'rare' },
        { id: 'starter_mage_boots', name: 'Souliers souples', type: 'boots', attackBonus: 0, defenseBonus: 0, rarity: 'common' }
    ],
    Necromancer: [
        { id: 'starter_necro_weapon', name: 'Baton ossifie', type: 'weapon', attackBonus: 1, defenseBonus: 0, intelligenceBonus: 1, magicBonus: 1, rarity: 'common' },
        { id: 'starter_necro_armor', name: 'Robe sombre', type: 'armor', attackBonus: 0, defenseBonus: 0, vitalityBonus: 1, rarity: 'common' },
        { id: 'starter_necro_ring', name: 'Anneau funebre', type: 'ring', attackBonus: 0, defenseBonus: 0, intelligenceBonus: 1, magicBonus: 1, rarity: 'rare' },
        { id: 'starter_necro_boots', name: 'Bottes de crypte', type: 'boots', attackBonus: 0, defenseBonus: 0, rarity: 'common' }
    ],
    Druid: [
        { id: 'starter_druid_weapon', name: 'Baton de frene', type: 'weapon', attackBonus: 1, defenseBonus: 0, intelligenceBonus: 1, magicBonus: 1, rarity: 'common' },
        { id: 'starter_druid_armor', name: 'Robe de mousse', type: 'armor', attackBonus: 0, defenseBonus: 0, vitalityBonus: 1, rarity: 'common' },
        { id: 'starter_druid_ring', name: 'Anneau des clairieres', type: 'ring', attackBonus: 0, defenseBonus: 0, intelligenceBonus: 1, magicBonus: 1, rarity: 'rare' },
        { id: 'starter_druid_boots', name: 'Bottes de racines', type: 'boots', attackBonus: 0, defenseBonus: 0, rarity: 'common' }
    ],
    Rogue: [
        { id: 'starter_rogue_weapon', name: 'Dague usee', type: 'weapon', attackBonus: 1, defenseBonus: 0, strengthBonus: 1, perceptionBonus: 1, rarity: 'common' },
        { id: 'starter_rogue_armor', name: 'Veste de cuir fin', type: 'armor', attackBonus: 0, defenseBonus: 0, rarity: 'common' },
        { id: 'starter_rogue_ring', name: 'Anneau discret', type: 'ring', attackBonus: 0, defenseBonus: 0, perceptionBonus: 1, rarity: 'common' },
        { id: 'starter_rogue_boots', name: 'Bottes legeres', type: 'boots', attackBonus: 0, defenseBonus: 1, vitalityBonus: 1, perceptionBonus: 1, rarity: 'common' }
    ],
    default: [
        { id: 'starter_generic_weapon', name: 'Arme basique', type: 'weapon', attackBonus: 0, defenseBonus: 0, rarity: 'common' },
        { id: 'starter_generic_armor', name: 'Tenue basique', type: 'armor', attackBonus: 0, defenseBonus: 0, rarity: 'common' },
        { id: 'starter_generic_ring', name: 'Anneau basique', type: 'ring', attackBonus: 0, defenseBonus: 0, rarity: 'common' },
        { id: 'starter_generic_boots', name: 'Bottes basiques', type: 'boots', attackBonus: 0, defenseBonus: 0, rarity: 'common' }
    ]
};

let selectedInventoryCharacterIndex = null;
let selectedInventorySlot = null;
let characterEntityIdCounter = 1;
let generatedInventoryItemCounter = 1;
const MAX_CHARACTER_NAME_LENGTH = 24;
const CLASS_BASE_STATS = {
    Warrior: { health: 100, mana: 50, attack: 9, defense: 5 },
    Rogue: { health: 80, mana: 50, attack: 7, defense: 3 },
    Mage: { health: 60, mana: 50, attack: 5, defense: 2 },
    Necromancer: { health: 64, mana: 58, attack: 5, defense: 2 },
    Druid: { health: 58, mana: 62, attack: 5, defense: 2 },
    default: { health: 100, mana: 50, attack: 9, defense: 5 }
};
const CLASS_XP_PER_LEVEL = {
    Warrior: 120,
    Rogue: 135,
    Mage: 150,
    Necromancer: 150,
    Druid: 150,
    default: 140
};
const CLASS_PRIMARY_STATS = {
    Warrior: { strength: 8, intelligence: 2, vitality: 8, perception: 4, magic: 1 },
    Rogue: { strength: 7, intelligence: 3, vitality: 6, perception: 8, magic: 2 },
    Mage: { strength: 2, intelligence: 10, vitality: 4, perception: 5, magic: 9 },
    Necromancer: { strength: 2, intelligence: 9, vitality: 5, perception: 5, magic: 9 },
    Druid: { strength: 2, intelligence: 9, vitality: 4, perception: 6, magic: 8 },
    default: { strength: 5, intelligence: 5, vitality: 5, perception: 5, magic: 5 }
};
const LEVEL_UP_STAT_POINTS = 5;
const BACKSTAB_STUN_BONUS_CHANCE = 0.2;
const CRITICAL_STRIKE_BASE_CHANCE = 0.05;
const CRITICAL_STRIKE_PERCEPTION_BONUS = 0.01;
const CRITICAL_STRIKE_MAX_CHANCE = 0.5;
const CRITICAL_STRIKE_DAMAGE_MULTIPLIER = 1.5;
const COLD_NUMB_DAMAGE_MULTIPLIER = 0.75;
const COLD_NUMB_DEFAULT_TURNS = 2;
const BURN_DEFAULT_TURNS = 2;
const SKILL_RANK_POWER_BONUS = 0.12;
const CLASS_WEAPON_FAMILIES = {
    Warrior: null,
    Rogue: new Set(['dagger', 'short_sword']),
    Mage: new Set(['staff']),
    Necromancer: new Set(['staff']),
    Druid: new Set(['staff'])
};
const CLASS_ARMOR_FAMILIES = {
    Warrior: null,
    Rogue: new Set(['robe', 'cloth', 'leather']),
    Mage: new Set(['robe']),
    Necromancer: new Set(['robe']),
    Druid: new Set(['robe'])
};
const DEFAULT_CHARACTER_ABILITIES = ['Attaquer', 'Bloquer'];
const LEVEL_UP_TRACK_SKILL = 'skill';
const LEVEL_UP_TRACK_PASSIVE = 'passive';
const CLASS_SKILL_TREE = {
    Warrior: [
        { id: 'warrior_coup_epee', action: 'Coup d epee', unlockLevel: 1, maxRank: 4, powerPerRank: 0.1 },
        { id: 'warrior_bloquer', action: 'Bloquer', unlockLevel: 1, maxRank: 1 },
        { id: 'warrior_assomer', action: 'Assomer', unlockLevel: 1, maxRank: 4, powerPerRank: 0.05, rankDescription: '+3% chance de reussite/rang' },
        { id: 'warrior_coup_mort', action: 'Coup de mort', unlockLevel: 3, maxRank: 4, powerPerRank: 0.14 },
        { id: 'warrior_frappe_heroique', action: 'Frappe heroique', unlockLevel: 5, maxRank: 4, powerPerRank: 0.12 },
        { id: 'warrior_garde_fer', action: 'Garde du fer', unlockLevel: 7, maxRank: 4, powerPerRank: 0.1 },
        { id: 'warrior_coup_devastateur', action: 'Coup devastateur', unlockLevel: 9, maxRank: 4, powerPerRank: 0.15 }
    ],
    Rogue: [
        { id: 'rogue_attaque_rapide', action: 'Attaque rapide', unlockLevel: 1, maxRank: 4, powerPerRank: 0.1 },
        { id: 'rogue_bloquer', action: 'Bloquer', unlockLevel: 1, maxRank: 1 },
        { id: 'rogue_backstab', action: 'Backstab', unlockLevel: 1, maxRank: 4, powerPerRank: 0.15, rankDescription: '+15% degats et +3% chance/rang' },
        { id: 'rogue_evasion', action: 'Evasion', unlockLevel: 3, maxRank: 4, powerPerRank: 0.08 },
        { id: 'rogue_frappe_ombre', action: 'Frappe de l ombre', unlockLevel: 5, maxRank: 4, powerPerRank: 0.14 },
        { id: 'rogue_pluie_lames', action: 'Pluie de lames', unlockLevel: 7, maxRank: 4, powerPerRank: 0.12 }
    ],
    Mage: [
        { id: 'mage_attaque_baton', action: 'Attaque au baton', unlockLevel: 1, maxRank: 3, powerPerRank: 0.08 },
        { id: 'mage_missile', action: 'Magic Missile', unlockLevel: 1, maxRank: 4, powerPerRank: 0.12 },
        { id: 'mage_boule_feu', action: 'Boule de feu', unlockLevel: 1, maxRank: 4, powerPerRank: 0.12 },
        { id: 'mage_soin', action: 'Soin', unlockLevel: 3, maxRank: 4, powerPerRank: 0.1 },
        { id: 'mage_pluie_feu', action: 'Pluie de feu', unlockLevel: 5, maxRank: 4, powerPerRank: 0.12 }
    ],
    Necromancer: [
        { id: 'necro_coup_baton', action: 'Coup de baton', unlockLevel: 1, maxRank: 3, powerPerRank: 0.08 },
        { id: 'necro_bloquer', action: 'Bloquer', unlockLevel: 1, maxRank: 1 },
        { id: 'necro_drain_vie', action: 'Drain de vie', unlockLevel: 1, maxRank: 4, powerPerRank: 0.1 },
        { id: 'necro_affaiblissement', action: 'Affaiblissement', unlockLevel: 1, maxRank: 4, powerPerRank: 0.08 },
        { id: 'necro_squelette', action: 'Invocation de squelette', unlockLevel: 1, maxRank: 3, powerPerRank: 0.08 },
        { id: 'necro_malediction', action: 'Malediction funeste', unlockLevel: 3, maxRank: 4, powerPerRank: 0.12 }
    ],
    Druid: [
        { id: 'druid_attaque_baton', action: 'Attaque au baton', unlockLevel: 1, maxRank: 3, powerPerRank: 0.08 },
        { id: 'druid_bloquer', action: 'Bloquer', unlockLevel: 1, maxRank: 1 },
        { id: 'druid_protection', action: 'Protection', unlockLevel: 1, maxRank: 4, powerPerRank: 0.1 },
        { id: 'druid_totem', action: 'Invocation de totem', unlockLevel: 1, maxRank: 4, powerPerRank: 0.08 },
        { id: 'druid_soin_groupe', action: 'Soin de groupe', unlockLevel: 1, maxRank: 4, powerPerRank: 0.1 },
        { id: 'druid_totem_mort', action: 'Invocation de totem de mort', unlockLevel: 3, maxRank: 4, powerPerRank: 0.1 },
        { id: 'druid_renouveau', action: 'Renouveau', unlockLevel: 5, maxRank: 4, powerPerRank: 0.12 }
    ]
};
const CLASS_PASSIVE_TREE = {
    Warrior: [
        { id: 'warrior_riposte', name: 'Riposte', unlockLevel: 2, maxRank: 1, effects: { riposteDamageRatio: 0.5 } },
        { id: 'warrior_precision', name: 'Precision de guerre', unlockLevel: 4, maxRank: 4, effects: { critChanceFlat: 0.02 } },
        { id: 'warrior_impact', name: 'Impact brutal', unlockLevel: 6, maxRank: 4, effects: { physicalDamagePercent: 0.05 } }
    ],
    Rogue: [
        { id: 'rogue_assassination', name: 'Assasination', unlockLevel: 2, maxRank: 1, effects: { assassinationEnabled: 1 } },
        { id: 'rogue_lames', name: 'Lames affutees', unlockLevel: 4, maxRank: 4, effects: { physicalDamagePercent: 0.05 } },
        { id: 'rogue_reflexes', name: 'Reflexes d ombre', unlockLevel: 6, maxRank: 4, effects: { allResistanceFlat: 3 } }
    ],
    Mage: [
        { id: 'mage_focus', name: 'Focus arcanique', unlockLevel: 2, maxRank: 4, effects: { spellDamagePercent: 0.06 } },
        { id: 'mage_reserve', name: 'Reserve de mana', unlockLevel: 4, maxRank: 4, effects: { manaRegenFlat: 2 } },
        { id: 'mage_voile', name: 'Voile mystique', unlockLevel: 6, maxRank: 4, effects: { magicResistanceFlat: 5 } }
    ],
    Necromancer: [
        { id: 'necro_obscur', name: 'Vol d ame', unlockLevel: 2, maxRank: 1, effects: { soulTheftEnabled: 1, soulTheftHealthOnKill: 5, soulTheftManaOnKill: 10 } },
        { id: 'necro_siphon', name: 'Siphon d ame', unlockLevel: 4, maxRank: 4, effects: { manaRegenFlat: 2 } },
        { id: 'necro_os', name: 'Carapace d os', unlockLevel: 6, maxRank: 4, effects: { physicalResistanceFlat: 4 } }
    ],
    Druid: [
        { id: 'druid_harmony', name: 'Harmonie sauvage', unlockLevel: 2, maxRank: 4, effects: { spellDamagePercent: 0.05 } },
        { id: 'druid_flux', name: 'Flux naturel', unlockLevel: 4, maxRank: 4, effects: { manaRegenFlat: 2 } },
        { id: 'druid_ecorce', name: 'Peau d ecorce', unlockLevel: 6, maxRank: 4, effects: { allResistanceFlat: 4 } }
    ]
};

function getProgressionMaxRank(rawRank, fallback = 4) {
    const rank = Math.floor(Number(rawRank) || 0);
    if (rank >= 1) {
        return rank;
    }
    return Math.max(1, Math.floor(Number(fallback) || 1));
}

function getSkillTreeForClass(classType) {
    return Array.isArray(CLASS_SKILL_TREE[classType]) ? CLASS_SKILL_TREE[classType] : [];
}

function getPassiveTreeForClass(classType) {
    return Array.isArray(CLASS_PASSIVE_TREE[classType]) ? CLASS_PASSIVE_TREE[classType] : [];
}

function createInitialSkillRanks(classType) {
    const ranks = {};
    getSkillTreeForClass(classType).forEach((skill) => {
        if (!skill || typeof skill.id !== 'string') {
            return;
        }
        const unlockLevel = Math.max(1, Math.floor(skill.unlockLevel || 1));
        ranks[skill.id] = unlockLevel <= 1 ? 1 : 0;
    });
    return ranks;
}

function createInitialPassiveRanks(classType) {
    const ranks = {};
    getPassiveTreeForClass(classType).forEach((passive) => {
        if (!passive || typeof passive.id !== 'string') {
            return;
        }
        ranks[passive.id] = 0;
    });
    return ranks;
}

function getSkillDefinitionById(classType, skillId) {
    if (typeof skillId !== 'string' || skillId.length === 0) {
        return null;
    }
    return getSkillTreeForClass(classType).find((skill) => skill && skill.id === skillId) || null;
}

function getSkillDefinitionByAction(classType, action) {
    if (typeof action !== 'string' || action.length === 0) {
        return null;
    }
    return getSkillTreeForClass(classType).find((skill) => skill && skill.action === action) || null;
}

function getPassiveDefinitionById(classType, passiveId) {
    if (typeof passiveId !== 'string' || passiveId.length === 0) {
        return null;
    }
    return getPassiveTreeForClass(classType).find((passive) => passive && passive.id === passiveId) || null;
}

function buildPassiveEffectDescription(passiveDefinition) {
    if (!passiveDefinition || typeof passiveDefinition !== 'object') {
        return '';
    }
    const effects = passiveDefinition.effects && typeof passiveDefinition.effects === 'object'
        ? passiveDefinition.effects
        : {};
    const parts = [];
    if (effects.physicalDamagePercent) {
        parts.push(`+${Math.round(effects.physicalDamagePercent * 100)}% degats physiques/rang`);
    }
    if (effects.spellDamagePercent) {
        parts.push(`+${Math.round(effects.spellDamagePercent * 100)}% puissance magique/rang`);
    }
    if (effects.critChanceFlat) {
        parts.push(`+${Math.round(effects.critChanceFlat * 100)}% critique/rang`);
    }
    if (effects.manaRegenFlat) {
        parts.push(`+${effects.manaRegenFlat} mana/tour/rang`);
    }
    if (effects.physicalResistanceFlat) {
        parts.push(`+${effects.physicalResistanceFlat}% res physique/rang`);
    }
    if (effects.magicResistanceFlat) {
        parts.push(`+${effects.magicResistanceFlat}% res magique/rang`);
    }
    if (effects.fireResistanceFlat) {
        parts.push(`+${effects.fireResistanceFlat}% res feu/rang`);
    }
    if (effects.iceResistanceFlat) {
        parts.push(`+${effects.iceResistanceFlat}% res glace/rang`);
    }
    if (effects.poisonResistanceFlat) {
        parts.push(`+${effects.poisonResistanceFlat}% res poison/rang`);
    }
    if (effects.allResistanceFlat) {
        parts.push(`+${effects.allResistanceFlat}% toutes resistances/rang`);
    }
    if (effects.riposteDamageRatio) {
        parts.push(`Riposte: ${Math.round(effects.riposteDamageRatio * 100)}% degats a l'agresseur`);
    }
    if (effects.assassinationEnabled) {
        parts.push('Kill critique: enchainement gratuit sur une autre cible');
    }
    if (effects.soulTheftEnabled || effects.soulTheftHealthOnKill || effects.soulTheftManaOnKill) {
        const healthGain = Math.max(0, Math.floor(Number(effects.soulTheftHealthOnKill) || 0));
        const manaGain = Math.max(0, Math.floor(Number(effects.soulTheftManaOnKill) || 0));
        parts.push(`A chaque mort de monstre: +${healthGain} PV et +${manaGain} mana`);
    }
    return parts.join(', ');
}
const DAMAGE_RESISTANCE_CONFIG = [
    { type: 'physical', bonusField: 'physicalResistanceBonus', label: 'Res Phys' },
    { type: 'magic', bonusField: 'magicResistanceBonus', label: 'Res Mag' },
    { type: 'fire', bonusField: 'fireResistanceBonus', label: 'Res Feu' },
    { type: 'ice', bonusField: 'iceResistanceBonus', label: 'Res Glace' },
    { type: 'poison', bonusField: 'poisonResistanceBonus', label: 'Res Poison' }
];
const DAMAGE_TYPE_ALIASES_LOCAL = {
    physical: 'physical',
    physique: 'physical',
    magic: 'magic',
    magique: 'magic',
    fire: 'fire',
    feu: 'fire',
    ice: 'ice',
    glace: 'ice',
    poison: 'poison'
};

function classUsesMana(classType) {
    return MANA_USING_CLASSES.has(classType);
}

function normalizeItemText(value) {
    return String(value || '').toLowerCase();
}

function getInventoryItemImagePath(item) {
    if (!item || typeof item !== 'object') {
        return '';
    }

    const itemType = normalizeItemText(item.type);
    const itemId = normalizeItemText(item.id);
    const itemName = normalizeItemText(item.name);

    if (itemType === 'consumable') {
        if (item.consumableKind === 'health') {
            return INVENTORY_ITEM_ICONS.potion_health;
        }
        if (item.consumableKind === 'mana') {
            return INVENTORY_ITEM_ICONS.potion_mana;
        }
        return '';
    }

    if (itemType === 'boots') {
        return INVENTORY_ITEM_ICONS.boots;
    }

    if (itemType === 'ring') {
        return INVENTORY_ITEM_ICONS.ring;
    }

    if (itemType === 'armor') {
        if (itemId.includes('chain') || itemName.includes('cotte') || itemName.includes('maille')) {
            return INVENTORY_ITEM_ICONS.armor_chain;
        }
        if (itemId.includes('robe') || itemName.includes('robe')) {
            return INVENTORY_ITEM_ICONS.armor_robe;
        }
        return INVENTORY_ITEM_ICONS.armor_leather;
    }

    if (itemType === 'offhand') {
        const offhandFamily = getOffhandFamily(item);
        if (offhandFamily === 'shield') {
            return INVENTORY_ITEM_ICONS.offhand_shield;
        }
    }

    if (itemType === 'weapon' || itemType === 'offhand') {
        const family = getWeaponFamily(item);
        if (family === 'dagger') {
            return INVENTORY_ITEM_ICONS.weapon_dagger;
        }
        if (family === 'staff') {
            return INVENTORY_ITEM_ICONS.weapon_staff;
        }
        return INVENTORY_ITEM_ICONS.weapon_sword;
    }

    return '';
}

function createInventoryItemIconElement(item, className = 'inventory-item-icon') {
    const iconPath = getInventoryItemImagePath(item);
    if (!iconPath) {
        return null;
    }
    const icon = document.createElement('img');
    icon.className = className;
    icon.src = iconPath;
    icon.alt = 'Objet';
    return icon;
}

function getItemPrimaryStatBonuses(item) {
    if (!item) {
        return {
            strengthBonus: 0,
            intelligenceBonus: 0,
            vitalityBonus: 0,
            perceptionBonus: 0,
            magicBonus: 0
        };
    }

    const hasExplicitStrengthBonus = typeof item.strengthBonus === 'number' && Number.isFinite(item.strengthBonus);
    const hasExplicitVitalityBonus = typeof item.vitalityBonus === 'number' && Number.isFinite(item.vitalityBonus);

    return {
        // Backward compatibility: old attack/defense bonuses now fuel primary stats.
        strengthBonus: Math.floor(hasExplicitStrengthBonus ? item.strengthBonus : (item.attackBonus || 0)),
        intelligenceBonus: Math.floor(item.intelligenceBonus || 0),
        vitalityBonus: Math.floor(hasExplicitVitalityBonus ? item.vitalityBonus : (item.defenseBonus || 0)),
        perceptionBonus: Math.floor(item.perceptionBonus || 0),
        magicBonus: Math.floor(item.magicBonus || 0)
    };
}

function createEmptyCharacterDamageResistanceMap() {
    return {
        physical: 0,
        magic: 0,
        fire: 0,
        ice: 0,
        poison: 0
    };
}

function getNormalizedDamageType(rawDamageType) {
    if (typeof window !== 'undefined' && typeof window.normalizeDamageType === 'function') {
        return window.normalizeDamageType(rawDamageType);
    }
    const normalizedKey = String(rawDamageType || 'physical').trim().toLowerCase();
    return DAMAGE_TYPE_ALIASES_LOCAL[normalizedKey] || 'physical';
}

function clampResistancePercent(rawValue) {
    if (typeof window !== 'undefined' && typeof window.normalizeDamageResistanceValue === 'function') {
        return window.normalizeDamageResistanceValue(rawValue);
    }
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
        return 0;
    }
    return Math.max(-100, Math.min(90, Math.round(numericValue)));
}

function normalizeItemResistanceBonusValue(rawValue) {
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
        return 0;
    }
    return Math.round(numericValue);
}

function getItemDamageResistanceBonuses(item) {
    const source = item && typeof item === 'object' ? item : {};
    const mapSource = source.damageResistances && typeof source.damageResistances === 'object'
        ? source.damageResistances
        : {};
    const mappedResistances = createEmptyCharacterDamageResistanceMap();
    Object.entries(mapSource).forEach(([rawType, rawValue]) => {
        const normalizedType = getNormalizedDamageType(rawType);
        mappedResistances[normalizedType] += normalizeItemResistanceBonusValue(rawValue);
    });
    return {
        physicalResistanceBonus: normalizeItemResistanceBonusValue((source.physicalResistanceBonus || 0) + (mappedResistances.physical || 0)),
        magicResistanceBonus: normalizeItemResistanceBonusValue((source.magicResistanceBonus || 0) + (mappedResistances.magic || 0)),
        fireResistanceBonus: normalizeItemResistanceBonusValue((source.fireResistanceBonus || 0) + (mappedResistances.fire || 0)),
        iceResistanceBonus: normalizeItemResistanceBonusValue((source.iceResistanceBonus || 0) + (mappedResistances.ice || 0)),
        poisonResistanceBonus: normalizeItemResistanceBonusValue((source.poisonResistanceBonus || 0) + (mappedResistances.poison || 0))
    };
}

function buildItemDamageResistanceBonusFields(item) {
    const bonuses = getItemDamageResistanceBonuses(item);
    return {
        physicalResistanceBonus: bonuses.physicalResistanceBonus,
        magicResistanceBonus: bonuses.magicResistanceBonus,
        fireResistanceBonus: bonuses.fireResistanceBonus,
        iceResistanceBonus: bonuses.iceResistanceBonus,
        poisonResistanceBonus: bonuses.poisonResistanceBonus
    };
}

function formatSignedPercent(value) {
    const normalized = Math.round(Number(value) || 0);
    return `${normalized >= 0 ? '+' : ''}${normalized}%`;
}

function getWeaponFamily(item) {
    const id = normalizeItemText(item.id);
    const name = normalizeItemText(item.name);

    if (name.includes('epee courte') || id.includes('short_sword') || id.includes('short-sword')) {
        return 'short_sword';
    }
    if (name.includes('dague') || id.includes('dagger')) {
        return 'dagger';
    }
    if (name.includes('baton') || id.includes('staff')) {
        return 'staff';
    }
    if (name.includes('epee') || id.includes('sword')) {
        return 'sword';
    }
    return 'unknown';
}

function getOffhandFamily(item) {
    if (!item || typeof item !== 'object') {
        return 'unknown';
    }
    if (typeof item.offhandFamily === 'string' && item.offhandFamily.trim().length > 0) {
        return normalizeItemText(item.offhandFamily);
    }
    const id = normalizeItemText(item.id);
    const name = normalizeItemText(item.name);
    if (id.includes('shield') || name.includes('bouclier')) {
        return 'shield';
    }
    return getWeaponFamily(item);
}

function getArmorFamily(item) {
    const id = normalizeItemText(item.id);
    const name = normalizeItemText(item.name);

    if (name.includes('robe') || id.includes('robe')) {
        return 'robe';
    }
    if (name.includes('tunique') || name.includes('tenue') || id.includes('tunic') || id.includes('cloth')) {
        return 'cloth';
    }
    if (name.includes('cuir') || name.includes('veste') || id.includes('leather')) {
        return 'leather';
    }
    if (name.includes('cotte') || name.includes('maille') || id.includes('chain')) {
        return 'chain';
    }
    if (name.includes('plaque') || name.includes('plate') || id.includes('plate')) {
        return 'plate';
    }
    return 'unknown';
}

function canCharacterEquipItem(character, item, targetSlot = null) {
    if (!character || !item || !item.type) {
        return { allowed: false, reason: 'objet invalide' };
    }

    const slot = targetSlot || item.type;
    if (slot === 'offhand') {
        const offhandFamily = getOffhandFamily(item);
        if (offhandFamily === 'shield') {
            if (character.classType !== 'Warrior') {
                return { allowed: false, reason: 'seul le guerrier peut equiper un bouclier' };
            }
            if (item.type !== 'offhand') {
                return { allowed: false, reason: 'emplacement reserve aux boucliers' };
            }
            return { allowed: true, reason: '' };
        }

        if (character.classType !== 'Rogue') {
            return { allowed: false, reason: 'seul le rogue peut utiliser une arme en main gauche' };
        }
        if (item.type !== 'weapon' && item.type !== 'offhand') {
            return { allowed: false, reason: 'main gauche reservee aux dagues' };
        }
        if (offhandFamily !== 'dagger') {
            return { allowed: false, reason: 'main gauche: dague uniquement' };
        }
        return { allowed: true, reason: '' };
    }

    if (slot !== 'weapon' && slot !== 'armor') {
        return { allowed: true, reason: '' };
    }

    if (slot === 'weapon') {
        const allowedWeaponFamilies = CLASS_WEAPON_FAMILIES[character.classType];
        if (!allowedWeaponFamilies) {
            return { allowed: true, reason: '' };
        }

        const weaponFamily = getWeaponFamily(item);
        if (allowedWeaponFamilies.has(weaponFamily)) {
            return { allowed: true, reason: '' };
        }
        if (character.classType === 'Rogue') {
            return { allowed: false, reason: 'armes autorisees: dague ou epee courte' };
        }
        if (character.classType === 'Mage' || character.classType === 'Necromancer' || character.classType === 'Druid') {
            return { allowed: false, reason: 'armes autorisees: baton uniquement' };
        }
        return { allowed: false, reason: 'arme non autorisee' };
    }

    const allowedArmorFamilies = CLASS_ARMOR_FAMILIES[character.classType];
    if (!allowedArmorFamilies) {
        return { allowed: true, reason: '' };
    }

    const armorFamily = getArmorFamily(item);
    if (allowedArmorFamilies.has(armorFamily)) {
        return { allowed: true, reason: '' };
    }
    if (character.classType === 'Rogue') {
        return { allowed: false, reason: 'armures autorisees: cuir ou plus leger' };
    }
    if (character.classType === 'Mage' || character.classType === 'Necromancer' || character.classType === 'Druid') {
        return { allowed: false, reason: 'armures autorisees: robe uniquement' };
    }
    return { allowed: false, reason: 'armure non autorisee' };
}

class Character {
    constructor(name, classType) {
        const classBaseStats = CLASS_BASE_STATS[classType] || CLASS_BASE_STATS.default;
        const classPrimaryStats = CLASS_PRIMARY_STATS[classType] || CLASS_PRIMARY_STATS.default;
        this.entityType = 'character';
        this.entityId = `char-${characterEntityIdCounter++}`;
        this.name = name;
        this.classType = classType;
        this.level = 1;
        this.experience = 0;
        this.strength = classPrimaryStats.strength;
        this.intelligence = classPrimaryStats.intelligence;
        this.vitality = classPrimaryStats.vitality;
        this.perception = classPrimaryStats.perception;
        this.magic = classPrimaryStats.magic;
        this.baseMaxHealth = classBaseStats.health;
        this.maxHealth = this.baseMaxHealth + this.getVitalityHealthBonus();
        this.health = this.maxHealth;
        this.attack = classBaseStats.attack;
        this.defense = classBaseStats.defense;
        this.equipment = {
            weapon: null,
            offhand: null,
            ring: null,
            armor: null,
            boots: null
        };
        this.baseMaxMana = classBaseStats.mana;
        this.maxMana = this.baseMaxMana + this.getIntelligenceManaBonus();
        this.mana = this.maxMana;
        this.manaRegenPerTurn = 0;
        this.isBlocking = false;
        this.pendingLevelUp = false;
        this.unspentStatPoints = 0;
        this.skillRanks = createInitialSkillRanks(this.classType);
        this.passiveRanks = createInitialPassiveRanks(this.classType);
        this.attackWeakenAmount = 0;
        this.attackWeakenTurns = 0;
        this.damageResistances = createEmptyCharacterDamageResistanceMap();
        this.coldNumbTurns = 0;
        this.coldNumbDamageMultiplier = 1;
        this.coldNumbAppliedThisTurn = false;
        this.burnDamage = 0;
        this.burnTurns = 0;
        this.burnAppliedThisTurn = false;
        this.infectionDamage = 0;
        this.infectionTurns = 0;
        this.infectionAppliedThisTurn = false;
        this.protectionShieldValue = 0;
        this.protectionShieldTurns = 0;
        this.protectionShieldAppliedThisTurn = false;
        this.webbedTurns = 0;
        this.assomerCooldownTurns = 0;
        this.usedAssomerThisTurn = false;
        this.coupDeMortCooldownTurns = 0;
        this.usedCoupDeMortThisTurn = false;
        this.pendingCoupDeMortFollowUp = false;
        this.pendingAssassinationFollowUp = false;
        this.backstabCooldownTurns = 0;
        this.usedBackstabThisTurn = false;
        this.skeletonSummonCooldownTurns = 0;
        this.usedSkeletonSummonThisTurn = false;
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

    applyWebbed(turns) {
        const duration = Math.max(1, Math.floor(turns || 0));
        this.webbedTurns = Math.max(this.webbedTurns, duration);
        return this.webbedTurns;
    }

    isWebbed() {
        return this.webbedTurns > 0;
    }

    consumeWebbedTurn() {
        if (this.webbedTurns > 0) {
            this.webbedTurns -= 1;
        }
        return this.webbedTurns;
    }

    getWebStatusText() {
        if (!this.isWebbed()) {
            return '';
        }
        const turnLabel = this.webbedTurns > 1 ? 'tours' : 'tour';
        return `Toile: immobilise (${this.webbedTurns} ${turnLabel})`;
    }

    applyColdNumb(turns = COLD_NUMB_DEFAULT_TURNS, damageMultiplier = COLD_NUMB_DAMAGE_MULTIPLIER) {
        const wasColdNumb = this.isColdNumb();
        const duration = Math.max(1, Math.floor(turns || 0));
        const normalizedMultiplier = Number.isFinite(damageMultiplier)
            ? Math.max(0.1, Math.min(1, Number(damageMultiplier)))
            : COLD_NUMB_DAMAGE_MULTIPLIER;
        this.coldNumbTurns = Math.max(this.coldNumbTurns, duration);
        this.coldNumbDamageMultiplier = wasColdNumb
            ? Math.min(this.getColdNumbDamageMultiplier(), normalizedMultiplier)
            : normalizedMultiplier;
        this.coldNumbAppliedThisTurn = true;
        return this.coldNumbTurns;
    }

    isColdNumb() {
        return this.coldNumbTurns > 0;
    }

    getColdNumbDamageMultiplier() {
        const value = Number(this.coldNumbDamageMultiplier);
        if (!Number.isFinite(value)) {
            return COLD_NUMB_DAMAGE_MULTIPLIER;
        }
        return Math.max(0.1, Math.min(1, value));
    }

    getColdNumbStatusText() {
        if (!this.isColdNumb()) {
            return '';
        }
        const reductionPercent = Math.round((1 - this.getColdNumbDamageMultiplier()) * 100);
        const turnLabel = this.coldNumbTurns > 1 ? 'tours' : 'tour';
        return `Engourdi: -${reductionPercent}% degats (${this.coldNumbTurns} ${turnLabel})`;
    }

    applyBurn(damage, turns = BURN_DEFAULT_TURNS) {
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

    applyInfection(damage, turns = 3) {
        const infectionDamage = Math.max(1, Math.floor(damage || 0));
        const infectionTurns = Math.max(1, Math.floor(turns || 0));
        this.infectionDamage = Math.max(this.infectionDamage, infectionDamage);
        this.infectionTurns = Math.max(this.infectionTurns, infectionTurns);
        this.infectionAppliedThisTurn = true;
        return this.infectionTurns;
    }

    isInfected() {
        return this.infectionDamage > 0 && this.infectionTurns > 0;
    }

    getInfectionStatusText() {
        if (!this.isInfected()) {
            return '';
        }
        const turnLabel = this.infectionTurns > 1 ? 'tours' : 'tour';
        return `Infection: ${this.infectionDamage} degats/tour (${this.infectionTurns} ${turnLabel})`;
    }

    applyProtectionShield(amount = 20, turns = 3, skipFirstTurnTick = false) {
        const shieldAmount = Math.max(1, Math.floor(amount || 0));
        const shieldTurns = Math.max(1, Math.floor(turns || 0));
        this.protectionShieldValue = Math.max(this.protectionShieldValue, shieldAmount);
        this.protectionShieldTurns = Math.max(this.protectionShieldTurns, shieldTurns);
        this.protectionShieldAppliedThisTurn = Boolean(skipFirstTurnTick);
        return this.protectionShieldValue;
    }

    hasProtectionShield() {
        return this.protectionShieldValue > 0 && this.protectionShieldTurns > 0;
    }

    getProtectionStatusText() {
        if (!this.hasProtectionShield()) {
            return '';
        }
        const turnLabel = this.protectionShieldTurns > 1 ? 'tours' : 'tour';
        return `Protection: ${this.protectionShieldValue} PV (${this.protectionShieldTurns} ${turnLabel})`;
    }

    absorbProtectionDamage(incomingDamage) {
        const normalizedIncomingDamage = Math.max(0, Math.floor(incomingDamage || 0));
        if (normalizedIncomingDamage <= 0 || !this.hasProtectionShield()) {
            return normalizedIncomingDamage;
        }
        const absorbedDamage = Math.min(normalizedIncomingDamage, this.protectionShieldValue);
        this.protectionShieldValue = Math.max(0, this.protectionShieldValue - absorbedDamage);
        if (this.protectionShieldValue <= 0) {
            this.protectionShieldValue = 0;
            this.protectionShieldTurns = 0;
            this.protectionShieldAppliedThisTurn = false;
        }
        return Math.max(0, normalizedIncomingDamage - absorbedDamage);
    }

    consumeTurnEffects() {
        const logs = [];

        if (this.assomerCooldownTurns > 0) {
            if (this.usedAssomerThisTurn) {
                this.usedAssomerThisTurn = false;
            } else {
                this.assomerCooldownTurns -= 1;
            }
        }

        if (this.coupDeMortCooldownTurns > 0) {
            if (this.usedCoupDeMortThisTurn) {
                this.usedCoupDeMortThisTurn = false;
            } else {
                this.coupDeMortCooldownTurns -= 1;
            }
        }

        if (this.backstabCooldownTurns > 0) {
            if (this.usedBackstabThisTurn) {
                this.usedBackstabThisTurn = false;
            } else {
                this.backstabCooldownTurns -= 1;
            }
        }

        if (this.skeletonSummonCooldownTurns > 0) {
            if (this.usedSkeletonSummonThisTurn) {
                this.usedSkeletonSummonThisTurn = false;
            } else {
                this.skeletonSummonCooldownTurns -= 1;
            }
        }

        const effectiveManaRegen = Math.max(0, this.manaRegenPerTurn + Math.round(this.getPassiveEffectTotal('manaRegenFlat')));
        if (effectiveManaRegen > 0 && this.mana < this.maxMana) {
            const beforeMana = this.mana;
            this.mana = Math.min(this.maxMana, this.mana + effectiveManaRegen);
            const restoredMana = this.mana - beforeMana;
            if (restoredMana > 0) {
                logs.push(`${this.name} regenere ${restoredMana} mana.`);
            }
        }

        if (this.hasAttackWeakness()) {
            this.attackWeakenTurns -= 1;
            if (this.attackWeakenTurns <= 0) {
                this.attackWeakenTurns = 0;
                this.attackWeakenAmount = 0;
                logs.push(`${this.name} n'est plus affaibli.`);
            }
        }

        if (this.hasProtectionShield()) {
            if (this.protectionShieldAppliedThisTurn) {
                this.protectionShieldAppliedThisTurn = false;
            } else {
                this.protectionShieldTurns = Math.max(0, this.protectionShieldTurns - 1);
                if (this.protectionShieldTurns <= 0) {
                    this.protectionShieldTurns = 0;
                    this.protectionShieldValue = 0;
                    logs.push(`${this.name} n'est plus protege.`);
                }
            }
        }

        if (this.isColdNumb()) {
            if (this.coldNumbAppliedThisTurn) {
                this.coldNumbAppliedThisTurn = false;
            } else {
                this.coldNumbTurns -= 1;
                if (this.coldNumbTurns <= 0) {
                    this.coldNumbTurns = 0;
                    this.coldNumbDamageMultiplier = 1;
                    logs.push(`${this.name} n'est plus engourdi.`);
                }
            }
        }

        if (this.isBurning()) {
            if (this.burnAppliedThisTurn) {
                this.burnAppliedThisTurn = false;
            } else {
                const finalBurnDamage = this.takeDamage(this.burnDamage, {
                    damageType: 'fire',
                    ignoreBlocking: true
                });

                this.burnTurns = Math.max(0, this.burnTurns - 1);
                const turnLabel = this.burnTurns > 1 ? 'tours restants' : 'tour restant';
                if (this.burnTurns > 0 && finalBurnDamage > 0) {
                    logs.push(`${this.name} subit ${finalBurnDamage} degats de brulure (${this.burnTurns} ${turnLabel}).`);
                } else if (this.burnTurns > 0) {
                    logs.push(`La protection de ${this.name} absorbe la brulure (${this.burnTurns} ${turnLabel}).`);
                } else {
                    if (finalBurnDamage > 0) {
                        logs.push(`${this.name} subit ${finalBurnDamage} degats de brulure.`);
                    } else {
                        logs.push(`La protection de ${this.name} absorbe la brulure.`);
                    }
                    this.burnDamage = 0;
                }

                if (!this.isAlive()) {
                    logs.push(`${this.name} succombe a la brulure.`);
                } else if (this.burnTurns === 0) {
                    logs.push(`${this.name} n'est plus en feu.`);
                }
            }
        }

        if (this.isInfected()) {
            if (this.infectionAppliedThisTurn) {
                this.infectionAppliedThisTurn = false;
            } else {
                const finalInfectionDamage = this.takeDamage(this.infectionDamage, {
                    damageType: 'poison',
                    ignoreBlocking: true
                });

                this.infectionTurns = Math.max(0, this.infectionTurns - 1);
                const turnLabel = this.infectionTurns > 1 ? 'tours restants' : 'tour restant';
                if (this.infectionTurns > 0 && finalInfectionDamage > 0) {
                    logs.push(`${this.name} subit ${finalInfectionDamage} degats d'infection (${this.infectionTurns} ${turnLabel}).`);
                } else if (this.infectionTurns > 0) {
                    logs.push(`La protection de ${this.name} absorbe l'infection (${this.infectionTurns} ${turnLabel}).`);
                } else {
                    if (finalInfectionDamage > 0) {
                        logs.push(`${this.name} subit ${finalInfectionDamage} degats d'infection.`);
                    } else {
                        logs.push(`La protection de ${this.name} absorbe l'infection.`);
                    }
                    this.infectionDamage = 0;
                }

                if (!this.isAlive()) {
                    logs.push(`${this.name} succombe a l'infection.`);
                } else if (this.infectionTurns === 0) {
                    logs.push(`${this.name} n'est plus infecte.`);
                }
            }
        }
        return logs;
    }

    canUseAssomer() {
        return this.classType === 'Warrior' && this.assomerCooldownTurns <= 0;
    }

    setAssomerCooldown(turns) {
        this.assomerCooldownTurns = Math.max(0, Math.floor(turns || 0));
        this.usedAssomerThisTurn = this.assomerCooldownTurns > 0;
    }

    canUseCoupDeMort() {
        return this.classType === 'Warrior' && this.coupDeMortCooldownTurns <= 0;
    }

    setCoupDeMortCooldown(turns) {
        this.coupDeMortCooldownTurns = Math.max(0, Math.floor(turns || 0));
        this.usedCoupDeMortThisTurn = this.coupDeMortCooldownTurns > 0;
    }

    hasPendingCoupDeMortFollowUp() {
        return this.classType === 'Warrior' && this.pendingCoupDeMortFollowUp;
    }

    clearCoupDeMortFollowUp() {
        this.pendingCoupDeMortFollowUp = false;
    }

    performCoupDeMortFollowUp(monster) {
        if (!this.hasPendingCoupDeMortFollowUp()) {
            return `${this.name} n'a pas d'enchainement de Coup de mort disponible.`;
        }
        if (!monster || !monster.isAlive()) {
            this.clearCoupDeMortFollowUp();
            return `${this.name} n'a pas de cible valide pour l'enchainement.`;
        }

        const currentAttack = this.getCurrentAttack();
        const baseDamage = Math.max(1, currentAttack + 4);
        const rawDamage = this.scalePhysicalDamage(baseDamage, 'Coup de mort');
        const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
        const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
        const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
        this.clearCoupDeMortFollowUp();
        if (typeof window.playRandomSwordHit === 'function') {
            window.playRandomSwordHit({ volume: 0.92 });
        }
        return `${this.name} enchaine Coup de mort sur ${monster.name} pour ${damage} degats.${criticalText}`;
    }

    canUseAssassinationPassive() {
        return this.classType === 'Rogue' && this.getPassiveRank('rogue_assassination') > 0;
    }

    hasPendingAssassinationFollowUp() {
        return this.canUseAssassinationPassive() && this.pendingAssassinationFollowUp;
    }

    clearAssassinationFollowUp() {
        this.pendingAssassinationFollowUp = false;
    }

    markAssassinationFollowUpIfEligible(monster, criticalCount = 0) {
        if (!this.canUseAssassinationPassive()) {
            return false;
        }
        const normalizedCriticalCount = Math.max(0, Math.floor(Number(criticalCount) || 0));
        if (normalizedCriticalCount <= 0) {
            return false;
        }
        if (!monster || typeof monster.isAlive !== 'function' || monster.isAlive()) {
            return false;
        }
        this.pendingAssassinationFollowUp = true;
        return true;
    }

    performAssassinationFollowUp(monster) {
        if (!this.hasPendingAssassinationFollowUp()) {
            return `${this.name} n'a pas d'enchainement d Assasination disponible.`;
        }
        if (!monster || !monster.isAlive()) {
            this.clearAssassinationFollowUp();
            return `${this.name} n'a pas de cible valide pour Assasination.`;
        }
        this.clearAssassinationFollowUp();
        const result = this.performAction('Attaque rapide', monster);
        return `${this.name} enchaine Assasination. ${result}`;
    }

    canUseBackstab() {
        return this.classType === 'Rogue' && this.backstabCooldownTurns <= 0;
    }

    setBackstabCooldown(turns) {
        this.backstabCooldownTurns = Math.max(0, Math.floor(turns || 0));
        this.usedBackstabThisTurn = this.backstabCooldownTurns > 0;
    }

    canUseSkeletonSummon() {
        return this.classType === 'Necromancer' && this.skeletonSummonCooldownTurns <= 0;
    }

    setSkeletonSummonCooldown(turns) {
        this.skeletonSummonCooldownTurns = Math.max(0, Math.floor(turns || 0));
        this.usedSkeletonSummonThisTurn = this.skeletonSummonCooldownTurns > 0;
    }

    getVitalityHealthBonus() {
        return Math.max(0, this.vitality * 2);
    }

    getIntelligenceManaBonus() {
        return Math.max(0, this.intelligence);
    }

    getBaseStrengthDamageMultiplier() {
        return 1 + (Math.max(0, this.strength) * 0.01);
    }

    getStrengthDamageMultiplier() {
        const strengthMultiplier = this.getBaseStrengthDamageMultiplier();
        const passiveMultiplier = 1 + this.getPassiveEffectTotal('physicalDamagePercent');
        return strengthMultiplier * passiveMultiplier;
    }

    getMagicDamageMultiplier() {
        const magicMultiplier = 1 + (Math.max(0, this.magic) * 0.005);
        const passiveMultiplier = 1 + this.getPassiveEffectTotal('spellDamagePercent');
        return magicMultiplier * passiveMultiplier;
    }

    getSkillRank(skillId) {
        if (typeof skillId !== 'string' || !this.skillRanks) {
            return 0;
        }
        return Math.max(0, Math.floor(this.skillRanks[skillId] || 0));
    }

    getPassiveRank(passiveId) {
        if (typeof passiveId !== 'string' || !this.passiveRanks) {
            return 0;
        }
        return Math.max(0, Math.floor(this.passiveRanks[passiveId] || 0));
    }

    getSkillDefinitionById(skillId) {
        return getSkillDefinitionById(this.classType, skillId);
    }

    getSkillDefinitionByAction(action) {
        return getSkillDefinitionByAction(this.classType, action);
    }

    getPassiveDefinitionById(passiveId) {
        return getPassiveDefinitionById(this.classType, passiveId);
    }

    getSkillPowerMultiplier(action) {
        const skillDefinition = this.getSkillDefinitionByAction(action);
        if (!skillDefinition) {
            return 1;
        }
        const rank = this.getSkillRank(skillDefinition.id);
        if (rank <= 1) {
            return 1;
        }
        const powerPerRank = Number.isFinite(skillDefinition.powerPerRank)
            ? Math.max(0, Number(skillDefinition.powerPerRank))
            : SKILL_RANK_POWER_BONUS;
        return 1 + ((rank - 1) * powerPerRank);
    }

    getPassiveEffectTotal(effectKey) {
        if (typeof effectKey !== 'string' || effectKey.length === 0) {
            return 0;
        }
        let total = 0;
        const passiveTree = getPassiveTreeForClass(this.classType);
        passiveTree.forEach((passive) => {
            if (!passive || typeof passive !== 'object' || typeof passive.id !== 'string') {
                return;
            }
            const effects = passive.effects && typeof passive.effects === 'object'
                ? passive.effects
                : {};
            const perRankValue = Number(effects[effectKey]) || 0;
            if (perRankValue === 0) {
                return;
            }
            total += perRankValue * this.getPassiveRank(passive.id);
        });
        return total;
    }

    getRiposteDamageRatio() {
        const passiveDefinition = this.getPassiveDefinitionById('warrior_riposte');
        if (!passiveDefinition) {
            return 0;
        }
        const passiveRank = this.getPassiveRank('warrior_riposte');
        if (passiveRank <= 0) {
            return 0;
        }
        const effects = passiveDefinition.effects && typeof passiveDefinition.effects === 'object'
            ? passiveDefinition.effects
            : {};
        const ratio = Number(effects.riposteDamageRatio) || 0;
        return Math.max(0, ratio);
    }

    canTriggerRiposte() {
        return this.getRiposteDamageRatio() > 0;
    }

    triggerRiposte(attacker, options = {}) {
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        if (!this.canTriggerRiposte() || !this.isAlive()) {
            return null;
        }
        if (!attacker || attacker === this) {
            return null;
        }
        if (typeof attacker.isAlive !== 'function' || !attacker.isAlive()) {
            return null;
        }
        if (typeof attacker.takeDamage !== 'function') {
            return null;
        }

        const riposteRatio = this.getRiposteDamageRatio();
        const baseDamage = Math.max(1, Math.round(this.getCurrentAttack() * riposteRatio));
        const rawDamage = this.scalePhysicalDamage(baseDamage, 'Riposte');
        const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
        const damage = attacker.takeDamage(criticalOutcome.damage, {
            damageType: 'physical',
            ignoreRiposte: true
        });
        const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
        const attackerDefeated = typeof attacker.isAlive === 'function' && !attacker.isAlive();
        if (!normalizedOptions.suppressLog && typeof logMessage === 'function') {
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            logMessage(`${this.name} riposte sur ${attacker.name} et inflige ${damage} degats.${criticalText}`);
            if (attackerDefeated) {
                logMessage(`${attacker.name} succombe a la riposte de ${this.name}.`);
            }
        }
        return {
            defenderName: this.name,
            attackerName: attacker.name,
            damage,
            criticalText,
            attackerDefeated
        };
    }

    scaleMagicSpellPower(baseValue, minimumValue = 1, action = '') {
        const safeBaseValue = Math.max(0, Number(baseValue) || 0);
        const safeMinimum = Math.max(0, Math.floor(Number(minimumValue) || 0));
        const scaledValue = safeBaseValue * this.getMagicDamageMultiplier() * this.getSkillPowerMultiplier(action);
        return Math.max(safeMinimum, Math.round(scaledValue));
    }

    getOutgoingDamageMultiplier() {
        return this.isColdNumb() ? this.getColdNumbDamageMultiplier() : 1;
    }

    scalePhysicalDamage(baseValue, action = '') {
        const scaledValue = baseValue * this.getStrengthDamageMultiplier() * this.getOutgoingDamageMultiplier() * this.getSkillPowerMultiplier(action);
        return Math.max(1, Math.round(scaledValue));
    }

    scaleSpellDamage(baseValue, action = '') {
        const combinedMultiplier = this.getBaseStrengthDamageMultiplier()
            * this.getMagicDamageMultiplier()
            * this.getOutgoingDamageMultiplier()
            * this.getSkillPowerMultiplier(action);
        return Math.max(1, Math.round(baseValue * combinedMultiplier));
    }

    getAssomerSuccessChance() {
        const currentAttack = this.getCurrentAttack();
        const baseChance = 0.2 + (currentAttack * 0.02);
        const assomerSkillRank = this.getSkillRank('warrior_assomer');
        const skillBonus = assomerSkillRank > 1 ? (assomerSkillRank - 1) * 0.03 : 0;
        return Math.max(0.25, Math.min(0.95, baseChance + skillBonus));
    }

    getBackstabSuccessChance(monster = null) {
        const currentAttack = this.getCurrentAttack();
        const baseChance = 0.2 + (currentAttack * 0.02);
        const isTargetStunned = Boolean(
            monster
            && (
                (typeof monster.isStunned === 'function' && monster.isStunned())
                || ((monster.stunnedTurns || 0) > 0)
            )
        );
        const backstabSkillRank = this.getSkillRank('rogue_backstab');
        const skillBonus = backstabSkillRank > 1 ? (backstabSkillRank - 1) * 0.03 : 0;
        const bonusChance = (isTargetStunned ? BACKSTAB_STUN_BONUS_CHANCE : 0) + skillBonus;
        return Math.max(0.25, Math.min(0.95, baseChance + bonusChance));
    }

    getCriticalStrikeChance() {
        const safePerception = Math.max(0, Math.floor(this.perception || 0));
        const passiveBonus = this.getPassiveEffectTotal('critChanceFlat');
        const rawChance = CRITICAL_STRIKE_BASE_CHANCE + (safePerception * CRITICAL_STRIKE_PERCEPTION_BONUS) + passiveBonus;
        return Math.max(CRITICAL_STRIKE_BASE_CHANCE, Math.min(CRITICAL_STRIKE_MAX_CHANCE, rawChance));
    }

    rollPhysicalCriticalDamage(rawDamage) {
        const normalizedDamage = Math.max(1, Math.floor(Number(rawDamage) || 0));
        const criticalChance = this.getCriticalStrikeChance();
        const isCritical = Math.random() < criticalChance;
        if (!isCritical) {
            return { damage: normalizedDamage, isCritical: false };
        }
        const criticalDamage = Math.max(1, Math.round(normalizedDamage * CRITICAL_STRIKE_DAMAGE_MULTIPLIER));
        return { damage: criticalDamage, isCritical: true };
    }

    getCriticalHitText(criticalCount = 0) {
        const normalizedCount = Math.max(0, Math.floor(Number(criticalCount) || 0));
        if (normalizedCount <= 0) {
            return '';
        }
        if (normalizedCount === 1) {
            return ' Coup critique !';
        }
        return ` ${normalizedCount} coups critiques !`;
    }

    isDualWieldingDaggers() {
        const mainWeapon = this.equipment.weapon;
        const offhandWeapon = this.equipment.offhand;
        if (!mainWeapon || !offhandWeapon) {
            return false;
        }
        return getWeaponFamily(mainWeapon) === 'dagger' && getWeaponFamily(offhandWeapon) === 'dagger';
    }

    getAttackWeaknessText() {
        if (!this.hasAttackWeakness()) {
            return '';
        }
        const turnLabel = this.attackWeakenTurns > 1 ? 'tours' : 'tour';
        return `Affaibli: -${this.attackWeakenAmount} attaque (${this.attackWeakenTurns} ${turnLabel})`;
    }

    getDamageResistance(damageType) {
        const normalizedType = getNormalizedDamageType(damageType);
        const allResistanceBonus = this.getPassiveEffectTotal('allResistanceFlat');
        let value = this.damageResistances[normalizedType] || 0;
        value += allResistanceBonus;
        if (normalizedType === 'physical') {
            value += this.getPassiveEffectTotal('physicalResistanceFlat');
        } else if (normalizedType === 'magic') {
            value += this.getPassiveEffectTotal('magicResistanceFlat');
        } else if (normalizedType === 'fire') {
            value += this.getPassiveEffectTotal('fireResistanceFlat');
        } else if (normalizedType === 'ice') {
            value += this.getPassiveEffectTotal('iceResistanceFlat');
        } else if (normalizedType === 'poison') {
            value += this.getPassiveEffectTotal('poisonResistanceFlat');
        }
        return clampResistancePercent(value);
    }

    getDamageResistanceSummaryText() {
        const parts = DAMAGE_RESISTANCE_CONFIG.map((entry) => {
            const value = this.getDamageResistance(entry.type);
            return `${entry.label} ${formatSignedPercent(value)}`;
        });
        return parts.join(' | ');
    }

    getPendingLevelUpStepCount() {
        const pointsPerLevel = Math.max(1, Math.floor(this.getLevelUpStatPoints()));
        const pendingPoints = Math.max(0, Math.floor(this.unspentStatPoints || 0));
        if (pendingPoints <= 0) {
            return 0;
        }
        return Math.max(1, Math.ceil(pendingPoints / pointsPerLevel));
    }

    getCurrentLevelUpStepLevel() {
        const currentLevel = Math.max(1, Math.floor(this.level || 1));
        const pendingSteps = this.getPendingLevelUpStepCount();
        if (pendingSteps <= 1) {
            return currentLevel;
        }
        return Math.max(1, currentLevel - (pendingSteps - 1));
    }

    getCurrentLevelUpStatPointBudget() {
        const pendingPoints = Math.max(0, Math.floor(this.unspentStatPoints || 0));
        if (pendingPoints <= 0) {
            return 0;
        }
        const pointsPerLevel = Math.max(1, Math.floor(this.getLevelUpStatPoints()));
        return Math.min(pendingPoints, pointsPerLevel);
    }

    getLevelUpProgressionType() {
        const currentLevel = this.getCurrentLevelUpStepLevel();
        return currentLevel % 2 === 0 ? LEVEL_UP_TRACK_PASSIVE : LEVEL_UP_TRACK_SKILL;
    }

    getSkillChoicesForCurrentLevel() {
        const currentLevel = this.getCurrentLevelUpStepLevel();
        const skillTree = getSkillTreeForClass(this.classType);
        return skillTree
            .filter((skill) => {
                if (!skill || typeof skill.id !== 'string') {
                    return false;
                }
                const unlockLevel = Math.max(1, Math.floor(skill.unlockLevel || 1));
                if (currentLevel < unlockLevel) {
                    return false;
                }
                const currentRank = this.getSkillRank(skill.id);
                const maxRank = getProgressionMaxRank(skill.maxRank);
                return currentRank < maxRank;
            })
            .map((skill) => {
                const currentRank = this.getSkillRank(skill.id);
                const maxRank = getProgressionMaxRank(skill.maxRank);
                const powerPerRank = Number.isFinite(skill.powerPerRank)
                    ? Math.max(0, Number(skill.powerPerRank))
                    : SKILL_RANK_POWER_BONUS;
                const powerText = typeof skill.rankDescription === 'string' && skill.rankDescription.trim().length > 0
                    ? skill.rankDescription
                    : (
                        powerPerRank > 0
                            ? `+${Math.round(powerPerRank * 100)}% puissance/rang`
                            : ''
                    );
                return {
                    track: LEVEL_UP_TRACK_SKILL,
                    id: skill.id,
                    name: skill.action,
                    currentRank,
                    nextRank: currentRank + 1,
                    maxRank,
                    typeLabel: currentRank <= 0 ? 'Nouveau skill' : 'Amelioration',
                    description: powerText
                };
            });
    }

    getPassiveChoicesForCurrentLevel() {
        const currentLevel = this.getCurrentLevelUpStepLevel();
        const passiveTree = getPassiveTreeForClass(this.classType);
        return passiveTree
            .filter((passive) => {
                if (!passive || typeof passive.id !== 'string') {
                    return false;
                }
                const unlockLevel = Math.max(1, Math.floor(passive.unlockLevel || 1));
                if (currentLevel < unlockLevel) {
                    return false;
                }
                const currentRank = this.getPassiveRank(passive.id);
                const maxRank = getProgressionMaxRank(passive.maxRank);
                return currentRank < maxRank;
            })
            .map((passive) => {
                const currentRank = this.getPassiveRank(passive.id);
                const maxRank = getProgressionMaxRank(passive.maxRank);
                return {
                    track: LEVEL_UP_TRACK_PASSIVE,
                    id: passive.id,
                    name: passive.name,
                    currentRank,
                    nextRank: currentRank + 1,
                    maxRank,
                    typeLabel: currentRank <= 0 ? 'Nouveau passif' : 'Amelioration',
                    description: buildPassiveEffectDescription(passive)
                };
            });
    }

    getAvailableLevelUpChoices() {
        const progressionType = this.getLevelUpProgressionType();
        if (progressionType === LEVEL_UP_TRACK_PASSIVE) {
            return this.getPassiveChoicesForCurrentLevel();
        }
        return this.getSkillChoicesForCurrentLevel();
    }

    canApplyLevelUpChoice(choice) {
        if (!choice || typeof choice !== 'object') {
            return false;
        }
        const progressionType = this.getLevelUpProgressionType();
        if (choice.track !== progressionType) {
            return false;
        }

        if (choice.track === LEVEL_UP_TRACK_SKILL) {
            const skillDefinition = this.getSkillDefinitionById(choice.id);
            if (!skillDefinition) {
                return false;
            }
            const unlockLevel = Math.max(1, Math.floor(skillDefinition.unlockLevel || 1));
            const currentLevel = this.getCurrentLevelUpStepLevel();
            if (currentLevel < unlockLevel) {
                return false;
            }
            const currentRank = this.getSkillRank(skillDefinition.id);
            return currentRank < getProgressionMaxRank(skillDefinition.maxRank);
        }

        if (choice.track === LEVEL_UP_TRACK_PASSIVE) {
            const passiveDefinition = this.getPassiveDefinitionById(choice.id);
            if (!passiveDefinition) {
                return false;
            }
            const unlockLevel = Math.max(1, Math.floor(passiveDefinition.unlockLevel || 1));
            const currentLevel = this.getCurrentLevelUpStepLevel();
            if (currentLevel < unlockLevel) {
                return false;
            }
            const currentRank = this.getPassiveRank(passiveDefinition.id);
            return currentRank < getProgressionMaxRank(passiveDefinition.maxRank);
        }

        return false;
    }

    applyLevelUpChoice(choice) {
        if (!this.canApplyLevelUpChoice(choice)) {
            return false;
        }
        if (choice.track === LEVEL_UP_TRACK_SKILL) {
            this.skillRanks[choice.id] = this.getSkillRank(choice.id) + 1;
            return true;
        }
        if (choice.track === LEVEL_UP_TRACK_PASSIVE) {
            this.passiveRanks[choice.id] = this.getPassiveRank(choice.id) + 1;
            return true;
        }
        return false;
    }

    getAbilities() {
        const skillTree = getSkillTreeForClass(this.classType);
        if (skillTree.length === 0) {
            return [...DEFAULT_CHARACTER_ABILITIES];
        }
        const availableActions = skillTree
            .filter((skill) => skill && typeof skill.action === 'string' && this.getSkillRank(skill.id) > 0)
            .map((skill) => skill.action);
        const uniqueActions = [...new Set(availableActions)];
        return uniqueActions.length > 0 ? uniqueActions : [...DEFAULT_CHARACTER_ABILITIES];
    }

    performAction(action, monster, target) {
        const currentAttack = this.getCurrentAttack();
        const applyWeaponContactEffects = () => {
            if (!monster) {
                return '';
            }

            const contactMessages = [];
            const numbTurns = Math.max(0, Math.floor(monster.weaponContactNumbTurns || 0));
            if (numbTurns > 0) {
                const damageMultiplier = Number.isFinite(monster.weaponContactDamageReductionMultiplier)
                    ? Math.max(0.1, Math.min(1, Number(monster.weaponContactDamageReductionMultiplier)))
                    : COLD_NUMB_DAMAGE_MULTIPLIER;
                this.applyColdNumb(numbTurns, damageMultiplier);
                const reductionPercent = Math.round((1 - damageMultiplier) * 100);
                const turnLabel = numbTurns > 1 ? 'tours' : 'tour';
                contactMessages.push(`${this.name} est engourdi (${numbTurns} ${turnLabel}, -${reductionPercent}% degats)`);
            }

            const contactFireDamage = Math.max(0, Math.floor(monster.weaponContactFireDamage || 0));
            if (contactFireDamage > 0) {
                const fireDamageTaken = this.takeDamage(contactFireDamage, { damageType: 'fire' });
                contactMessages.push(`${this.name} subit ${fireDamageTaken} degats de feu`);
            }

            const burnTurns = Math.max(0, Math.floor(monster.weaponContactBurnTurns || 0));
            const burnDamage = Math.max(0, Math.floor(monster.weaponContactBurnDamage || 0));
            if (burnTurns > 0 && burnDamage > 0) {
                this.applyBurn(burnDamage, burnTurns);
                const burnTurnLabel = burnTurns > 1 ? 'tours' : 'tour';
                contactMessages.push(`${this.name} est brule (${burnTurns} ${burnTurnLabel})`);
            }

            return contactMessages.length > 0 ? ` ${contactMessages.join(' et ')}.` : '';
        };
        const playSpellCastSound = (volume = 0.78) => {
            if (typeof window.playRandomSpellCast === 'function') {
                window.playRandomSpellCast({ volume });
            }
        };
        const playMeleeHitSound = (volume = 0.9) => {
            if (typeof window.playRandomSwordHit !== 'function') {
                return;
            }
            const hasDualDaggers = this.classType === 'Rogue' && this.isDualWieldingDaggers();
            window.playRandomSwordHit({ volume });
            if (!hasDualDaggers) {
                return;
            }
            window.setTimeout(() => {
                if (typeof window.playRandomSwordHit === 'function') {
                    window.playRandomSwordHit({ volume });
                }
            }, 90);
        };
        const markAssassinationOnCriticalKill = (targetMonster, criticalCount = 0) => {
            this.markAssassinationFollowUpIfEligible(targetMonster, criticalCount);
        };

        if (!monster || !monster.isAlive()) {
            // For non-attack actions, monster may be null. Only return for attack actions.
            if (
                action === 'Coup d epee'
                || action === 'Coup de mort'
                || action === 'Assomer'
                || action === 'Magic Missile'
                || action === 'Backstab'
                || action === 'Attaque au baton'
                || action === 'Attaque rapide'
                || action === 'Coup de baton'
                || action === 'Drain de vie'
                || action === 'Affaiblissement'
                || action === 'Frappe heroique'
                || action === 'Coup devastateur'
                || action === 'Frappe de l ombre'
                || action === 'Pluie de lames'
                || action === 'Malediction funeste'
            ) {
                return `${this.name} n'a pas de cible.`;
            }
        }

        if (action === 'Bloquer') {
            this.isBlocking = true;
            return `${this.name} se prepare a bloquer.`;
        }

        if (action === 'Coup d epee') {
            const baseDamage = Math.max(1, currentAttack);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.9);
            return `${this.name} frappe avec une epee pour ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Coup de mort') {
            if (!this.canUseCoupDeMort()) {
                return `${this.name} ne peut pas encore utiliser Coup de mort (${this.coupDeMortCooldownTurns} tours restants).`;
            }
            this.setCoupDeMortCooldown(3);
            this.clearCoupDeMortFollowUp();
            const baseDamage = Math.max(1, currentAttack + 4);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const targetWasKilled = !monster.isAlive();
            if (targetWasKilled) {
                this.pendingCoupDeMortFollowUp = true;
            }
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.93);
            if (targetWasKilled) {
                return `${this.name} utilise Coup de mort et tue ${monster.name} (${damage} degats). Enchainement disponible !${criticalText}${contactEffectText}`;
            }
            return `${this.name} utilise Coup de mort sur ${monster.name} pour ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Assomer') {
            if (!this.canUseAssomer()) {
                return `${this.name} ne peut pas encore utiliser Assomer (${this.assomerCooldownTurns} tours restants).`;
            }
            this.setAssomerCooldown(3);
            const successChance = this.getAssomerSuccessChance();
            const roll = Math.random();
            if (roll <= successChance) {
                if (typeof monster.applyStun === 'function') {
                    monster.applyStun(2);
                } else {
                    monster.stunnedTurns = Math.max(monster.stunnedTurns || 0, 2);
                }
                const contactEffectText = applyWeaponContactEffects();
                return `${this.name} assome ${monster.name} pour 2 tours !${contactEffectText}`;
            }
            const percent = Math.round(successChance * 100);
            return `${this.name} tente Assomer sur ${monster.name}, mais echoue (${percent}% de chance).`;
        }

        if (action === 'Frappe heroique') {
            const baseDamage = Math.max(1, currentAttack + 8);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.94);
            return `${this.name} declenche Frappe heroique et inflige ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Garde du fer') {
            this.isBlocking = true;
            const shieldAmount = Math.max(12, this.scalePhysicalDamage(Math.max(1, currentAttack + 6), action));
            const appliedValue = this.applyProtectionShield(shieldAmount, 2, true);
            return `${this.name} adopte Garde du fer: blocage actif et ${appliedValue} PV de protection.`;
        }

        if (action === 'Coup devastateur') {
            const baseDamage = Math.max(1, currentAttack + 12);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const stunChance = 0.55;
            let stunText = '';
            if (typeof monster.applyStun === 'function' && Math.random() < stunChance) {
                monster.applyStun(1);
                stunText = ' La cible est etourdie 1 tour.';
            }
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.98);
            return `${this.name} assene un Coup devastateur pour ${damage} degats.${stunText}${criticalText}${contactEffectText}`;
        }

        if (action === 'Magic Missile') {
            if (this.mana < 10) {
                return `${this.name} n'a pas assez de mana.`;
            }
            this.mana -= 10;
            const baseDamage = Math.max(1, currentAttack + 5);
            const rawDamage = this.scaleSpellDamage(baseDamage, action);
            const damage = monster.takeDamage(rawDamage, { damageType: 'magic' });
            playSpellCastSound();
            return `${this.name} lance Magic Missile pour ${damage} degats.`;
        }

        if (action === 'Boule de feu') {
            if (this.mana < 20) {
                return `${this.name} n'a pas assez de mana pour Boule de feu.`;
            }
            this.mana -= 20;
            const baseDamage = Math.max(1, currentAttack + 12);
            const rawDamage = this.scaleSpellDamage(baseDamage, action);
            const damage = monster.takeDamage(rawDamage, { damageType: 'fire' });
            const burnDamage = this.scaleSpellDamage(4, action);
            if (typeof monster.applyBurn === 'function') {
                monster.applyBurn(burnDamage, 2);
            }
            playSpellCastSound();
            return `${this.name} lance Boule de feu sur ${monster.name} pour ${damage} degats et applique Brulure (2 tours).`;
        }

        if (action === 'Attaque au baton') {
            const baseDamage = Math.max(1, currentAttack + 2);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.86);
            return `${this.name} frappe au baton pour ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Coup de baton') {
            const baseDamage = Math.max(1, currentAttack + 2);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.86);
            return `${this.name} donne un coup de baton pour ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Invocation de squelette') {
            if (typeof window.summonSkeletonForCharacter !== 'function') {
                return `Invocation impossible pour le moment.`;
            }
            const summonResult = window.summonSkeletonForCharacter(this);
            if (!summonResult || !summonResult.success) {
                return summonResult && summonResult.message ? summonResult.message : `Invocation echouee.`;
            }
            playSpellCastSound(0.74);
            return summonResult.message;
        }

        if (action === 'Invocation de totem') {
            if (typeof window.summonTotemForCharacter !== 'function') {
                return `Invocation impossible pour le moment.`;
            }
            const summonResult = window.summonTotemForCharacter(this);
            if (!summonResult || !summonResult.success) {
                return summonResult && summonResult.message ? summonResult.message : `Invocation echouee.`;
            }
            playSpellCastSound(0.74);
            return summonResult.message;
        }

        if (action === 'Invocation de totem de mort') {
            if (typeof window.summonDeathTotemForCharacter !== 'function') {
                return `Invocation impossible pour le moment.`;
            }
            const summonResult = window.summonDeathTotemForCharacter(this);
            if (!summonResult || !summonResult.success) {
                return summonResult && summonResult.message ? summonResult.message : `Invocation echouee.`;
            }
            playSpellCastSound(0.74);
            return summonResult.message;
        }

        if (action === 'Drain de vie') {
            const manaCost = 14;
            if (this.mana < manaCost) {
                return `${this.name} n'a pas assez de mana pour Drain de vie.`;
            }
            this.mana -= manaCost;
            const baseDamage = Math.max(1, currentAttack + 6);
            const rawDamage = this.scaleSpellDamage(baseDamage, action);
            const damage = monster.takeDamage(rawDamage, { damageType: 'magic', ignoreArmor: true });
            const expectedHeal = Math.max(1, Math.round(damage * 0.6));
            const beforeHealth = this.health;
            this.health = Math.min(this.maxHealth, this.health + expectedHeal);
            const restored = Math.max(0, this.health - beforeHealth);
            playSpellCastSound();
            return `${this.name} draine ${damage} PV de ${monster.name} et recupere ${restored} PV.`;
        }

        if (action === 'Affaiblissement') {
            const manaCost = 12;
            if (this.mana < manaCost) {
                return `${this.name} n'a pas assez de mana pour Affaiblissement.`;
            }
            this.mana -= manaCost;
            const weakenAmount = this.scaleMagicSpellPower(5, 1, action);
            const weakenTurns = 3;
            playSpellCastSound(0.76);
            if (typeof monster.applyAttackWeakness !== 'function') {
                return `${this.name} lance Affaiblissement sur ${monster.name}.`;
            }
            monster.applyAttackWeakness(weakenAmount, weakenTurns);
            const weaknessText = typeof monster.getAttackWeaknessText === 'function'
                ? monster.getAttackWeaknessText()
                : `Affaibli: -${weakenAmount} attaque`;
            return `${this.name} lance Affaiblissement sur ${monster.name}. ${weaknessText}`;
        }

        if (action === 'Malediction funeste') {
            const manaCost = 18;
            if (this.mana < manaCost) {
                return `${this.name} n'a pas assez de mana pour Malediction funeste.`;
            }
            this.mana -= manaCost;
            const baseDamage = Math.max(1, currentAttack + 4);
            const rawDamage = this.scaleSpellDamage(baseDamage, action);
            const damage = monster.takeDamage(rawDamage, { damageType: 'magic' });
            const weakenAmount = this.scaleMagicSpellPower(7, 2, action);
            const weakenTurns = 3;
            if (typeof monster.applyAttackWeakness === 'function') {
                monster.applyAttackWeakness(weakenAmount, weakenTurns);
            }
            playSpellCastSound();
            return `${this.name} maudit ${monster.name}: ${damage} degats et -${weakenAmount} attaque pendant ${weakenTurns} tours.`;
        }

        if (action === 'Soin') {
            if (this.mana < 10) {
                return `${this.name} n'a pas assez de mana.`;
            }
            this.mana -= 10;
            const heal = this.scaleMagicSpellPower(25, 1, action);
            if (target && typeof target.health === 'number') {
                target.health = Math.min(target.maxHealth, target.health + heal);
                playSpellCastSound(0.72);
                return `${this.name} soigne ${target.name} de ${heal} PV.`;
            }
            this.health = Math.min(this.maxHealth, this.health + heal);
            playSpellCastSound(0.72);
            return `${this.name} se soigne de ${heal} PV.`;
        }

        if (action === 'Protection') {
            const manaCost = 16;
            if (this.mana < manaCost) {
                return `${this.name} n'a pas assez de mana pour Protection.`;
            }
            if (!target || typeof target.applyProtectionShield !== 'function' || !target.isAlive()) {
                return `${this.name} n'a pas de cible valide pour Protection.`;
            }
            this.mana -= manaCost;
            const shieldAmount = this.scaleMagicSpellPower(20, 1, action);
            const shieldTurns = 3;
            const appliedValue = target.applyProtectionShield(shieldAmount, shieldTurns, target === this);
            playSpellCastSound(0.73);
            return `${this.name} protege ${target.name} (${appliedValue} PV, ${shieldTurns} tours).`;
        }

        if (action === 'Soin de groupe') {
            const manaCost = 22;
            if (this.mana < manaCost) {
                return `${this.name} n'a pas assez de mana pour Soin de groupe.`;
            }
            this.mana -= manaCost;
            const aliveAllies = characters.filter((character) => character && character.isAlive());
            const baseHeal = this.scaleMagicSpellPower(10, 6, action);
            let totalRestored = 0;
            aliveAllies.forEach((ally) => {
                const beforeHealth = ally.health;
                ally.health = Math.min(ally.maxHealth, ally.health + baseHeal);
                totalRestored += Math.max(0, ally.health - beforeHealth);
            });
            playSpellCastSound(0.72);
            return `${this.name} lance Soin de groupe et restaure ${totalRestored} PV au groupe.`;
        }

        if (action === 'Renouveau') {
            const manaCost = 26;
            if (this.mana < manaCost) {
                return `${this.name} n'a pas assez de mana pour Renouveau.`;
            }
            this.mana -= manaCost;
            const aliveAllies = characters.filter((character) => character && character.isAlive());
            const healPerAlly = this.scaleMagicSpellPower(18, 10, action);
            let totalRestored = 0;
            aliveAllies.forEach((ally) => {
                const beforeHealth = ally.health;
                ally.health = Math.min(ally.maxHealth, ally.health + healPerAlly);
                totalRestored += Math.max(0, ally.health - beforeHealth);
            });
            playSpellCastSound(0.74);
            return `${this.name} invoque Renouveau et restaure ${totalRestored} PV au groupe.`;
        }

        if (action === 'Backstab') {
            if (!this.canUseBackstab()) {
                return `${this.name} ne peut pas encore utiliser Backstab (${this.backstabCooldownTurns} tours restants).`;
            }

            this.setBackstabCooldown(3);
            const successChance = this.getBackstabSuccessChance(monster);
            const roll = Math.random();
            if (roll > successChance) {
                const percent = Math.round(successChance * 100);
                return `${this.name} tente Backstab sur ${monster.name}, mais echoue (${percent}% de chance).`;
            }

            const baseDamage = Math.max(1, (currentAttack + 7) * 3);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.9);
            return `${this.name} reussit Backstab et inflige ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Evasion') {
            this.isBlocking = true;
            const shieldAmount = Math.max(10, this.scalePhysicalDamage(Math.max(1, currentAttack + 2), action));
            const appliedValue = this.applyProtectionShield(shieldAmount, 1, true);
            return `${this.name} utilise Evasion et gagne ${appliedValue} PV de protection temporaire.`;
        }

        if (action === 'Frappe de l ombre') {
            const baseDamage = Math.max(1, currentAttack + 6);
            const rawDamage = this.scalePhysicalDamage(baseDamage, action);
            const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
            const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
            const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
            markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
            const contactEffectText = applyWeaponContactEffects();
            playMeleeHitSound(0.9);
            return `${this.name} execute Frappe de l ombre et inflige ${damage} degats.${criticalText}${contactEffectText}`;
        }

        if (action === 'Pluie de lames') {
            const firstRawDamage = this.scalePhysicalDamage(Math.max(1, currentAttack + 1), action);
            const firstOutcome = this.rollPhysicalCriticalDamage(firstRawDamage);
            const firstDamage = monster.takeDamage(firstOutcome.damage, { damageType: 'physical' });
            const contactEffectText = applyWeaponContactEffects();
            let criticalCount = firstOutcome.isCritical ? 1 : 0;
            markAssassinationOnCriticalKill(monster, criticalCount);
            playMeleeHitSound(0.9);
            if (!monster.isAlive()) {
                return `${this.name} dechaine Pluie de lames et inflige ${firstDamage} degats.${this.getCriticalHitText(criticalCount)}${contactEffectText}`;
            }
            const secondRawDamage = this.scalePhysicalDamage(Math.max(1, currentAttack + 1), action);
            const secondOutcome = this.rollPhysicalCriticalDamage(secondRawDamage);
            const secondDamage = monster.takeDamage(secondOutcome.damage, { damageType: 'physical' });
            if (secondOutcome.isCritical) {
                criticalCount += 1;
            }
            markAssassinationOnCriticalKill(monster, criticalCount);
            if (!monster.isAlive()) {
                return `${this.name} dechaine Pluie de lames et inflige ${firstDamage} + ${secondDamage} degats.${this.getCriticalHitText(criticalCount)}${contactEffectText}`;
            }
            const thirdRawDamage = this.scalePhysicalDamage(Math.max(1, currentAttack + 1), action);
            const thirdOutcome = this.rollPhysicalCriticalDamage(thirdRawDamage);
            const thirdDamage = monster.takeDamage(thirdOutcome.damage, { damageType: 'physical' });
            if (thirdOutcome.isCritical) {
                criticalCount += 1;
            }
            markAssassinationOnCriticalKill(monster, criticalCount);
            return `${this.name} dechaine Pluie de lames et inflige ${firstDamage} + ${secondDamage} + ${thirdDamage} degats.${this.getCriticalHitText(criticalCount)}${contactEffectText}`;
        }

        if (action === 'Attaque rapide') {
            const firstRawDamage = this.scalePhysicalDamage(Math.max(1, currentAttack - 1), action);
            const firstOutcome = this.rollPhysicalCriticalDamage(firstRawDamage);
            const damage = monster.takeDamage(firstOutcome.damage, { damageType: 'physical' });
            const contactEffectText = applyWeaponContactEffects();
            let criticalCount = firstOutcome.isCritical ? 1 : 0;
            markAssassinationOnCriticalKill(monster, criticalCount);
            playMeleeHitSound(0.88);
            if (this.classType === 'Rogue' && this.isDualWieldingDaggers()) {
                if (!monster.isAlive()) {
                    return `${this.name} attaque rapidement avec deux dagues et inflige ${damage} degats.${this.getCriticalHitText(criticalCount)}${contactEffectText}`;
                }
                const secondRawDamage = this.scalePhysicalDamage(Math.max(1, currentAttack - 1), action);
                const secondOutcome = this.rollPhysicalCriticalDamage(secondRawDamage);
                const secondDamage = monster.takeDamage(secondOutcome.damage, { damageType: 'physical' });
                if (secondOutcome.isCritical) {
                    criticalCount += 1;
                }
                markAssassinationOnCriticalKill(monster, criticalCount);
                return `${this.name} attaque rapidement avec deux dagues et inflige ${damage} + ${secondDamage} degats.${this.getCriticalHitText(criticalCount)}${contactEffectText}`;
            }
            return `${this.name} attaque rapidement pour ${damage} degats.${this.getCriticalHitText(criticalCount)}${contactEffectText}`;
        }

        const rawDamage = this.scalePhysicalDamage(Math.max(1, currentAttack), action);
        const criticalOutcome = this.rollPhysicalCriticalDamage(rawDamage);
        const damage = monster.takeDamage(criticalOutcome.damage, { damageType: 'physical' });
        const criticalText = this.getCriticalHitText(criticalOutcome.isCritical ? 1 : 0);
        markAssassinationOnCriticalKill(monster, criticalOutcome.isCritical ? 1 : 0);
        const contactEffectText = applyWeaponContactEffects();
        playMeleeHitSound(0.9);
        return `${this.name} attaque pour ${damage} degats.${criticalText}${contactEffectText}`;
    }

    getXpPerLevel() {
        return CLASS_XP_PER_LEVEL[this.classType] || CLASS_XP_PER_LEVEL.default;
    }

    getLevelUpStatPoints() {
        return LEVEL_UP_STAT_POINTS;
    }

    getExperienceNeededForNextLevel() {
        return Math.max(1, this.level * this.getXpPerLevel());
    }

    getExperienceProgressText() {
        return `${this.experience}/${this.getExperienceNeededForNextLevel()}`;
    }

    gainExperience(amount) {
        const gainedExperience = Math.max(0, Math.floor(amount || 0));
        if (gainedExperience <= 0) {
            return;
        }

        this.experience += gainedExperience;
        while (this.experience >= this.getExperienceNeededForNextLevel()) {
            this.experience -= this.getExperienceNeededForNextLevel();
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.unspentStatPoints += this.getLevelUpStatPoints();
        this.pendingLevelUp = true;
    }

    canAllocateLevelUpStats(pointsByStat) {
        if (!pointsByStat || typeof pointsByStat !== 'object') {
            return false;
        }
        const pointsToSpend = this.getCurrentLevelUpStatPointBudget();
        if (pointsToSpend <= 0) {
            return false;
        }
        const statKeys = ['strength', 'intelligence', 'vitality', 'perception', 'magic'];
        let total = 0;
        for (let i = 0; i < statKeys.length; i += 1) {
            const key = statKeys[i];
            const value = pointsByStat[key];
            if (!Number.isInteger(value) || value < 0) {
                return false;
            }
            total += value;
        }
        return total === pointsToSpend;
    }

    allocateLevelUpStats(pointsByStat) {
        if (!this.canAllocateLevelUpStats(pointsByStat)) {
            return false;
        }
        const pointsSpent = pointsByStat.strength
            + pointsByStat.intelligence
            + pointsByStat.vitality
            + pointsByStat.perception
            + pointsByStat.magic;

        this.strength += pointsByStat.strength;
        this.intelligence += pointsByStat.intelligence;
        this.vitality += pointsByStat.vitality;
        this.perception += pointsByStat.perception;
        this.magic += pointsByStat.magic;

        const healthGain = pointsByStat.vitality * 2;
        if (healthGain > 0) {
            this.maxHealth += healthGain;
            this.health = Math.min(this.maxHealth, this.health + healthGain);
        }

        const manaGain = pointsByStat.intelligence;
        if (manaGain > 0) {
            this.maxMana += manaGain;
            this.mana = Math.min(this.maxMana, this.mana + manaGain);
        }

        this.unspentStatPoints = Math.max(0, this.unspentStatPoints - pointsSpent);
        return true;
    }

    completeLevelUp(pointsByStat, progressionChoice) {
        const availableChoices = this.getAvailableLevelUpChoices();
        const requiresProgressionChoice = availableChoices.length > 0;
        if (!this.canAllocateLevelUpStats(pointsByStat)) {
            return false;
        }
        if (requiresProgressionChoice && !this.canApplyLevelUpChoice(progressionChoice)) {
            return false;
        }

        let appliedProgression = null;
        if (requiresProgressionChoice) {
            const choiceApplied = this.applyLevelUpChoice(progressionChoice);
            if (!choiceApplied) {
                return false;
            }
            appliedProgression = {
                track: progressionChoice.track,
                id: progressionChoice.id
            };
        }

        const statsApplied = this.allocateLevelUpStats(pointsByStat);
        if (!statsApplied) {
            if (appliedProgression) {
                if (appliedProgression.track === LEVEL_UP_TRACK_SKILL) {
                    this.skillRanks[appliedProgression.id] = Math.max(0, this.getSkillRank(appliedProgression.id) - 1);
                } else if (appliedProgression.track === LEVEL_UP_TRACK_PASSIVE) {
                    this.passiveRanks[appliedProgression.id] = Math.max(0, this.getPassiveRank(appliedProgression.id) - 1);
                }
            }
            return false;
        }

        this.pendingLevelUp = this.unspentStatPoints > 0;
        return true;
    }

    applyItemBonuses(item, multiplier) {
        const statBonuses = getItemPrimaryStatBonuses(item);
        const resistanceBonuses = getItemDamageResistanceBonuses(item);
        const strengthDelta = statBonuses.strengthBonus * multiplier;
        const intelligenceDelta = statBonuses.intelligenceBonus * multiplier;
        const vitalityDelta = statBonuses.vitalityBonus * multiplier;
        const perceptionDelta = statBonuses.perceptionBonus * multiplier;
        const magicDelta = statBonuses.magicBonus * multiplier;

        this.strength += strengthDelta;
        this.intelligence += intelligenceDelta;
        this.vitality += vitalityDelta;
        this.perception += perceptionDelta;
        this.magic += magicDelta;

        const maxHealthDelta = vitalityDelta * 2;
        if (maxHealthDelta !== 0) {
            this.maxHealth += maxHealthDelta;
            if (maxHealthDelta > 0) {
                this.health = Math.min(this.maxHealth, this.health + maxHealthDelta);
            } else {
                this.health = Math.min(this.health, this.maxHealth);
            }
        }

        const maxManaDelta = intelligenceDelta;
        if (maxManaDelta !== 0) {
            this.maxMana += maxManaDelta;
            if (maxManaDelta > 0) {
                this.mana = Math.min(this.maxMana, this.mana + maxManaDelta);
            } else {
                this.mana = Math.min(this.mana, this.maxMana);
            }
        }

        this.manaRegenPerTurn += (item.manaRegenBonus || 0) * multiplier;
        DAMAGE_RESISTANCE_CONFIG.forEach((entry) => {
            const resistanceDelta = (resistanceBonuses[entry.bonusField] || 0) * multiplier;
            if (resistanceDelta === 0) {
                return;
            }
            const currentValue = this.damageResistances[entry.type] || 0;
            this.damageResistances[entry.type] = currentValue + resistanceDelta;
        });
    }

    equipItem(item) {
        if (!item || !EQUIPMENT_SLOTS.includes(item.type)) {
            return null;
        }

        const slot = item.type;
        let previousItem = null;
        if (this.equipment[slot]) {
            previousItem = this.equipment[slot];
            this.applyItemBonuses(previousItem, -1);
        }

        this.equipment[slot] = item;
        this.applyItemBonuses(item, 1);
        return previousItem;
    }

    unequipItem(slot) {
        if (!EQUIPMENT_SLOTS.includes(slot)) {
            return null;
        }
        const equippedItem = this.equipment[slot];
        if (!equippedItem) {
            return null;
        }
        this.applyItemBonuses(equippedItem, -1);
        this.equipment[slot] = null;
        return equippedItem;
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
        const damageType = getNormalizedDamageType(normalizedOptions.damageType || 'physical');
        const resistancePercent = this.getDamageResistance(damageType);
        const resolver = (typeof window !== 'undefined' && typeof window.resolveDamageWithType === 'function')
            ? window.resolveDamageWithType
            : (rawDamage, context = {}) => {
                const reducedByArmor = context.ignoreArmor ? Math.max(1, Math.floor(rawDamage || 0)) : armorFormula(rawDamage, context.armorValue || 0);
                const normalizedResistance = clampResistancePercent(context.resistancePercent || 0);
                return Math.max(1, Math.round(reducedByArmor * (1 - (normalizedResistance / 100))));
            };
        let finalDamage = resolver(damage, {
            armorValue: this.defense,
            damageType,
            resistancePercent,
            ignoreArmor: Boolean(normalizedOptions.ignoreArmor),
            minDamage: 1
        });
        if (this.isBlocking && !normalizedOptions.ignoreBlocking) {
            finalDamage = Math.max(1, Math.floor(finalDamage / 2));
            this.isBlocking = false;
        }
        finalDamage = this.absorbProtectionDamage(finalDamage);
        this.health -= finalDamage;
        if (finalDamage > 0 && typeof window.queueDamageFlash === 'function') {
            window.queueDamageFlash(this, finalDamage);
        }
        if (finalDamage > 0 && this.health > 0 && normalizedOptions.enableRiposte === true && !normalizedOptions.ignoreRiposte) {
            const riposteOutcome = this.triggerRiposte(normalizedOptions.attacker, { suppressLog: true });
            normalizedOptions.riposteOutcome = riposteOutcome;
        }
        if (this.health <= 0) {
            this.health = 0;
            console.log(`${this.name} est mort!`);
        }
        return finalDamage;
    }

    isAlive() {
        return this.health > 0;
    }
}

const characters = [];

function getStartingEquipmentKit(classType) {
    return STARTING_EQUIPMENT_KITS[classType] || STARTING_EQUIPMENT_KITS.default;
}

function equipStartingEquipment(character) {
    const kit = getStartingEquipmentKit(character.classType);
    kit.forEach((template) => {
        if (!template || !EQUIPMENT_SLOTS.includes(template.type) || character.equipment[template.type]) {
            return;
        }
        const starterItem = {
            id: template.id,
            name: template.name,
            type: template.type,
            attackBonus: template.attackBonus || 0,
            defenseBonus: template.defenseBonus || 0,
            strengthBonus: template.strengthBonus || 0,
            intelligenceBonus: template.intelligenceBonus || 0,
            vitalityBonus: template.vitalityBonus || 0,
            perceptionBonus: template.perceptionBonus || 0,
            magicBonus: template.magicBonus || 0,
            manaRegenBonus: template.manaRegenBonus || 0,
            ...buildItemDamageResistanceBonusFields(template),
            rarity: normalizeItemRarity(template.rarity)
        };
        const eligibility = canCharacterEquipItem(character, starterItem);
        if (!eligibility.allowed) {
            return;
        }
        character.equipItem(starterItem);
    });
}

function createCharacter(name, classType) {
    if (characters.length < 6) {
        const char = new Character(name, classType);
        equipStartingEquipment(char);
        characters.push(char);
        updateCharacterUI();
        return char;
    }
    return null;
}

function formatItemBonuses(item) {
    const bonuses = [];
    const statBonuses = getItemPrimaryStatBonuses(item);
    const resistanceBonuses = getItemDamageResistanceBonuses(item);
    if (statBonuses.strengthBonus) {
        bonuses.push(`+${statBonuses.strengthBonus} Force`);
    }
    if (statBonuses.intelligenceBonus) {
        bonuses.push(`+${statBonuses.intelligenceBonus} Int`);
    }
    if (statBonuses.vitalityBonus) {
        bonuses.push(`+${statBonuses.vitalityBonus} Vit`);
    }
    if (statBonuses.perceptionBonus) {
        bonuses.push(`+${statBonuses.perceptionBonus} Per`);
    }
    if (statBonuses.magicBonus) {
        bonuses.push(`+${statBonuses.magicBonus} Magie`);
    }
    if (item.manaRegenBonus) {
        bonuses.push(`+${item.manaRegenBonus} Mana/tour`);
    }
    DAMAGE_RESISTANCE_CONFIG.forEach((entry) => {
        const value = Math.round(resistanceBonuses[entry.bonusField] || 0);
        if (value === 0) {
            return;
        }
        bonuses.push(`${entry.label} ${formatSignedPercent(value)}`);
    });
    if (item.healAmount) {
        bonuses.push(`+${item.healAmount} PV`);
    }
    if (item.manaAmount) {
        bonuses.push(`+${item.manaAmount} Mana`);
    }
    return bonuses.length > 0 ? `(${bonuses.join(', ')})` : '';
}

function normalizeItemRarity(rarity) {
    if (ITEM_RARITIES.includes(rarity)) {
        return rarity;
    }
    return 'common';
}

function getItemRarityLabel(rarity) {
    return ITEM_RARITY_LABELS[normalizeItemRarity(rarity)];
}

function getItemRarityClass(rarity) {
    return ITEM_RARITY_CLASSES[normalizeItemRarity(rarity)];
}

function formatItemNameWithBonuses(item) {
    const bonuses = formatItemBonuses(item);
    return bonuses ? `${item.name} ${bonuses}` : item.name;
}

function formatEquippedItemHtml(item) {
    if (!item) {
        return '<span class="equipped-none">Aucune</span>';
    }
    const rarityClass = getItemRarityClass(item.rarity);
    const rarityLabel = getItemRarityLabel(item.rarity);
    const itemName = formatItemNameWithBonuses(item);
    const iconPath = getInventoryItemImagePath(item);
    const iconHtml = iconPath ? `<img class="inventory-inline-icon" src="${iconPath}" alt="Objet">` : '';
    return `<span class="equipped-item ${rarityClass}">${iconHtml}<span>${itemName}</span></span> <span class="rarity-tag ${rarityClass}">${rarityLabel}</span>`;
}

function formatEquipmentSummary(char) {
    return EQUIPMENT_SLOTS
        .map((slot) => `${EQUIPMENT_SLOT_LABELS[slot]}: ${formatEquippedItemHtml(char.equipment[slot])}`)
        .join(' | ');
}

function getInventoryStackById(itemId) {
    return partyInventory.find((stack) => stack.id === itemId);
}

function createGeneratedInventoryItemId(prefix = 'loot') {
    const rawPrefix = String(prefix || 'loot').toLowerCase();
    const normalizedPrefix = rawPrefix.replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'loot';
    const timestamp = Date.now().toString(36);
    const counter = generatedInventoryItemCounter++;
    return `${normalizedPrefix}_${timestamp}_${counter}`;
}

function isCombatPotionStack(stack) {
    if (!stack || stack.type !== 'consumable') {
        return false;
    }
    return stack.consumableKind === 'health' || stack.consumableKind === 'mana';
}

function getCombatPotionsForCharacter(character) {
    if (!character) {
        return [];
    }
    return partyInventory
        .filter((stack) => stack.quantity > 0 && isCombatPotionStack(stack))
        .map((stack) => ({
            id: stack.id,
            name: stack.name,
            quantity: stack.quantity,
            consumableKind: stack.consumableKind,
            healAmount: Math.max(0, Math.floor(stack.healAmount || 0)),
            manaAmount: Math.max(0, Math.floor(stack.manaAmount || 0)),
            rarity: normalizeItemRarity(stack.rarity)
        }));
}

function usePotionInCombat(character, potionId) {
    if (!character || !potionId) {
        return { success: false, message: 'Action impossible.' };
    }

    const stack = getInventoryStackById(potionId);
    if (!stack || stack.quantity <= 0 || !isCombatPotionStack(stack)) {
        return { success: false, message: 'Potion indisponible.' };
    }

    if (stack.consumableKind === 'health') {
        if (character.health >= character.maxHealth) {
            return { success: false, message: `${character.name} a deja tous ses PV.` };
        }
        const healAmount = Math.max(1, Math.floor(stack.healAmount || 0));
        stack.quantity -= 1;
        const beforeHealth = character.health;
        character.health = Math.min(character.maxHealth, character.health + healAmount);
        const restored = Math.max(0, character.health - beforeHealth);
        return { success: true, message: `${character.name} boit ${stack.name} et recupere ${restored} PV.` };
    }

    if (stack.consumableKind === 'mana') {
        if (character.mana >= character.maxMana) {
            return { success: false, message: `${character.name} a deja tout son mana.` };
        }
        const manaAmount = Math.max(1, Math.floor(stack.manaAmount || 0));
        stack.quantity -= 1;
        const beforeMana = character.mana;
        character.mana = Math.min(character.maxMana, character.mana + manaAmount);
        const restored = Math.max(0, character.mana - beforeMana);
        return { success: true, message: `${character.name} boit ${stack.name} et recupere ${restored} mana.` };
    }

    return { success: false, message: 'Potion invalide.' };
}

function takeItemFromInventory(itemId) {
    const stack = getInventoryStackById(itemId);
    if (!stack || stack.quantity <= 0) {
        return null;
    }
    stack.quantity -= 1;
    return {
        id: stack.id,
        name: stack.name,
        type: stack.type,
        attackBonus: stack.attackBonus || 0,
        defenseBonus: stack.defenseBonus || 0,
        strengthBonus: stack.strengthBonus || 0,
        intelligenceBonus: stack.intelligenceBonus || 0,
        vitalityBonus: stack.vitalityBonus || 0,
        perceptionBonus: stack.perceptionBonus || 0,
        magicBonus: stack.magicBonus || 0,
        manaRegenBonus: stack.manaRegenBonus || 0,
        ...buildItemDamageResistanceBonusFields(stack),
        consumableKind: stack.consumableKind || '',
        healAmount: stack.healAmount || 0,
        manaAmount: stack.manaAmount || 0,
        rarity: normalizeItemRarity(stack.rarity),
        excludeFromDropPool: Boolean(stack.excludeFromDropPool),
        isBossRelic: Boolean(stack.isBossRelic),
        bossTier: Math.max(0, Math.floor(stack.bossTier || 0)),
        bossKey: stack.bossKey || ''
    };
}

function discardInventoryItem(itemId, quantity = 1) {
    const stack = getInventoryStackById(itemId);
    if (!stack || stack.quantity <= 0) {
        return false;
    }

    const discardAmount = Math.max(1, Math.floor(quantity || 1));
    const removedQuantity = Math.min(stack.quantity, discardAmount);
    stack.quantity -= removedQuantity;

    if (stack.quantity <= 0) {
        const stackIndex = partyInventory.findIndex((entry) => entry.id === itemId);
        if (stackIndex >= 0) {
            partyInventory.splice(stackIndex, 1);
        }
    }

    const quantityPrefix = removedQuantity > 1 ? `x${removedQuantity} ` : '';
    logInventoryMessage(`Objet jete: ${quantityPrefix}${stack.name}.`);
    updateCharacterUI();
    renderInventoryModal();

    if (typeof updateCombatUI === 'function' && typeof inCombat !== 'undefined' && inCombat) {
        updateCombatUI();
    }
    return true;
}

function returnItemToInventory(item) {
    const stack = getInventoryStackById(item.id);
    if (stack) {
        stack.quantity += 1;
        return;
    }
    partyInventory.push({
        id: item.id,
        name: item.name,
        type: item.type,
        attackBonus: item.attackBonus || 0,
        defenseBonus: item.defenseBonus || 0,
        strengthBonus: item.strengthBonus || 0,
        intelligenceBonus: item.intelligenceBonus || 0,
        vitalityBonus: item.vitalityBonus || 0,
        perceptionBonus: item.perceptionBonus || 0,
        magicBonus: item.magicBonus || 0,
        manaRegenBonus: item.manaRegenBonus || 0,
        ...buildItemDamageResistanceBonusFields(item),
        consumableKind: item.consumableKind || '',
        healAmount: item.healAmount || 0,
        manaAmount: item.manaAmount || 0,
        rarity: normalizeItemRarity(item.rarity),
        excludeFromDropPool: Boolean(item.excludeFromDropPool),
        isBossRelic: Boolean(item.isBossRelic),
        bossTier: Math.max(0, Math.floor(item.bossTier || 0)),
        bossKey: item.bossKey || '',
        quantity: 1
    });
}

function getInventoryDropPool() {
    return partyInventory
        .filter((stack) => !stack.excludeFromDropPool)
        .map((stack) => ({
        id: stack.id,
        name: stack.name,
        type: stack.type,
        attackBonus: stack.attackBonus || 0,
        defenseBonus: stack.defenseBonus || 0,
        strengthBonus: stack.strengthBonus || 0,
        intelligenceBonus: stack.intelligenceBonus || 0,
        vitalityBonus: stack.vitalityBonus || 0,
        perceptionBonus: stack.perceptionBonus || 0,
        magicBonus: stack.magicBonus || 0,
        manaRegenBonus: stack.manaRegenBonus || 0,
        ...buildItemDamageResistanceBonusFields(stack),
        consumableKind: stack.consumableKind || '',
        healAmount: stack.healAmount || 0,
        manaAmount: stack.manaAmount || 0,
        rarity: normalizeItemRarity(stack.rarity)
        }));
}

function addItemToPartyInventory(itemId) {
    const stack = getInventoryStackById(itemId);
    if (!stack) {
        return null;
    }

    stack.quantity += 1;
    return {
        id: stack.id,
        name: stack.name,
        type: stack.type,
        attackBonus: stack.attackBonus || 0,
        defenseBonus: stack.defenseBonus || 0,
        strengthBonus: stack.strengthBonus || 0,
        intelligenceBonus: stack.intelligenceBonus || 0,
        vitalityBonus: stack.vitalityBonus || 0,
        perceptionBonus: stack.perceptionBonus || 0,
        magicBonus: stack.magicBonus || 0,
        manaRegenBonus: stack.manaRegenBonus || 0,
        ...buildItemDamageResistanceBonusFields(stack),
        consumableKind: stack.consumableKind || '',
        healAmount: stack.healAmount || 0,
        manaAmount: stack.manaAmount || 0,
        rarity: normalizeItemRarity(stack.rarity),
        excludeFromDropPool: Boolean(stack.excludeFromDropPool),
        isBossRelic: Boolean(stack.isBossRelic),
        bossTier: Math.max(0, Math.floor(stack.bossTier || 0)),
        bossKey: stack.bossKey || ''
    };
}

function addGeneratedItemToPartyInventory(item, options = {}) {
    if (!item || typeof item !== 'object' || !item.type || !item.name) {
        return null;
    }
    const idPrefix = options && typeof options.idPrefix === 'string' ? options.idPrefix : 'loot';
    const explicitId = typeof item.id === 'string' ? item.id.trim() : '';
    const itemId = explicitId || createGeneratedInventoryItemId(idPrefix);
    const existingStack = getInventoryStackById(itemId);
    if (existingStack) {
        existingStack.quantity += 1;
        return {
            id: existingStack.id,
            name: existingStack.name,
            type: existingStack.type,
            attackBonus: existingStack.attackBonus || 0,
            defenseBonus: existingStack.defenseBonus || 0,
            strengthBonus: existingStack.strengthBonus || 0,
            intelligenceBonus: existingStack.intelligenceBonus || 0,
            vitalityBonus: existingStack.vitalityBonus || 0,
            perceptionBonus: existingStack.perceptionBonus || 0,
            magicBonus: existingStack.magicBonus || 0,
            manaRegenBonus: existingStack.manaRegenBonus || 0,
            ...buildItemDamageResistanceBonusFields(existingStack),
            consumableKind: existingStack.consumableKind || '',
            healAmount: existingStack.healAmount || 0,
            manaAmount: existingStack.manaAmount || 0,
            rarity: normalizeItemRarity(existingStack.rarity),
            excludeFromDropPool: Boolean(existingStack.excludeFromDropPool),
            isBossRelic: Boolean(existingStack.isBossRelic),
            bossTier: Math.max(0, Math.floor(existingStack.bossTier || 0)),
            bossKey: existingStack.bossKey || ''
        };
    }

    const stack = {
        id: itemId,
        name: item.name,
        type: item.type,
        attackBonus: Math.floor(item.attackBonus || 0),
        defenseBonus: Math.floor(item.defenseBonus || 0),
        strengthBonus: Math.floor(item.strengthBonus || 0),
        intelligenceBonus: Math.floor(item.intelligenceBonus || 0),
        vitalityBonus: Math.floor(item.vitalityBonus || 0),
        perceptionBonus: Math.floor(item.perceptionBonus || 0),
        magicBonus: Math.floor(item.magicBonus || 0),
        manaRegenBonus: Math.floor(item.manaRegenBonus || 0),
        ...buildItemDamageResistanceBonusFields(item),
        consumableKind: item.consumableKind || '',
        healAmount: Math.floor(item.healAmount || 0),
        manaAmount: Math.floor(item.manaAmount || 0),
        rarity: normalizeItemRarity(item.rarity),
        excludeFromDropPool: Boolean(item.excludeFromDropPool),
        isBossRelic: Boolean(item.isBossRelic),
        bossTier: Math.max(0, Math.floor(item.bossTier || 0)),
        bossKey: item.bossKey || '',
        quantity: 1
    };
    partyInventory.push(stack);
    return {
        id: stack.id,
        name: stack.name,
        type: stack.type,
        attackBonus: stack.attackBonus || 0,
        defenseBonus: stack.defenseBonus || 0,
        strengthBonus: stack.strengthBonus || 0,
        intelligenceBonus: stack.intelligenceBonus || 0,
        vitalityBonus: stack.vitalityBonus || 0,
        perceptionBonus: stack.perceptionBonus || 0,
        magicBonus: stack.magicBonus || 0,
        manaRegenBonus: stack.manaRegenBonus || 0,
        ...buildItemDamageResistanceBonusFields(stack),
        consumableKind: stack.consumableKind || '',
        healAmount: stack.healAmount || 0,
        manaAmount: stack.manaAmount || 0,
        rarity: normalizeItemRarity(stack.rarity),
        excludeFromDropPool: Boolean(stack.excludeFromDropPool),
        isBossRelic: Boolean(stack.isBossRelic),
        bossTier: Math.max(0, Math.floor(stack.bossTier || 0)),
        bossKey: stack.bossKey || ''
    };
}

function logInventoryMessage(message) {
    if (typeof logMessage === 'function') {
        logMessage(message);
    }
}

function updateCharacterUI() {
    const container = document.getElementById('characters');
    if (!container) {
        return;
    }

    container.innerHTML = '';
    characters.forEach((char, index) => {
        const div = document.createElement('div');
        div.className = 'character';
        const portraitPath = CHARACTER_PORTRAITS[char.classType] || '';
        const healthPercent = char.maxHealth > 0 ? Math.max(0, Math.min(100, Math.round((char.health / char.maxHealth) * 100))) : 0;
        const manaPercent = char.maxMana > 0 ? Math.max(0, Math.min(100, Math.round((char.mana / char.maxMana) * 100))) : 0;
        const resourceBarsHtml = `
            <div class="resource-bars">
                <div class="resource-block">
                    <div class="resource-row"><span>PV</span><span>${char.health}/${char.maxHealth}</span></div>
                    <div class="resource-bar"><div class="resource-fill resource-fill-health" style="width: ${healthPercent}%;"></div></div>
                </div>
                ${classUsesMana(char.classType) ? `
                <div class="resource-block">
                    <div class="resource-row"><span>Mana</span><span>${char.mana}/${char.maxMana}</span></div>
                    <div class="resource-bar"><div class="resource-fill resource-fill-mana" style="width: ${manaPercent}%;"></div></div>
                </div>
                ` : ''}
            </div>
        `;
        const weaknessText = char.getAttackWeaknessText();
        const weaknessLine = weaknessText ? `<br><span class="debuff-status">${weaknessText}</span>` : '';
        const webText = typeof char.getWebStatusText === 'function' ? char.getWebStatusText() : '';
        const webLine = webText ? `<br><span class="debuff-status">${webText}</span>` : '';
        const coldNumbText = typeof char.getColdNumbStatusText === 'function' ? char.getColdNumbStatusText() : '';
        const coldNumbLine = coldNumbText ? `<br><span class="debuff-status">${coldNumbText}</span>` : '';
        const burnText = typeof char.getBurnStatusText === 'function' ? char.getBurnStatusText() : '';
        const burnLine = burnText ? `<br><span class="debuff-status">${burnText}</span>` : '';
        const infectionText = typeof char.getInfectionStatusText === 'function' ? char.getInfectionStatusText() : '';
        const infectionLine = infectionText ? `<br><span class="debuff-status">${infectionText}</span>` : '';
        const protectionText = typeof char.getProtectionStatusText === 'function' ? char.getProtectionStatusText() : '';
        const protectionLine = protectionText ? `<br><span class="debuff-status">${protectionText}</span>` : '';
        const assomerLine = (char.classType === 'Warrior' && char.assomerCooldownTurns > 0)
            ? `<br><span class="skill-cooldown">Assomer recharge: ${char.assomerCooldownTurns} tours</span>`
            : '';
        const backstabLine = (char.classType === 'Rogue' && char.backstabCooldownTurns > 0)
            ? `<br><span class="skill-cooldown">Backstab recharge: ${char.backstabCooldownTurns} tours</span>`
            : '';
        const summonLine = (char.classType === 'Necromancer' && char.skeletonSummonCooldownTurns > 0)
            ? `<br><span class="skill-cooldown">Invocation squelette recharge: ${char.skeletonSummonCooldownTurns} tours</span>`
            : '';
        const coupDeMortLine = (char.classType === 'Warrior' && char.coupDeMortCooldownTurns > 0)
            ? `<br><span class="skill-cooldown">Coup de mort recharge: ${char.coupDeMortCooldownTurns} tours</span>`
            : '';
        const pendingPointsLine = char.unspentStatPoints > 0
            ? `<br><span class="skill-cooldown">Points a distribuer: ${char.unspentStatPoints}</span>`
            : '';
        const experienceProgress = typeof char.getExperienceProgressText === 'function'
            ? char.getExperienceProgressText()
            : `${char.experience}/100`;
        const portraitClass = `character-portrait${typeof char.isInfected === 'function' && char.isInfected() ? ' status-infected' : ''}`;

        div.innerHTML = `
            ${portraitPath ? `<img class="${portraitClass}" src="${portraitPath}" alt="${char.classType}">` : ''}
            ${resourceBarsHtml}
            <strong>${char.name}</strong> (${char.classType})<br>
            Niveau: ${char.level}<br>
            XP: ${experienceProgress}
            ${pendingPointsLine}
            ${weaknessLine}
            ${webLine}
            ${coldNumbLine}
            ${burnLine}
            ${infectionLine}
            ${protectionLine}
            ${assomerLine}
            ${coupDeMortLine}
            ${backstabLine}
            ${summonLine}
        `;

        const inventoryButton = document.createElement('button');
        inventoryButton.type = 'button';
        inventoryButton.className = 'inventory-button';
        inventoryButton.textContent = 'Inventaire';
        inventoryButton.addEventListener('click', () => openInventoryModal(index));

        div.appendChild(inventoryButton);
        container.appendChild(div);
    });

    if (typeof saveGameProgressIfPossible === 'function') {
        saveGameProgressIfPossible('character-ui-refresh');
    }
}

function openInventoryModal(characterIndex) {
    selectedInventoryCharacterIndex = characterIndex;
    selectedInventorySlot = null;
    renderInventoryModal();

    const modal = document.getElementById('inventory-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeInventoryModal() {
    selectedInventoryCharacterIndex = null;
    selectedInventorySlot = null;
    const modal = document.getElementById('inventory-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function equipCharacterItem(characterIndex, slot, itemId) {
    const char = characters[characterIndex];
    if (!char) {
        return;
    }

    const stack = getInventoryStackById(itemId);
    const slotMatchesItemType = stack && (stack.type === slot || (slot === 'offhand' && stack.type === 'weapon'));
    if (!stack || !slotMatchesItemType || stack.quantity <= 0) {
        return;
    }

    const eligibility = canCharacterEquipItem(char, stack, slot);
    if (!eligibility.allowed) {
        logInventoryMessage(`${char.name} ne peut pas equiper ${stack.name}: ${eligibility.reason}.`);
        return;
    }

    const inventoryItem = takeItemFromInventory(itemId);
    if (!inventoryItem) {
        return;
    }
    if (slot === 'offhand') {
        inventoryItem.type = 'offhand';
    }

    const previousItem = char.equipItem(inventoryItem);
    if (previousItem) {
        returnItemToInventory(previousItem);
    }

    logInventoryMessage(`${char.name} equipe ${inventoryItem.name}.`);
    updateCharacterUI();
    renderInventoryModal();
}

function unequipCharacterItem(characterIndex, slot) {
    const char = characters[characterIndex];
    if (!char) {
        return;
    }

    const removedItem = char.unequipItem(slot);
    if (!removedItem) {
        return;
    }

    returnItemToInventory(removedItem);
    logInventoryMessage(`${char.name} retire ${removedItem.name}.`);
    updateCharacterUI();
    renderInventoryModal();
}

function normalizeCharacterName(rawName) {
    if (typeof rawName !== 'string') {
        return '';
    }
    const cleaned = rawName
        .replace(/[^\p{L}\p{N}' -]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned.slice(0, MAX_CHARACTER_NAME_LENGTH);
}

function renameCharacter(characterIndex, nextName) {
    const char = characters[characterIndex];
    if (!char) {
        return;
    }

    const normalizedName = normalizeCharacterName(nextName);
    if (!normalizedName) {
        logInventoryMessage('Nom invalide. Utilisez au moins une lettre ou un chiffre.');
        return;
    }

    if (normalizedName === char.name) {
        return;
    }

    const previousName = char.name;
    char.name = normalizedName;
    logInventoryMessage(`${previousName} devient ${char.name}.`);
    updateCharacterUI();
    if (typeof updateCombatUI === 'function') {
        updateCombatUI();
    }
    renderInventoryModal();
}

function renderInventoryCharacterHeader(char, characterIndex) {
    const charName = document.getElementById('inventory-character-name');
    if (!charName || !char) {
        return;
    }

    const portraitPath = CHARACTER_PORTRAITS[char.classType] || '';
    const healthPercent = char.maxHealth > 0 ? Math.max(0, Math.min(100, Math.round((char.health / char.maxHealth) * 100))) : 0;
    const manaPercent = char.maxMana > 0 ? Math.max(0, Math.min(100, Math.round((char.mana / char.maxMana) * 100))) : 0;
    const weaknessText = typeof char.getAttackWeaknessText === 'function' ? char.getAttackWeaknessText() : '';
    const webText = typeof char.getWebStatusText === 'function' ? char.getWebStatusText() : '';
    const coldNumbText = typeof char.getColdNumbStatusText === 'function' ? char.getColdNumbStatusText() : '';
    const burnText = typeof char.getBurnStatusText === 'function' ? char.getBurnStatusText() : '';
    const infectionText = typeof char.getInfectionStatusText === 'function' ? char.getInfectionStatusText() : '';
    const protectionText = typeof char.getProtectionStatusText === 'function' ? char.getProtectionStatusText() : '';
    const resistanceSummary = typeof char.getDamageResistanceSummaryText === 'function'
        ? char.getDamageResistanceSummaryText()
        : '';
    const inventoryPortraitClass = `inventory-character-portrait${typeof char.isInfected === 'function' && char.isInfected() ? ' status-infected' : ''}`;
    const statusLines = [weaknessText, webText, coldNumbText, burnText, infectionText, protectionText].filter(Boolean)
        .map((status) => `<div class="inventory-status">${status}</div>`)
        .join('');

    charName.innerHTML = `
        <div class="inventory-character-card">
            ${portraitPath ? `<img class="${inventoryPortraitClass}" src="${portraitPath}" alt="${char.classType}">` : ''}
            <div class="inventory-character-meta">
                <h3>${char.name} <span>(${char.classType})</span></h3>
                <div class="inventory-rename-row">
                    <label for="inventory-character-rename">Nom</label>
                    <input id="inventory-character-rename" type="text" maxlength="${MAX_CHARACTER_NAME_LENGTH}" value="${char.name}">
                    <button id="inventory-rename-button" type="button">Renommer</button>
                </div>
                <div class="inventory-stat-grid">
                    <div class="inventory-stat"><span>Niveau</span><strong>${char.level}</strong></div>
                    <div class="inventory-stat"><span>XP</span><strong>${typeof char.getExperienceProgressText === 'function' ? char.getExperienceProgressText() : `${char.experience}/100`}</strong></div>
                    <div class="inventory-stat"><span>Attaque</span><strong>${char.getCurrentAttack()}</strong></div>
                    <div class="inventory-stat"><span>Defense</span><strong>${char.defense}</strong></div>
                    <div class="inventory-stat"><span>Force</span><strong>${char.strength}</strong></div>
                    <div class="inventory-stat"><span>Intelligence</span><strong>${char.intelligence}</strong></div>
                    <div class="inventory-stat"><span>Vitalite</span><strong>${char.vitality}</strong></div>
                    <div class="inventory-stat"><span>Perception</span><strong>${char.perception}</strong></div>
                    <div class="inventory-stat"><span>Magie</span><strong>${char.magic}</strong></div>
                    <div class="inventory-stat"><span>Points a distribuer</span><strong>${char.unspentStatPoints}</strong></div>
                </div>
                <div class="resource-bars">
                    <div class="resource-block">
                        <div class="resource-row"><span>PV</span><span>${char.health}/${char.maxHealth}</span></div>
                        <div class="resource-bar"><div class="resource-fill resource-fill-health" style="width: ${healthPercent}%;"></div></div>
                    </div>
                    ${classUsesMana(char.classType) ? `
                    <div class="resource-block">
                        <div class="resource-row"><span>Mana</span><span>${char.mana}/${char.maxMana}</span></div>
                        <div class="resource-bar"><div class="resource-fill resource-fill-mana" style="width: ${manaPercent}%;"></div></div>
                    </div>
                    ` : ''}
                </div>
                <div class="inventory-status">${resistanceSummary}</div>
                ${statusLines}
            </div>
        </div>
    `;

    const renameInput = document.getElementById('inventory-character-rename');
    const renameButton = document.getElementById('inventory-rename-button');
    if (!renameInput || !renameButton) {
        return;
    }

    renameButton.addEventListener('click', () => {
        renameCharacter(characterIndex, renameInput.value);
    });
    renameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            renameCharacter(characterIndex, renameInput.value);
        }
    });
}

function renderInventoryOverview() {
    const picker = document.getElementById('inventory-picker');
    const pickerTitle = document.getElementById('inventory-picker-title');
    if (!picker) {
        return;
    }

    if (pickerTitle) {
        pickerTitle.textContent = 'Inventaire';
    }

    picker.innerHTML = '';

    const hint = document.createElement('p');
    hint.className = 'inventory-hint';
    hint.textContent = 'Choisissez un emplacement pour equiper un objet.';
    picker.appendChild(hint);

    const availableItems = partyInventory.filter((item) => item.quantity > 0);
    if (availableItems.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'inventory-empty';
        empty.textContent = 'Aucun objet disponible.';
        picker.appendChild(empty);
        return;
    }

    availableItems.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'inventory-item-row';
        const rarityLabel = getItemRarityLabel(item.rarity);
        const rarityClass = getItemRarityClass(item.rarity);
        const slotLabel = EQUIPMENT_SLOT_LABELS[item.type] || item.type;
        const itemName = formatItemNameWithBonuses(item);
        const iconPath = getInventoryItemImagePath(item);
        const iconHtml = iconPath ? `<img class="inventory-item-icon" src="${iconPath}" alt="Objet">` : '';
        row.innerHTML = `
            <div class="inventory-item-main">
                <span class="inventory-item-type">${slotLabel}</span>
                <span class="equipped-item ${rarityClass}">${iconHtml}<span>[${rarityLabel}] ${itemName}</span></span>
            </div>
        `;

        const actions = document.createElement('div');
        actions.className = 'inventory-item-actions';

        const quantity = document.createElement('span');
        quantity.className = 'inventory-item-qty';
        quantity.textContent = `x${item.quantity}`;
        actions.appendChild(quantity);

        const dropButton = document.createElement('button');
        dropButton.type = 'button';
        dropButton.className = 'inventory-drop-button';
        dropButton.textContent = 'Jeter';
        dropButton.title = `Jeter 1 ${item.name}`;
        dropButton.addEventListener('click', () => discardInventoryItem(item.id, 1));
        actions.appendChild(dropButton);

        row.appendChild(actions);
        picker.appendChild(row);
    });
}

function renderInventoryPicker(slot) {
    const picker = document.getElementById('inventory-picker');
    const pickerTitle = document.getElementById('inventory-picker-title');
    if (!picker || selectedInventoryCharacterIndex === null) {
        return;
    }

    const char = characters[selectedInventoryCharacterIndex];
    if (!char) {
        return;
    }

    if (pickerTitle) {
        pickerTitle.textContent = `Inventaire - ${EQUIPMENT_SLOT_LABELS[slot]}`;
    }

    picker.innerHTML = '';

    const toolbar = document.createElement('div');
    toolbar.className = 'inventory-picker-toolbar';
    const toolbarLabel = document.createElement('span');
    toolbarLabel.textContent = `${EQUIPMENT_SLOT_LABELS[slot]} disponible`;
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.textContent = 'Voir tout';
    backButton.addEventListener('click', () => {
        selectedInventorySlot = null;
        renderInventoryModal();
    });
    toolbar.appendChild(toolbarLabel);
    toolbar.appendChild(backButton);
    picker.appendChild(toolbar);

    const equippedItem = char.equipment[slot];
    if (equippedItem) {
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.classList.add(getItemRarityClass(equippedItem.rarity));
        removeButton.textContent = `Retirer [${getItemRarityLabel(equippedItem.rarity)}] ${equippedItem.name}`;
        removeButton.addEventListener('click', () => unequipCharacterItem(selectedInventoryCharacterIndex, slot));
        picker.appendChild(removeButton);
    }

    const availableItems = partyInventory.filter((item) => {
        if (item.quantity <= 0) {
            return false;
        }
        if (slot === 'offhand') {
            return item.type === 'weapon' || item.type === 'offhand';
        }
        return item.type === slot;
    });
    if (availableItems.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Aucune piece disponible pour cet emplacement.';
        picker.appendChild(empty);
        return;
    }

    availableItems.forEach((item) => {
        const actionRow = document.createElement('div');
        actionRow.className = 'inventory-picker-item-row';

        const equipButton = document.createElement('button');
        equipButton.type = 'button';
        equipButton.classList.add('inventory-main-action');
        equipButton.classList.add(getItemRarityClass(item.rarity));
        const itemName = formatItemNameWithBonuses(item);
        const rarityLabel = getItemRarityLabel(item.rarity);
        const eligibility = canCharacterEquipItem(char, item, slot);
        const itemLabel = `[${rarityLabel}] ${itemName} (x${item.quantity})`;
        const itemIcon = createInventoryItemIconElement(item, 'inventory-picker-item-icon');
        if (itemIcon) {
            equipButton.appendChild(itemIcon);
        }
        const itemLabelSpan = document.createElement('span');
        itemLabelSpan.className = 'inventory-picker-item-label';
        if (!eligibility.allowed) {
            equipButton.disabled = true;
            equipButton.title = eligibility.reason;
            itemLabelSpan.textContent = `${itemLabel} - ${eligibility.reason}`;
        } else {
            itemLabelSpan.textContent = itemLabel;
            equipButton.addEventListener('click', () => equipCharacterItem(selectedInventoryCharacterIndex, slot, item.id));
        }
        equipButton.appendChild(itemLabelSpan);

        const dropButton = document.createElement('button');
        dropButton.type = 'button';
        dropButton.className = 'inventory-drop-button';
        dropButton.textContent = 'Jeter';
        dropButton.title = `Jeter 1 ${item.name}`;
        dropButton.addEventListener('click', () => discardInventoryItem(item.id, 1));

        actionRow.appendChild(equipButton);
        actionRow.appendChild(dropButton);
        picker.appendChild(actionRow);
    });
}

function renderInventoryModal() {
    if (selectedInventoryCharacterIndex === null) {
        return;
    }

    const char = characters[selectedInventoryCharacterIndex];
    if (!char) {
        closeInventoryModal();
        return;
    }

    const charName = document.getElementById('inventory-character-name');
    const slots = document.getElementById('inventory-slots');
    const picker = document.getElementById('inventory-picker');
    if (!charName || !slots || !picker) {
        return;
    }

    renderInventoryCharacterHeader(char, selectedInventoryCharacterIndex);
    slots.innerHTML = '';

    EQUIPMENT_SLOTS.forEach((slot) => {
        const row = document.createElement('div');
        row.className = 'inventory-slot-row';
        if (selectedInventorySlot === slot) {
            row.classList.add('selected');
        }

        const slotInfo = document.createElement('span');
        slotInfo.innerHTML = `${EQUIPMENT_SLOT_LABELS[slot]}: ${formatEquippedItemHtml(char.equipment[slot])}`;

        const chooseButton = document.createElement('button');
        chooseButton.type = 'button';
        chooseButton.textContent = 'Choisir';
        chooseButton.addEventListener('click', () => {
            selectedInventorySlot = slot;
            renderInventoryModal();
        });

        row.appendChild(slotInfo);
        row.appendChild(chooseButton);
        slots.appendChild(row);
    });

    if (selectedInventorySlot) {
        renderInventoryPicker(selectedInventorySlot);
    } else {
        renderInventoryOverview();
    }
}

function initInventoryModal() {
    const closeButton = document.getElementById('inventory-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeInventoryModal);
    }

    const modal = document.getElementById('inventory-modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeInventoryModal();
            }
        });
    }
}

initInventoryModal();

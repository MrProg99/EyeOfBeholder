let monsterEntityIdCounter = 1;
const MONSTER_DATA = {
    goblin: {
        id: 'goblin',
        name: 'Goblin',
        monsterLevel: 1,
        health: 30,
        attack: 8,
        defense: 2,
        role: 'fighter',
        image: 'Images/Goblin.png',
        abilities: ['Attaque basique']
    },
    orc: {
        id: 'orc',
        name: 'Orc',
        monsterLevel: 2,
        health: 50,
        attack: 12,
        defense: 4,
        role: 'fighter',
        damageResistances: { physical: 8, bleed: 5 },
        image: 'Images/Orc.png',
        abilities: ['Attaque basique lourde']
    },
    troll: {
        id: 'troll',
        name: 'Troll',
        monsterLevel: 3,
        health: 80,
        attack: 15,
        defense: 6,
        role: 'fighter',
        damageResistances: { poison: 12, bleed: 10 },
        image: 'Images/Troll.png',
        abilities: ['Attaque basique tres puissante']
    },
    shaman: {
        id: 'shaman',
        name: 'Shaman gobelin',
        monsterLevel: 2,
        health: 42,
        attack: 7,
        defense: 3,
        role: 'shaman',
        mana: 40,
        healPower: 18,
        healManaCost: 16,
        weakenPower: 4,
        weakenManaCost: 12,
        weakenTurns: 3,
        damageResistances: { magic: 10 },
        image: 'Images/Shaman.png',
        abilities: ['Soin d allie (+18 PV, 16 mana)', 'Affaiblissement (-4 Att pendant 3 tours, 12 mana)', 'Attaque basique']
    },
    kobold: {
        id: 'kobold',
        name: 'Kobold',
        monsterLevel: 1,
        health: 19,
        attack: 9,
        defense: 2,
        role: 'kobold',
        damageResistances: { poison: 8 },
        image: 'Images/Kobold.png',
        abilities: ['Attaque basique rapide']
    },
    kobold_chief: {
        id: 'kobold_chief',
        name: 'Chef kobold',
        monsterLevel: 4,
        health: 47,
        attack: 13,
        defense: 5,
        role: 'kobold_chief',
        spawnIntervalTurns: 2,
        spawnCountdownTurns: 2,
        summonType: 'kobold',
        summonCount: 2,
        damageResistances: { physical: 10, poison: 15, bleed: 8 },
        image: 'Images/ChefKobold.png',
        abilities: ['Appel de renforts: +2 kobolds tous les 2 tours', 'Attaque basique lourde']
    },
    dark_imp: {
        id: 'dark_imp',
        name: 'Imp des tenebres',
        monsterLevel: 2,
        health: 44,
        attack: 9,
        defense: 2,
        role: 'dark_imp',
        infernalSparkDamage: 8,
        curseWeakenAmount: 2,
        curseWeakenTurns: 2,
        deathExplosionFireDamage: 7,
        damageResistances: { fire: 15, ice: -10, bleed: 5 },
        image: 'Images/ImpTenebre.png',
        abilities: [
            'Griffe sombre (petite attaque melee)',
            'Etincelle infernale (petits degats de feu a distance)',
            'Ricanement maudit (Affaibli sur un heros)',
            'Explosion finale (petits degats de feu a sa mort)'
        ]
    },
    cultist: {
        id: 'cultist',
        name: 'Cultiste',
        monsterLevel: 3,
        health: 48,
        attack: 8,
        defense: 3,
        role: 'cultist',
        healPower: 12,
        curseWeakenAmount: 2,
        curseWeakenTurns: 2,
        lifeDrainDamage: 7,
        lifeDrainHealRatio: 0.55,
        summonType: 'skeleton_weak',
        summonCount: 1,
        damageResistances: { magic: 10, poison: 12, bleed: 6 },
        image: 'Images/Cultiste.png',
        abilities: [
            'Dague rituelle (petite attaque physique)',
            'Malediction (Affaibli sur un heros)',
            'Drain mineur (vole un peu de vie)',
            'Soin impie (soigne un allie)',
            'Appel des ombres (invoque un squelette faible)'
        ]
    },
    minor_specter: {
        id: 'minor_specter',
        name: 'Spectre mineur',
        monsterLevel: 3,
        health: 46,
        attack: 7,
        defense: 3,
        role: 'minor_specter',
        curseWeakenAmount: 2,
        curseWeakenTurns: 2,
        lifeDrainDamage: 6,
        lifeDrainHealRatio: 0.5,
        damageResistances: { physical: 35, poison: 90, bleed: 90 },
        image: 'Images/SpectreMineur.png',
        abilities: [
            'Toucher spectral (petite attaque magique)',
            'Drain mineur (inflige des degats et se soigne)',
            'Frisson d outre-tombe (Affaibli)'
        ]
    },
    green_slime: {
        id: 'green_slime',
        name: 'Slime verte',
        monsterLevel: 5,
        isBoss: true,
        health: 78,
        attack: 8,
        defense: 2,
        role: 'green_slime',
        splitSpawnCount: 2,
        splitRemainingGenerations: 2,
        splitChildHealthScale: 0.6,
        splitChildAttackScale: 0.85,
        splitChildDefenseScale: 0.8,
        damageResistances: { poison: 35, fire: -10, bleed: 80 },
        image: 'Images/SlimeVerte.png',
        abilities: ['Division: se scinde en 2 a la mort', 'Les nouvelles slimes se divisent encore une fois']
    },
    ice_golem: {
        id: 'ice_golem',
        name: 'Golem de glace',
        monsterLevel: 6,
        isBoss: true,
        health: 180,
        attack: 18,
        defense: 10,
        role: 'ice_golem',
        damageResistances: { ice: 70, fire: -100, bleed: 90 },
        weaponContactNumbTurns: 2,
        weaponContactDamageReductionMultiplier: 0.75,
        image: 'Images/GolemGlace.png',
        abilities: ['Carapace glacee', 'Vulnerable au feu (x2)', 'Contact d arme: Engourdi 2 tours (-25% degats)', 'Attaque basique lourde']
    },
    fire_golem: {
        id: 'fire_golem',
        name: 'Golem de feu',
        monsterLevel: 7,
        isBoss: true,
        health: 220,
        attack: 20,
        defense: 12,
        role: 'fire_golem',
        damageResistances: { fire: 75, ice: -25, bleed: 90 },
        weaponContactFireDamage: 10,
        weaponContactBurnDamage: 6,
        weaponContactBurnTurns: 2,
        image: 'Images/GolemFeu.png',
        abilities: ['Carapace incandescente', 'Contact d arme: 10 degats de feu', 'Inflige Brulure (2 tours) au contact', 'Attaque basique ecrasante']
    },
    spectral_knight: {
        id: 'spectral_knight',
        name: 'Chevalier spectrale',
        monsterLevel: 8,
        isBoss: true,
        health: 280,
        attack: 13,
        defense: 16,
        role: 'spectral_knight',
        damageResistances: { magic: 30, poison: 20, bleed: 80 },
        attacksPerTurn: 2,
        deathCryDamage: 12,
        deathCryChance: 0.45,
        deathCryCooldownTurns: 2,
        image: 'Images/ChevalierSpectrale.png',
        abilities: ['Cri de la mort (touche tous les heros)', 'Armure spectrale elevee', 'Double frappe (2 coups par tour)']
    },
    spider_queen: {
        id: 'spider_queen',
        name: 'Reine araignee',
        monsterLevel: 9,
        isBoss: true,
        health: 340,
        attack: 16,
        defense: 14,
        role: 'spider_queen',
        damageResistances: { poison: 70, fire: -10, bleed: 15 },
        poisonCloudDamage: 10,
        poisonCloudChance: 0.34,
        poisonCloudInfectionChance: 0.5,
        poisonCloudInfectionDamage: 6,
        poisonCloudInfectionTurns: 3,
        poisonCloudCooldownTurns: 2,
        venomBiteDamageBonus: 4,
        venomBiteInfectionChance: 0.55,
        venomBiteInfectionDamage: 7,
        venomBiteInfectionTurns: 3,
        lifeDrainDamage: 18,
        lifeDrainHealRatio: 0.6,
        lifeDrainChance: 0.24,
        summonChance: 0.28,
        summonType: 'spiderling',
        summonCount: 1,
        image: 'Images/ReineAraignee.png',
        abilities: ['Nuage de poison (AOE + chance d infection)', 'Morsure venimeuse', 'Invocation de bebe araignee', 'Drain de vie']
    },
    spider: {
        id: 'spider',
        name: 'Araignee',
        monsterLevel: 2,
        health: 56,
        attack: 11,
        defense: 4,
        role: 'spider',
        damageResistances: { poison: 25, bleed: 10 },
        webTurns: 2,
        spawnIntervalTurns: 2,
        spawnCountdownTurns: 2,
        image: 'Images/Spider.png',
        abilities: ['Toile (immobilise 2 tours)', 'Pond 1 bebe araignee tous les 2 tours', 'Attaque basique']
    },
    spiderling: {
        id: 'spiderling',
        name: 'Bebe araignee',
        monsterLevel: 1,
        health: 20,
        attack: 7,
        defense: 1,
        role: 'spiderling',
        damageResistances: { poison: 10, bleed: 5 },
        image: 'Images/Spider.png',
        abilities: ['Attaque basique rapide']
    },
    rat: {
        id: 'rat',
        name: 'Rat',
        monsterLevel: 1,
        health: 18,
        attack: 8,
        defense: 1,
        role: 'rat',
        damageResistances: { bleed: -12, poison: 5 },
        physicalDodgeChance: 0.28,
        infectedBiteChance: 0.22,
        infectedBiteDamage: 3,
        infectedBiteTurns: 2,
        deathPoisonOnKillerChance: 0.3,
        deathPoisonOnKillerDamage: 4,
        deathPoisonOnKillerTurns: 2,
        image: 'Images/Rat.png',
        abilities: [
            'Esquive physique (chance d eviter un coup)',
            'Morsure infectee (petite chance d infection)',
            'Contagion de la mort (chance d infecter son tueur)'
        ]
    },
    skeleton_weak: {
        id: 'skeleton_weak',
        name: 'Squelette invoque',
        monsterLevel: 1,
        health: 16,
        attack: 6,
        defense: 1,
        role: 'skeleton_minion',
        damageResistances: { poison: 30, bleed: 75 },
        image: 'Images/Skelette.png',
        abilities: ['Attaque basique faible']
    }
};
const MONSTER_SPAWN_POOL = ['goblin', 'orc', 'troll', 'spider', 'dark_imp', 'cultist', 'minor_specter', 'rat'];
const MONSTER_FORCE_KEY_BY_TYPE = {
    shaman: 'shaman',
    kobold: 'kobold',
    kobold_chief: 'kobold_chief',
    dark_imp: 'dark_imp',
    cultist: 'cultist',
    minor_specter: 'minor_specter',
    green_slime: 'green_slime',
    ice_golem: 'ice_golem',
    fire_golem: 'fire_golem',
    spectral_knight: 'spectral_knight',
    spider_queen: 'spider_queen',
    spider: 'spider',
    spiderling: 'spiderling',
    rat: 'rat',
    skeleton_weak: 'skeleton_weak'
};
const MONSTER_BESTIARY = Object.values(MONSTER_DATA).map((template) => ({
    key: template.id,
    name: template.name,
    image: template.image,
    health: template.health,
    attack: template.attack,
    defense: template.defense,
    damageResistances: template.damageResistances || {},
    abilities: Array.isArray(template.abilities) ? [...template.abilities] : []
}));
// Higher value means armor mitigates less damage overall.
const ARMOR_REDUCTION_SCALE = 20;
const DAMAGE_TYPES = ['physical', 'magic', 'fire', 'ice', 'poison', 'bleed'];
const DAMAGE_TYPE_LABELS = {
    physical: 'Physique',
    magic: 'Magique',
    fire: 'Feu',
    ice: 'Glace',
    poison: 'Poison',
    bleed: 'Saignement'
};
const DAMAGE_TYPE_ALIASES = {
    physical: 'physical',
    physique: 'physical',
    magic: 'magic',
    magique: 'magic',
    fire: 'fire',
    feu: 'fire',
    ice: 'ice',
    glace: 'ice',
    poison: 'poison',
    bleed: 'bleed',
    saignement: 'bleed'
};
const DAMAGE_RESISTANCE_MIN = -100;
const DAMAGE_RESISTANCE_MAX = 90;
const MONSTER_HEALTH_VARIANCE_MIN = 0.9;
const MONSTER_HEALTH_VARIANCE_MAX = 1.1;
const DEFAULT_MONSTER_LEVEL = 1;
const MIN_MONSTER_LEVEL = 1;
const MAX_MONSTER_LEVEL = 99;

function hasExplicitHealthOverride(overrides) {
    return Boolean(
        overrides
        && Object.prototype.hasOwnProperty.call(overrides, 'health')
        && Number.isFinite(Number(overrides.health))
    );
}

function shouldApplyMonsterHealthVariance(template, mergedOptions, overrides) {
    if (!template || !mergedOptions) {
        return false;
    }
    if (Boolean(template.isBoss) || Boolean(mergedOptions.isBoss)) {
        return false;
    }
    if (hasExplicitHealthOverride(overrides)) {
        return false;
    }
    return true;
}

function rollMonsterHealthVarianceMultiplier() {
    const spread = MONSTER_HEALTH_VARIANCE_MAX - MONSTER_HEALTH_VARIANCE_MIN;
    return MONSTER_HEALTH_VARIANCE_MIN + (Math.random() * spread);
}

function normalizeMonsterLevel(rawLevel, fallbackLevel = DEFAULT_MONSTER_LEVEL) {
    const fallback = Math.max(MIN_MONSTER_LEVEL, Math.min(MAX_MONSTER_LEVEL, Math.floor(Number(fallbackLevel) || DEFAULT_MONSTER_LEVEL)));
    const numericLevel = Number(rawLevel);
    if (!Number.isFinite(numericLevel)) {
        return fallback;
    }
    return Math.max(MIN_MONSTER_LEVEL, Math.min(MAX_MONSTER_LEVEL, Math.floor(numericLevel)));
}

function calculateDamageWithArmor(rawDamage, armorValue) {
    const normalizedRawDamage = Math.max(1, Math.floor(rawDamage || 0));
    const normalizedArmor = Math.max(0, Math.floor(armorValue || 0));
    const reductionRatio = normalizedArmor / (normalizedArmor + ARMOR_REDUCTION_SCALE);
    return Math.max(1, Math.round(normalizedRawDamage * (1 - reductionRatio)));
}

function normalizeDamageType(rawDamageType) {
    const normalizedKey = String(rawDamageType || 'physical').trim().toLowerCase();
    return DAMAGE_TYPE_ALIASES[normalizedKey] || 'physical';
}

function normalizeDamageResistanceValue(rawValue) {
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
        return 0;
    }
    return Math.max(DAMAGE_RESISTANCE_MIN, Math.min(DAMAGE_RESISTANCE_MAX, Math.round(numericValue)));
}

function createEmptyDamageResistanceMap() {
    return {
        physical: 0,
        magic: 0,
        fire: 0,
        ice: 0,
        poison: 0,
        bleed: 0
    };
}

function normalizeDamageResistanceMap(rawMap) {
    const normalized = createEmptyDamageResistanceMap();
    if (!rawMap || typeof rawMap !== 'object') {
        return normalized;
    }
    Object.entries(rawMap).forEach(([rawType, rawValue]) => {
        const type = normalizeDamageType(rawType);
        normalized[type] = normalizeDamageResistanceValue(rawValue);
    });
    return normalized;
}

function resolveDamageWithType(rawDamage, options = {}) {
    const normalizedRawDamage = Math.max(1, Math.floor(rawDamage || 0));
    const ignoreArmor = Boolean(options.ignoreArmor);
    const armorValue = Math.max(0, Math.floor(options.armorValue || 0));
    const armorPenetrationPercent = Math.max(0, Math.min(0.95, Number(options.armorPenetrationPercent) || 0));
    const resistancePercent = normalizeDamageResistanceValue(options.resistancePercent || 0);
    const minDamage = Math.max(0, Math.floor(options.minDamage || 1));
    const effectiveArmorValue = ignoreArmor ? 0 : Math.max(0, Math.round(armorValue * (1 - armorPenetrationPercent)));
    const damageAfterArmor = ignoreArmor ? normalizedRawDamage : calculateDamageWithArmor(normalizedRawDamage, effectiveArmorValue);
    const reducedDamage = Math.round(damageAfterArmor * (1 - (resistancePercent / 100)));
    return Math.max(minDamage, reducedDamage);
}

function createMonsterFromTemplate(template, overrides = {}) {
    const mergedOptions = {
        ...template,
        ...(overrides || {})
    };
    const mergedMonsterLevel = normalizeMonsterLevel(
        Object.prototype.hasOwnProperty.call(mergedOptions, 'monsterLevel')
            ? mergedOptions.monsterLevel
            : mergedOptions.level,
        template && template.monsterLevel
    );
    mergedOptions.monsterLevel = mergedMonsterLevel;
    const mergedName = typeof mergedOptions.name === 'string' ? mergedOptions.name : template.name;
    const mergedHealth = Number(mergedOptions.health);
    const mergedAttack = Number(mergedOptions.attack);
    const mergedDefense = Number(mergedOptions.defense);
    const baseHealth = Math.max(1, Math.round(Number.isFinite(mergedHealth) ? mergedHealth : template.health));
    let health = baseHealth;
    if (shouldApplyMonsterHealthVariance(template, mergedOptions, overrides)) {
        const healthVarianceMultiplier = rollMonsterHealthVarianceMultiplier();
        health = Math.max(1, Math.round(baseHealth * healthVarianceMultiplier));
    }
    const attack = Math.max(1, Math.round(Number.isFinite(mergedAttack) ? mergedAttack : template.attack));
    const defense = Math.max(0, Math.round(Number.isFinite(mergedDefense) ? mergedDefense : template.defense));
    return new Monster(mergedName, health, attack, defense, mergedOptions);
}

class Monster {
    constructor(name, health, attack, defense, options = {}) {
        this.entityType = 'monster';
        this.entityId = `mon-${monsterEntityIdCounter++}`;
        this.name = name;
        this.monsterType = typeof options.id === 'string' ? options.id : '';
        this.isBossMonster = Boolean(options.isBoss);
        const rawMonsterLevel = Object.prototype.hasOwnProperty.call(options, 'monsterLevel')
            ? options.monsterLevel
            : options.level;
        this.monsterLevel = normalizeMonsterLevel(rawMonsterLevel, DEFAULT_MONSTER_LEVEL);
        this.health = health;
        this.maxHealth = health;
        this.attack = attack;
        this.defense = defense;
        this.image = options.image || '';
        this.role = options.role || 'fighter';
        this.damageResistances = normalizeDamageResistanceMap(options.damageResistances || options.resistances || {});
        this.weaponContactNumbTurns = Math.max(0, Math.floor(options.weaponContactNumbTurns || 0));
        this.weaponContactDamageReductionMultiplier = Number.isFinite(options.weaponContactDamageReductionMultiplier)
            ? Math.max(0.1, Number(options.weaponContactDamageReductionMultiplier))
            : 1;
        this.weaponContactFireDamage = Math.max(0, Math.floor(options.weaponContactFireDamage || 0));
        this.weaponContactBurnDamage = Math.max(0, Math.floor(options.weaponContactBurnDamage || 0));
        this.weaponContactBurnTurns = Math.max(0, Math.floor(options.weaponContactBurnTurns || 0));
        this.splitSpawnCount = Math.max(0, Math.floor(options.splitSpawnCount || 0));
        this.splitRemainingGenerations = Math.max(0, Math.floor(options.splitRemainingGenerations || 0));
        this.splitChildHealthScale = Number.isFinite(options.splitChildHealthScale)
            ? Math.max(0.1, Math.min(1, Number(options.splitChildHealthScale)))
            : 1;
        this.splitChildAttackScale = Number.isFinite(options.splitChildAttackScale)
            ? Math.max(0.1, Math.min(1, Number(options.splitChildAttackScale)))
            : 1;
        this.splitChildDefenseScale = Number.isFinite(options.splitChildDefenseScale)
            ? Math.max(0.1, Math.min(1, Number(options.splitChildDefenseScale)))
            : 1;
        this.hasProcessedDeathSplit = false;
        this.maxMana = Math.max(0, Math.floor(options.maxMana || options.mana || 0));
        this.mana = this.maxMana;
        this.healPower = options.healPower || 0;
        this.healManaCost = Math.max(0, Math.floor(options.healManaCost || 0));
        this.weakenPower = options.weakenPower || 0;
        this.weakenManaCost = Math.max(0, Math.floor(options.weakenManaCost || 0));
        this.weakenTurns = options.weakenTurns || 0;
        this.infernalSparkDamage = Math.max(0, Math.floor(options.infernalSparkDamage || 0));
        this.curseWeakenAmount = Math.max(0, Math.floor(options.curseWeakenAmount || 0));
        this.curseWeakenTurns = Math.max(0, Math.floor(options.curseWeakenTurns || 0));
        this.deathExplosionFireDamage = Math.max(0, Math.floor(options.deathExplosionFireDamage || 0));
        this.webTurns = options.webTurns || 0;
        this.spawnIntervalTurns = options.spawnIntervalTurns || 0;
        this.spawnCountdownTurns = options.spawnCountdownTurns || this.spawnIntervalTurns || 0;
        this.attacksPerTurn = Math.max(1, Math.floor(options.attacksPerTurn || 1));
        this.deathCryDamage = Math.max(0, Math.floor(options.deathCryDamage || 0));
        this.deathCryChance = Number.isFinite(options.deathCryChance)
            ? Math.max(0, Math.min(1, Number(options.deathCryChance)))
            : 0;
        this.deathCryCooldownDuration = Math.max(0, Math.floor(options.deathCryCooldownTurns || 0));
        this.deathCryCooldownRemaining = 0;
        this.deathCryUsedThisTurn = false;
        this.poisonCloudDamage = Math.max(0, Math.floor(options.poisonCloudDamage || 0));
        this.poisonCloudChance = Number.isFinite(options.poisonCloudChance)
            ? Math.max(0, Math.min(1, Number(options.poisonCloudChance)))
            : 0;
        this.poisonCloudInfectionChance = Number.isFinite(options.poisonCloudInfectionChance)
            ? Math.max(0, Math.min(1, Number(options.poisonCloudInfectionChance)))
            : 0;
        this.poisonCloudInfectionDamage = Math.max(0, Math.floor(options.poisonCloudInfectionDamage || 0));
        this.poisonCloudInfectionTurns = Math.max(0, Math.floor(options.poisonCloudInfectionTurns || 0));
        this.poisonCloudCooldownDuration = Math.max(0, Math.floor(options.poisonCloudCooldownTurns || 0));
        this.poisonCloudCooldownRemaining = 0;
        this.poisonCloudUsedThisTurn = false;
        this.venomBiteDamageBonus = Math.max(0, Math.floor(options.venomBiteDamageBonus || 0));
        this.venomBiteInfectionChance = Number.isFinite(options.venomBiteInfectionChance)
            ? Math.max(0, Math.min(1, Number(options.venomBiteInfectionChance)))
            : 0;
        this.venomBiteInfectionDamage = Math.max(0, Math.floor(options.venomBiteInfectionDamage || 0));
        this.venomBiteInfectionTurns = Math.max(0, Math.floor(options.venomBiteInfectionTurns || 0));
        this.lifeDrainDamage = Math.max(0, Math.floor(options.lifeDrainDamage || 0));
        this.lifeDrainHealRatio = Number.isFinite(options.lifeDrainHealRatio)
            ? Math.max(0, Math.min(1, Number(options.lifeDrainHealRatio)))
            : 0;
        this.lifeDrainChance = Number.isFinite(options.lifeDrainChance)
            ? Math.max(0, Math.min(1, Number(options.lifeDrainChance)))
            : 0;
        this.summonChance = Number.isFinite(options.summonChance)
            ? Math.max(0, Math.min(1, Number(options.summonChance)))
            : 0;
        this.summonType = typeof options.summonType === 'string' ? options.summonType : '';
        this.summonCount = Math.max(0, Math.floor(options.summonCount || 0));
        this.physicalDodgeChance = Number.isFinite(options.physicalDodgeChance)
            ? Math.max(0, Math.min(1, Number(options.physicalDodgeChance)))
            : 0;
        this.infectedBiteChance = Number.isFinite(options.infectedBiteChance)
            ? Math.max(0, Math.min(1, Number(options.infectedBiteChance)))
            : 0;
        this.infectedBiteDamage = Math.max(0, Math.floor(options.infectedBiteDamage || 0));
        this.infectedBiteTurns = Math.max(0, Math.floor(options.infectedBiteTurns || 0));
        this.deathPoisonOnKillerChance = Number.isFinite(options.deathPoisonOnKillerChance)
            ? Math.max(0, Math.min(1, Number(options.deathPoisonOnKillerChance)))
            : 0;
        this.deathPoisonOnKillerDamage = Math.max(0, Math.floor(options.deathPoisonOnKillerDamage || 0));
        this.deathPoisonOnKillerTurns = Math.max(0, Math.floor(options.deathPoisonOnKillerTurns || 0));
        this.lastAttackerEntity = null;
        this.stunnedTurns = 0;
        this.burnDamage = 0;
        this.burnTurns = 0;
        this.poisonDamage = 0;
        this.poisonTurns = 0;
        this.bleedDamage = 0;
        this.bleedStacks = 0;
        this.attackWeakenAmount = 0;
        this.attackWeakenTurns = 0;
        this.damageTakenVulnerabilityPercent = 0;
        this.damageTakenVulnerabilityTurns = 0;
    }

    getCurrentAttack() {
        return Math.max(1, this.attack - this.attackWeakenAmount);
    }

    hasAttackWeakness() {
        return this.attackWeakenAmount > 0 && this.attackWeakenTurns > 0;
    }

    applyAttackWeakness(amount, turns) {
        const weakenAmount = Math.max(1, Math.floor(amount || 0));
        const weakenTurns = Math.max(1, Math.floor(turns || 0));
        if (weakenAmount <= 0 || weakenTurns <= 0) {
            return false;
        }
        this.attackWeakenAmount = Math.max(this.attackWeakenAmount, weakenAmount);
        this.attackWeakenTurns = Math.max(this.attackWeakenTurns, weakenTurns);
        return true;
    }

    getAttackWeaknessText() {
        if (!this.hasAttackWeakness()) {
            return '';
        }
        const turnLabel = this.attackWeakenTurns > 1 ? 'tours' : 'tour';
        return `Affaibli: -${this.attackWeakenAmount} attaque (${this.attackWeakenTurns} ${turnLabel})`;
    }

    applyDamageTakenVulnerability(percent, turns) {
        const vulnerabilityPercent = Math.max(0, Number(percent) || 0);
        const vulnerabilityTurns = Math.max(1, Math.floor(turns || 0));
        if (vulnerabilityPercent <= 0 || vulnerabilityTurns <= 0) {
            return {
                percent: this.damageTakenVulnerabilityPercent,
                turns: this.damageTakenVulnerabilityTurns
            };
        }
        this.damageTakenVulnerabilityPercent = Math.max(this.damageTakenVulnerabilityPercent, vulnerabilityPercent);
        this.damageTakenVulnerabilityTurns = Math.max(this.damageTakenVulnerabilityTurns, vulnerabilityTurns);
        return {
            percent: this.damageTakenVulnerabilityPercent,
            turns: this.damageTakenVulnerabilityTurns
        };
    }

    isMarked() {
        return this.damageTakenVulnerabilityPercent > 0 && this.damageTakenVulnerabilityTurns > 0;
    }

    getMarkedStatusText() {
        if (!this.isMarked()) {
            return '';
        }
        const percent = Math.round(this.damageTakenVulnerabilityPercent * 100);
        const turnLabel = this.damageTakenVulnerabilityTurns > 1 ? 'tours' : 'tour';
        return `Marque: +${percent}% degats subis (${this.damageTakenVulnerabilityTurns} ${turnLabel})`;
    }

    getDamageResistance(damageType) {
        const normalizedType = normalizeDamageType(damageType);
        const resistance = this.damageResistances[normalizedType];
        return normalizeDamageResistanceValue(resistance);
    }

    takeDamage(damage, options = {}) {
        const wasAliveBeforeHit = this.health > 0;
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        const fallbackAttacker = (typeof window !== 'undefined' && window.__combatDamageSource)
            ? window.__combatDamageSource
            : null;
        const attacker = normalizedOptions.attacker || fallbackAttacker || null;
        const isDamageOverTime = Boolean(normalizedOptions.isDamageOverTime);
        const damageType = normalizeDamageType(normalizedOptions.damageType || 'physical');
        if (
            wasAliveBeforeHit
            && damageType === 'physical'
            && this.physicalDodgeChance > 0
            && Math.random() < this.physicalDodgeChance
        ) {
            normalizedOptions.wasDodged = true;
            if (typeof logMessage === 'function') {
                logMessage(`${this.name} esquive le coup physique.`);
            }
            return 0;
        }
        const resistancePercent = this.getDamageResistance(damageType);
        const baseDamage = resolveDamageWithType(damage, {
            armorValue: this.defense,
            damageType,
            resistancePercent,
            ignoreArmor: Boolean(normalizedOptions.ignoreArmor),
            armorPenetrationPercent: normalizedOptions.armorPenetrationPercent || 0
        });
        const finalDamage = this.isMarked()
            ? Math.max(1, Math.round(baseDamage * (1 + this.damageTakenVulnerabilityPercent)))
            : baseDamage;
        this.health -= finalDamage;
        if (finalDamage > 0 && typeof window.queueDamageFlash === 'function') {
            window.queueDamageFlash(this, finalDamage);
        }
        if (finalDamage > 0 && typeof window.recordCombatDamageEvent === 'function') {
            window.recordCombatDamageEvent(this, finalDamage, normalizedOptions);
        }
        if (finalDamage > 0 && attacker) {
            this.lastAttackerEntity = attacker;
        }
        if (this.health <= 0) {
            this.health = 0;
            if (wasAliveBeforeHit && finalDamage > 0 && typeof window.playSoundEffect === 'function') {
                // Let the sword impact start first so the death sound remains audible.
                window.setTimeout(() => {
                    if (typeof window.playSoundEffect === 'function') {
                        window.playSoundEffect('monsterDeath', { volume: 1.0 });
                    }
                }, 180);
            }
            if (wasAliveBeforeHit && finalDamage > 0 && typeof window.handleMonsterDefeatPassiveEffects === 'function') {
                const deathAttacker = attacker || (isDamageOverTime ? this.lastAttackerEntity : null);
                window.handleMonsterDefeatPassiveEffects(this, deathAttacker);
            }
        }
        return finalDamage;
    }

    isShaman() {
        return this.role === 'shaman';
    }

    isKobold() {
        return this.role === 'kobold';
    }

    isKoboldChief() {
        return this.role === 'kobold_chief';
    }

    isSpider() {
        return this.role === 'spider';
    }

    isSpiderling() {
        return this.role === 'spiderling';
    }

    isIceGolem() {
        return this.role === 'ice_golem';
    }

    isFireGolem() {
        return this.role === 'fire_golem';
    }

    isGreenSlime() {
        return this.role === 'green_slime';
    }

    isSpectralKnight() {
        return this.role === 'spectral_knight';
    }

    isSpiderQueen() {
        return this.role === 'spider_queen';
    }

    isDarkImp() {
        return this.role === 'dark_imp';
    }

    isCultist() {
        return this.role === 'cultist';
    }

    isSkeletonMinion() {
        return this.role === 'skeleton_minion';
    }

    isMinorSpecter() {
        return this.role === 'minor_specter';
    }

    isRat() {
        return this.role === 'rat';
    }

    isBoss() {
        return this.isBossMonster;
    }

    getMonsterLevel() {
        return this.monsterLevel;
    }

    canUseDeathCry() {
        return this.deathCryDamage > 0 && this.deathCryCooldownRemaining <= 0;
    }

    startDeathCryCooldown() {
        if (this.deathCryCooldownDuration > 0) {
            this.deathCryCooldownRemaining = Math.max(this.deathCryCooldownRemaining, this.deathCryCooldownDuration);
            this.deathCryUsedThisTurn = true;
        }
    }

    canUsePoisonCloud() {
        return this.poisonCloudDamage > 0 && this.poisonCloudCooldownRemaining <= 0;
    }

    startPoisonCloudCooldown() {
        if (this.poisonCloudCooldownDuration > 0) {
            this.poisonCloudCooldownRemaining = Math.max(this.poisonCloudCooldownRemaining, this.poisonCloudCooldownDuration);
            this.poisonCloudUsedThisTurn = true;
        }
    }

    getDeathSplitChildren() {
        if (this.isAlive() || this.hasProcessedDeathSplit) {
            return [];
        }
        if (this.splitSpawnCount <= 0 || this.splitRemainingGenerations <= 0) {
            return [];
        }

        this.hasProcessedDeathSplit = true;
        const nextSplitRemainingGenerations = Math.max(0, this.splitRemainingGenerations - 1);
        const childHealth = Math.max(1, Math.round(this.maxHealth * this.splitChildHealthScale));
        const childAttack = Math.max(1, Math.round(this.attack * this.splitChildAttackScale));
        const childDefense = Math.max(0, Math.round(this.defense * this.splitChildDefenseScale));
        const children = [];
        for (let i = 0; i < this.splitSpawnCount; i += 1) {
            children.push({
                name: this.name,
                health: childHealth,
                attack: childAttack,
                defense: childDefense,
                splitSpawnCount: this.splitSpawnCount,
                splitRemainingGenerations: nextSplitRemainingGenerations,
                splitChildHealthScale: this.splitChildHealthScale,
                splitChildAttackScale: this.splitChildAttackScale,
                splitChildDefenseScale: this.splitChildDefenseScale
            });
        }
        return children;
    }

    applyStun(turns) {
        const duration = Math.max(1, Math.floor(turns || 0));
        this.stunnedTurns = Math.max(this.stunnedTurns, duration);
    }

    isStunned() {
        return this.stunnedTurns > 0;
    }

    consumeStunTurn() {
        if (this.stunnedTurns > 0) {
            this.stunnedTurns -= 1;
        }
    }

    applyBurn(damage, turns) {
        const nextBurnDamage = Math.max(1, Math.floor(damage || 0));
        const nextBurnTurns = Math.max(1, Math.floor(turns || 0));
        this.burnDamage = Math.max(this.burnDamage, nextBurnDamage);
        this.burnTurns = Math.max(this.burnTurns, nextBurnTurns);
    }

    isBurning() {
        return this.burnDamage > 0 && this.burnTurns > 0;
    }

    consumeBurnTurn() {
        if (!this.isBurning() || !this.isAlive()) {
            return 0;
        }

        const finalDamage = this.takeDamage(this.burnDamage, {
            damageType: 'fire',
            isDamageOverTime: true
        });

        this.burnTurns = Math.max(0, this.burnTurns - 1);
        if (this.burnTurns === 0) {
            this.burnDamage = 0;
        }
        return finalDamage;
    }

    applyPoison(damage, turns) {
        const nextPoisonDamage = Math.max(1, Math.floor(damage || 0));
        const nextPoisonTurns = Math.max(1, Math.floor(turns || 0));
        this.poisonDamage = Math.max(this.poisonDamage, nextPoisonDamage);
        this.poisonTurns = Math.max(this.poisonTurns, nextPoisonTurns);
        return {
            damage: this.poisonDamage,
            turns: this.poisonTurns
        };
    }

    applyBleed(damage) {
        const nextBleedDamage = Math.max(1, Math.floor(damage || 0));
        this.bleedDamage += nextBleedDamage;
        this.bleedStacks += 1;
        return {
            damage: this.bleedDamage,
            stacks: this.bleedStacks
        };
    }

    isBleeding() {
        return this.bleedDamage > 0 && this.bleedStacks > 0;
    }

    consumeBleedTurn() {
        if (!this.isBleeding() || !this.isAlive()) {
            return 0;
        }
        return this.takeDamage(this.bleedDamage, {
            damageType: 'bleed',
            ignoreArmor: true,
            isDamageOverTime: true
        });
    }

    isPoisoned() {
        return this.poisonDamage > 0 && this.poisonTurns > 0;
    }

    consumePoisonTurn() {
        if (!this.isPoisoned() || !this.isAlive()) {
            return 0;
        }

        const finalDamage = this.takeDamage(this.poisonDamage, {
            damageType: 'poison',
            isDamageOverTime: true
        });

        this.poisonTurns = Math.max(0, this.poisonTurns - 1);
        if (this.poisonTurns === 0) {
            this.poisonDamage = 0;
        }
        return finalDamage;
    }

    consumeTurnEffects() {
        const logs = [];
        if (this.hasAttackWeakness()) {
            this.attackWeakenTurns = Math.max(0, this.attackWeakenTurns - 1);
            if (this.attackWeakenTurns === 0) {
                this.attackWeakenAmount = 0;
                logs.push(`${this.name} n'est plus affaibli.`);
            }
        }
        if (this.deathCryCooldownRemaining > 0) {
            if (this.deathCryUsedThisTurn) {
                this.deathCryUsedThisTurn = false;
            } else {
                this.deathCryCooldownRemaining = Math.max(0, this.deathCryCooldownRemaining - 1);
            }
        }
        if (this.poisonCloudCooldownRemaining > 0) {
            if (this.poisonCloudUsedThisTurn) {
                this.poisonCloudUsedThisTurn = false;
            } else {
                this.poisonCloudCooldownRemaining = Math.max(0, this.poisonCloudCooldownRemaining - 1);
            }
        }
        if (this.isMarked()) {
            this.damageTakenVulnerabilityTurns = Math.max(0, this.damageTakenVulnerabilityTurns - 1);
            if (this.damageTakenVulnerabilityTurns === 0) {
                this.damageTakenVulnerabilityPercent = 0;
                logs.push(`${this.name} n'est plus marque.`);
            }
        }
        return logs;
    }

    isAlive() {
        return this.health > 0;
    }
}

function createMonster(forcedType = null, overrides = {}) {
    const forcedKey = MONSTER_FORCE_KEY_BY_TYPE[forcedType];
    if (forcedKey && MONSTER_DATA[forcedKey]) {
        return createMonsterFromTemplate(MONSTER_DATA[forcedKey], overrides);
    }

    const randomKey = MONSTER_SPAWN_POOL[Math.floor(Math.random() * MONSTER_SPAWN_POOL.length)];
    return createMonsterFromTemplate(MONSTER_DATA[randomKey], overrides);
}

if (typeof window !== 'undefined') {
    window.MONSTER_BESTIARY = MONSTER_BESTIARY;
    window.calculateDamageWithArmor = calculateDamageWithArmor;
    window.ARMOR_REDUCTION_SCALE = ARMOR_REDUCTION_SCALE;
    window.DAMAGE_TYPES = DAMAGE_TYPES;
    window.DAMAGE_TYPE_LABELS = DAMAGE_TYPE_LABELS;
    window.normalizeDamageType = normalizeDamageType;
    window.normalizeDamageResistanceValue = normalizeDamageResistanceValue;
    window.normalizeDamageResistanceMap = normalizeDamageResistanceMap;
    window.resolveDamageWithType = resolveDamageWithType;
}

function logMessage(message) {
    // Main message log
    const messages = document.getElementById('messages');
    if (messages) {
        const div = document.createElement('div');
        div.textContent = message;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Combat modal log (if open)
    const combatLog = document.getElementById('combat-modal-log');
    if (combatLog) {
        const d = document.createElement('div');
        d.textContent = message;
        combatLog.appendChild(d);
        combatLog.scrollTop = combatLog.scrollHeight;
    }
}

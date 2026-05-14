let monsterEntityIdCounter = 1;
const MONSTER_DATA = {
    goblin: {
        id: 'goblin',
        name: 'Goblin',
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
        health: 50,
        attack: 12,
        defense: 4,
        role: 'fighter',
        damageResistances: { physical: 8 },
        image: 'Images/Orc.png',
        abilities: ['Attaque basique lourde']
    },
    troll: {
        id: 'troll',
        name: 'Troll',
        health: 80,
        attack: 15,
        defense: 6,
        role: 'fighter',
        damageResistances: { poison: 12 },
        image: 'Images/Troll.png',
        abilities: ['Attaque basique tres puissante']
    },
    shaman: {
        id: 'shaman',
        name: 'Shaman gobelin',
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
        health: 47,
        attack: 13,
        defense: 5,
        role: 'kobold_chief',
        spawnIntervalTurns: 2,
        spawnCountdownTurns: 2,
        summonType: 'kobold',
        summonCount: 2,
        damageResistances: { physical: 10, poison: 15 },
        image: 'Images/ChefKobold.png',
        abilities: ['Appel de renforts: +2 kobolds tous les 2 tours', 'Attaque basique lourde']
    },
    green_slime: {
        id: 'green_slime',
        name: 'Slime verte',
        isBoss: true,
        health: 68,
        attack: 8,
        defense: 2,
        role: 'green_slime',
        splitSpawnCount: 2,
        splitRemainingGenerations: 2,
        splitChildHealthScale: 0.6,
        splitChildAttackScale: 0.85,
        splitChildDefenseScale: 0.8,
        damageResistances: { poison: 35, fire: -10 },
        image: 'Images/SlimeVerte.png',
        abilities: ['Division: se scinde en 2 a la mort', 'Les nouvelles slimes se divisent encore une fois']
    },
    ice_golem: {
        id: 'ice_golem',
        name: 'Golem de glace',
        isBoss: true,
        health: 180,
        attack: 18,
        defense: 10,
        role: 'ice_golem',
        damageResistances: { ice: 70, fire: -100 },
        weaponContactNumbTurns: 2,
        weaponContactDamageReductionMultiplier: 0.75,
        image: 'Images/GolemGlace.png',
        abilities: ['Carapace glacee', 'Vulnerable au feu (x2)', 'Contact d arme: Engourdi 2 tours (-25% degats)', 'Attaque basique lourde']
    },
    fire_golem: {
        id: 'fire_golem',
        name: 'Golem de feu',
        isBoss: true,
        health: 220,
        attack: 20,
        defense: 12,
        role: 'fire_golem',
        damageResistances: { fire: 75, ice: -25 },
        weaponContactFireDamage: 10,
        weaponContactBurnDamage: 6,
        weaponContactBurnTurns: 2,
        image: 'Images/GolemFeu.png',
        abilities: ['Carapace incandescente', 'Contact d arme: 10 degats de feu', 'Inflige Brulure (2 tours) au contact', 'Attaque basique ecrasante']
    },
    spectral_knight: {
        id: 'spectral_knight',
        name: 'Chevalier spectrale',
        isBoss: true,
        health: 280,
        attack: 13,
        defense: 16,
        role: 'spectral_knight',
        damageResistances: { magic: 30, poison: 20 },
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
        isBoss: true,
        health: 340,
        attack: 16,
        defense: 14,
        role: 'spider_queen',
        damageResistances: { poison: 70, fire: -10 },
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
        health: 56,
        attack: 11,
        defense: 4,
        role: 'spider',
        damageResistances: { poison: 25 },
        webTurns: 2,
        spawnIntervalTurns: 2,
        spawnCountdownTurns: 2,
        image: 'Images/Spider.png',
        abilities: ['Toile (immobilise 2 tours)', 'Pond 1 bebe araignee tous les 2 tours', 'Attaque basique']
    },
    spiderling: {
        id: 'spiderling',
        name: 'Bebe araignee',
        health: 20,
        attack: 7,
        defense: 1,
        role: 'spiderling',
        damageResistances: { poison: 10 },
        image: 'Images/Spider.png',
        abilities: ['Attaque basique rapide']
    }
};
const MONSTER_SPAWN_POOL = ['goblin', 'orc', 'troll', 'spider'];
const MONSTER_FORCE_KEY_BY_TYPE = {
    shaman: 'shaman',
    kobold: 'kobold',
    kobold_chief: 'kobold_chief',
    green_slime: 'green_slime',
    ice_golem: 'ice_golem',
    fire_golem: 'fire_golem',
    spectral_knight: 'spectral_knight',
    spider_queen: 'spider_queen',
    spider: 'spider',
    spiderling: 'spiderling'
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
const DAMAGE_TYPES = ['physical', 'magic', 'fire', 'ice', 'poison'];
const DAMAGE_TYPE_LABELS = {
    physical: 'Physique',
    magic: 'Magique',
    fire: 'Feu',
    ice: 'Glace',
    poison: 'Poison'
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
    poison: 'poison'
};
const DAMAGE_RESISTANCE_MIN = -100;
const DAMAGE_RESISTANCE_MAX = 90;
const MONSTER_HEALTH_VARIANCE_MIN = 0.9;
const MONSTER_HEALTH_VARIANCE_MAX = 1.1;

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
        poison: 0
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
    const resistancePercent = normalizeDamageResistanceValue(options.resistancePercent || 0);
    const minDamage = Math.max(0, Math.floor(options.minDamage || 1));
    const damageAfterArmor = ignoreArmor ? normalizedRawDamage : calculateDamageWithArmor(normalizedRawDamage, armorValue);
    const reducedDamage = Math.round(damageAfterArmor * (1 - (resistancePercent / 100)));
    return Math.max(minDamage, reducedDamage);
}

function createMonsterFromTemplate(template, overrides = {}) {
    const mergedOptions = {
        ...template,
        ...(overrides || {})
    };
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
        this.stunnedTurns = 0;
        this.burnDamage = 0;
        this.burnTurns = 0;
        this.attackWeakenAmount = 0;
        this.attackWeakenTurns = 0;
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

    getDamageResistance(damageType) {
        const normalizedType = normalizeDamageType(damageType);
        const resistance = this.damageResistances[normalizedType];
        return normalizeDamageResistanceValue(resistance);
    }

    takeDamage(damage, options = {}) {
        const wasAliveBeforeHit = this.health > 0;
        const damageType = normalizeDamageType(options && options.damageType ? options.damageType : 'physical');
        const resistancePercent = this.getDamageResistance(damageType);
        const finalDamage = resolveDamageWithType(damage, {
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
            if (wasAliveBeforeHit && finalDamage > 0 && typeof window.playSoundEffect === 'function') {
                // Let the sword impact start first so the death sound remains audible.
                window.setTimeout(() => {
                    if (typeof window.playSoundEffect === 'function') {
                        window.playSoundEffect('monsterDeath', { volume: 1.0 });
                    }
                }, 180);
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

        const finalDamage = this.takeDamage(this.burnDamage, { damageType: 'fire' });

        this.burnTurns = Math.max(0, this.burnTurns - 1);
        if (this.burnTurns === 0) {
            this.burnDamage = 0;
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

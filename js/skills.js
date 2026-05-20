const SKILLS_CLASS_DEFINITIONS = [
    { key: 'Warrior', label: 'Guerrier', portrait: 'Images/Guerrier.png' },
    { key: 'Rogue', label: 'Voleur', portrait: 'Images/Voleur.png' },
    { key: 'Archer', label: 'Archer', portrait: 'Images/Archer.png' },
    { key: 'Mage', label: 'Mage', portrait: 'Images/Mage.png' },
    { key: 'Necromancer', label: 'Necromancien', portrait: 'Images/Necromancien.png' },
    { key: 'Druid', label: 'Druide', portrait: 'Images/Duide.png' }
];

function getSkillRankDescription(skill) {
    if (!skill || typeof skill !== 'object') {
        return 'Aucune description disponible.';
    }
    const explicitDescription = typeof skill.rankDescription === 'string' ? skill.rankDescription.trim() : '';
    if (explicitDescription) {
        return explicitDescription;
    }
    const powerPerRank = Number(skill.powerPerRank);
    if (Number.isFinite(powerPerRank) && powerPerRank > 0) {
        return `+${Math.round(powerPerRank * 100)}% puissance/rang`;
    }
    return 'Aucun bonus de rang supplementaire.';
}

function getPassiveRankDescription(passive) {
    if (!passive || typeof passive !== 'object') {
        return 'Aucune description disponible.';
    }
    if (typeof buildPassiveEffectDescription === 'function') {
        const description = buildPassiveEffectDescription(passive);
        if (typeof description === 'string' && description.trim().length > 0) {
            return description;
        }
    }
    return 'Bonus passif permanent.';
}

function createSkillListItem(entryName, unlockLevel, maxRank, description) {
    const item = document.createElement('li');

    const title = document.createElement('span');
    title.className = 'skills-item-title';
    title.textContent = entryName;

    const meta = document.createElement('span');
    meta.className = 'skills-item-meta';
    meta.textContent = `Niveau ${unlockLevel} - Rang max ${maxRank}`;

    const desc = document.createElement('span');
    desc.className = 'skills-item-desc';
    desc.textContent = description;

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(desc);
    return item;
}

function buildClassColumn(titleText, listItems) {
    const column = document.createElement('section');
    column.className = 'skills-column';

    const title = document.createElement('h3');
    title.textContent = titleText;
    column.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'skills-list';
    listItems.forEach((item) => list.appendChild(item));
    column.appendChild(list);
    return column;
}

function renderSkillsGuide() {
    const grid = document.getElementById('skills-grid');
    if (!grid) {
        return;
    }

    const hasSkillTreeAccessor = typeof getSkillTreeForClass === 'function';
    const hasPassiveTreeAccessor = typeof getPassiveTreeForClass === 'function';
    if (!hasSkillTreeAccessor || !hasPassiveTreeAccessor) {
        const missingData = document.createElement('p');
        missingData.textContent = 'Impossible de charger les arbres de skills/passifs.';
        grid.appendChild(missingData);
        return;
    }

    SKILLS_CLASS_DEFINITIONS.forEach((classDefinition) => {
        const card = document.createElement('article');
        card.className = 'skills-class-card';

        const header = document.createElement('header');
        header.className = 'skills-class-header';

        const portrait = document.createElement('img');
        portrait.className = 'skills-class-portrait';
        portrait.src = classDefinition.portrait;
        portrait.alt = classDefinition.label;

        const className = document.createElement('h2');
        className.className = 'skills-class-name';
        className.textContent = classDefinition.label;

        header.appendChild(portrait);
        header.appendChild(className);
        card.appendChild(header);

        const skills = getSkillTreeForClass(classDefinition.key) || [];
        const skillItems = skills.map((skill) => {
            const unlockLevel = Math.max(1, Math.floor(Number(skill.unlockLevel) || 1));
            const maxRank = Math.max(1, Math.floor(Number(skill.maxRank) || 1));
            const description = getSkillRankDescription(skill);
            return createSkillListItem(skill.action || 'Skill', unlockLevel, maxRank, description);
        });
        if (skillItems.length === 0) {
            skillItems.push(createSkillListItem('Aucun skill', 1, 1, 'Aucune competence active definie.'));
        }
        card.appendChild(buildClassColumn('Skills actifs', skillItems));

        const passives = getPassiveTreeForClass(classDefinition.key) || [];
        const passiveItems = passives.map((passive) => {
            const unlockLevel = Math.max(1, Math.floor(Number(passive.unlockLevel) || 1));
            const maxRank = Math.max(1, Math.floor(Number(passive.maxRank) || 1));
            const description = getPassiveRankDescription(passive);
            return createSkillListItem(passive.name || 'Passif', unlockLevel, maxRank, description);
        });
        if (passiveItems.length === 0) {
            passiveItems.push(createSkillListItem('Aucun passif', 1, 1, 'Aucun passif defini.'));
        }
        card.appendChild(buildClassColumn('Passifs', passiveItems));

        grid.appendChild(card);
    });
}

function bindSkillsReturnLink() {
    const returnLink = document.getElementById('skills-return-link');
    if (!returnLink) {
        return;
    }

    returnLink.addEventListener('click', (event) => {
        if (window.opener && !window.opener.closed) {
            event.preventDefault();
            try {
                window.opener.focus();
            } catch (_) {
                // Ignore focus errors and still close this tab.
            }
            window.close();
            return;
        }

        if (window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        }
    });
}

bindSkillsReturnLink();
renderSkillsGuide();

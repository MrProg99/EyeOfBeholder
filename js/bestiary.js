function renderBestiaryTable() {
    const tableBody = document.getElementById('bestiary-table-body');
    if (!tableBody) {
        return;
    }

    const monsters = Array.isArray(window.MONSTER_BESTIARY) ? window.MONSTER_BESTIARY : [];
    if (monsters.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5">Aucune donnee de bestiaire disponible.</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    monsters.forEach((monster) => {
        const row = document.createElement('tr');
        const abilities = Array.isArray(monster.abilities) ? [...monster.abilities] : [];
        const rawResistances = monster && typeof monster === 'object' ? monster.damageResistances : null;
        if (rawResistances && typeof rawResistances === 'object') {
            const labels = (typeof window !== 'undefined' && window.DAMAGE_TYPE_LABELS) ? window.DAMAGE_TYPE_LABELS : {};
            const resistanceSummary = Object.entries(rawResistances)
                .map(([type, value]) => ({ type, value: Number(value) }))
                .filter((entry) => Number.isFinite(entry.value) && entry.value !== 0)
                .map((entry) => `${labels[entry.type] || entry.type}: ${entry.value >= 0 ? '+' : ''}${Math.round(entry.value)}%`)
                .join(', ');
            if (resistanceSummary) {
                abilities.push(`Resistances: ${resistanceSummary}`);
            }
        }
        const abilitiesHtml = abilities.length > 0
            ? `<ul class="bestiary-abilities">${abilities.map((ability) => `<li>${ability}</li>`).join('')}</ul>`
            : '<span>Aucune capacite speciale</span>';

        row.innerHTML = `
            <td>
                <div class="bestiary-monster-cell">
                    <img class="bestiary-monster-image" src="${monster.image || ''}" alt="${monster.name}">
                    <strong>${monster.name}</strong>
                </div>
            </td>
            <td>${monster.health}</td>
            <td>${monster.attack}</td>
            <td>${monster.defense}</td>
            <td>${abilitiesHtml}</td>
        `;
        tableBody.appendChild(row);
    });
}

renderBestiaryTable();

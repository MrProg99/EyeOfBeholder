class Dungeon {
    constructor() {
        this.floors = [];
        this.currentFloor = 0;
        this.currentRoom = { x: 0, y: 0 };
        this.generateTower();
    }

    ensureMinimumCombatRooms(rooms, minimumCombatRooms = 3) {
        if (!Array.isArray(rooms) || rooms.length === 0) {
            return;
        }

        const countCombatRooms = () => rooms.reduce((count, room) => (
            room && room.type === 'monster' ? count + 1 : count
        ), 0);

        let combatRooms = countCombatRooms();
        if (combatRooms >= minimumCombatRooms) {
            return;
        }

        const regularCandidates = [];
        const stairCandidates = [];

        rooms.forEach((room) => {
            if (!room || room.type === 'monster' || room.type === 'rest') {
                return;
            }
            if (room.hasStairs) {
                stairCandidates.push(room);
                return;
            }
            regularCandidates.push(room);
        });

        const candidates = [...regularCandidates, ...stairCandidates];
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        while (combatRooms < minimumCombatRooms && candidates.length > 0) {
            const room = candidates.pop();
            room.type = 'monster';
            room.monsterCount = Math.floor(Math.random() * 3) + 1;
            combatRooms++;
        }
    }

    generateTower() {
        for (let floor = 0; floor < 10; floor++) { // 10 floors for example
            const rooms = [];
            for (let i = 0; i < 12; i++) {
                const isMonsterRoom = Math.random() > 0.7;
                const room = {
                    x: i % 4,
                    y: Math.floor(i / 4),
                    type: isMonsterRoom ? 'monster' : 'empty',
                    monsterCount: isMonsterRoom ? (Math.floor(Math.random() * 3) + 1) : 0,
                    hasStairs: i === 11 // last room has stairs
                };
                rooms.push(room);
            }
            // Add rest room at position 0
            rooms[0].type = 'rest';
            rooms[0].monsterCount = 0;
            // Floor 1 (index 0): staircase guarded by the Green Slime boss.
            if (floor === 0) {
                rooms[11].type = 'monster';
                rooms[11].monsterCount = 1;
                rooms[11].forcedMonsterType = 'green_slime';
            }
            // Floor 2 (index 1): staircase guarded by the Ice Golem boss.
            if (floor === 1) {
                rooms[11].type = 'monster';
                rooms[11].monsterCount = 1;
                rooms[11].forcedMonsterType = 'ice_golem';
            }
            // Floor 3 (index 2): staircase guarded by the Fire Golem boss.
            if (floor === 2) {
                rooms[11].type = 'monster';
                rooms[11].monsterCount = 1;
                rooms[11].forcedMonsterType = 'fire_golem';
            }
            // Floor 4 (index 3): staircase guarded by the Spectral Knight boss.
            if (floor === 3) {
                rooms[11].type = 'monster';
                rooms[11].monsterCount = 1;
                rooms[11].forcedMonsterType = 'spectral_knight';
            }
            // Floor 5 (index 4): staircase guarded by the Spider Queen boss.
            if (floor === 4) {
                rooms[11].type = 'monster';
                rooms[11].monsterCount = 1;
                rooms[11].forcedMonsterType = 'spider_queen';
            }
            this.ensureMinimumCombatRooms(rooms, 3);
            this.floors.push(rooms);
        }
    }

    getCurrentRoom() {
        return this.floors[this.currentFloor][this.currentRoom.y * 4 + this.currentRoom.x];
    }

    move(dx, dy) {
        const newX = this.currentRoom.x + dx;
        const newY = this.currentRoom.y + dy;
        if (newX >= 0 && newX < 4 && newY >= 0 && newY < 3) {
            this.currentRoom.x = newX;
            this.currentRoom.y = newY;
            return true;
        }
        return false;
    }

    climbStairs() {
        if (this.getCurrentRoom().hasStairs && this.currentFloor < this.floors.length - 1) {
            this.currentFloor++;
            this.currentRoom = { x: 0, y: 0 };
            return true;
        }
        return false;
    }
}

const dungeon = new Dungeon();

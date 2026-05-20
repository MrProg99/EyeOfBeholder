const ASCENT_MAP_DEFAULT_ROWS = 8;
const ASCENT_MAP_DEFAULT_COLS = 5;
const ASCENT_MAP_MIN_ROWS = 6;
const ASCENT_MAP_BRANCH_COUNT = 3;
const ASCENT_MAP_ROW_WANDER_CHANCE = 0.72;
const ASCENT_MAP_ROW_WANDER_RANGE = 1;
const ASCENT_MAP_ROW_MERGE_CHANCE = 0.24;
const ASCENT_MAP_EXTRA_LINK_CHANCE = 0.42;
const ASCENT_MAP_EXTRA_LINK_MAX_DISTANCE = 2;
const ASCENT_MAP_PREGENERATED_FLOORS = 10;
const ASCENT_RED_ROOM_MIN_FLOOR = 2;
const ASCENT_RED_ROOM_BASE_CHANCE = 0.12;
const ASCENT_RED_ROOM_FLOOR_STEP_CHANCE = 0.03;
const ASCENT_RED_ROOM_MAX_CHANCE = 0.4;
const ASCENT_FORCE_RED_ROOM_ON_FIRST_FLOOR = true;
const ASCENT_FIRST_FLOOR_RED_ROOM_MIN_MONSTERS = 3;
const ASCENT_MONSTER_COUNT_TIER_ONE_MAX_FLOOR = 3;
const ASCENT_MONSTER_COUNT_TIER_TWO_MAX_FLOOR = 6;
const ASCENT_NODE_TYPES = Object.freeze({
    MONSTER: 'monster',
    REST: 'rest',
    BOSS: 'boss'
});
const ASCENT_BOSS_ROTATION = ['green_slime', 'ice_golem', 'fire_golem', 'spectral_knight', 'spider_queen', 'archimage'];

class Dungeon {
    constructor() {
        this.floors = [];
        this.currentFloor = 0;
        this.currentRoom = { x: 0, y: 0, nodeId: '' };
        this.generateTower();
    }

    isAscentPathMode() {
        return true;
    }

    chooseBossTypeForFloor(floorIndex) {
        const normalizedIndex = Math.max(0, Math.floor(Number(floorIndex) || 0));
        return ASCENT_BOSS_ROTATION[normalizedIndex % ASCENT_BOSS_ROTATION.length];
    }

    getMonsterCountRangeForFloor(floorIndex) {
        const floorNumber = Math.max(1, Math.floor(Number(floorIndex) || 0) + 1);
        if (floorNumber <= 1) {
            return { min: 1, max: 2 };
        }
        if (floorNumber <= ASCENT_MONSTER_COUNT_TIER_ONE_MAX_FLOOR) {
            return { min: 1, max: 3 };
        }
        if (floorNumber <= ASCENT_MONSTER_COUNT_TIER_TWO_MAX_FLOOR) {
            return { min: 2, max: 4 };
        }
        return { min: 3, max: 5 };
    }

    rollMonsterCountForFloor(floorIndex) {
        const range = this.getMonsterCountRangeForFloor(floorIndex);
        const min = Math.max(1, Math.floor(Number(range.min) || 1));
        const max = Math.max(min, Math.floor(Number(range.max) || min));
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    normalizeMonsterCountForFloor(rawCount, floorIndex, room = null) {
        if (room && room.nodeType === ASCENT_NODE_TYPES.BOSS) {
            return 1;
        }
        const floorNumber = Math.max(1, Math.floor(Number(floorIndex) || 0) + 1);
        const range = this.getMonsterCountRangeForFloor(floorIndex);
        const min = Math.max(1, Math.floor(Number(range.min) || 1));
        const max = Math.max(min, Math.floor(Number(range.max) || min));
        const numericCount = Math.floor(Number(rawCount) || 0);
        if (room && room.isRedRoom && floorNumber <= 1) {
            const baselineCount = numericCount > 0 ? numericCount : min;
            return Math.max(ASCENT_FIRST_FLOOR_RED_ROOM_MIN_MONSTERS, baselineCount);
        }
        if (numericCount <= 0) {
            return this.rollMonsterCountForFloor(floorIndex);
        }
        return Math.max(min, Math.min(max, numericCount));
    }

    getRedRoomChanceForFloor(floorIndex) {
        const floorNumber = Math.max(1, Math.floor(Number(floorIndex) || 0) + 1);
        if (floorNumber < ASCENT_RED_ROOM_MIN_FLOOR) {
            return 0;
        }
        const extraFloors = floorNumber - ASCENT_RED_ROOM_MIN_FLOOR;
        const rawChance = ASCENT_RED_ROOM_BASE_CHANCE + (extraFloors * ASCENT_RED_ROOM_FLOOR_STEP_CHANCE);
        return Math.max(0, Math.min(ASCENT_RED_ROOM_MAX_CHANCE, rawChance));
    }

    shouldCreateRedRoomForFloor(floorIndex) {
        const chance = this.getRedRoomChanceForFloor(floorIndex);
        return chance > 0 && Math.random() < chance;
    }

    createRoomNode(options = {}) {
        const row = Math.max(0, Math.floor(Number(options.y) || 0));
        const col = Math.max(0, Math.floor(Number(options.x) || 0));
        const allowedNodeTypes = Object.values(ASCENT_NODE_TYPES);
        const requestedType = typeof options.nodeType === 'string' ? options.nodeType : ASCENT_NODE_TYPES.MONSTER;
        const nodeType = allowedNodeTypes.includes(requestedType) ? requestedType : ASCENT_NODE_TYPES.MONSTER;
        const initialType = nodeType === ASCENT_NODE_TYPES.BOSS ? ASCENT_NODE_TYPES.MONSTER : nodeType;
        return {
            id: typeof options.id === 'string' ? options.id : '',
            x: col,
            y: row,
            row,
            col,
            type: initialType,
            nodeType,
            monsterCount: Math.max(0, Math.floor(Number(options.monsterCount) || 0)),
            forcedMonsterType: typeof options.forcedMonsterType === 'string' ? options.forcedMonsterType : '',
            isRedRoom: Boolean(options.isRedRoom),
            hasStairs: false,
            linksUp: [],
            linksDown: [],
            available: Boolean(options.available),
            entered: Boolean(options.entered),
            cleared: Boolean(options.cleared)
        };
    }

    getAscentLaneColumns(cols, laneCount = ASCENT_MAP_BRANCH_COUNT) {
        const totalCols = Math.max(1, Math.floor(Number(cols) || ASCENT_MAP_DEFAULT_COLS));
        const safeLaneCount = Math.max(1, Math.min(totalCols, Math.floor(Number(laneCount) || ASCENT_MAP_BRANCH_COUNT)));
        const centerCol = Math.floor(totalCols / 2);
        const laneColumns = [];
        const offsets = [0, -1, 1, -2, 2, -3, 3, -4, 4];

        for (let offsetIndex = 0; offsetIndex < offsets.length; offsetIndex += 1) {
            const offset = offsets[offsetIndex];
            const col = Math.max(0, Math.min(totalCols - 1, centerCol + offset));
            if (!laneColumns.includes(col)) {
                laneColumns.push(col);
            }
            if (laneColumns.length >= safeLaneCount) {
                break;
            }
        }

        return laneColumns.sort((first, second) => first - second);
    }

    generateAscentRowColumns(baseColumns, totalCols, previousColumns = []) {
        if (!Array.isArray(baseColumns) || baseColumns.length === 0) {
            const fallbackCol = Math.max(0, Math.floor((Number(totalCols) || ASCENT_MAP_DEFAULT_COLS) / 2));
            return [fallbackCol];
        }

        const safeTotalCols = Math.max(1, Math.floor(Number(totalCols) || ASCENT_MAP_DEFAULT_COLS));
        const sortedBaseColumns = [...baseColumns].sort((first, second) => first - second);
        const usedColumns = new Set();
        const rowColumns = [];

        const clampToGrid = (col) => Math.max(0, Math.min(safeTotalCols - 1, Math.floor(Number(col) || 0)));

        sortedBaseColumns.forEach((baseCol, index) => {
            const previousCol = Number.isInteger(previousColumns[index]) ? previousColumns[index] : baseCol;
            const applyWander = Math.random() < ASCENT_MAP_ROW_WANDER_CHANCE;
            const wanderOffset = applyWander
                ? (Math.floor(Math.random() * ((ASCENT_MAP_ROW_WANDER_RANGE * 2) + 1)) - ASCENT_MAP_ROW_WANDER_RANGE)
                : 0;
            const preferredCol = clampToGrid(previousCol + wanderOffset);
            const fallbackCandidates = [
                preferredCol,
                baseCol,
                preferredCol - 1,
                preferredCol + 1,
                baseCol - 1,
                baseCol + 1,
                previousCol - 1,
                previousCol + 1
            ];

            let selectedCol = null;
            for (let candidateIndex = 0; candidateIndex < fallbackCandidates.length; candidateIndex += 1) {
                const candidateCol = clampToGrid(fallbackCandidates[candidateIndex]);
                if (usedColumns.has(candidateCol)) {
                    continue;
                }
                selectedCol = candidateCol;
                break;
            }

            if (selectedCol === null) {
                selectedCol = Array.from({ length: safeTotalCols }, (_, colIndex) => colIndex)
                    .sort((first, second) => {
                        const firstDistance = Math.abs(first - preferredCol);
                        const secondDistance = Math.abs(second - preferredCol);
                        if (firstDistance !== secondDistance) {
                            return firstDistance - secondDistance;
                        }
                        return first - second;
                    })
                    .find((colCandidate) => !usedColumns.has(colCandidate));
            }

            const resolvedCol = clampToGrid(selectedCol);
            usedColumns.add(resolvedCol);
            rowColumns.push(resolvedCol);
        });

        const sortedRowColumns = rowColumns.sort((first, second) => first - second);
        if (sortedRowColumns.length >= 3 && Math.random() < ASCENT_MAP_ROW_MERGE_CHANCE) {
            const removeIndex = Math.random() < 0.5 ? 0 : sortedRowColumns.length - 1;
            sortedRowColumns.splice(removeIndex, 1);
        }

        return sortedRowColumns;
    }

    connectAscentRows(fromRooms, toRooms, linkRooms) {
        if (!Array.isArray(fromRooms) || fromRooms.length === 0 || !Array.isArray(toRooms) || toRooms.length === 0) {
            return;
        }

        const sortedFromRooms = [...fromRooms].sort((first, second) => first.x - second.x);
        const sortedToRooms = [...toRooms].sort((first, second) => first.x - second.x);
        const getDistanceBetweenRooms = (firstRoom, secondRoom) => Math.abs((firstRoom && firstRoom.x) - (secondRoom && secondRoom.x));

        sortedFromRooms.forEach((fromRoom) => {
            const closestTargets = [...sortedToRooms].sort((first, second) => {
                const firstDistance = getDistanceBetweenRooms(fromRoom, first);
                const secondDistance = getDistanceBetweenRooms(fromRoom, second);
                if (firstDistance !== secondDistance) {
                    return firstDistance - secondDistance;
                }
                return first.x - second.x;
            });
            const primaryTarget = closestTargets[0];
            if (!primaryTarget) {
                return;
            }
            linkRooms(fromRoom, primaryTarget);

            const secondaryTarget = closestTargets.find((candidateTarget) => (
                candidateTarget.id !== primaryTarget.id
                && getDistanceBetweenRooms(fromRoom, candidateTarget) <= ASCENT_MAP_EXTRA_LINK_MAX_DISTANCE
            ));
            if (secondaryTarget && Math.random() < ASCENT_MAP_EXTRA_LINK_CHANCE) {
                linkRooms(fromRoom, secondaryTarget);
            }
        });

        sortedToRooms.forEach((toRoom) => {
            if (toRoom.linksDown.length > 0) {
                return;
            }
            const nearestFromRoom = [...sortedFromRooms].sort((first, second) => {
                const firstDistance = getDistanceBetweenRooms(first, toRoom);
                const secondDistance = getDistanceBetweenRooms(second, toRoom);
                if (firstDistance !== secondDistance) {
                    return firstDistance - secondDistance;
                }
                return first.x - second.x;
            })[0];
            if (nearestFromRoom) {
                linkRooms(nearestFromRoom, toRoom);
            }
        });

        sortedToRooms.forEach((toRoom) => {
            if (toRoom.linksDown.length !== 1 || Math.random() >= (ASCENT_MAP_EXTRA_LINK_CHANCE * 0.55)) {
                return;
            }
            const currentSourceId = toRoom.linksDown[0];
            const alternateSourceRoom = [...sortedFromRooms]
                .filter((fromRoom) => fromRoom.id !== currentSourceId && !fromRoom.linksUp.includes(toRoom.id))
                .sort((first, second) => {
                    const firstDistance = getDistanceBetweenRooms(first, toRoom);
                    const secondDistance = getDistanceBetweenRooms(second, toRoom);
                    if (firstDistance !== secondDistance) {
                        return firstDistance - secondDistance;
                    }
                    return first.x - second.x;
                })[0];
            if (!alternateSourceRoom || getDistanceBetweenRooms(alternateSourceRoom, toRoom) > ASCENT_MAP_EXTRA_LINK_MAX_DISTANCE) {
                return;
            }
            linkRooms(alternateSourceRoom, toRoom);
        });
    }

    buildAscentFloor(floorIndex) {
        const rows = Math.max(ASCENT_MAP_MIN_ROWS, Math.floor(Number(ASCENT_MAP_DEFAULT_ROWS) || ASCENT_MAP_MIN_ROWS));
        const cols = Math.max(ASCENT_MAP_BRANCH_COUNT, Math.floor(Number(ASCENT_MAP_DEFAULT_COLS) || ASCENT_MAP_BRANCH_COUNT));
        const bossType = this.chooseBossTypeForFloor(floorIndex);
        const laneColumns = this.getAscentLaneColumns(cols, ASCENT_MAP_BRANCH_COUNT);
        const centerColumn = laneColumns[Math.floor(laneColumns.length / 2)] ?? Math.floor(cols / 2);
        const topRowIndex = rows - 1;
        const restRowIndex = Math.floor((rows - 1) / 2);
        const nodes = [];
        const roomsByRow = [];
        let previousLaneColumns = [...laneColumns];
        let nodeCounter = 1;

        for (let row = 0; row < rows; row += 1) {
            const isStartRow = row === 0;
            const isTopRow = row === topRowIndex;
            const isRestRow = row === restRowIndex;
            let columns = [centerColumn];
            if (!(isTopRow || isRestRow)) {
                columns = isStartRow
                    ? [...laneColumns]
                    : this.generateAscentRowColumns(laneColumns, cols, previousLaneColumns);
            }

            const rowNodes = columns.map((col) => {
                const nodeType = isTopRow
                    ? ASCENT_NODE_TYPES.BOSS
                    : (isRestRow ? ASCENT_NODE_TYPES.REST : ASCENT_NODE_TYPES.MONSTER);
                const isRedRoom = nodeType === ASCENT_NODE_TYPES.MONSTER
                    && !isStartRow
                    && this.shouldCreateRedRoomForFloor(floorIndex);
                const monsterCount = nodeType === ASCENT_NODE_TYPES.MONSTER
                    ? this.rollMonsterCountForFloor(floorIndex)
                    : (isTopRow ? 1 : 0);
                const room = this.createRoomNode({
                    id: `floor${floorIndex + 1}_node${nodeCounter}`,
                    x: col,
                    y: row,
                    nodeType,
                    monsterCount,
                    forcedMonsterType: isTopRow ? bossType : '',
                    isRedRoom,
                    available: isStartRow,
                    entered: false,
                    cleared: false
                });
                nodeCounter += 1;
                return room;
            });

            if (columns.length > 1) {
                previousLaneColumns = [...columns];
            }
            roomsByRow.push(rowNodes);
            nodes.push(...rowNodes);
        }

        if (ASCENT_FORCE_RED_ROOM_ON_FIRST_FLOOR && floorIndex === 0) {
            const existingRedRoom = nodes.some((room) => room && room.nodeType === ASCENT_NODE_TYPES.MONSTER && room.isRedRoom);
            if (!existingRedRoom) {
                const optionalChallengeCandidates = roomsByRow
                    .filter((rowNodes, rowIndex) => rowIndex > 0 && Array.isArray(rowNodes))
                    .flatMap((rowNodes) => {
                        const monsterNodes = rowNodes.filter((room) => room && room.nodeType === ASCENT_NODE_TYPES.MONSTER);
                        if (monsterNodes.length <= 1) {
                            return [];
                        }
                        return monsterNodes;
                    });
                const fallbackCandidates = optionalChallengeCandidates.length > 0
                    ? optionalChallengeCandidates
                    : nodes.filter((room) => (
                        room
                        && room.nodeType === ASCENT_NODE_TYPES.MONSTER
                        && room.row > 0
                    ));
                if (fallbackCandidates.length > 0) {
                    const forcedIndex = Math.floor(Math.random() * fallbackCandidates.length);
                    fallbackCandidates[forcedIndex].isRedRoom = true;
                }
            }
        }

        const linkRooms = (fromRoom, toRoom) => {
            if (!fromRoom || !toRoom) {
                return;
            }
            if (!fromRoom.linksUp.includes(toRoom.id)) {
                fromRoom.linksUp.push(toRoom.id);
            }
            if (!toRoom.linksDown.includes(fromRoom.id)) {
                toRoom.linksDown.push(fromRoom.id);
            }
        };

        for (let row = 0; row < roomsByRow.length - 1; row += 1) {
            this.connectAscentRows(roomsByRow[row], roomsByRow[row + 1], linkRooms);
        }

        const startNodeIds = (roomsByRow[0] || []).map((room) => room.id);
        const bossRowNodes = roomsByRow[roomsByRow.length - 1] || [];
        const bossNodeId = bossRowNodes.length > 0 ? bossRowNodes[0].id : '';
        return {
            mode: 'ascent-path',
            rows,
            cols,
            bossType,
            nodes,
            startNodeIds,
            bossNodeId
        };
    }

    generateTower(totalFloors = ASCENT_MAP_PREGENERATED_FLOORS) {
        this.floors = [];
        const safeTotalFloors = Math.max(1, Math.floor(Number(totalFloors) || ASCENT_MAP_PREGENERATED_FLOORS));
        for (let floorIndex = 0; floorIndex < safeTotalFloors; floorIndex += 1) {
            this.floors.push(this.buildAscentFloor(floorIndex));
        }
        this.currentFloor = 0;
        const firstRoom = this.getInitialRoomForFloor(0);
        if (firstRoom) {
            this.currentRoom = { x: firstRoom.x, y: firstRoom.y, nodeId: firstRoom.id };
        } else {
            this.currentRoom = { x: 0, y: 0, nodeId: '' };
        }
    }

    ensureFloorExists(floorIndex) {
        const targetIndex = Math.max(0, Math.floor(Number(floorIndex) || 0));
        while (this.floors.length <= targetIndex) {
            this.floors.push(this.buildAscentFloor(this.floors.length));
        }
    }

    getFloorData(floorIndex = this.currentFloor) {
        const index = Math.max(0, Math.floor(Number(floorIndex) || 0));
        return this.floors[index] || null;
    }

    getRoomsForFloor(floorIndex = this.currentFloor) {
        const floor = this.getFloorData(floorIndex);
        if (!floor || !Array.isArray(floor.nodes)) {
            return [];
        }
        return floor.nodes;
    }

    getRoomById(roomId, floorIndex = this.currentFloor) {
        if (typeof roomId !== 'string' || roomId.length === 0) {
            return null;
        }
        const rooms = this.getRoomsForFloor(floorIndex);
        return rooms.find((room) => room && room.id === roomId) || null;
    }

    getRoomAt(x, y, floorIndex = this.currentFloor) {
        const col = Math.floor(Number(x) || 0);
        const row = Math.floor(Number(y) || 0);
        const rooms = this.getRoomsForFloor(floorIndex);
        return rooms.find((room) => room && room.x === col && room.y === row) || null;
    }

    getInitialRoomForFloor(floorIndex = this.currentFloor) {
        const floor = this.getFloorData(floorIndex);
        if (!floor) {
            return null;
        }
        const rooms = this.getRoomsForFloor(floorIndex);
        const startById = Array.isArray(floor.startNodeIds)
            ? floor.startNodeIds
                .map((roomId) => this.getRoomById(roomId, floorIndex))
                .filter((room) => Boolean(room))
            : [];
        if (startById.length > 0) {
            return startById.sort((first, second) => first.x - second.x)[0];
        }
        if (rooms.length === 0) {
            return null;
        }
        return rooms.sort((first, second) => {
            if (first.y !== second.y) {
                return first.y - second.y;
            }
            return first.x - second.x;
        })[0];
    }

    getCurrentRoom() {
        const floor = this.getFloorData(this.currentFloor);
        if (!floor) {
            return null;
        }
        const roomFromId = this.getRoomById(this.currentRoom.nodeId, this.currentFloor);
        if (roomFromId) {
            return roomFromId;
        }
        const roomFromCoords = this.getRoomAt(this.currentRoom.x, this.currentRoom.y, this.currentFloor);
        if (roomFromCoords) {
            this.currentRoom = { x: roomFromCoords.x, y: roomFromCoords.y, nodeId: roomFromCoords.id };
            return roomFromCoords;
        }
        const fallbackRoom = this.getInitialRoomForFloor(this.currentFloor);
        if (fallbackRoom) {
            this.currentRoom = { x: fallbackRoom.x, y: fallbackRoom.y, nodeId: fallbackRoom.id };
            return fallbackRoom;
        }
        return null;
    }

    normalizeCurrentRoom(savedRoom, floorIndex = this.currentFloor) {
        this.ensureFloorExists(floorIndex);
        const floor = this.getFloorData(floorIndex);
        if (!floor) {
            return { x: 0, y: 0, nodeId: '' };
        }
        const normalizedSource = savedRoom && typeof savedRoom === 'object' ? savedRoom : {};
        const roomById = this.getRoomById(normalizedSource.nodeId, floorIndex);
        if (roomById) {
            return { x: roomById.x, y: roomById.y, nodeId: roomById.id };
        }
        const roomByCoords = this.getRoomAt(normalizedSource.x, normalizedSource.y, floorIndex);
        if (roomByCoords) {
            return { x: roomByCoords.x, y: roomByCoords.y, nodeId: roomByCoords.id };
        }
        const fallbackRoom = this.getInitialRoomForFloor(floorIndex);
        if (fallbackRoom) {
            return { x: fallbackRoom.x, y: fallbackRoom.y, nodeId: fallbackRoom.id };
        }
        return { x: 0, y: 0, nodeId: '' };
    }

    canEnterRoom(room) {
        if (!room || typeof room !== 'object') {
            return false;
        }
        if (room.cleared) {
            return false;
        }
        return Boolean(room.available);
    }

    enterRoomById(roomId) {
        const room = this.getRoomById(roomId, this.currentFloor);
        if (!this.canEnterRoom(room)) {
            return null;
        }
        room.entered = true;
        this.currentRoom = { x: room.x, y: room.y, nodeId: room.id };
        return room;
    }

    enterRoomByCoordinates(x, y) {
        const room = this.getRoomAt(x, y, this.currentFloor);
        if (!room) {
            return null;
        }
        return this.enterRoomById(room.id);
    }

    getAvailableRoomsOnCurrentFloor() {
        return this.getRoomsForFloor(this.currentFloor).filter((room) => room && room.available && !room.cleared);
    }

    move(dx, dy) {
        const availableRooms = this.getAvailableRoomsOnCurrentFloor();
        if (availableRooms.length === 0) {
            return false;
        }

        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) {
            const firstRoom = availableRooms[0];
            this.enterRoomById(firstRoom.id);
            return true;
        }

        const moveX = Math.floor(Number(dx) || 0);
        const moveY = Math.floor(Number(dy) || 0);
        if (moveX === 0 && moveY === 0) {
            return false;
        }

        let candidates = [];
        if (moveY < 0) {
            candidates = availableRooms.filter((room) => room.y > currentRoom.y);
        } else if (moveY > 0) {
            candidates = availableRooms.filter((room) => room.y < currentRoom.y);
        } else if (moveX < 0) {
            candidates = availableRooms.filter((room) => room.y === currentRoom.y && room.x < currentRoom.x);
        } else if (moveX > 0) {
            candidates = availableRooms.filter((room) => room.y === currentRoom.y && room.x > currentRoom.x);
        }

        if (candidates.length === 0) {
            return false;
        }

        candidates.sort((first, second) => {
            const firstVerticalDistance = Math.abs(first.y - currentRoom.y);
            const secondVerticalDistance = Math.abs(second.y - currentRoom.y);
            if (firstVerticalDistance !== secondVerticalDistance) {
                return firstVerticalDistance - secondVerticalDistance;
            }
            const firstHorizontalDistance = Math.abs(first.x - currentRoom.x);
            const secondHorizontalDistance = Math.abs(second.x - currentRoom.x);
            if (firstHorizontalDistance !== secondHorizontalDistance) {
                return firstHorizontalDistance - secondHorizontalDistance;
            }
            if (moveY < 0 || moveY > 0) {
                return first.x - second.x;
            }
            return first.y - second.y;
        });

        const selectedRoom = candidates[0];
        this.enterRoomById(selectedRoom.id);
        return true;
    }

    unlockLinkedRooms(room) {
        if (!room || !Array.isArray(room.linksUp) || room.linksUp.length === 0) {
            return;
        }
        room.linksUp.forEach((targetId) => {
            const linkedRoom = this.getRoomById(targetId, this.currentFloor);
            if (!linkedRoom || linkedRoom.cleared) {
                return;
            }
            linkedRoom.available = true;
        });
    }

    advanceToNextFloor() {
        const nextFloorIndex = Math.max(0, Math.floor(this.currentFloor) + 1);
        this.ensureFloorExists(nextFloorIndex);
        this.currentFloor = nextFloorIndex;
        const initialRoom = this.getInitialRoomForFloor(this.currentFloor);
        if (initialRoom) {
            this.currentRoom = { x: initialRoom.x, y: initialRoom.y, nodeId: initialRoom.id };
        } else {
            this.currentRoom = { x: 0, y: 0, nodeId: '' };
        }
        return true;
    }

    completeCurrentRoom() {
        const room = this.getCurrentRoom();
        if (!room) {
            return { completed: false, clearedBoss: false, advancedFloor: false };
        }

        room.cleared = true;
        room.available = false;
        room.entered = true;
        this.getRoomsForFloor(this.currentFloor).forEach((candidateRoom) => {
            if (!candidateRoom || candidateRoom.cleared) {
                return;
            }
            candidateRoom.available = false;
        });
        this.unlockLinkedRooms(room);

        const wasBossNode = room.nodeType === ASCENT_NODE_TYPES.BOSS;
        room.type = 'empty';
        room.monsterCount = 0;

        if (wasBossNode) {
            const bossType = room.forcedMonsterType || '';
            const advancedFloor = this.advanceToNextFloor();
            return {
                completed: true,
                clearedBoss: true,
                advancedFloor,
                bossType
            };
        }

        return {
            completed: true,
            clearedBoss: false,
            advancedFloor: false,
            bossType: ''
        };
    }

    climbStairs() {
        return false;
    }
}

const dungeon = new Dungeon();

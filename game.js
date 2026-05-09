
(function() {
    'use strict';

    const CONFIG = {
        INITIAL_GOLD: 6000,
        ENTRY_FEE: 50,
        WIN_REWARD: 150,
        SELL_RATE: 0.7,
        MAX_HORSE_SLOTS: 3,
        MAX_STAT_VALUE: 300
    };

    const PART_TYPES = {
        head: { name: '头部', icon: '🐴' },
        body: { name: '身体', icon: '🐎' },
        legs: { name: '腿部', icon: '🦵' },
        tail: { name: '尾巴', icon: '💫' },
        mane: { name: '鬃毛', icon: '✨' }
    };

    const QUALITY_COLORS = {
        common: '#FFFFFF',
        rare: '#4ECDC4',
        epic: '#9B59B6',
        legendary: '#FFD700'
    };

    const SHOP_ITEMS = [
        { type: 'head', quality: 'common', name: '普通马头', price: 50, stats: { speed: 10, acceleration: 5, stamina: 5, magic: 0 }},
        { type: 'head', quality: 'common', name: '结实马头', price: 70, stats: { speed: 8, acceleration: 8, stamina: 8, magic: 1 }},
        { type: 'head', quality: 'rare', name: '流线马头', price: 180, stats: { speed: 25, acceleration: 15, stamina: 10, magic: 5 }},
        { type: 'head', quality: 'epic', name: '风神马头', price: 350, stats: { speed: 40, acceleration: 25, stamina: 15, magic: 10 }},
        { type: 'head', quality: 'legendary', name: '龙首', price: 480, stats: { speed: 60, acceleration: 40, stamina: 20, magic: 15 }},
        { type: 'body', quality: 'common', name: '普通马身', price: 60, stats: { speed: 8, acceleration: 6, stamina: 10, magic: 1 }},
        { type: 'body', quality: 'common', name: '肌肉马身', price: 80, stats: { speed: 10, acceleration: 8, stamina: 12, magic: 0 }},
        { type: 'body', quality: 'rare', name: '轻便马身', price: 200, stats: { speed: 20, acceleration: 25, stamina: 15, magic: 5 }},
        { type: 'body', quality: 'epic', name: '闪电马身', price: 380, stats: { speed: 35, acceleration: 40, stamina: 25, magic: 10 }},
        { type: 'body', quality: 'legendary', name: '神躯', price: 500, stats: { speed: 50, acceleration: 50, stamina: 40, magic: 20 }},
        { type: 'legs', quality: 'common', name: '普通马腿', price: 55, stats: { speed: 12, acceleration: 10, stamina: 5, magic: 0 }},
        { type: 'legs', quality: 'common', name: '修长马腿', price: 75, stats: { speed: 15, acceleration: 8, stamina: 8, magic: 0 }},
        { type: 'legs', quality: 'rare', name: '疾风马腿', price: 220, stats: { speed: 28, acceleration: 22, stamina: 12, magic: 3 }},
        { type: 'legs', quality: 'epic', name: '雷神马腿', price: 360, stats: { speed: 45, acceleration: 38, stamina: 18, magic: 8 }},
        { type: 'legs', quality: 'legendary', name: '飞毛腿', price: 490, stats: { speed: 65, acceleration: 55, stamina: 25, magic: 10 }},
        { type: 'tail', quality: 'common', name: '普通马尾', price: 45, stats: { speed: 5, acceleration: 5, stamina: 12, magic: 3 }},
        { type: 'tail', quality: 'common', name: '浓密马尾', price: 65, stats: { speed: 6, acceleration: 6, stamina: 15, magic: 2 }},
        { type: 'tail', quality: 'rare', name: '火焰马尾', price: 160, stats: { speed: 12, acceleration: 12, stamina: 28, magic: 8 }},
        { type: 'tail', quality: 'epic', name: '风暴马尾', price: 320, stats: { speed: 18, acceleration: 18, stamina: 45, magic: 15 }},
        { type: 'tail', quality: 'legendary', name: '神尾', price: 470, stats: { speed: 25, acceleration: 25, stamina: 60, magic: 25 }},
        { type: 'mane', quality: 'common', name: '普通鬃毛', price: 40, stats: { speed: 3, acceleration: 3, stamina: 3, magic: 10 }},
        { type: 'mane', quality: 'common', name: '飘逸鬃毛', price: 60, stats: { speed: 5, acceleration: 5, stamina: 5, magic: 12 }},
        { type: 'mane', quality: 'rare', name: '魔法鬃毛', price: 150, stats: { speed: 10, acceleration: 10, stamina: 10, magic: 25 }},
        { type: 'mane', quality: 'epic', name: '秘法鬃毛', price: 300, stats: { speed: 15, acceleration: 15, stamina: 15, magic: 40 }},
        { type: 'mane', quality: 'legendary', name: '神鬃', price: 450, stats: { speed: 20, acceleration: 20, stamina: 20, magic: 60 }}
    ];

    let GameState = {
        currentScreen: 'main',
        player: null,
        currentHorse: null,
        selectedRaceHorse: null,
        raceData: null,
        shopFilter: { type: 'all', quality: 'all' },
        partSelectorType: null
    };

    function createNewPlayer() {
        return {
            gold: CONFIG.INITIAL_GOLD,
            inventory: [],
            horses: [],
            stats: { totalRaces: 0, wins: 0, losses: 0 }
        };
    }

    const Game = {
        init() {
            this.loadData();
            this.renderAll();
            this.setupEventListeners();
        },

        loadData() {
            const saved = localStorage.getItem('tianji_horse_save');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    GameState.player = data.player;
                } catch (e) {
                    GameState.player = createNewPlayer();
                }
            } else {
                GameState.player = createNewPlayer();
            }
        },

        saveData() {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                player: GameState.player
            };
            localStorage.setItem('tianji_horse_save', JSON.stringify(saveData));
        },

        switchScreen(screenName) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.add('hidden');
            });
            const targetScreen = document.getElementById(`${screenName}-screen`);
            if (targetScreen) {
                targetScreen.classList.remove('hidden');
                GameState.currentScreen = screenName;
                this.renderCurrentScreen();
            }
        },

        renderCurrentScreen() {
            switch (GameState.currentScreen) {
                case 'main':
                    this.renderMainScreen();
                    break;
                case 'barn':
                    this.renderBarnScreen();
                    break;
                case 'builder':
                    this.renderBuilderScreen();
                    break;
                case 'shop':
                    this.renderShopScreen();
                    break;
                case 'race':
                    this.renderRaceScreen();
                    break;
            }
        },

        renderAll() {
            this.renderCurrentScreen();
        },

        renderMainScreen() {
            document.getElementById('main-gold').textContent = GameState.player.gold;
            const total = GameState.player.stats.totalRaces;
            const wins = GameState.player.stats.wins;
            document.getElementById('total-races').textContent = total;
            document.getElementById('win-rate').textContent = total > 0 ? Math.round((wins / total) * 100) + '%' : '0%';
        },

        renderBarnScreen() {
            document.getElementById('barn-gold').textContent = GameState.player.gold;
            const slotsContainer = document.getElementById('horse-slots');
            slotsContainer.innerHTML = '';

            for (let i = 0; i < CONFIG.MAX_HORSE_SLOTS; i++) {
                const horse = GameState.player.horses[i];
                const slot = document.createElement('div');
                slot.className = 'horse-slot' + (horse ? '' : ' empty-slot');

                if (horse) {
                    slot.innerHTML = `
                        <div class="slot-icon">🐎</div>
                        <div class="horse-slot-info">
                            <div class="horse-slot-name">${horse.name}</div>
                            <div class="horse-slot-score">评分: ${this.calculateHorseScore(horse)}</div>
                        </div>
                        <div class="horse-slot-parts">
                            ${Object.keys(PART_TYPES).map(type => 
                                `<div class="part-indicator ${horse.parts[type] ? type : 'empty'}"></div>`
                            ).join('')}
                        </div>
                    `;
                    slot.onclick = () => this.showHorseOptions(horse, i);
                } else {
                    slot.innerHTML = `
                        <div class="slot-icon">➕</div>
                        <div class="horse-slot-info">
                            <div class="horse-slot-name">空槽位</div>
                        </div>
                    `;
                    slot.onclick = () => this.openHorseBuilder();
                }

                slotsContainer.appendChild(slot);
            }
        },

        renderShopScreen() {
            document.getElementById('shop-gold').textContent = GameState.player.gold;
            this.renderShopItems();
            this.renderInventory();
        },

        renderShopItems() {
            const container = document.getElementById('shop-items');
            container.innerHTML = '';

            const filteredItems = SHOP_ITEMS.filter(item => {
                const typeMatch = GameState.shopFilter.type === 'all' || item.type === GameState.shopFilter.type;
                const qualityMatch = GameState.shopFilter.quality === 'all' || item.quality === GameState.shopFilter.quality;
                return typeMatch && qualityMatch;
            });

            filteredItems.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = `shop-item ${item.quality}`;
                itemEl.innerHTML = `
                    <div class="shop-item-icon">${PART_TYPES[item.type].icon}</div>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-type">${PART_TYPES[item.type].name} · ${this.getQualityText(item.quality)}</div>
                    <div class="shop-item-price">💰 ${item.price}</div>
                    <div class="shop-item-stats">
                        速度+${item.stats.speed} 加速+${item.stats.acceleration}<br>
                        耐力+${item.stats.stamina} 魔法+${item.stats.magic}
                    </div>
                `;
                itemEl.onclick = () => Shop.purchase(index);
                container.appendChild(itemEl);
            });
        },

        renderInventory() {
            const container = document.getElementById('inventory-items');
            container.innerHTML = '';

            if (GameState.player.inventory.length === 0) {
                container.innerHTML = '<div style="color: var(--text-light); opacity: 0.5; padding: 20px; text-align: center;">背包空空如也</div>';
                return;
            }

            GameState.player.inventory.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = `inventory-item ${item.quality}`;
                itemEl.innerHTML = `<div class="inventory-item-icon">${PART_TYPES[item.type].icon}</div>`;
                itemEl.title = `${item.name}\n速度+${item.stats.speed} 加速+${item.stats.acceleration}\n耐力+${item.stats.stamina} 魔法+${item.stats.magic}`;
                itemEl.onclick = () => this.showInventoryItemOptions(index);
                container.appendChild(itemEl);
            });
        },

        renderRaceScreen() {
            document.getElementById('race-gold').textContent = GameState.player.gold;
            this.renderRaceHorseList();
        },

        renderRaceHorseList() {
            const container = document.getElementById('race-horse-list');
            container.innerHTML = '';

            const completeHorses = GameState.player.horses.filter(h => h.isComplete);

            if (completeHorses.length === 0) {
                container.innerHTML = '<div style="color: var(--text-light); opacity: 0.5; padding: 20px; text-align: center;">没有完整的马匹可参赛<br>先去养马屋拼马吧！</div>';
                document.getElementById('start-race-btn').disabled = true;
                return;
            }

            completeHorses.forEach((horse, index) => {
                const card = document.createElement('div');
                card.className = 'race-horse-card' + (GameState.selectedRaceHorse === horse.id ? ' selected' : '');
                card.innerHTML = `
                    <div class="race-horse-icon">🐎</div>
                    <div class="race-horse-info">
                        <div class="race-horse-name">${horse.name}</div>
                        <div class="race-horse-score">评分: ${this.calculateHorseScore(horse)}</div>
                    </div>
                `;
                card.onclick = () => {
                    GameState.selectedRaceHorse = horse.id;
                    this.renderRaceHorseList();
                    document.getElementById('start-race-btn').disabled = false;
                };
                container.appendChild(card);
            });
        },

        showHorseOptions(horse, index) {
            const sellValue = this.calculateHorseSellValue(horse);
            const confirmMsg = `确定要卖掉「${horse.name}」吗？\n可获得 💰${sellValue}`;

            if (confirm(confirmMsg)) {
                this.sellHorse(index);
            }
        },

        showInventoryItemOptions(index) {
            const item = GameState.player.inventory[index];
            alert(`${item.name}\n\n速度: +${item.stats.speed}\n加速: +${item.stats.acceleration}\n耐力: +${item.stats.stamina}\n魔法: +${item.stats.magic}\n\n品质: ${this.getQualityText(item.quality)}`);
        },

        openHorseBuilder() {
            GameState.currentHorse = {
                id: 'horse_' + Date.now(),
                name: '',
                parts: {},
                isComplete: false
            };
            document.getElementById('horse-name').value = '';
            this.clearBuilderSlots();
            this.switchScreen('builder');
            this.renderBuilderScreen();
        },

        closeHorseBuilder() {
            GameState.currentHorse = null;
            this.switchScreen('barn');
        },

        clearBuilderSlots() {
            Object.keys(PART_TYPES).forEach(type => {
                const slot = document.querySelector(`.part-slot[data-part="${type}"] .slot-content`);
                if (slot) {
                    slot.className = 'slot-content empty';
                    slot.textContent = '?';
                }
            });
            this.updateStatsPreview();
        },

        renderBuilderScreen() {
            if (!GameState.currentHorse) return;
            this.updateStatsPreview();
        },

        updateStatsPreview() {
            const stats = this.calculateHorseStats(GameState.currentHorse.parts);
            const score = this.calculateStatsScore(stats);

            ['speed', 'acceleration', 'stamina', 'magic'].forEach(stat => {
                const bar = document.getElementById(`stat-${stat}`);
                const value = stats[stat];
                const percentage = Math.min((value / CONFIG.MAX_STAT_VALUE) * 100, 100);
                bar.style.setProperty('--width', percentage + '%');
                bar.querySelector('::before') || (bar.style.width = percentage + '%');
                bar.style.width = percentage + '%';
                bar.className = `stat-bar-fill ${stat}`;
                bar.querySelector('.stat-number').textContent = value;
            });

            document.getElementById('total-score').textContent = score;
            this.updateSaveButton();
        },

        updateSaveButton() {
            const btn = document.getElementById('save-horse-btn');
            const name = document.getElementById('horse-name').value.trim();
            const hasAllParts = Object.keys(PART_TYPES).every(type => GameState.currentHorse.parts[type]);

            btn.disabled = !(name && hasAllParts);
        },

        openPartSelector(type) {
            GameState.partSelectorType = type;
            const modal = document.getElementById('part-selector-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');

            const typeName = type === 'all' ? '全部部件' : PART_TYPES[type].name;
            modalTitle.textContent = `选择${typeName}`;

            modalBody.innerHTML = '';

            if (type === 'all') {
                const allParts = SHOP_ITEMS.map((item, idx) => ({...item, originalIndex: idx}));
                this.renderPartSelectorItems(modalBody, allParts, true);
            } else {
                const shopItems = SHOP_ITEMS.filter(item => item.type === type).map((item, idx) => ({...item, originalIndex: SHOP_ITEMS.indexOf(item)}));
                const invItems = GameState.player.inventory.filter(item => item.type === type).map((item, idx) => ({...item, originalIndex: idx, fromInventory: true}));

                if (shopItems.length > 0) {
                    const shopSection = document.createElement('div');
                    shopSection.innerHTML = '<h4 style="color: var(--color-accent); margin-bottom: 10px;">商店购买</h4>';
                    this.renderPartSelectorItems(shopSection, shopItems, false);
                    modalBody.appendChild(shopSection);
                }

                if (invItems.length > 0) {
                    const invSection = document.createElement('div');
                    invSection.innerHTML = '<h4 style="color: var(--color-secondary); margin: 15px 0 10px;">从背包选择</h4>';
                    this.renderPartSelectorItems(invSection, invItems, true);
                    modalBody.appendChild(invSection);
                }

                if (shopItems.length === 0 && invItems.length === 0) {
                    modalBody.innerHTML = '<div style="color: var(--text-light); opacity: 0.5; text-align: center; padding: 20px;">没有可用的部件<br>先去商店购买吧！</div>';
                }
            }

            modal.classList.remove('hidden');
        },

        renderPartSelectorItems(container, items, showPrice) {
            const list = document.createElement('div');
            list.className = 'modal-part-list';

            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = `modal-part-item ${item.quality}`;
                itemEl.innerHTML = `
                    <div class="modal-part-icon">${PART_TYPES[item.type].icon}</div>
                    <div class="modal-part-name">${item.name}</div>
                    ${showPrice ? `<div class="modal-part-price">💰 ${item.price}</div>` : ''}
                    <div class="modal-part-stats">
                        速度+${item.stats.speed} 加速+${item.stats.acceleration}<br>
                        耐力+${item.stats.stamina} 魔法+${item.stats.magic}
                    </div>
                `;
                itemEl.onclick = () => this.selectPart(item);
                list.appendChild(itemEl);
            });

            container.appendChild(list);
        },

        selectPart(item) {
            const isInBuilder = GameState.currentScreen === 'builder' && GameState.currentHorse;
            
            if (item.fromInventory) {
                if (isInBuilder) {
                    const invIndex = GameState.player.inventory.findIndex(i =>
                        i.type === item.type && i.name === item.name && i.quality === item.quality
                    );
                    if (invIndex > -1) {
                        this.equipPartFromInventory(GameState.partSelectorType, invIndex);
                    }
                } else {
                    Game.showNotification(`「${item.name}」已放入背包`, 'success');
                }
            } else {
                const originalItem = SHOP_ITEMS[item.originalIndex];
                Shop.purchaseDirect(item.originalIndex);
                if (isInBuilder) {
                    const lastItem = GameState.player.inventory[GameState.player.inventory.length - 1];
                    if (lastItem && lastItem.type === originalItem.type && lastItem.name === originalItem.name) {
                        const invIndex = GameState.player.inventory.length - 1;
                        this.equipPartFromInventory(GameState.partSelectorType, invIndex);
                    }
                } else {
                    Game.showNotification(`「${originalItem.name}」已放入背包`, 'success');
                }
            }
            this.closePartSelector();
        },

        equipPartFromInventory(slotType, invIndex) {
            const part = GameState.player.inventory[invIndex];
            if (!part) return;

            GameState.currentHorse.parts[slotType] = {
                type: part.type,
                quality: part.quality,
                name: part.name,
                stats: part.stats
            };

            GameState.player.inventory.splice(invIndex, 1);
            this.updateBuilderSlot(slotType, part);
            this.updateStatsPreview();
            this.saveData();
        },

        updateBuilderSlot(type, part) {
            const slot = document.querySelector(`.part-slot[data-part="${type}"] .slot-content`);
            if (slot) {
                slot.className = `slot-content ${part.quality}`;
                slot.textContent = PART_TYPES[type].icon;
            }
        },

        closePartSelector() {
            document.getElementById('part-selector-modal').classList.add('hidden');
            GameState.partSelectorType = null;
        },

        saveHorse() {
            if (!GameState.currentHorse) return;

            const name = document.getElementById('horse-name').value.trim();
            if (!name) {
                this.showNotification('请输入马匹名称！', 'error');
                return;
            }

            const hasAllParts = Object.keys(PART_TYPES).every(type => GameState.currentHorse.parts[type]);
            if (!hasAllParts) {
                this.showNotification('马匹部件不完整！', 'error');
                return;
            }

            if (GameState.player.horses.length >= CONFIG.MAX_HORSE_SLOTS) {
                this.showNotification('马厩已满！', 'error');
                return;
            }

            GameState.currentHorse.name = name;
            GameState.currentHorse.isComplete = true;
            GameState.currentHorse.totalStats = this.calculateHorseStats(GameState.currentHorse.parts);
            GameState.currentHorse.totalScore = this.calculateHorseScore(GameState.currentHorse);

            GameState.player.horses.push(GameState.currentHorse);
            this.saveData();
            this.showNotification(`${name} 创建成功！`, 'success');
            GameState.currentHorse = null;
            this.switchScreen('barn');
        },

        sellHorse(index) {
            const horse = GameState.player.horses[index];
            if (!horse) return;

            const sellValue = this.calculateHorseSellValue(horse);
            GameState.player.gold += sellValue;

            Object.values(horse.parts).forEach(part => {
                if (part) {
                    GameState.player.inventory.push(part);
                }
            });

            GameState.player.horses.splice(index, 1);
            this.saveData();
            this.showNotification(`卖出「${horse.name}」，获得 💰${sellValue}`, 'success');
            this.renderBarnScreen();
        },

        calculateHorseStats(parts) {
            const stats = { speed: 0, acceleration: 0, stamina: 0, magic: 0 };

            Object.values(parts).forEach(part => {
                if (part && part.stats) {
                    stats.speed += part.stats.speed || 0;
                    stats.acceleration += part.stats.acceleration || 0;
                    stats.stamina += part.stats.stamina || 0;
                    stats.magic += part.stats.magic || 0;
                }
            });

            return stats;
        },

        calculateStatsScore(stats) {
            return Math.round(
                stats.speed * 0.3 +
                stats.acceleration * 0.3 +
                stats.stamina * 0.25 +
                stats.magic * 0.15
            );
        },

        calculateHorseScore(horse) {
            const stats = horse.totalStats || this.calculateHorseStats(horse.parts);
            return this.calculateStatsScore(stats);
        },

        calculateHorseSellValue(horse) {
            let totalPrice = 0;
            Object.values(horse.parts).forEach(part => {
                if (part) {
                    const original = SHOP_ITEMS.find(item =>
                        item.type === part.type && item.quality === part.quality && item.name === part.name
                    );
                    if (original) {
                        totalPrice += original.price;
                    }
                }
            });
            return Math.round(totalPrice * CONFIG.SELL_RATE);
        },

        getQualityText(quality) {
            const map = {
                common: '普通',
                rare: '稀有',
                epic: '史诗',
                legendary: '传说'
            };
            return map[quality] || quality;
        },

        startRace() {
            if (!GameState.selectedRaceHorse) {
                this.showNotification('请选择参赛马匹！', 'error');
                return;
            }

            if (GameState.player.gold < CONFIG.ENTRY_FEE) {
                this.showNotification('金币不足！需要 💰50 入场费', 'error');
                return;
            }

            const playerHorse = GameState.player.horses.find(h => h.id === GameState.selectedRaceHorse);
            if (!playerHorse || !playerHorse.isComplete) {
                this.showNotification('马匹不完整！', 'error');
                return;
            }

            GameState.player.gold -= CONFIG.ENTRY_FEE;
            this.saveData();

            const opponentHorse = this.generateOpponentHorse(playerHorse);

            GameState.raceData = {
                playerHorse: playerHorse,
                opponentHorse: opponentHorse,
                currentRound: 0,
                score: { player: 0, opponent: 0 },
                status: 'ready',
                winner: null
            };

            document.getElementById('select-horse-section').classList.add('hidden');
            document.getElementById('race-arena').classList.remove('hidden');
            document.getElementById('race-result').classList.add('hidden');
            document.getElementById('race-round-info').classList.remove('hidden');

            document.getElementById('player-score').textContent = '0';
            document.getElementById('opponent-score').textContent = '0';
            document.getElementById('current-round').textContent = '1';

            document.getElementById('player-horse').textContent = '🐎';
            document.getElementById('opponent-horse').textContent = opponentHorse.icon || '🏇';

            this.runRace();
        },

        generateOpponentHorse(playerHorse) {
            const playerAvg = this.calculateHorseScore(playerHorse);
            const difficulty = 0.7 + Math.random() * 0.5;
            const targetScore = Math.round(playerAvg * difficulty);

            const opponentNames = ['黑马', '白马', '红马', '灰马', '棕马'];
            const opponent = {
                id: 'opponent_' + Date.now(),
                name: opponentNames[Math.floor(Math.random() * opponentNames.length)],
                isComplete: true,
                icon: ['🏇', '🦄', '🐎'][Math.floor(Math.random() * 3)],
                totalScore: targetScore,
                totalStats: {
                    speed: Math.round(targetScore * 0.3),
                    acceleration: Math.round(targetScore * 0.3),
                    stamina: Math.round(targetScore * 0.25),
                    magic: Math.round(targetScore * 0.15)
                }
            };

            return opponent;
        },

        runRace() {
            if (GameState.raceData.currentRound >= 3) {
                this.endRace();
                return;
            }

            GameState.raceData.currentRound++;
            document.getElementById('current-round').textContent = GameState.raceData.currentRound;

            const playerScore = this.calculateHorseScore(GameState.raceData.playerHorse);
            const opponentScore = this.calculateHorseScore(GameState.raceData.opponentHorse);

            const playerFinal = playerScore * (0.9 + Math.random() * 0.2);
            const opponentFinal = opponentScore * (0.9 + Math.random() * 0.2);

            this.animateRace(playerFinal, opponentFinal, () => {
                const playerWon = playerFinal > opponentFinal;

                if (playerWon) {
                    GameState.raceData.score.player++;
                } else {
                    GameState.raceData.score.opponent++;
                }

                document.getElementById('player-score').textContent = GameState.raceData.score.player;
                document.getElementById('opponent-score').textContent = GameState.raceData.score.opponent;

                if (GameState.raceData.score.player >= 2 || GameState.raceData.score.opponent >= 2) {
                    setTimeout(() => this.endRace(), 1000);
                } else {
                    setTimeout(() => this.runRace(), 1500);
                }
            });
        },

        animateRace(playerScore, opponentScore, callback) {
            const duration = 2000;
            const startTime = Date.now();
            const trackWidth = document.querySelector('.progress-track')?.offsetWidth || 300;

            const playerProgress = document.getElementById('player-progress');
            const opponentProgress = document.getElementById('opponent-progress');
            const playerSprite = document.getElementById('player-horse');
            const opponentSprite = document.getElementById('opponent-horse');

            playerProgress.style.width = '0%';
            opponentProgress.style.width = '0%';

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeProgress = 1 - Math.pow(1 - progress, 3);

                const playerWidth = (playerScore / 300) * trackWidth * easeProgress;
                const opponentWidth = (opponentScore / 300) * trackWidth * easeProgress;

                playerProgress.style.width = Math.min((playerWidth / trackWidth) * 100, 95) + '%';
                opponentProgress.style.width = Math.min((opponentWidth / trackWidth) * 100, 95) + '%';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    playerProgress.style.width = '100%';
                    opponentProgress.style.width = '100%';
                    setTimeout(callback, 300);
                }
            };

            requestAnimationFrame(animate);
        },

        endRace() {
            const playerWins = GameState.raceData.score.player >= 2;
            const opponentWins = GameState.raceData.score.opponent >= 2;

            GameState.player.stats.totalRaces++;

            if (playerWins) {
                GameState.player.gold += CONFIG.WIN_REWARD;
                GameState.player.stats.wins++;
                GameState.raceData.winner = 'player';
            } else {
                GameState.player.stats.losses++;
                GameState.raceData.winner = 'opponent';
            }

            this.saveData();

            const resultEl = document.getElementById('race-result');
            const resultText = document.getElementById('result-text');
            const resultGold = document.getElementById('result-gold');

            resultEl.classList.remove('hidden', 'win', 'lose');
            resultEl.classList.add(playerWins ? 'win' : 'lose');

            resultText.textContent = playerWins ? '🏆 胜利！' : '😢 失败...';
            resultGold.textContent = playerWins
                ? `获得 💰${CONFIG.WIN_REWARD} 金币！`
                : `失去 💰${CONFIG.ENTRY_FEE} 入场费`;
        },

        exitRace() {
            GameState.selectedRaceHorse = null;
            GameState.raceData = null;

            document.getElementById('select-horse-section').classList.remove('hidden');
            document.getElementById('race-arena').classList.add('hidden');

            this.renderRaceScreen();
        },

        showNotification(message, type = 'info') {
            const container = document.getElementById('notifications');
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `<div class="notification-text">${message}</div>`;
            container.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 2500);
        },

        setupEventListeners() {
            document.getElementById('horse-name').addEventListener('input', () => {
                if (GameState.currentHorse) {
                    GameState.currentHorse.name = document.getElementById('horse-name').value;
                    this.updateSaveButton();
                }
            });

            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            document.querySelectorAll('.quality-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
    };

    const Shop = {
        filterType(type) {
            GameState.shopFilter.type = type;
            Game.renderShopItems();
        },

        filterQuality(quality) {
            GameState.shopFilter.quality = quality;
            Game.renderShopItems();
        },

        purchase(shopItemIndex) {
            const item = SHOP_ITEMS[shopItemIndex];
            if (!item) return;

            if (GameState.player.gold < item.price) {
                Game.showNotification('金币不足！', 'error');
                return;
            }

            GameState.player.gold -= item.price;
            GameState.player.inventory.push({
                id: 'part_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                type: item.type,
                quality: item.quality,
                name: item.name,
                stats: {...item.stats}
            });

            Game.saveData();
            Game.showNotification(`购买了「${item.name}」！`, 'success');
            Game.renderShopScreen();
        },

        purchaseDirect(shopItemIndex) {
            this.purchase(shopItemIndex);
        }
    };

    window.Game = Game;
    window.Shop = Shop;

    document.addEventListener('DOMContentLoaded', () => {
        Game.init();
    });

})();

const SHOP_ITEMS = [
    { id: 'h1', type: 'head', category: 'common', name: '普通-低级', icon: '🐴', price: 50, stats: { speed: 60, power: 40 } },
    { id: 'h2', type: 'head', category: 'common', name: '普通-中级', icon: '🐴', price: 100, stats: { speed: 75, power: 60 } },
    { id: 'h3', type: 'head', category: 'common', name: '普通-高级', icon: '🐴', price: 150, stats: { speed: 90, power: 80 } },
    { id: 'h4', type: 'head', category: 'tech', name: '科技-低级', icon: '🤖', price: 50, stats: { speed: 65, tech: 50 } },
    { id: 'h5', type: 'head', category: 'tech', name: '科技-中级', icon: '🤖', price: 100, stats: { speed: 80, tech: 65 } },
    { id: 'h6', type: 'head', category: 'tech', name: '科技-高级', icon: '🤖', price: 150, stats: { speed: 95, tech: 85 } },
    { id: 'h7', type: 'head', category: 'magic', name: '魔法-低级', icon: '🦄', price: 50, stats: { speed: 70, magic: 50 } },
    { id: 'h8', type: 'head', category: 'magic', name: '魔法-中级', icon: '🦄', price: 100, stats: { speed: 85, magic: 65 } },
    { id: 'h9', type: 'head', category: 'magic', name: '魔法-高级', icon: '🦄', price: 150, stats: { speed: 100, magic: 90 } },
    
    { id: 'b1', type: 'body', category: 'common', name: '普通-低级', icon: '🦴', price: 50, stats: { stamina: 50, power: 30 } },
    { id: 'b2', type: 'body', category: 'common', name: '普通-中级', icon: '🦴', price: 100, stats: { stamina: 70, power: 50 } },
    { id: 'b3', type: 'body', category: 'common', name: '普通-高级', icon: '🦴', price: 150, stats: { stamina: 90, power: 70 } },
    { id: 'b4', type: 'body', category: 'tech', name: '科技-低级', icon: '⚙️', price: 50, stats: { stamina: 45, tech: 40 } },
    { id: 'b5', type: 'body', category: 'tech', name: '科技-中级', icon: '⚙️', price: 100, stats: { stamina: 65, tech: 60 } },
    { id: 'b6', type: 'body', category: 'tech', name: '科技-高级', icon: '⚙️', price: 150, stats: { stamina: 85, tech: 80 } },
    { id: 'b7', type: 'body', category: 'magic', name: '魔法-低级', icon: '✨', price: 50, stats: { stamina: 40, magic: 45 } },
    { id: 'b8', type: 'body', category: 'magic', name: '魔法-中级', icon: '✨', price: 100, stats: { stamina: 60, magic: 65 } },
    { id: 'b9', type: 'body', category: 'magic', name: '魔法-高级', icon: '✨', price: 150, stats: { stamina: 80, magic: 85 } },
    
    { id: 'l1', type: 'legs', category: 'common', name: '普通-低级', icon: '🦵', price: 50, stats: { speed: 50, stamina: 30 } },
    { id: 'l2', type: 'legs', category: 'common', name: '普通-中级', icon: '🦵', price: 100, stats: { speed: 70, stamina: 50 } },
    { id: 'l3', type: 'legs', category: 'common', name: '普通-高级', icon: '🦵', price: 150, stats: { speed: 90, stamina: 70 } },
    { id: 'l4', type: 'legs', category: 'tech', name: '科技-低级', icon: '🚀', price: 50, stats: { speed: 55, tech: 35 } },
    { id: 'l5', type: 'legs', category: 'tech', name: '科技-中级', icon: '🚀', price: 100, stats: { speed: 75, tech: 55 } },
    { id: 'l6', type: 'legs', category: 'tech', name: '科技-高级', icon: '🚀', price: 150, stats: { speed: 95, tech: 75 } },
    { id: 'l7', type: 'legs', category: 'magic', name: '魔法-低级', icon: '👢', price: 50, stats: { speed: 45, magic: 40 } },
    { id: 'l8', type: 'legs', category: 'magic', name: '魔法-中级', icon: '👢', price: 100, stats: { speed: 65, magic: 60 } },
    { id: 'l9', type: 'legs', category: 'magic', name: '魔法-高级', icon: '👢', price: 150, stats: { speed: 85, magic: 80 } },
    
    { id: 't1', type: 'tail', category: 'common', name: '普通-低级', icon: '🎿', price: 50, stats: { stamina: 40, power: 20 } },
    { id: 't2', type: 'tail', category: 'common', name: '普通-中级', icon: '🎿', price: 100, stats: { stamina: 60, power: 40 } },
    { id: 't3', type: 'tail', category: 'common', name: '普通-高级', icon: '🎿', price: 150, stats: { stamina: 80, power: 60 } },
    { id: 't4', type: 'tail', category: 'tech', name: '科技-低级', icon: '🔌', price: 50, stats: { stamina: 35, tech: 30 } },
    { id: 't5', type: 'tail', category: 'tech', name: '科技-中级', icon: '🔌', price: 100, stats: { stamina: 55, tech: 50 } },
    { id: 't6', type: 'tail', category: 'tech', name: '科技-高级', icon: '🔌', price: 150, stats: { stamina: 75, tech: 70 } },
    { id: 't7', type: 'tail', category: 'magic', name: '魔法-低级', icon: '🎀', price: 50, stats: { stamina: 30, magic: 35 } },
    { id: 't8', type: 'tail', category: 'magic', name: '魔法-中级', icon: '🎀', price: 100, stats: { stamina: 50, magic: 55 } },
    { id: 't9', type: 'tail', category: 'magic', name: '魔法-高级', icon: '🎀', price: 150, stats: { stamina: 70, magic: 75 } },
    
    { id: 's1', type: 'special', category: 'common', name: '普通头饰', icon: '🎩', price: 100, stats: { speed: 10, power: 10 } },
    { id: 's2', type: 'special', category: 'tech', name: '科技头盔', icon: '🎯', price: 150, stats: { tech: 30 } },
    { id: 's3', type: 'special', category: 'magic', name: '魔法皇冠', icon: '👑', price: 200, stats: { magic: 40 } },
    { id: 'e1', type: 'extra', category: 'tech', name: '加速器', icon: '⚡', price: 200, stats: { speed: 30 } },
    { id: 'e2', type: 'extra', category: 'magic', name: '魔法护符', icon: '🔮', price: 250, stats: { magic: 50 } }
];

const HORSE_NAMES = ['的卢', '赤兔', '绝影'];

const CONFIG = {
    INITIAL_GOLD: 6000,
    RACE_FEE: 50,
    WIN_REWARD: 150,
    SELL_RATE: 0.7
};

let GameState = {
    gold: CONFIG.INITIAL_GOLD,
    inventory: [],
    horses: [
        { id: 0, name: '的卢', parts: { head: null, body: null, legs: null, tail: null, special: null }, stats: { speed: 0, power: 0, stamina: 0, magic: 0, tech: 0 } },
        { id: 1, name: '赤兔', parts: { head: null, body: null, legs: null, tail: null, special: null }, stats: { speed: 0, power: 0, stamina: 0, magic: 0, tech: 0 } },
        { id: 2, name: '绝影', parts: { head: null, body: null, legs: null, tail: null, special: null }, stats: { speed: 0, power: 0, stamina: 0, magic: 0, tech: 0 } }
    ],
    currentHorse: 0,
    totalRaces: 0,
    wins: 0,
    losses: 0,
    partSelectorType: null,
    selectedPart: null,
    raceData: null
};

const Game = {
    init() {
        this.loadGame();
        this.updateUI();
        this.setupEventListeners();
    },
    
    loadGame() {
        const saved = localStorage.getItem('tianji_horse_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                GameState.gold = data.gold || CONFIG.INITIAL_GOLD;
                GameState.inventory = data.inventory || [];
                GameState.horses = data.horses || GameState.horses;
                GameState.totalRaces = data.totalRaces || 0;
                GameState.wins = data.wins || 0;
                GameState.losses = data.losses || 0;
            } catch (e) {
                console.error('Failed to load save:', e);
            }
        }
    },
    
    saveGame() {
        const data = {
            gold: GameState.gold,
            inventory: GameState.inventory,
            horses: GameState.horses,
            totalRaces: GameState.totalRaces,
            wins: GameState.wins,
            losses: GameState.losses
        };
        localStorage.setItem('tianji_horse_save', JSON.stringify(data));
    },
    
    updateUI() {
        document.querySelectorAll('.gold-amount, #barn-gold, #shop-gold, #race-gold, #victory-gold, #defeat-gold').forEach(el => {
            el.textContent = GameState.gold;
        });
        
        document.getElementById('total-races').textContent = GameState.totalRaces;
        const winRate = GameState.totalRaces > 0 ? Math.round((GameState.wins / GameState.totalRaces) * 100) : 0;
        document.getElementById('win-rate').textContent = winRate + '%';
        
        this.updateHorseStats();
        this.updateHorseCards();
        this.updatePreview();
        this.updateInventoryCounts();
    },
    
    switchScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        document.getElementById(screenName + '-screen').classList.remove('hidden');
        
        if (screenName === 'shop') {
            Shop.renderItems('head');
        }
        
        if (screenName === 'race') {
            this.renderRacePrep();
        }
    },
    
    selectHorseTab(index) {
        GameState.currentHorse = index;
        document.querySelectorAll('.tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        this.updateHorseStats();
        this.updatePreview();
    },
    
    updateHorseStats() {
        const horse = GameState.horses[GameState.currentHorse];
        const stats = horse.stats;
        
        document.querySelectorAll('.stat-bar').forEach(bar => bar.style.width = '0%');
        document.querySelectorAll('.stat-value-num').forEach(el => el.textContent = '0');
        
        if (stats.speed > 0) {
            document.querySelector('.stat-bar.speed').style.width = Math.min(stats.speed, 100) + '%';
            document.querySelectorAll('.stat-value-num')[0].textContent = stats.speed;
        }
        if (stats.power > 0) {
            document.querySelector('.stat-bar.power').style.width = Math.min(stats.power, 100) + '%';
            document.querySelectorAll('.stat-value-num')[1].textContent = stats.power;
        }
        if (stats.stamina > 0) {
            document.querySelector('.stat-bar.stamina').style.width = Math.min(stats.stamina, 100) + '%';
            document.querySelectorAll('.stat-value-num')[2].textContent = stats.stamina;
        }
        if (stats.magic > 0) {
            document.querySelector('.stat-bar.magic').style.width = Math.min(stats.magic, 100) + '%';
            document.querySelectorAll('.stat-value-num')[3].textContent = stats.magic;
        }
    },
    
    updateHorseCards() {
        const container = document.getElementById('player-horses');
        if (!container) return;
        
        container.innerHTML = '';
        GameState.horses.forEach((horse, index) => {
            const card = document.createElement('div');
            card.className = 'horse-card';
            
            const hasParts = horse.parts.head || horse.parts.body || horse.parts.legs || horse.parts.tail;
            const horseIcon = hasParts ? '🐴' : '❓';
            const colors = ['#4ECDC4', '#FF6B6B', '#FFE66D'];
            
            card.innerHTML = `
                <div class="horse-card-number" style="background: ${colors[index]}">${index + 1}</div>
                <div class="horse-card-icon">${horseIcon}</div>
                <div class="horse-card-info">
                    <div class="horse-card-name">${horse.name}</div>
                    <div class="horse-card-stats">
                        <span class="stat-dot speed"></span>
                        <span class="stat-dot power"></span>
                        <span class="stat-dot stamina"></span>
                        <span class="stat-dot magic"></span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },
    
    updatePreview() {
        const horse = GameState.horses[GameState.currentHorse];
        
        document.getElementById('current-horse-name').textContent = horse.name;
        
        const parts = ['head', 'body', 'legs', 'tail', 'special'];
        parts.forEach(partType => {
            const el = document.getElementById('preview-' + partType);
            if (horse.parts[partType]) {
                el.textContent = horse.parts[partType].icon;
                el.style.display = 'block';
            } else {
                el.textContent = '';
                el.style.display = 'none';
            }
        });
    },
    
    updateInventoryCounts() {
        const types = ['head', 'body', 'legs', 'tail', 'special'];
        types.forEach(type => {
            const count = GameState.inventory.filter(item => item.type === type).length;
            const el = document.getElementById('count-' + type);
            if (el) {
                el.textContent = count;
            }
        });
    },
    
    openPartSelector(type) {
        GameState.partSelectorType = type;
        document.getElementById('part-selector-modal').classList.remove('hidden');
        document.getElementById('modal-title').textContent = `选择${this.getPartTypeName(type)}部件`;
        PartSelector.renderParts(type);
    },
    
    getPartTypeName(type) {
        const names = { head: '马头', body: '马身', legs: '马腿', tail: '马尾', special: '头饰', extra: '特殊' };
        return names[type] || type;
    },
    
    closePartSelector() {
        document.getElementById('part-selector-modal').classList.add('hidden');
        GameState.partSelectorType = null;
        GameState.selectedPart = null;
    },
    
    selectPartForEquip(part) {
        GameState.selectedPart = part;
        document.getElementById('preview-icon').textContent = part.icon;
        document.getElementById('selected-icon').textContent = part.icon;
        document.getElementById('selected-name').textContent = part.category + '-' + part.name;
        
        const statHtml = [];
        if (part.stats.speed) statHtml.push(`速度 +${part.stats.speed}`);
        if (part.stats.power) statHtml.push(`力量 +${part.stats.power}`);
        if (part.stats.stamina) statHtml.push(`耐力 +${part.stats.stamina}`);
        if (part.stats.magic) statHtml.push(`魔力 +${part.stats.magic}`);
        if (part.stats.tech) statHtml.push(`科技 +${part.stats.tech}`);
        
        document.getElementById('new-stats').innerHTML = statHtml.map(s => `<div class="stat-item small">${s}</div>`).join('');
    },
    
    confirmEquip() {
        if (!GameState.selectedPart) return;
        
        const part = GameState.selectedPart;
        const horse = GameState.horses[GameState.currentHorse];
        
        const invIndex = GameState.inventory.findIndex(p => 
            p.id === part.id
        );
        
        if (invIndex === -1) {
            this.showNotification('未拥有该部件', 'error');
            return;
        }
        
        GameState.inventory.splice(invIndex, 1);
        horse.parts[part.type] = part;
        
        this.recalculateHorseStats(horse);
        this.saveGame();
        this.updateUI();
        this.closePartSelector();
        this.showNotification('装备成功!', 'success');
    },
    
    recalculateHorseStats(horse) {
        horse.stats = { speed: 0, power: 0, stamina: 0, magic: 0, tech: 0 };
        
        Object.values(horse.parts).forEach(part => {
            if (part && part.stats) {
                Object.entries(part.stats).forEach(([key, value]) => {
                    if (horse.stats[key] !== undefined) {
                        horse.stats[key] += value;
                    }
                });
            }
        });
    },
    
    saveHorse() {
        const horse = GameState.horses[GameState.currentHorse];
        const hasParts = horse.parts.head && horse.parts.body && horse.parts.legs && horse.parts.tail;
        
        if (!hasParts) {
            this.showNotification('请先装备完整的部件', 'warning');
            return;
        }
        
        this.saveGame();
        this.showNotification('马匹已保存!', 'success');
    },
    
    sellHorse() {
        const horse = GameState.horses[GameState.currentHorse];
        const hasParts = horse.parts.head || horse.parts.body || horse.parts.legs || horse.parts.tail || horse.parts.special;
        
        if (!hasParts) {
            this.showNotification('没有可出售的部件', 'warning');
            return;
        }
        
        let totalValue = 0;
        Object.values(horse.parts).forEach(part => {
            if (part) {
                totalValue += part.price;
            }
        });
        
        const sellValue = Math.round(totalValue * CONFIG.SELL_RATE);
        GameState.gold += sellValue;
        
        horse.parts = { head: null, body: null, legs: null, tail: null, special: null };
        horse.stats = { speed: 0, power: 0, stamina: 0, magic: 0, tech: 0 };
        
        this.saveGame();
        this.updateUI();
        this.showNotification(`出售成功! 获得 ${sellValue} 马币`, 'success');
    },
    
    renderRacePrep() {
        const playerContainer = document.getElementById('player-horses');
        const opponentContainer = document.getElementById('opponent-horses');
        
        playerContainer.innerHTML = '';
        GameState.horses.forEach((horse, index) => {
            const card = document.createElement('div');
            card.className = 'horse-card';
            
            const hasParts = horse.parts.head || horse.parts.body || horse.parts.legs || horse.parts.tail;
            const horseIcon = hasParts ? '🐴' : '❓';
            const colors = ['#4ECDC4', '#FF6B6B', '#FFE66D'];
            
            card.innerHTML = `
                <div class="horse-card-number" style="background: ${colors[index]}">${index + 1}</div>
                <div class="horse-card-icon">${horseIcon}</div>
                <div class="horse-card-info">
                    <div class="horse-card-name">${horse.name}</div>
                    <div class="horse-card-stats">
                        <span class="stat-dot speed"></span>
                        <span class="stat-dot power"></span>
                        <span class="stat-dot stamina"></span>
                        <span class="stat-dot magic"></span>
                    </div>
                </div>
            `;
            playerContainer.appendChild(card);
        });
        
        opponentContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const card = document.createElement('div');
            card.className = 'horse-card';
            card.innerHTML = `
                <div class="horse-card-number" style="background: #FF6B6B">${i + 1}</div>
                <div class="horse-card-icon">❓</div>
                <div class="horse-card-info">
                    <div class="horse-card-name">????</div>
                    <div class="horse-card-stats">
                        <span class="stat-dot" style="background: #666"></span>
                        <span class="stat-dot" style="background: #666"></span>
                        <span class="stat-dot" style="background: #666"></span>
                        <span class="stat-dot" style="background: #666"></span>
                    </div>
                </div>
            `;
            opponentContainer.appendChild(card);
        }
    },
    
    startRace() {
        const validHorses = GameState.horses.filter(h => 
            h.parts.head && h.parts.body && h.parts.legs && h.parts.tail
        );
        
        if (validHorses.length === 0) {
            this.showNotification('请先在养马屋组装马匹', 'warning');
            return;
        }
        
        if (GameState.gold < CONFIG.RACE_FEE) {
            this.showNotification('马币不足', 'error');
            return;
        }
        
        GameState.gold -= CONFIG.RACE_FEE;
        
        GameState.raceData = {
            playerHorses: validHorses.slice(0, 3),
            opponentHorses: this.generateOpponentHorses(),
            currentRound: 0,
            playerScore: 0,
            opponentScore: 0,
            roundResults: []
        };
        
        document.getElementById('race-prep').classList.add('hidden');
        document.getElementById('race-arena').classList.remove('hidden');
        
        this.runRaceRound();
    },
    
    generateOpponentHorses() {
        const horses = [];
        const names = ['爪黄飞电', '乌骓', '追风'];
        
        for (let i = 0; i < 3; i++) {
            const speed = 60 + Math.floor(Math.random() * 40);
            const power = 50 + Math.floor(Math.random() * 30);
            const stamina = 50 + Math.floor(Math.random() * 30);
            const magic = 30 + Math.floor(Math.random() * 30);
            
            horses.push({
                name: names[i],
                stats: { speed, power, stamina, magic, tech: 0 }
            });
        }
        
        return horses;
    },
    
    runRaceRound() {
        const data = GameState.raceData;
        if (!data) return;
        
        const round = data.currentRound;
        const playerHorse = data.playerHorses[round] || data.playerHorses[0];
        const opponentHorse = data.opponentHorses[round];
        
        document.querySelector('.round-badge').textContent = `第 ${round + 1} 局`;
        document.querySelector('.player-score').textContent = data.playerScore;
        document.querySelector('.opponent-score').textContent = data.opponentScore;
        
        document.querySelector('.player-lane .horse-name-label').textContent = playerHorse.name;
        document.querySelector('.opponent-lane .horse-name-label').textContent = opponentHorse.name;
        
        const playerProgress = document.getElementById('player-stamina');
        const opponentProgress = document.getElementById('opponent-stamina');
        playerProgress.style.width = '100%';
        opponentProgress.style.width = '100%';
        
        let playerPos = 0;
        let opponentPos = 0;
        const playerHorseEl = document.getElementById('player-horse');
        const opponentHorseEl = document.getElementById('opponent-horse');
        playerHorseEl.style.left = '0';
        opponentHorseEl.style.left = '0';
        
        const raceInterval = setInterval(() => {
            const playerSpeed = this.calculateSpeed(playerHorse.stats);
            const opponentSpeed = this.calculateSpeed(opponentHorse.stats);
            
            playerPos += playerSpeed * 0.5;
            opponentPos += opponentSpeed * 0.5;
            
            const maxPos = 85;
            playerPos = Math.min(playerPos, maxPos);
            opponentPos = Math.min(opponentPos, maxPos);
            
            playerHorseEl.style.left = playerPos + '%';
            opponentHorseEl.style.left = opponentPos + '%';
            
            playerProgress.style.width = Math.max(0, 100 - playerPos) + '%';
            opponentProgress.style.width = Math.max(0, 100 - opponentPos) + '%';
            
            if (playerPos >= maxPos || opponentPos >= maxPos) {
                clearInterval(raceInterval);
                
                const winner = playerPos >= maxPos && opponentPos < maxPos ? 'player' : 
                              opponentPos >= maxPos && playerPos < maxPos ? 'opponent' : 'draw';
                
                if (winner === 'player') data.playerScore++;
                else if (winner === 'opponent') data.opponentScore++;
                
                data.roundResults.push(winner);
                data.currentRound++;
                
                setTimeout(() => {
                    this.checkRaceEnd();
                }, 1000);
            }
        }, 50);
    },
    
    calculateSpeed(stats) {
        const baseSpeed = stats.speed || 0;
        const powerBonus = (stats.power || 0) * 0.3;
        const staminaBonus = (stats.stamina || 0) * 0.2;
        const magicBonus = (stats.magic || 0) * 0.1;
        const techBonus = (stats.tech || 0) * 0.15;
        
        const total = baseSpeed + powerBonus + staminaBonus + magicBonus + techBonus;
        return total / 100 + Math.random() * 0.2;
    },
    
    checkRaceEnd() {
        const data = GameState.raceData;
        
        if (data.playerScore >= 2) {
            this.endRace(true);
        } else if (data.opponentScore >= 2) {
            this.endRace(false);
        } else if (data.currentRound >= 3) {
            const winner = data.playerScore > data.opponentScore;
            this.endRace(winner);
        } else {
            this.runRaceRound();
        }
    },
    
    endRace(won) {
        document.getElementById('race-arena').classList.add('hidden');
        document.getElementById('race-prep').classList.remove('hidden');
        
        GameState.totalRaces++;
        
        if (won) {
            GameState.wins++;
            GameState.gold += CONFIG.WIN_REWARD;
            this.switchScreen('victory');
            document.querySelector('.reward-panel.victory .reward-value').textContent = '+' + CONFIG.WIN_REWARD;
            document.querySelector('.reward-panel.victory .current-gold').textContent = '当前马币: ' + GameState.gold;
        } else {
            GameState.losses++;
            this.switchScreen('defeat');
            document.querySelector('.reward-panel.defeat .reward-value').textContent = '-' + CONFIG.RACE_FEE;
            document.querySelector('.reward-panel.defeat .current-gold').textContent = '当前马币: ' + GameState.gold;
        }
        
        this.saveGame();
        this.updateUI();
    },
    
    raceAction() {
        const playerHorseEl = document.getElementById('player-horse');
        playerHorseEl.style.transform = 'translateY(-50%) scale(1.1)';
        setTimeout(() => {
            playerHorseEl.style.transform = 'translateY(-50%) scale(1)';
        }, 100);
    },
    
    viewReplay() {
        this.showNotification('回放功能开发中', 'warning');
    },
    
    showNotification(message, type = 'success') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<div class="notification-text">${message}</div>`;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
};

const Shop = {
    currentType: 'head',
    
    filterType(type) {
        this.currentType = type;
        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        this.renderItems(type);
    },
    
    renderItems(type) {
        const container = document.getElementById('shop-items');
        if (!container) return;
        
        const items = SHOP_ITEMS.filter(item => item.type === type);
        
        container.innerHTML = items.map(item => {
            const isOwned = GameState.inventory.some(i => i.id === item.id);
            const canBuy = GameState.gold >= item.price && !isOwned;
            
            const statHtml = [];
            if (item.stats.speed) statHtml.push(`速度 +${item.stats.speed}`);
            if (item.stats.power) statHtml.push(`力量 +${item.stats.power}`);
            if (item.stats.stamina) statHtml.push(`耐力 +${item.stats.stamina}`);
            if (item.stats.magic) statHtml.push(`魔力 +${item.stats.magic}`);
            if (item.stats.tech) statHtml.push(`科技 +${item.stats.tech}`);
            
            return `
                <div class="shop-item" onclick="Shop.buyItem('${item.id}')">
                    <div class="shop-item-header">
                        <div class="shop-item-icon">${item.icon}</div>
                        <div class="shop-item-info">
                            <div class="shop-item-name">${item.category}-${item.name}</div>
                            <div class="shop-item-category">${Game.getPartTypeName(item.type)}</div>
                        </div>
                    </div>
                    <div class="shop-item-stats">
                        ${statHtml.map(s => `<span class="shop-item-stat">${s}</span>`).join('')}
                    </div>
                    <div class="shop-item-price-row">
                        <div class="shop-item-price">
                            <span>🪙</span>
                            <span>${item.price}</span>
                        </div>
                        <button class="shop-item-buy-btn" ${!canBuy ? 'disabled' : ''}>
                            ${isOwned ? '已拥有' : '购买'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    buyItem(itemId) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        
        if (GameState.inventory.some(i => i.id === itemId)) {
            Game.showNotification('已拥有该部件', 'warning');
            return;
        }
        
        if (GameState.gold < item.price) {
            Game.showNotification('马币不足', 'error');
            return;
        }
        
        GameState.gold -= item.price;
        GameState.inventory.push({ ...item });
        
        Game.saveGame();
        Game.updateUI();
        this.renderItems(this.currentType);
        Game.showNotification(`购买成功!`, 'success');
    }
};

const PartSelector = {
    filterCategory(category) {
        document.querySelectorAll('.modal-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        this.renderParts(GameState.partSelectorType, category);
    },
    
    renderParts(type, category = 'all') {
        const container = document.getElementById('parts-grid');
        if (!container) return;
        
        let items = GameState.inventory.filter(item => item.type === type);
        
        if (category !== 'all') {
            items = items.filter(item => item.category === category);
        }
        
        container.innerHTML = items.map((item, index) => {
            const isSelected = GameState.selectedPart && GameState.selectedPart.id === item.id;
            
            const statHtml = [];
            if (item.stats.speed) statHtml.push(`速度 +${item.stats.speed}`);
            if (item.stats.power) statHtml.push(`力量 +${item.stats.power}`);
            if (item.stats.stamina) statHtml.push(`耐力 +${item.stats.stamina}`);
            if (item.stats.magic) statHtml.push(`魔力 +${item.stats.magic}`);
            if (item.stats.tech) statHtml.push(`科技 +${item.stats.tech}`);
            
            return `
                <div class="part-card ${isSelected ? 'selected' : ''}" onclick="Game.selectPartForEquip(GameState.inventory[${index}])">
                    <div class="part-icon">${item.icon}</div>
                    <div class="part-name">${item.category}-${item.name}</div>
                    <div class="part-stats">${statHtml.join(', ')}</div>
                    <div class="part-price owned">✓ 已拥有</div>
                </div>
            `;
        }).join('');
        
        if (items.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px;">暂无该类型部件，请先去商店购买</div>';
        }
    }
};

Game.init();
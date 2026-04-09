const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 游戏配置 - 可替换贴图的配置项
const CONFIG = {
    colors: {
        red: '#e94560',
        blue: '#4ecdc4',
        yellow: '#ffe66d',
        green: '#95e1a3',
        background: '#16213e',
        conveyor: '#0f3460',
        shelf: '#1a1a2e',
        shelfBorder: '#e94560'
    },
    itemTypes: [
        { name: 'red', color: '#e94560', image: 'assets/items/red.png' },
        { name: 'blue', color: '#4ecdc4', image: 'assets/items/blue.png' },
        { name: 'yellow', color: '#ffe66d', image: 'assets/items/yellow.png' },
        { name: 'green', color: '#95e1a3', image: 'assets/items/green.png' },
        { name: 'bomb', color: '#ff3333', image: 'assets/items/bomb.png' }
    ],
    shelfTypes: {
        red: { color: '#e94560', image: 'assets/shelves/red.png' },
        blue: { color: '#4ecdc4', image: 'assets/shelves/blue.png' },
        yellow: { color: '#ffe66d', image: 'assets/shelves/yellow.png' },
        green: { color: '#95e1a3', image: 'assets/shelves/green.png' },
        bomb: { color: '#ff3333', image: 'assets/shelves/bomb.png' }
    },
    images: {
        background: 'assets/background.png',
        conveyor: 'assets/conveyor.png'
    },
    maxHealth: 10,
    baseConveyorSpeed: 1.0,
    speedIncreaseRate: 0.0005,
    itemSize: 60,
    shelfWidth: 90,
    shelfHeight: 80
};

// 图片资源管理
const ImageManager = {
    loaded: {},
    loading: false,
    loadImage(src) {
        return new Promise((resolve) => {
            if (this.loaded[src]) {
                resolve(this.loaded[src]);
                return;
            }
            const img = new Image();
            img.onload = () => {
                this.loaded[src] = img;
                resolve(img);
            };
            img.onerror = () => {
                this.loaded[src] = null;
                resolve(null);
            };
            img.src = src;
        });
    },
    getImage(src) {
        return this.loaded[src] || null;
    }
};

// 游戏状态
let gameState = {
    running: false,
    score: 0,
    health: CONFIG.maxHealth,
    conveyorSpeed: CONFIG.baseConveyorSpeed,
    items: [],
    thrownItems: [],
    shelves: [],
    lastItemTime: 0,
    itemSpawnInterval: 1500,
    touchStart: null,
    selectedItem: null,
    effects: []
};

// 排行榜数据
let leaderboardData = [
    { name: '小明', score: 350 },
    { name: '小红', score: 280 },
    { name: '小刚', score: 220 },
    { name: '小美', score: 180 },
    { name: '小李', score: 120 }
];

// 初始化画布大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initShelves();
}

// 初始化货架
function initShelves() {
    const spacing = 20;
    const shelfWidth = CONFIG.shelfWidth;
    const shelfHeight = CONFIG.shelfHeight;
    const shelfGap = 50; // 缩小货架间距
    
    gameState.shelves = [];
    
    // 第1层（最上方）：中间炸弹货架（0分）
    gameState.shelves.push({
        x: canvas.width / 2 - shelfWidth / 2,
        y: 40,
        width: shelfWidth,
        height: shelfHeight,
        type: 'bomb',
        color: CONFIG.itemTypes[4].color,
        score: 0
    });
    
    // 第2层：左蓝、右绿（3分）
    const layer2Y = 140;
    gameState.shelves.push({
        x: spacing,
        y: layer2Y,
        width: shelfWidth,
        height: shelfHeight,
        type: 'blue',
        color: CONFIG.itemTypes[1].color,
        score: 3
    });
    
    gameState.shelves.push({
        x: canvas.width - shelfWidth - spacing,
        y: layer2Y,
        width: shelfWidth,
        height: shelfHeight,
        type: 'green',
        color: CONFIG.itemTypes[3].color,
        score: 3
    });
    
    // 第3层：左红、右黄（2分）
    const layer3Y = layer2Y + shelfHeight + shelfGap;
    gameState.shelves.push({
        x: spacing,
        y: layer3Y,
        width: shelfWidth,
        height: shelfHeight,
        type: 'red',
        color: CONFIG.itemTypes[0].color,
        score: 2
    });
    
    gameState.shelves.push({
        x: canvas.width - shelfWidth - spacing,
        y: layer3Y,
        width: shelfWidth,
        height: shelfHeight,
        type: 'yellow',
        color: CONFIG.itemTypes[2].color,
        score: 2
    });
    
    // 第4层：左红、右黄（1分）
    const layer4Y = layer3Y + shelfHeight + shelfGap;
    gameState.shelves.push({
        x: spacing,
        y: layer4Y,
        width: shelfWidth,
        height: shelfHeight,
        type: 'red',
        color: CONFIG.itemTypes[0].color,
        score: 1
    });
    
    gameState.shelves.push({
        x: canvas.width - shelfWidth - spacing,
        y: layer4Y,
        width: shelfWidth,
        height: shelfHeight,
        type: 'yellow',
        color: CONFIG.itemTypes[2].color,
        score: 1
    });
}

// 生成新货物
function spawnItem() {
    const type = CONFIG.itemTypes[Math.floor(Math.random() * CONFIG.itemTypes.length)];
    const item = {
        x: -CONFIG.itemSize,
        y: canvas.height - 120, // 货物位置上移
        width: CONFIG.itemSize,
        height: CONFIG.itemSize,
        type: type.name,
        color: type.color,
        vx: 0,
        vy: 0,
        onConveyor: true,
        selected: false
    };
    gameState.items.push(item);
}

// 绘制游戏
function draw() {
    // 绘制背景（优先使用图片，没有则用色块）
    const bgImage = ImageManager.getImage(CONFIG.images.background);
    if (bgImage) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawShelves();
    drawConveyor();
    drawItems();
    drawThrownItems();
    drawEffects();
    
    if (gameState.touchStart && gameState.selectedItem) {
        drawSwipeLine();
    }
}

// 绘制图片或色块的通用函数
function drawImageOrRect(x, y, width, height, imageSrc, fallbackColor, drawBorder = false) {
    const img = ImageManager.getImage(imageSrc);
    if (img) {
        ctx.drawImage(img, x, y, width, height);
    } else {
        ctx.fillStyle = fallbackColor;
        ctx.fillRect(x, y, width, height);
        if (drawBorder) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
        }
    }
}

// 绘制特效
function drawEffects() {
    if (!gameState.effects) {
        gameState.effects = [];
        return;
    }
    for (let i = gameState.effects.length - 1; i >= 0; i--) {
        const effect = gameState.effects[i];
        effect.life -= 1;
        
        if (effect.life <= 0) {
            gameState.effects.splice(i, 1);
            continue;
        }
        
        const alpha = effect.life / effect.maxLife;
        
        if (effect.type === 'score') {
            // 分数文字上浮特效
            ctx.globalAlpha = alpha;
            ctx.fillStyle = effect.color;
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`+${effect.score}`, effect.x, effect.y - (effect.maxLife - effect.life) * 2);
            ctx.globalAlpha = 1;
        } else if (effect.type === 'explosion') {
            // 爆炸特效
            const radius = (1 - alpha) * 60;
            ctx.globalAlpha = alpha * 0.5;
            ctx.fillStyle = effect.color;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // 火花粒子
            for (let j = 0; j < 8; j++) {
                const angle = (j / 8) * Math.PI * 2;
                const particleDistance = (1 - alpha) * 50;
                const px = effect.x + Math.cos(angle) * particleDistance;
                const py = effect.y + Math.sin(angle) * particleDistance;
                const particleRadius = 3 * alpha;
                
                ctx.globalAlpha = alpha;
                ctx.fillStyle = effect.color;
                ctx.beginPath();
                ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
    }
}

// 添加得分特效
function addScoreEffect(x, y, score, color) {
    gameState.effects.push({
        type: 'score',
        x: x,
        y: y,
        score: score,
        color: color,
        life: 60,
        maxLife: 60
    });
    
    if (score >= 30) {
        // 30分添加爆炸特效
        gameState.effects.push({
            type: 'explosion',
            x: x,
            y: y,
            color: color,
            life: 40,
            maxLife: 40
        });
    }
}

// 绘制货架
function drawShelves() {
    gameState.shelves.forEach(shelf => {
        const shelfConfig = CONFIG.shelfTypes[shelf.type];
        const shelfImage = shelfConfig ? ImageManager.getImage(shelfConfig.image) : null;
        
        if (shelfImage) {
            ctx.drawImage(shelfImage, shelf.x, shelf.y, shelf.width, shelf.height);
        } else {
            ctx.fillStyle = CONFIG.colors.shelf;
            ctx.fillRect(shelf.x, shelf.y, shelf.width, shelf.height);
            
            ctx.strokeStyle = shelf.color;
            ctx.lineWidth = 4;
            ctx.strokeRect(shelf.x, shelf.y, shelf.width, shelf.height);
            
            ctx.fillStyle = shelf.color;
            ctx.beginPath();
            ctx.arc(shelf.x + shelf.width / 2, shelf.y + shelf.height / 2, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(shelf.type, shelf.x + shelf.width / 2, shelf.y + shelf.height - 15);
        }
    });
}

// 绘制传送带
function drawConveyor() {
    const y = canvas.height - 90; // 传送带位置上移
    const conveyorImage = ImageManager.getImage(CONFIG.images.conveyor);
    
    if (conveyorImage) {
        ctx.drawImage(conveyorImage, 0, y - 45, canvas.width, 90); // 缩小传送带高度
    } else {
        ctx.fillStyle = CONFIG.colors.conveyor;
        ctx.fillRect(0, y - 45, canvas.width, 90); // 缩小传送带高度
        
        ctx.fillStyle = '#333';
        const rollerCount = Math.floor(canvas.width / 50);
        for (let i = 0; i < rollerCount; i++) {
            ctx.beginPath();
            ctx.arc(i * 50 + 25, y, 12, 0, Math.PI * 2); // 缩小滚轴
            ctx.fill();
        }
    }
}

// 绘制传送带上的货物
function drawItems() {
    gameState.items.forEach(item => {
        const itemType = CONFIG.itemTypes.find(t => t.name === item.type);
        const itemImage = itemType ? ImageManager.getImage(itemType.image) : null;
        
        if (itemImage) {
            ctx.drawImage(itemImage, item.x, item.y, item.width, item.height);
        } else {
            ctx.fillStyle = item.color;
            ctx.fillRect(item.x, item.y, item.width, item.height);
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.strokeRect(item.x, item.y, item.width, item.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.type, item.x + item.width / 2, item.y + item.height / 2);
        }
    });
}

// 绘制被扔出的货物
function drawThrownItems() {
    gameState.thrownItems.forEach(item => {
        const itemType = CONFIG.itemTypes.find(t => t.name === item.type);
        const itemImage = itemType ? ImageManager.getImage(itemType.image) : null;
        
        if (itemImage) {
            ctx.drawImage(itemImage, item.x, item.y, item.width, item.height);
        } else {
            ctx.fillStyle = item.color;
            ctx.fillRect(item.x, item.y, item.width, item.height);
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.strokeRect(item.x, item.y, item.width, item.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.type, item.x + item.width / 2, item.y + item.height / 2);
        }
    });
}

// 绘制瞄准箭头
function drawSwipeLine() {
    if (!gameState.touchStart || !gameState.selectedItem) return;
    
    const startX = gameState.selectedItem.x + gameState.selectedItem.width / 2;
    const startY = gameState.selectedItem.y + gameState.selectedItem.height / 2;
    const endX = gameState.touchStart.x;
    const endY = gameState.touchStart.y;
    
    const dx = startX - endX;
    const dy = startY - endY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算力度（0-1之间）
    const maxDistance = 200;
    const power = Math.min(distance / maxDistance, 1);
    
    // 计算箭头颜色（从透明到红色）
    const alpha = 0.3 + power * 0.7;
    const red = 255;
    const green = Math.floor(255 * (1 - power));
    const blue = Math.floor(255 * (1 - power));
    const arrowColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    
    // 计算箭头长度（根据力度）
    const arrowLength = 50 + power * 100;
    const angle = Math.atan2(dy, dx);
    
    // 箭头终点（指向货物实际飞行的方向）
    const arrowEndX = startX + Math.cos(angle) * arrowLength;
    const arrowEndY = startY + Math.sin(angle) * arrowLength;
    
    // 绘制箭头线
    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(arrowEndX, arrowEndY);
    ctx.stroke();
    
    // 绘制箭头头部
    const arrowHeadSize = 15;
    ctx.fillStyle = arrowColor;
    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
        arrowEndX - Math.cos(angle - Math.PI / 6) * arrowHeadSize,
        arrowEndY - Math.sin(angle - Math.PI / 6) * arrowHeadSize
    );
    ctx.lineTo(
        arrowEndX - Math.cos(angle + Math.PI / 6) * arrowHeadSize,
        arrowEndY - Math.sin(angle + Math.PI / 6) * arrowHeadSize
    );
    ctx.closePath();
    ctx.fill();
    
    // 绘制力度指示器
    ctx.fillStyle = arrowColor;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(power * 100)}%`, arrowEndX, arrowEndY - 10);
}

// 更新游戏状态
function update(timestamp) {
    if (!gameState.running) return;
    
    gameState.conveyorSpeed += CONFIG.speedIncreaseRate;
    
    if (timestamp - gameState.lastItemTime > gameState.itemSpawnInterval) {
        spawnItem();
        gameState.lastItemTime = timestamp;
        if (gameState.itemSpawnInterval > 800) {
            gameState.itemSpawnInterval -= 10;
        }
    }
    
    updateConveyorItems();
    updateThrownItems();
}

// 更新传送带上的货物
function updateConveyorItems() {
    for (let i = gameState.items.length - 1; i >= 0; i--) {
        const item = gameState.items[i];
        
        if (item.onConveyor && !item.selected) {
            item.x += gameState.conveyorSpeed;
        }
        
        if (item.x > canvas.width) {
            gameState.items.splice(i, 1);
            takeDamage();
        }
    }
}

// 更新被扔出的货物
function updateThrownItems() {
    const gravity = 0.3;
    
    for (let i = gameState.thrownItems.length - 1; i >= 0; i--) {
        const item = gameState.thrownItems[i];
        
        item.vy += gravity;
        item.x += item.vx;
        item.y += item.vy;
        
        let scored = false;
        for (const shelf of gameState.shelves) {
            if (checkCollision(item, shelf)) {
                if (item.type === shelf.type) {
                    const actualScore = shelf.score * 10;
                    if (shelf.score > 0) {
                        addScore(actualScore);
                        addScoreEffect(
                            item.x + item.width / 2,
                            item.y + item.height / 2,
                            actualScore,
                            shelf.color
                        );
                    }
                } else {
                    takeDamage();
                }
                scored = true;
                break;
            }
        }
        
        // 墙壁反弹效果
        if (item.x < 0) {
            item.x = 0;
            item.vx = -item.vx * 0.8; // 反弹并减少一些速度
        } else if (item.x + item.width > canvas.width) {
            item.x = canvas.width - item.width;
            item.vx = -item.vx * 0.8; // 反弹并减少一些速度
        }
        
        if (scored) {
            gameState.thrownItems.splice(i, 1);
        } else if (item.y > canvas.height || item.y < -100) {
            // 货物飞出屏幕，扣血
            takeDamage();
            gameState.thrownItems.splice(i, 1);
        }
    }
}

// 碰撞检测
function checkCollision(item, shelf) {
    return item.x < shelf.x + shelf.width &&
           item.x + item.width > shelf.x &&
           item.y < shelf.y + shelf.height &&
           item.y + item.height > shelf.y;
}

// 增加分数
function addScore(points) {
    gameState.score += points;
    document.getElementById('score').textContent = gameState.score;
}

// 扣血
function takeDamage() {
    gameState.health--;
    updateHealthBar();
    
    if (gameState.health <= 0) {
        endGame();
    }
}

// 更新血条显示
function updateHealthBar() {
    const healthPercent = (gameState.health / CONFIG.maxHealth) * 100;
    document.getElementById('health-bar').style.width = healthPercent + '%';
}

// 触摸/鼠标事件处理
function getPointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function handleStart(e) {
    if (!gameState.running) return;
    
    e.preventDefault();
    const pos = getPointerPosition(e);
    
    for (let i = gameState.items.length - 1; i >= 0; i--) {
        const item = gameState.items[i];
        if (pos.x >= item.x && pos.x <= item.x + item.width &&
            pos.y >= item.y && pos.y <= item.y + item.height) {
            gameState.selectedItem = item;
            item.selected = true;
            gameState.touchStart = pos;
            break;
        }
    }
}

function handleMove(e) {
    if (!gameState.running || !gameState.touchStart) return;
    
    e.preventDefault();
    const pos = getPointerPosition(e);
    gameState.touchStart = pos;
}

function handleEnd(e) {
    if (!gameState.running || !gameState.selectedItem || !gameState.touchStart) return;
    
    e.preventDefault();
    
    const item = gameState.selectedItem;
    const startX = item.x + item.width / 2;
    const startY = item.y + item.height / 2;
    const endX = gameState.touchStart.x;
    const endY = gameState.touchStart.y;
    
    const dx = startX - endX;
    const dy = startY - endY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxSpeed = 35;
    const speed = Math.min(distance / 6, maxSpeed);
    const angle = Math.atan2(dy, dx);
    
    item.vx = Math.cos(angle) * speed;
    item.vy = Math.sin(angle) * speed;
    item.onConveyor = false;
    item.selected = false;
    
    const index = gameState.items.indexOf(item);
    if (index > -1) {
        gameState.items.splice(index, 1);
    }
    gameState.thrownItems.push(item);
    
    gameState.selectedItem = null;
    gameState.touchStart = null;
}

// 游戏循环
function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

// 开始游戏
function startGame() {
    gameState = {
        running: true,
        score: 0,
        health: CONFIG.maxHealth,
        conveyorSpeed: CONFIG.baseConveyorSpeed,
        items: [],
        thrownItems: [],
        shelves: gameState.shelves,
        lastItemTime: 0,
        itemSpawnInterval: 1500,
        touchStart: null,
        selectedItem: null,
        effects: []
    };
    
    document.getElementById('score').textContent = '0';
    updateHealthBar();
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('end-screen').classList.add('hidden');
}

// 结束游戏
function endGame() {
    gameState.running = false;
    
    document.getElementById('final-score').textContent = gameState.score;
    
    updateLeaderboard();
    
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');
}

// 更新排行榜
function updateLeaderboard() {
    const playerEntry = { name: '我', score: gameState.score };
    leaderboardData.push(playerEntry);
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, 10);
    
    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = '';
    
    let playerRank = -1;
    
    leaderboardData.forEach((entry, index) => {
        const li = document.createElement('li');
        if (entry.name === '我' && entry.score === gameState.score) {
            li.classList.add('current-player');
            playerRank = index + 1;
        }
        li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${entry.score}</span>`;
        listEl.appendChild(li);
    });
    
    const rankEl = document.getElementById('player-rank');
    if (playerRank > 0) {
        rankEl.textContent = `你的排名: 第${playerRank}名`;
    } else {
        rankEl.textContent = '';
    }
}

// 分享功能
function shareGame() {
    if (navigator.share) {
        navigator.share({
            title: '货物归类游戏',
            text: `我在货物归类游戏中获得了 ${gameState.score} 分！来挑战我吧！`,
            url: window.location.href
        }).then(() => {
            startGame();
        }).catch(console.error);
    } else {
        alert(`分享成功！你获得了 ${gameState.score} 分！`);
        startGame();
    }
}

// 初始化事件监听
function initEvents() {
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleEnd, { passive: false });
    
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', startGame);
    document.getElementById('share-btn').addEventListener('click', shareGame);
    
    window.addEventListener('resize', resizeCanvas);
}

// 预加载所有图片资源
async function preloadImages() {
    const allImages = [];
    
    // 背景和传送带
    allImages.push(ImageManager.loadImage(CONFIG.images.background));
    allImages.push(ImageManager.loadImage(CONFIG.images.conveyor));
    
    // 货物图片
    CONFIG.itemTypes.forEach(type => {
        allImages.push(ImageManager.loadImage(type.image));
    });
    
    // 货架图片
    Object.values(CONFIG.shelfTypes).forEach(shelfType => {
        allImages.push(ImageManager.loadImage(shelfType.image));
    });
    
    await Promise.all(allImages);
    console.log('所有图片资源加载完成（或尝试加载完毕）');
}

// 初始化游戏
async function init() {
    await preloadImages();
    resizeCanvas();
    initEvents();
    requestAnimationFrame(gameLoop);
}

// 启动游戏
init();

# 田忌赛马 - 技术架构文档

## 1. 系统架构

### 1.1 整体架构
采用模块化的单页面应用架构，所有功能集成在一个HTML文件中，通过状态管理和界面切换实现不同功能模块。

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (HTML/CSS)                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │主界面    │ │养马屋    │ │商店      │ │赛场      │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                 Game Logic Layer (JavaScript)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │经济系统   │ │马匹系统   │ │比赛系统   │ │商店系统   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (LocalStorage)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │玩家数据   │ │游戏配置   │ │存档数据   │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
```

### 1.2 核心模块

#### GameManager（游戏管理器）
- 职责：管理游戏主循环、状态切换、数据持久化
- 公开API：
  - `init()` - 初始化游戏
  - `saveData()` - 保存游戏数据
  - `loadData()` - 加载游戏数据
  - `switchScreen(screenName)` - 切换界面

#### ShopSystem（商店系统）
- 职责：管理商店库存、商品购买、价格计算
- 公开API：
  - `getShopItems()` - 获取商店商品
  - `purchaseItem(itemId)` - 购买物品
  - `getInventory()` - 获取玩家库存
  - `filterItems(type, quality)` - 筛选商品

#### HorseSystem（马匹系统）
- 职责：管理马匹组装、属性计算、马匹存储
- 公开API：
  - `createHorse(parts)` - 创建马匹
  - `calculateStats(parts)` - 计算属性
  - `getHorses()` - 获取玩家马匹
  - `sellHorse(horseId)` - 卖马
  - `deleteHorse(horseId)` - 删除马匹

#### RaceSystem（比赛系统）
- 职责：管理比赛流程、胜负判定、奖励结算
- 公开API：
  - `startRace(playerHorse, opponentHorse)` - 开始比赛
  - `calculateScore(horse)` - 计算马匹得分
  - `runRaceRound()` - 执行单轮比赛
  - `determineWinner()` - 判定胜负
  - `distributeRewards(won)` - 发放奖励

#### UIManager（界面管理器）
- 职责：管理界面渲染、动画效果、用户交互
- 公开API：
  - `renderScreen(screenName)` - 渲染界面
  - `showModal(content)` - 显示弹窗
  - `hideModal()` - 隐藏弹窗
  - `playAnimation(type)` - 播放动画
  - `updateUI()` - 更新UI数据

---

## 2. 数据结构设计

### 2.1 玩家数据（PlayerData）
```javascript
const playerData = {
  gold: 300,                    // 当前金币
  inventory: [],                // 背包中的部件
  horses: [],                   // 玩家拥有的马匹
  maxHorseSlots: 3,             // 最大马匹槽位
  totalRaces: 0,                 // 总比赛场次
  wins: 0,                       // 胜利场次
  losses: 0                      // 失败场次
};
```

### 2.2 马匹部件（HorsePart）
```javascript
const horsePart = {
  id: 'part_001',               // 部件唯一ID
  type: 'head',                  // 部件类型：head, body, legs, tail, mane
  quality: 'common',             // 品质：common, rare, epic, legendary
  name: '普通马头',              // 部件名称
  price: 50,                     // 购买价格
  stats: {
    speed: 10,                   // 速度属性
    acceleration: 5,             // 加速属性
    stamina: 5,                  // 耐力属性
    magic: 0                     // 魔法属性
  },
  color: '#FFFFFF',              // 颜色（用于像素渲染）
  emoji: '🐴'                    // 图标标识
};
```

### 2.3 马匹数据（Horse）
```javascript
const horse = {
  id: 'horse_001',              // 马匹唯一ID
  name: '赤兔马',                // 马匹名称
  parts: {
    head: 'part_head_001',      // 头部部件ID
    body: 'part_body_001',      // 身体部件ID
    legs: 'part_legs_001',      // 腿部部件ID
    tail: 'part_tail_001',      // 尾巴部件ID
    mane: 'part_mane_001'       // 鬃毛部件ID
  },
  totalStats: {
    speed: 50,
    acceleration: 40,
    stamina: 35,
    magic: 20
  },
  totalScore: 0,                 // 综合评分
  isComplete: false              // 是否完整（5个部位都有）
};
```

### 2.4 商店配置（ShopConfig）
```javascript
const shopConfig = {
  entryFee: 50,                  // 比赛入场费
  winReward: 150,                // 胜利奖励
  sellRate: 0.7,                // 卖马回收比例
  parts: []                      // 商店部件列表
};
```

### 2.5 比赛数据（RaceData）
```javascript
const raceData = {
  playerHorse: null,             // 玩家选择的马匹
  opponentHorse: null,           // 对手马匹
  currentRound: 0,               // 当前回合
  rounds: [],                    // 各回合结果
  score: { player: 0, opponent: 0 }, // 当前比分
  status: 'waiting',             // 状态：waiting, racing, finished
  winner: null                   // 胜者：player, opponent, null
};
```

---

## 3. 商店商品配置

### 3.1 部件类型
| 类型 | 英文名 | 描述 | 必需槽位 |
|------|--------|------|----------|
| 头部 | Head | 马的头部，影响视野和速度 | ✅ |
| 身体 | Body | 马的主体，影响核心速度 | ✅ |
| 腿部 | Legs | 马的腿部，影响加速和速度 | ✅ |
| 尾巴 | Tail | 马的尾巴，影响耐力 | ✅ |
| 鬃毛 | Mane | 马的鬃毛，影响魔法 | ✅ |

### 3.2 品质等级
| 品质 | 英文 | 价格范围 | 属性范围 | 颜色代码 | 出现概率 |
|------|------|----------|----------|----------|----------|
| 普通 | Common | 50-100 | 5-15 | #FFFFFF | 50% |
| 稀有 | Rare | 150-250 | 20-35 | #4ECDC4 | 30% |
| 史诗 | Epic | 300-400 | 40-55 | #9B59B6 | 15% |
| 传说 | Legendary | 450-500 | 60-75 | #FFD700 | 5% |

### 3.3 商品预设列表
```javascript
const shopItems = [
  // 头部
  { type: 'head', quality: 'common', name: '普通马头', price: 50, stats: { speed: 10, acceleration: 5, stamina: 5, magic: 0 }},
  { type: 'head', quality: 'common', name: '结实马头', price: 70, stats: { speed: 8, acceleration: 8, stamina: 8, magic: 1 }},
  { type: 'head', quality: 'rare', name: '流线马头', price: 180, stats: { speed: 25, acceleration: 15, stamina: 10, magic: 5 }},
  { type: 'head', quality: 'epic', name: '风神马头', price: 350, stats: { speed: 40, acceleration: 25, stamina: 15, magic: 10 }},
  { type: 'head', quality: 'legendary', name: '龙首', price: 480, stats: { speed: 60, acceleration: 40, stamina: 20, magic: 15 }},
  
  // 身体
  { type: 'body', quality: 'common', name: '普通马身', price: 60, stats: { speed: 8, acceleration: 6, stamina: 10, magic: 1 }},
  { type: 'body', quality: 'common', name: '肌肉马身', price: 80, stats: { speed: 10, acceleration: 8, stamina: 12, magic: 0 }},
  { type: 'body', quality: 'rare', name: '轻便马身', price: 200, stats: { speed: 20, acceleration: 25, stamina: 15, magic: 5 }},
  { type: 'body', quality: 'epic', name: '闪电马身', price: 380, stats: { speed: 35, acceleration: 40, stamina: 25, magic: 10 }},
  { type: 'body', quality: 'legendary', name: '神躯', price: 500, stats: { speed: 50, acceleration: 50, stamina: 40, magic: 20 }},
  
  // 腿部
  { type: 'legs', quality: 'common', name: '普通马腿', price: 55, stats: { speed: 12, acceleration: 10, stamina: 5, magic: 0 }},
  { type: 'legs', quality: 'common', name: '修长马腿', price: 75, stats: { speed: 15, acceleration: 8, stamina: 8, magic: 0 }},
  { type: 'legs', quality: 'rare', name: '疾风马腿', price: 220, stats: { speed: 28, acceleration: 22, stamina: 12, magic: 3 }},
  { type: 'legs', quality: 'epic', name: '雷神马腿', price: 360, stats: { speed: 45, acceleration: 38, stamina: 18, magic: 8 }},
  { type: 'legs', quality: 'legendary', name: '飞毛腿', price: 490, stats: { speed: 65, acceleration: 55, stamina: 25, magic: 10 }},
  
  // 尾巴
  { type: 'tail', quality: 'common', name: '普通马尾', price: 45, stats: { speed: 5, acceleration: 5, stamina: 12, magic: 3 }},
  { type: 'tail', quality: 'common', name: '浓密马尾', price: 65, stats: { speed: 6, acceleration: 6, stamina: 15, magic: 2 }},
  { type: 'tail', quality: 'rare', name: '火焰马尾', price: 160, stats: { speed: 12, acceleration: 12, stamina: 28, magic: 8 }},
  { type: 'tail', quality: 'epic', name: '风暴马尾', price: 320, stats: { speed: 18, acceleration: 18, stamina: 45, magic: 15 }},
  { type: 'tail', quality: 'legendary', name: '神尾', price: 470, stats: { speed: 25, acceleration: 25, stamina: 60, magic: 25 }},
  
  // 鬃毛
  { type: 'mane', quality: 'common', name: '普通鬃毛', price: 40, stats: { speed: 3, acceleration: 3, stamina: 3, magic: 10 }},
  { type: 'mane', quality: 'common', name: '飘逸鬃毛', price: 60, stats: { speed: 5, acceleration: 5, stamina: 5, magic: 12 }},
  { type: 'mane', quality: 'rare', name: '魔法鬃毛', price: 150, stats: { speed: 10, acceleration: 10, stamina: 10, magic: 25 }},
  { type: 'mane', quality: 'epic', name: '秘法鬃毛', price: 300, stats: { speed: 15, acceleration: 15, stamina: 15, magic: 40 }},
  { type: 'mane', quality: 'legendary', name: '神鬃', price: 450, stats: { speed: 20, acceleration: 20, stamina: 20, magic: 60 }}
];
```

---

## 4. 比赛算法

### 4.1 得分计算公式
马匹综合得分计算公式：
```
总分 = (速度 × 0.3) + (加速 × 0.3) + (耐力 × 0.25) + (魔法 × 0.15)
```

### 4.2 比赛随机性
- 添加 ±10% 的随机波动
- 使用 `Math.random()` 模拟不确定性
- 确保每场比赛都有悬念

### 4.3 对手马匹生成
根据玩家马匹的平均属性，生成不同难度的对手：
- **简单难度**：玩家平均属性的 70-85%
- **普通难度**：玩家平均属性的 85-100%
- **困难难度**：玩家平均属性的 100-120%
- **地狱难度**：玩家平均属性的 120-140%

### 4.4 三局两胜判定
```javascript
function determineMatchWinner(rounds) {
  const wins = rounds.filter(r => r.winner === 'player').length;
  const losses = rounds.filter(r => r.winner === 'opponent').length;
  
  if (wins >= 2) return 'player';
  if (losses >= 2) return 'opponent';
  return null; // 尚未分出胜负
}
```

---

## 5. UI/UX 设计规范

### 5.1 色彩系统（CSS Variables）
```css
:root {
  /* 主色调 */
  --color-primary: #FF6B6B;      /* 珊瑚红 */
  --color-secondary: #4ECDC4;    /* 天蓝色 */
  --color-accent: #FFE66D;       /* 明黄色 */
  --color-purple: #9B59B6;        /* 紫罗兰 */
  --color-pink: #E91E63;          /* 深粉色 */
  
  /* 品质色 */
  --color-common: #FFFFFF;        /* 普通 - 白色 */
  --color-rare: #4ECDC4;          /* 稀有 - 青色 */
  --color-epic: #9B59B6;          /* 史诗 - 紫色 */
  --color-legendary: #FFD700;     /* 传说 - 金色 */
  
  /* 背景色 */
  --bg-dark: #1A1A2E;             /* 深蓝背景 */
  --bg-darker: #16213E;           /* 更深的蓝 */
  --bg-card: #0F3460;             /* 卡片背景 */
  
  /* 文字色 */
  --text-light: #F8F9FA;          /* 浅色文字 */
  --text-dark: #2C3E50;           /* 深色文字 */
  
  /* 功能色 */
  --color-success: #4ECDC4;       /* 成功 */
  --color-danger: #E74C3C;        /* 危险/失败 */
  --color-warning: #F39C12;       /* 警告 */
}
```

### 5.2 字体规范
```css
/* 标题字体 - 孟菲斯风格几何字体 */
@import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');

/* 正文字体 - 像素风格字体 */
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

/* 中文正文 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');

:root {
  --font-display: 'Bungee', cursive;
  --font-pixel: 'VT323', monospace;
  --font-chinese: 'Noto Sans SC', sans-serif;
  
  --font-size-title: 32px;
  --font-size-heading: 24px;
  --font-size-body: 16px;
  --font-size-small: 14px;
}
```

### 5.3 间距系统
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
  
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;
  --border-radius-round: 50%;
}
```

### 5.4 按钮设计
```css
.btn {
  padding: var(--space-md) var(--space-xl);
  border: 3px solid var(--color-dark);
  border-radius: var(--border-radius-lg);
  font-family: var(--font-display);
  font-size: var(--font-size-body);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  box-shadow: 4px 4px 0 var(--color-dark);
}

.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-dark);
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--color-dark);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--text-light);
}

.btn-secondary {
  background: var(--color-secondary);
  color: var(--text-dark);
}

.btn-warning {
  background: var(--color-accent);
  color: var(--text-dark);
}
```

### 5.5 卡片设计
```css
.card {
  background: var(--bg-card);
  border: 3px solid var(--color-dark);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: var(--color-accent);
  border-radius: 50%;
}
```

---

## 6. 动画效果

### 6.1 核心动画
```css
/* 弹性缩放动画 */
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 摇晃动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 闪烁动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 滑入动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 弹跳入场 */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 旋转动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 6.2 状态动画
```javascript
// UI 反馈动画
const animations = {
  success: 'bounce 0.5s ease',
  error: 'shake 0.5s ease',
  highlight: 'pulse 1s infinite',
  entrance: 'bounceIn 0.6s ease-out',
  exit: 'fadeOut 0.3s ease-out'
};
```

---

## 7. 状态管理

### 7.1 全局状态对象
```javascript
const GameState = {
  currentScreen: 'main',         // 当前界面
  player: null,                   // 玩家数据
  shop: null,                     // 商店数据
  currentHorse: null,             // 当前正在组装的马
  raceData: null,                 // 当前比赛数据
  ui: {
    modal: null,                  // 当前弹窗
    notifications: [],            // 通知队列
    loading: false                // 加载状态
  }
};
```

### 7.2 状态更新机制
```javascript
// 状态更新函数
function updateState(key, value) {
  GameState[key] = value;
  saveToLocalStorage();
  renderUI();
}

// 批量更新
function batchUpdate(updates) {
  Object.assign(GameState, updates);
  saveToLocalStorage();
  renderUI();
}
```

---

## 8. 数据持久化

### 8.1 LocalStorage 结构
```javascript
const STORAGE_KEY = 'tianji_horse_save';

const saveData = {
  version: '1.0.0',
  timestamp: Date.now(),
  player: {
    gold: 300,
    inventory: [],
    horses: [],
    stats: { totalRaces: 0, wins: 0, losses: 0 }
  }
};
```

### 8.2 保存/加载函数
```javascript
function saveGame() {
  const saveData = {
    version: '1.0.0',
    timestamp: Date.now(),
    player: GameState.player
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    GameState.player = data.player;
    return true;
  }
  return false;
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  GameState.player = createNewPlayer();
  saveGame();
}
```

---

## 9. 性能优化

### 9.1 渲染优化
- 使用 CSS `transform` 代替 `top/left` 定位
- 使用 `requestAnimationFrame` 进行动画
- 减少重绘和回流
- 使用 `will-change` 提示浏览器优化

### 9.2 数据结构优化
- 使用对象存储部件，快速查找
- 使用数组存储马匹，便于遍历
- 缓存计算结果（如总属性）

### 9.3 事件处理优化
- 事件委托处理列表点击
- 防抖处理频繁操作
- 移除不需要的事件监听

---

## 10. 错误处理

### 10.1 异常捕获
```javascript
try {
  purchaseItem(itemId);
  showNotification('购买成功！', 'success');
} catch (error) {
  console.error('购买失败:', error);
  showNotification('购买失败：' + error.message, 'error');
}
```

### 10.2 边界检查
```javascript
function canStartRace() {
  if (GameState.player.gold < SHOP_CONFIG.entryFee) {
    showNotification('金币不足，无法参加比赛', 'error');
    return false;
  }
  if (GameState.player.horses.length === 0) {
    showNotification('没有可参赛的马匹', 'error');
    return false;
  }
  return true;
}
```

---

## 11. 文件结构

```
田忌赛马/
├── index.html           # 主页面文件
├── style.css            # 样式文件
├── game.js              # 游戏逻辑文件
└── README.md            # 说明文档
```

所有文件均为单文件结构，便于部署和维护。

---

## 12. 开发规范

### 12.1 代码风格
- 使用 ES6+ 语法
- 变量命名：camelCase
- 常量命名：UPPER_SNAKE_CASE
- 函数命名：camelCase，动词开头
- 类命名：PascalCase

### 12.2 注释规范
```javascript
/**
 * 函数描述
 * @param {类型} 参数名 - 参数描述
 * @returns {类型} 返回值描述
 */
function functionName(param) {
  // 单行注释
  return result;
}
```

### 12.3 模块组织
```javascript
// IIFE 模式，避免全局污染
(function() {
  'use strict';
  
  // 私有变量
  let privateVar = 'private';
  
  // 公开API
  window.GameAPI = {
    init: init,
    save: saveGame,
    load: loadGame
  };
  
})();
```

---

## 13. 兼容性考虑

### 13.1 浏览器支持
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 13.2 响应式断点
```css
/* 移动设备优先 */
/* 默认：320px - 767px */

/* 平板设备 */
@media (min-width: 768px) {
  /* 平板样式 */
}

/* 桌面设备 */
@media (min-width: 1024px) {
  /* 桌面样式 */
}
```

### 13.3 触摸优化
- 按钮最小尺寸 48px × 48px
- 适当的手指间距
- 触摸事件替代点击事件（移动端）
- 禁用双击缩放

---

## 14. 安全性考虑

### 14.1 数据验证
```javascript
function validatePurchase(itemId) {
  const item = shop.items.find(i => i.id === itemId);
  if (!item) throw new Error('商品不存在');
  if (GameState.player.gold < item.price) throw new Error('金币不足');
  return true;
}
```

### 14.2 LocalStorage 安全
- 不存储敏感信息
- 数据版本控制，便于迁移
- 异常捕获防止存储失败

---

本技术架构文档为"田忌赛马"游戏提供了完整的技术指导和实现规范，确保开发过程的一致性和代码质量。

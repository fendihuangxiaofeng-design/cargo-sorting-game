const SpriteLoader = (function() {
    let config = null;
    const loadedSprites = {};
    
    async function loadConfig() {
        try {
            const response = await fetch('./assets/sprite_config.json');
            config = await response.json();
            return config;
        } catch (error) {
            console.error('Failed to load sprite config:', error);
            return null;
        }
    }
    
    async function loadSprite(key) {
        if (!config) {
            console.error('Sprite config not loaded');
            return null;
        }
        
        const category = getCategoryForKey(key);
        if (!category || !config[category]) {
            console.error(`Category not found for key: ${key}`);
            return null;
        }
        
        const path = config[category][key];
        if (!path) {
            console.error(`Sprite path not found for key: ${key}`);
            return null;
        }
        
        const fullPath = config.texturePath + path;
        
        if (loadedSprites[key]) {
            return loadedSprites[key];
        }
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                loadedSprites[key] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to load sprite: ${fullPath}`);
                loadedSprites[key] = null;
                resolve(null);
            };
            img.src = fullPath;
        });
    }
    
    function getCategoryForKey(key) {
        if (key.startsWith('main_')) return 'ui';
        if (key.startsWith('barn_')) {
            if (key.startsWith('barn_part_')) return 'parts';
            return 'ui';
        }
        if (key.startsWith('button_')) return 'ui';
        if (key.startsWith('title_')) return 'ui';
        if (key.startsWith('text_')) return 'ui';
        if (key === 'gold_bar' || key === 'status_bar' || key === 'grass_decoration' || key === 'corner_dot') return 'ui';
        if (key.startsWith('icon_')) return 'icons';
        if (key.startsWith('bg_')) return 'backgrounds';
        if (key.startsWith('horse_')) return 'characters';
        return null;
    }
    
    function applySpriteToElement(element, spriteKey) {
        const img = loadedSprites[spriteKey];
        if (img) {
            if (element.tagName === 'IMG') {
                element.src = img.src;
            } else {
                element.style.backgroundImage = `url(${img.src})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundPosition = 'center';
            }
        }
    }
    
    async function loadAllSprites() {
        const cfg = await loadConfig();
        if (!cfg) return;
        
        Object.assign(config, cfg);
        
        const allKeys = [];
        
        if (config.ui) {
            Object.keys(config.ui).forEach(key => allKeys.push({ key, category: 'ui' }));
        }
        if (config.icons) {
            Object.keys(config.icons).forEach(key => allKeys.push({ key, category: 'icons' }));
        }
        if (config.backgrounds) {
            Object.keys(config.backgrounds).forEach(key => allKeys.push({ key, category: 'backgrounds' }));
        }
        if (config.characters) {
            Object.keys(config.characters).forEach(key => allKeys.push({ key, category: 'characters' }));
        }
        if (config.parts) {
            Object.keys(config.parts).forEach(key => allKeys.push({ key, category: 'parts' }));
        }
        
        await Promise.all(allKeys.map(item => {
            const path = config[item.category][item.key];
            const fullPath = config.texturePath + path;
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedSprites[item.key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to preload sprite: ${fullPath}`);
                    loadedSprites[item.key] = null;
                    resolve();
                };
                img.src = fullPath;
            });
        }));
        
        document.querySelectorAll('[data-sprite]').forEach(element => {
            const spriteKey = element.dataset.sprite;
            applySpriteToElement(element, spriteKey);
        });
    }
    
    return {
        loadConfig,
        loadSprite,
        applySpriteToElement,
        loadAllSprites,
        get loadedSprites() { return loadedSprites; },
        get config() { return config; }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    SpriteLoader.loadAllSprites();
});
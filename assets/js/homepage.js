// 首页脚本

// 加载特色游戏
async function loadFeaturedGames() {
    try {
        // 加载游戏数据
        const response = await fetch('data/games.json');
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        
        const games = await response.json();
        
        // 过滤出特色游戏
        const featuredGames = games.filter(game => game.featured);
        
        const featuredContainer = document.getElementById('featured-games');
        if (!featuredContainer) {
            console.error('Featured games container not found');
            return;
        }
        
        if (featuredGames.length === 0) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center py-8">No featured games available</div>';
            return;
        }
        
        let html = '';
        featuredGames.forEach(game => {
            html += `
            <div class="arcade-cabinet" data-game-id="${game.id}">
                <div class="cabinet-screen">
                    <img 
                        src="${game.thumbnail}" 
                        alt="${game.title}"
                        loading="lazy"
                    >
                    <button class="play-btn" data-game-slug="${game.slug}">PLAY NOW</button>
                </div>
                <div class="cabinet-title neon-text">${game.title}</div>
                <div class="cabinet-controls">
                    <div class="control-btn red"></div>
                    <div class="control-btn blue"></div>
                    <div class="control-btn green"></div>
                    <div class="control-btn yellow"></div>
                </div>
            </div>
            `;
        });
        
        featuredContainer.innerHTML = html;
        
        // 添加游戏卡片点击事件
        addGameCardEvents();
        
        // 触发游戏加载完成事件
        document.dispatchEvent(new CustomEvent('gamesLoaded'));
        
    } catch (error) {
        console.error('Error loading featured games:', error);
        const featuredContainer = document.getElementById('featured-games');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">Failed to load games. Please try again later.</div>';
        }
    }
}

// 加载分类游戏
async function loadCategoryGames() {
    try {
        // 加载游戏数据
        const response = await fetch('data/games.json');
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        
        const games = await response.json();
        
        // 获取所有分类容器
        const categoryRows = document.querySelectorAll('.category-row');
        
        categoryRows.forEach(row => {
            const categoryTitle = row.querySelector('.category-title').textContent.trim().toLowerCase();
            const category = categoryTitle.split(' ')[0].toLowerCase();
            
            // 过滤该分类的游戏
            const categoryGames = games.filter(game => game.category.toLowerCase() === category);
            
            const gamesContainer = row.querySelector('.arcade-machines');
            if (!gamesContainer) {
                console.error(`Games container for ${category} not found`);
                return;
            }
            
            if (categoryGames.length === 0) {
                gamesContainer.innerHTML = '<div class="col-span-full text-center py-4">No games available in this category</div>';
                return;
            }
            
            // 只显示前3个游戏
            const displayGames = categoryGames.slice(0, 3);
            
            let html = '';
            displayGames.forEach(game => {
                html += `
                <div class="arcade-cabinet" data-game-id="${game.id}">
                    <div class="cabinet-screen">
                        <img 
                            src="${game.thumbnail}" 
                            alt="${game.title}"
                            loading="lazy"
                        >
                        <button class="play-btn" data-game-slug="${game.slug}">PLAY NOW</button>
                    </div>
                    <div class="cabinet-title neon-text">${game.title}</div>
                    <div class="cabinet-controls">
                        <div class="control-btn red"></div>
                        <div class="control-btn blue"></div>
                        <div class="control-btn green"></div>
                        <div class="control-btn yellow"></div>
                    </div>
                </div>
                `;
            });
            
            gamesContainer.innerHTML = html;
        });
        
        // 添加游戏卡片点击事件
        addGameCardEvents();
        
    } catch (error) {
        console.error('Error loading category games:', error);
        const categoryContainers = document.querySelectorAll('.arcade-machines');
        categoryContainers.forEach(container => {
            container.innerHTML = '<div class="col-span-full text-center py-4 text-red-500">Failed to load games. Please try again later.</div>';
        });
    }
}

// 添加游戏卡片点击事件
function addGameCardEvents() {
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const gameSlug = this.getAttribute('data-game-slug');
            // 播放按钮音效
            const buttonSound = document.getElementById('button-sound');
            if (buttonSound) {
                buttonSound.currentTime = 0;
                buttonSound.play();
            }
            // 跳转到游戏页面
            window.location.href = `games/${gameSlug}.html`;
        });
    });
}

// 投币效果增强
function setupCoinSlot() {
    const insertCoinBtn = document.querySelector('.insert-coin-btn');
    const coinCounter = document.querySelector('.coin-counter');
    
    if (insertCoinBtn && coinCounter) {
        insertCoinBtn.addEventListener('click', function() {
            // 播放投币音效
            const coinSound = document.getElementById('coin-sound');
            if (coinSound) {
                coinSound.currentTime = 0;
                coinSound.play();
            }
            
            // 更新硬币数量
            let credits = parseInt(coinCounter.textContent.split(':')[1].trim()) || 0;
            credits += 1;
            coinCounter.textContent = `CREDITS: ${credits}`;
            
            // 保存到本地存储
            localStorage.setItem('arcadeCredits', credits);
            
            // 如果是首次投币，滚动到游戏区域
            if (credits === 1) {
                setTimeout(() => {
                    window.scrollTo({
                        top: document.querySelector('.game-categories').offsetTop,
                        behavior: 'smooth'
                    });
                }, 1000);
            }
        });
    }
    
    // 从本地存储加载硬币数量
    if (coinCounter) {
        const savedCredits = localStorage.getItem('arcadeCredits') || 0;
        coinCounter.textContent = `CREDITS: ${savedCredits}`;
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载特色游戏
    loadFeaturedGames();
    
    // 加载分类游戏
    loadCategoryGames();
    
    // 设置投币功能
    setupCoinSlot();
    
    // 欢迎屏幕效果
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        // 检查是否有硬币
        const credits = parseInt(localStorage.getItem('arcadeCredits')) || 0;
        if (credits > 0) {
            // 已有硬币，显示欢迎信息
            welcomeScreen.querySelector('.neon-text.blink').style.display = 'none';
        }
        
        // 点击欢迎屏幕
        welcomeScreen.addEventListener('click', function() {
            // 检查是否有硬币
            const credits = parseInt(localStorage.getItem('arcadeCredits')) || 0;
            if (credits === 0) {
                // 没有硬币，提示投币
                const insertCoinBtn = document.querySelector('.insert-coin-btn');
                if (insertCoinBtn) {
                    insertCoinBtn.classList.add('highlight');
                    setTimeout(() => {
                        insertCoinBtn.classList.remove('highlight');
                    }, 1000);
                }
            } else {
                // 有硬币，滚动到游戏区域
                window.scrollTo({
                    top: document.querySelector('.game-categories').offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});
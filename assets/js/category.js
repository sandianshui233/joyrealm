// 分类页面脚本

// 加载分类游戏
async function loadCategoryGames() {
    try {
        // 获取当前分类
        const currentPath = window.location.pathname;
        const categorySlug = currentPath.split('/').pop().replace('.html', '');
        
        // 加载所有游戏
        const response = await fetch('../data/games.json');
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        
        const games = await response.json();
        
        // 过滤当前分类的游戏
        const categoryGames = games.filter(game => game.category === categorySlug);
        
        const gamesContainer = document.getElementById('category-games');
        if (!gamesContainer) {
            console.error('Category games container not found');
            return;
        }
        
        if (categoryGames.length === 0) {
            gamesContainer.innerHTML = '<div class="col-span-full text-center py-8">No games available in this category</div>';
            return;
        }
        
        let html = '';
        categoryGames.forEach(game => {
            html += `
            <div class="arcade-cabinet" data-game-id="${game.id}">
                <div class="cabinet-screen">
                    <img 
                        src="../${game.thumbnail}" 
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
        
        // 添加游戏卡片点击事件
        addGameCardEvents();
        
    } catch (error) {
        console.error('Error loading category games:', error);
        const gamesContainer = document.getElementById('category-games');
        if (gamesContainer) {
            gamesContainer.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">Failed to load games. Please try again later.</div>';
        }
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
            window.location.href = `../games/${gameSlug}.html`;
        });
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载分类游戏
    loadCategoryGames();
    
    // 投币按钮事件
    const insertCoinBtn = document.querySelector('.insert-coin-btn');
    if (insertCoinBtn) {
        insertCoinBtn.addEventListener('click', function() {
            // 播放投币音效
            const coinSound = document.getElementById('coin-sound');
            if (coinSound) {
                coinSound.currentTime = 0;
                coinSound.play();
            }
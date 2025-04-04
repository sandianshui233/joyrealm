// 分类页面脚本

// 全局变量，用于跟踪是否已加载游戏
let gamesLoaded = false;

// 加载分类游戏
async function loadCategoryGames() {
    // 如果已经加载过游戏，则不再重复加载
    if (gamesLoaded) {
        return;
    }
    
    try {
        // 获取当前分类
        const currentPath = window.location.pathname;
        const categorySlug = currentPath.split('/').pop().replace('.html', '');
        
        // 加载分类特定的游戏
        const response = await fetch('../data/categories/' + categorySlug + '.json');
        if (!response.ok) {
            // 如果特定分类的JSON不存在，尝试加载所有游戏
            const allGamesResponse = await fetch('../data/games.json');
            if (!allGamesResponse.ok) {
                throw new Error('Failed to load game data');
            }
            
            const games = await allGamesResponse.json();
            // 过滤当前分类的游戏
            const categoryGames = games.filter(game => game.category === categorySlug);
            displayGames(categoryGames);
        } else {
            // 直接使用分类特定的JSON
            const categoryGames = await response.json();
            displayGames(categoryGames);
        }
        
        // 标记游戏已加载
        gamesLoaded = true;
    } catch (error) {
        console.error('Error loading category games:', error);
        const gamesContainer = document.getElementById('category-games');
        if (gamesContainer) {
            gamesContainer.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">加载游戏失败。请稍后再试。</div>';
        }
    }
}

// 分离显示游戏的逻辑到单独的函数
function displayGames(categoryGames) {
    const gamesContainer = document.getElementById('category-games');
    if (!gamesContainer) {
        console.error('Category games container not found');
        return;
    }
    
    // 清空容器，确保不会重复添加游戏卡片
    gamesContainer.innerHTML = '';
    
    if (categoryGames.length === 0) {
        gamesContainer.innerHTML = '<div class="col-span-full text-center py-8">该分类暂无游戏</div>';
        return;
    }
    
    let html = '';
    categoryGames.forEach(game => {
        // 确保图片路径正确
        const thumbnailPath = game.thumbnail.startsWith('/') ? game.thumbnail.substring(1) : game.thumbnail;
        
        html += `
        <div class="arcade-cabinet" data-game-id="${game.id}">
            <div class="cabinet-screen">
                <img 
                    src="../${thumbnailPath}" 
                    alt="${game.title}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='../assets/images/placeholder.jpg';"
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
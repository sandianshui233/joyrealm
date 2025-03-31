// 首页游戏展示
async function loadFeaturedGames() {
    try {
        // 使用相对路径
        const response = await fetch('./data/games.json');
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        const games = await response.json();
        
        const featuredContainer = document.getElementById('featured-games');
        if (!featuredContainer) {
            console.error('Featured games container not found');
            return;
        }
        
        console.log('Successfully loaded game data:', games);
        
        if (games.length === 0) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center py-8">No games available</div>';
            return;
        }
        
        let html = '';
        // 生成街机柜风格的游戏卡片
        games.forEach(game => {
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
        
        // 游戏加载完成后触发事件
        featuredContainer.innerHTML = html;
        console.log('Game cards rendered');
        
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

// 添加游戏卡片点击事件
function addGameCardEvents() {
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const gameSlug = this.getAttribute('data-game-slug');
            // 播放按钮音效
            playButtonSound();
            // 跳转到游戏页面
            window.location.href = `./games/${gameSlug}.html`;
        });
    });
}

// 按钮音效
function playButtonSound() {
    const buttonSound = document.getElementById('button-sound');
    if (buttonSound) {
        buttonSound.currentTime = 0;
        buttonSound.play();
    }
}

// 投币音效
function playCoinSound() {
    const coinSound = document.getElementById('coin-sound');
    if (coinSound) {
        coinSound.currentTime = 0;
        coinSound.play();
    }
}

// 页面加载完成后执行
console.log('homepage.js loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting to load games');
    loadFeaturedGames();
    
    // 投币按钮事件
    const insertCoinBtn = document.querySelector('.insert-coin-btn');
    if (insertCoinBtn) {
        insertCoinBtn.addEventListener('click', function() {
            playCoinSound();
            const coinCounter = document.querySelector('.coin-counter');
            if (coinCounter) {
                // 增加投币数
                const currentCredits = parseInt(coinCounter.textContent.split(':')[1].trim()) || 0;
                coinCounter.textContent = `CREDITS: ${currentCredits + 1}`;
            }
            
            // 滚动到游戏区域
            const featuredGames = document.querySelector('.popular-games');
            if (featuredGames) {
                featuredGames.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
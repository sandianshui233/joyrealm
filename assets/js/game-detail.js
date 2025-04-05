// 游戏详情页脚本

// 全局变量，防止重复加载
let relatedGamesLoaded = false;

// 加载相关游戏
async function loadRelatedGames() {
    // 如果已经加载过，则不再重复加载
    if (relatedGamesLoaded) {
        console.log("相关游戏已加载，跳过");
        return;
    }
    
    try {
        // 获取当前游戏slug
        const currentPath = window.location.pathname;
        const currentSlug = currentPath.split('/').pop().replace('.html', '');
        
        // 获取当前游戏类别
        const gameCategory = document.querySelector('.meta-value').textContent;
        
        // 加载所有游戏
        const response = await fetch('../data/games.json');
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        
        const games = await response.json();
        
        // 过滤出相关游戏（同类别，但不是当前游戏）
        const relatedGames = games
            .filter(game => game.category === gameCategory && game.slug !== currentSlug)
            .slice(0, 3); // 最多显示3个相关游戏
        
        const relatedContainer = document.querySelector('.related-games-grid');
        if (!relatedContainer) {
            console.error('Related games container not found');
            return;
        }
        
        // 清空容器，确保不会重复添加
        relatedContainer.innerHTML = '';
        
        if (relatedGames.length === 0) {
            relatedContainer.innerHTML = '<p class="text-center py-4">No related games found</p>';
            return;
        }
        
        let html = '';
        relatedGames.forEach(game => {
            html += `
            <div class="related-game-card">
                <a href="../games/${game.slug}.html" class="related-game-link">
                    <div class="related-game-img">
                        <img src="../${game.thumbnail}" alt="${game.title}" loading="lazy">
                    </div>
                    <div class="related-game-info">
                        <h3 class="related-game-title">${game.title}</h3>
                        <p class="related-game-category">${game.category}</p>
                    </div>
                </a>
            </div>
            `;
        });
        
        relatedContainer.innerHTML = html;
        
        // 标记已加载
        relatedGamesLoaded = true;
    } catch (error) {
        console.error('Error loading related games:', error);
        const relatedContainer = document.querySelector('.related-games-grid');
        if (relatedContainer) {
            relatedContainer.innerHTML = '<p class="text-center py-4 text-red-500">Failed to load related games</p>';
        }
    }
}

// 确保DOM加载完成后再执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏懒加载
    if (typeof setupGameLazyLoading === 'function') {
        setupGameLazyLoading();
    }
    
    // 加载相关游戏
    loadRelatedGames();
    
    // 添加投币按钮事件
    const insertCoinBtn = document.getElementById('insert-coin-game');
    if (insertCoinBtn) {
        insertCoinBtn.addEventListener('click', function() {
            const coinSound = document.getElementById('coin-sound');
            if (coinSound) {
                coinSound.currentTime = 0;
                coinSound.play();
            }
            
            // 增加信用点数
            const creditCounter = document.querySelector('.coin-counter');
            if (creditCounter) {
                const currentCredits = parseInt(creditCounter.textContent.replace('CREDITS: ', ''));
                creditCounter.textContent = `CREDITS: ${currentCredits + 1}`;
            }
        });
    }
});

// 街机控制互动效果
function setupArcadeControls() {
    // 摇杆效果
    const joystickStick = document.querySelector('.joystick-stick');
    if (joystickStick) {
        document.addEventListener('keydown', function(e) {
            // 方向键控制摇杆
            switch(e.key) {
                case 'ArrowUp':
                    joystickStick.style.transform = 'translateY(-5px) rotate(-10deg)';
                    break;
                case 'ArrowDown':
                    joystickStick.style.transform = 'translateY(5px) rotate(10deg)';
                    break;
                case 'ArrowLeft':
                    joystickStick.style.transform = 'translateX(-5px) rotate(-20deg)';
                    break;
                case 'ArrowRight':
                    joystickStick.style.transform = 'translateX(5px) rotate(20deg)';
                    break;
            }
        });
        
        document.addEventListener('keyup', function() {
            joystickStick.style.transform = 'none';
        });
    }
    
    // 按钮效果
    const controlButtons = document.querySelectorAll('.control-btn');
    if (controlButtons.length > 0) {
        document.addEventListener('keydown', function(e) {
            // ZXCV键控制按钮
            switch(e.key.toLowerCase()) {
                case 'z':
                    controlButtons[0].style.transform = 'scale(0.9)';
                    break;
                case 'x':
                    controlButtons[1].style.transform = 'scale(0.9)';
                    break;
                case 'c':
                    controlButtons[2].style.transform = 'scale(0.9)';
                    break;
                case 'v':
                    controlButtons[3].style.transform = 'scale(0.9)';
                    break;
            }
        });
        
        document.addEventListener('keyup', function() {
            controlButtons.forEach(btn => {
                btn.style.transform = 'none';
            });
        });
    }
    
    // 投币按钮
    const insertCoinBtn = document.getElementById('insert-coin-game');
    if (insertCoinBtn) {
        insertCoinBtn.addEventListener('click', function() {
            // 播放投币音效
            const coinSound = document.getElementById('coin-sound');
            if (coinSound) {
                coinSound.currentTime = 0;
                coinSound.play();
            }
            
            // 触发游戏加载
            const loadGameBtn = document.querySelector('.load-game-btn');
            if (loadGameBtn) {
                loadGameBtn.click();
            }
        });
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载相关游戏
    loadRelatedGames();
    
    // 设置街机控制互动
    setupArcadeControls();
});
// 复古街机效果

// 街机特效脚本

// CRT屏幕开关效果
function crtToggleEffect() {
    const body = document.body;
    body.classList.add('crt-off');
    setTimeout(() => {
        body.classList.remove('crt-off');
    }, 100);
}

// 霓虹灯闪烁效果
function setupNeonFlicker() {
    const neonElements = document.querySelectorAll('.neon-text, .neon-yellow, .neon-pink, .neon-blue, .neon-green');
    
    neonElements.forEach(el => {
        // 随机闪烁
        if (Math.random() > 0.9) {
            el.classList.add('flicker');
            setTimeout(() => {
                el.classList.remove('flicker');
            }, 200 + Math.random() * 500);
        }
    });
    
    // 定期调用
    setTimeout(setupNeonFlicker, 2000);
}

// 添加CSS类
function addArcadeStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .crt-off {
            opacity: 0.8;
            filter: brightness(0.8) contrast(1.2);
            transition: all 0.1s;
        }
        
        .flicker {
            opacity: 0.7;
            transition: opacity 0.1s;
        }
        
        @keyframes scanline {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(100vh);
            }
        }
        
        .scanline {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 999;
            animation: scanline 8s linear infinite;
            pointer-events: none;
        }
    `;
    document.head.appendChild(styleEl);
    
    // 添加扫描线
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    document.body.appendChild(scanline);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加样式
    addArcadeStyles();
    
    // CRT开机效果
    crtToggleEffect();
    
    // 启动霓虹灯闪烁
    setupNeonFlicker();
    
    // 为所有按钮添加音效
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            const buttonSound = document.getElementById('button-sound');
            if (buttonSound && typeof playButtonSound === 'function') {
                playButtonSound();
            }
        }
    });
});

// 投币音效
function playCoinSound() {
    const coinSound = new Audio('assets/sounds/coin.mp3');
    coinSound.play();
}

// 按钮点击音效
function playButtonSound() {
    const buttonSound = new Audio('assets/sounds/button-press.mp3');
    buttonSound.play();
}

// 初始化街机效果
document.addEventListener('DOMContentLoaded', function() {
    // 添加CRT开机效果
    crtToggleEffect();
    
    // 为所有像素按钮添加音效
    const pixelButtons = document.querySelectorAll('.pixel-btn');
    pixelButtons.forEach(button => {
        button.addEventListener('click', function() {
            playButtonSound();
        });
    });
    
    // 投币效果
    const insertCoin = document.querySelector('.insert-coin');
    if (insertCoin) {
        insertCoin.addEventListener('click', function() {
            playCoinSound();
            this.textContent = "CREDIT: 1";
            setTimeout(() => {
                // 模拟游戏开始
                window.scrollTo({
                    top: document.querySelector('#featured-games').offsetTop,
                    behavior: 'smooth'
                });
            }, 1000);
        });
    }
    
    // 修改游戏卡片样式
    function updateGameCards() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.classList.add('arcade-cabinet');
        });
    }
    
    // 监听游戏卡片加载完成
    document.addEventListener('gamesLoaded', updateGameCards);
});


// 添加更多音效函数
function playGameStartSound() {
    const gameStartSound = document.getElementById('game-start-sound');
    if (gameStartSound) {
        gameStartSound.currentTime = 0;
        gameStartSound.play();
    }
}

function playGameOverSound() {
    const gameOverSound = document.getElementById('game-over-sound');
    if (gameOverSound) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }
}
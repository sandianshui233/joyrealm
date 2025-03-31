// 复古街机效果

// CRT屏幕开关效果
function crtToggleEffect() {
    const body = document.body;
    body.classList.add('crt-off');
    setTimeout(() => {
        body.classList.remove('crt-off');
    }, 100);
}

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
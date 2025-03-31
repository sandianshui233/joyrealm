// 游戏iframe懒加载
function setupGameLazyLoading() {
  // 获取游戏iframe容器
  const gameFrame = document.querySelector('.game-frame');
  if (!gameFrame) return;
  
  // 创建占位内容
  const placeholder = document.createElement('div');
  placeholder.className = 'game-placeholder';
  placeholder.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full">
      <div class="insert-coin mb-4">INSERT COIN TO PLAY</div>
      <button class="pixel-btn load-game-btn">START GAME</button>
    </div>
  `;
  
  // 获取iframe的src
  const iframe = gameFrame.querySelector('iframe');
  const originalSrc = iframe.src;
  
  // 清空iframe的src
  iframe.src = '';
  
  // 添加占位内容
  gameFrame.appendChild(placeholder);
  
  // 点击开始游戏按钮加载iframe
  const loadGameBtn = placeholder.querySelector('.load-game-btn');
  loadGameBtn.addEventListener('click', function() {
    // 播放投币音效
    if (typeof playCoinSound === 'function') {
      playCoinSound();
    }
    
    // 显示加载动画
    placeholder.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full">
        <div class="loading-text">LOADING...</div>
        <div class="loading-bar"></div>
      </div>
    `;
    
    // 延迟加载iframe，模拟游戏加载
    setTimeout(() => {
      iframe.src = originalSrc;
      
      // iframe加载完成后移除占位内容
      iframe.onload = function() {
        if (placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
      };
    }, 1500);
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  setupGameLazyLoading();
});
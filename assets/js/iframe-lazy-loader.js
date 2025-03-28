// iframe懒加载实现
function initIframeLazyLoading() {
    // 获取所有带有data-src属性的iframe占位符
    const placeholders = document.querySelectorAll('.game-placeholder');
    
    if (placeholders.length === 0) {
        console.log('未找到游戏占位符，尝试创建iframe');
        createGameIframe();
        return;
    }
    
    placeholders.forEach(placeholder => {
        const loadButton = placeholder.querySelector('.load-game-btn');
        const iframeSrc = placeholder.dataset.src;
        
        if (loadButton) {
            loadButton.addEventListener('click', function() {
                // 创建iframe并替换占位符
                const iframe = document.createElement('iframe');
                iframe.src = iframeSrc;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                
                // 替换占位符内容
                placeholder.innerHTML = '';
                placeholder.appendChild(iframe);
                placeholder.classList.add('game-loaded');
            });
        } else if (iframeSrc) {
            // 如果没有加载按钮但有src，自动加载iframe
            console.log('自动加载游戏:', iframeSrc);
            setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.src = iframeSrc;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                
                // 替换占位符内容
                placeholder.innerHTML = '';
                placeholder.appendChild(iframe);
                placeholder.classList.add('game-loaded');
            }, 1000); // 延迟1秒加载，给页面其他元素加载的时间
        }
        
        // 处理外部链接按钮
        const externalLinks = placeholder.querySelectorAll('a[href]');
        externalLinks.forEach(link => {
            // 确保链接有正确的target属性
            if (!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
        });
    });
}

// 创建游戏iframe的备用方法
function createGameIframe() {
    const gameFrames = document.querySelectorAll('.game-frame');
    
    gameFrames.forEach(frame => {
        // 检查是否已经有iframe
        if (frame.querySelector('iframe')) {
            console.log('游戏框架已有iframe，跳过');
            return;
        }
        
        // 创建新的iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://itch.io/embed-upload/11407110?color=333333';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        
        // 清空并添加iframe
        frame.innerHTML = '';
        frame.appendChild(iframe);
        console.log('已创建游戏iframe');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化iframe懒加载');
    initIframeLazyLoading();
});

// 如果DOMContentLoaded已经触发，立即执行
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('页面已加载，立即初始化iframe懒加载');
    initIframeLazyLoading();
}
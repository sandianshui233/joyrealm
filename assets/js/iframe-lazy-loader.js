// iframe懒加载实现
function initIframeLazyLoading() {
    // 获取所有带有data-src属性的iframe占位符
    const placeholders = document.querySelectorAll('.game-placeholder');
    
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initIframeLazyLoading();
});
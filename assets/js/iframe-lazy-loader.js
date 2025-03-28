// iframe懒加载实现
function initIframeLazyLoading() {
    console.log('初始化iframe懒加载...');
    
    // 检查页面上是否已经有iframe
    const existingIframes = document.querySelectorAll('iframe');
    if (existingIframes.length > 0) {
        console.log('页面已存在iframe，跳过懒加载');
        return;
    }
    
    // 获取所有带有data-src属性的iframe占位符
    const placeholders = document.querySelectorAll('.game-placeholder');
    console.log('找到占位符数量:', placeholders.length);
    
    // 如果没有找到占位符，直接返回，不尝试创建iframe
    if (placeholders.length === 0) {
        console.log('未找到游戏占位符，跳过懒加载');
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
                console.log('游戏已加载:', iframeSrc);
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

// 示例：在游戏列表页面中启用懒加载
<script src="../assets/js/iframe-lazy-loader.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // 只在游戏列表页面调用懒加载
        if (window.location.pathname.includes('/categories/')) {
            initIframeLazyLoading();
        }
    });
</script>
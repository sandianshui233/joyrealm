// 组件加载函数
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('找不到元素:', elementId);
        return;
    }
    
    // 获取当前页面的路径深度，调整组件路径
    const pathPrefix = getPathPrefix();
    const fullPath = pathPrefix + componentPath;
    
    fetch(fullPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            console.log('成功加载组件:', fullPath);
        })
        .catch(error => {
            console.error('加载组件失败:', fullPath, error);
            // 加载失败时显示错误信息
            element.innerHTML = `<div class="text-red-500">组件加载失败: ${fullPath}</div>`;
        });
}

// 根据当前页面URL确定路径前缀
function getPathPrefix() {
    const path = window.location.pathname;
    // 如果在子目录中，需要返回到根目录
    if (path.includes('/games/') || path.includes('/categories/')) {
        return '../';
    }
    return '';
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始加载组件');
    // 加载页头
    loadComponent('header-container', 'assets/components/header.html');
    // 加载页脚
    loadComponent('footer-container', 'assets/components/footer.html');
});
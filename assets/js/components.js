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
    
    console.log('尝试加载组件:', fullPath, '对应元素:', elementId);
    
    fetch(fullPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`网络响应不正常: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            console.log('成功加载组件:', fullPath);
            // 触发一个自定义事件，表示组件已加载
            const event = new CustomEvent('componentLoaded', { detail: { id: elementId, path: fullPath } });
            document.dispatchEvent(event);
        })
        .catch(error => {
            console.error('加载组件失败:', fullPath, error);
            // 加载失败时显示错误信息
            element.innerHTML = `<div class="text-red-500">组件加载失败: ${fullPath}<br>错误: ${error.message}</div>`;
        });
}

// 根据当前页面URL确定路径前缀
function getPathPrefix() {
    const path = window.location.pathname;
    console.log('当前页面路径:', path);
    
    // 使用绝对路径而不是相对路径
    if (path.includes('/games/') || path.includes('/categories/')) {
        return '/';  // 使用网站根目录的绝对路径
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
    
    // 移除底部可能多余的框（如果您确定它是多余的）
    // 注意：请根据实际情况修改选择器
    const extraBoxes = document.querySelectorAll('.ad-container.ad-sticky-bottom');
    if (extraBoxes.length > 0) {
        console.log('发现可能多余的广告容器，数量:', extraBoxes.length);
        // 如果确定要移除，取消下面这行的注释
        // extraBoxes.forEach(box => box.style.display = 'none');
    }
});
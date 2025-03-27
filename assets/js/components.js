// 组件加载函数
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    fetch(componentPath)
        .then(response => response.text())
        .then(html => {
            element.innerHTML = html;
        })
        .catch(error => console.error('加载组件失败:', error));
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载页头
    loadComponent('header-container', '/assets/components/header.html');
    // 加载页脚
    loadComponent('footer-container', '/assets/components/footer.html');
});
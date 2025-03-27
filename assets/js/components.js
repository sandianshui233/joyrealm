// 组件加载函数
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('找不到元素:', elementId);
        return;
    }
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            console.log('成功加载组件:', componentPath);
        })
        .catch(error => {
            console.error('加载组件失败:', componentPath, error);
            // 加载失败时显示错误信息
            element.innerHTML = `<div class="text-red-500">组件加载失败: ${componentPath}</div>`;
        });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始加载组件');
    // 加载页头
    loadComponent('header-container', 'assets/components/header.html');
    // 加载页脚
    loadComponent('footer-container', 'assets/components/footer.html');
});
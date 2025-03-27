// 首页游戏展示
async function loadFeaturedGames() {
    try {
        // 使用相对路径
        const response = await fetch('./data/games.json');
        if (!response.ok) {
            throw new Error('游戏数据加载失败');
        }
        const games = await response.json();
        
        const featuredContainer = document.getElementById('featured-games');
        if (!featuredContainer) {
            console.error('找不到featured-games容器');
            return;
        }
        
        console.log('成功加载游戏数据:', games);
        
        let html = '';
        games.forEach(game => {
            // 直接在这里定义createGameCard函数，不依赖外部文件
            html += `
            <div class="game-card relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 hover:z-10 group">
                <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style="filter: blur(8px);"></div>
                <div class="relative z-10 p-4 bg-black bg-opacity-80 h-full flex flex-col">
                    <a href="/games/${game.slug}.html" class="block flex-grow">
                        <div class="relative pb-[56.25%] mb-3 overflow-hidden rounded">
                            <img 
                                class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                src="${game.thumbnail}" 
                                alt="${game.title}"
                            >
                            <div class="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                                ${game.category}
                            </div>
                        </div>
                        <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-1 group-hover:from-yellow-300 group-hover:to-purple-400">${game.title}</h3>
                        <p class="text-sm text-gray-300 mb-2">${game.description}</p>
                    </a>
                    <div class="mt-auto">
                        <button class="preview-game-btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
                                data-game-id="${game.slug}"
                                data-game-title="${game.title}"
                                data-game-thumb="${game.thumbnail}"
                                data-game-desc="${game.description}">
                            预览游戏
                        </button>
                    </div>
                </div>
            </div>
            `;
        });
        
        featuredContainer.innerHTML = html;
        console.log('游戏卡片已渲染');
        
        // 初始化游戏预览功能
        initGamePreviews();
    } catch (error) {
        console.error('加载精选游戏出错:', error);
        const featuredContainer = document.getElementById('featured-games');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">加载游戏失败，请稍后再试</div>';
        }
    }
}

// 游戏预览功能
function initGamePreviews() {
    const previewButtons = document.querySelectorAll('.preview-game-btn');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const gameId = this.dataset.gameId;
            const gameTitle = this.dataset.gameTitle;
            const gameThumb = this.dataset.gameThumb;
            const gameDesc = this.dataset.gameDesc;
            
            // 创建模态预览窗口
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80';
            modal.innerHTML = `
                <div class="relative bg-gray-900 rounded-lg max-w-4xl w-full mx-4 overflow-hidden">
                    <div class="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 class="text-xl font-bold text-yellow-400">${gameTitle}</h3>
                        <button class="close-preview text-gray-400 hover:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="p-6">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="md:w-1/3">
                                <img src="${gameThumb}" alt="${gameTitle}" class="w-full rounded">
                            </div>
                            <div class="md:w-2/3">
                                <p class="text-gray-300 mb-4">${gameDesc}</p>
                                <a href="/games/${gameId}.html" class="btn-play inline-block text-center">开始游戏</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden'; // 防止背景滚动
            
            // 关闭预览
            modal.querySelector('.close-preview').addEventListener('click', function() {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            });
        });
    });
}

// 添加样式
function addCardStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .game-card:hover {
            box-shadow: 0 0 15px rgba(236, 72, 153, 0.8);
        }
    `;
    document.head.appendChild(styleEl);
}

// 页面加载完成后执行
// 添加调试信息
console.log('homepage.js 已加载');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始加载游戏');
    addCardStyles();
    loadFeaturedGames();
    
    // 检查元素是否存在
    const featuredContainer = document.getElementById('featured-games');
    console.log('featured-games容器存在:', !!featuredContainer);
});
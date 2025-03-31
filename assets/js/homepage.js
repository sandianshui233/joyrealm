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
        
        if (games.length === 0) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center py-8">暂无游戏数据</div>';
            return;
        }
        
        let html = '';
        // 修改游戏卡片生成HTML
        games.forEach(game => {
            html += `
            <div class="game-card arcade-cabinet relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 hover:z-10 group">
                <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style="filter: blur(8px);"></div>
                <div class="relative z-10 p-4 bg-black bg-opacity-80 h-full flex flex-col">
                    <a href="./games/${game.slug}.html" class="block flex-grow">
                        <div class="relative pb-[56.25%] mb-3 overflow-hidden rounded">
                            <img 
                                class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                src="${game.thumbnail}" 
                                alt="${game.title}"
                                loading="lazy"
                            >
                            <div class="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                                ${game.category}
                            </div>
                            <!-- 添加街机风格的游戏标志 -->
                            <div class="absolute top-2 left-2 bg-black bg-opacity-70 text-xs font-bold px-2 py-1 rounded">
                                <span class="text-yellow-400">GAME</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-bold neon-text mb-1">${game.title}</h3>
                        <p class="text-sm text-gray-300 mb-2">${game.description}</p>
                    </a>
                    <div class="mt-auto flex justify-between">
                        <a href="./games/${game.slug}.html" class="block w-3/4 pixel-btn text-center">
                            PLAY NOW
                        </a>
                        <button class="favorite-btn w-1/5 ml-2 pixel-btn" data-game-id="${game.id}">
                            ♥
                        </button>
                    </div>
                </div>
            </div>
            `;
        });
        
        // 游戏加载完成后触发事件
        featuredContainer.innerHTML = html;
        console.log('游戏卡片已渲染');
        // 触发游戏加载完成事件
        document.dispatchEvent(new CustomEvent('gamesLoaded'));
    } catch (error) {
        console.error('加载精选游戏出错:', error);
        const featuredContainer = document.getElementById('featured-games');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">加载游戏失败，请稍后再试</div>';
        }
    }
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
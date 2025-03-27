// 首页游戏展示
async function loadFeaturedGames() {
    try {
        const response = await fetch('/data/games.json');
        if (!response.ok) {
            throw new Error('游戏数据加载失败');
        }
        const games = await response.json();
        
        const featuredContainer = document.getElementById('featured-games');
        if (!featuredContainer) return;
        
        let html = '';
        games.forEach(game => {
            html += createGameCard(game);
        });
        
        featuredContainer.innerHTML = html;
        
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

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedGames();
});
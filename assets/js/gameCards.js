// 创建炫酷的游戏卡片
function createNeonGameCard(game) {
    return `
    <div class="game-card relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 hover:z-10 group">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style="filter: blur(8px);"></div>
        <div class="relative z-10 p-4 bg-black bg-opacity-80 h-full flex flex-col">
            <a href="/games/${game.slug}.html" class="block flex-grow">
                <div class="relative pb-[56.25%] mb-3 overflow-hidden rounded">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 animate-pulse"></div>
                    <img 
                        class="lazy-image absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        data-src="${game.thumbnail}" 
                        alt="${game.title}" 
                        src="/assets/images/placeholder.jpg"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div class="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                        ${game.category}
                    </div>
                </div>
                <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-1 group-hover:from-yellow-300 group-hover:to-purple-400">${game.title}</h3>
                <p class="text-sm text-gray-300 mb-2 line-clamp-2">${game.description}</p>
            </a>
            <div class="mt-auto">
                <button class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-glow">
                    立即游玩
                </button>
            </div>
        </div>
    </div>
    `;
}

// 添加霓虹灯效果的CSS
function addNeonStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes neon-pulse {
            0%, 100% { box-shadow: 0 0 10px rgba(123, 31, 162, 0.7), 0 0 20px rgba(123, 31, 162, 0.5); }
            50% { box-shadow: 0 0 15px rgba(123, 31, 162, 0.9), 0 0 30px rgba(123, 31, 162, 0.7); }
        }
        
        .shadow-glow {
            box-shadow: 0 0 15px rgba(236, 72, 153, 0.8), 0 0 30px rgba(236, 72, 153, 0.6);
        }
        
        .game-card:hover {
            animation: neon-pulse 2s infinite;
        }
        
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    `;
    document.head.appendChild(styleEl);
}

// 创建游戏卡片
function createGameCard(game) {
    return `
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

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    addCardStyles();
});
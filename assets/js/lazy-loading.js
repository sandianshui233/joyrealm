// 图片懒加载
function setupLazyLoading() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    // 检查WebP支持
                    if (img.dataset.srcWebp && isWebPSupported()) {
                        img.src = img.dataset.srcWebp;
                    } else {
                        img.src = src;
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 回退到简单的滚动事件监听
        const lazyLoad = function() {
            const lazyImages = document.querySelectorAll('.lazy-image');
            const scrollTop = window.pageYOffset;
            
            lazyImages.forEach(img => {
                if (img.offsetTop < window.innerHeight + scrollTop) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                }
            });
            
            if (lazyImages.length == 0) {
                document.removeEventListener('scroll', lazyLoad);
            }
        };
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
        lazyLoad();
    }
}

// 检查WebP支持
function isWebPSupported() {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

// 分页加载游戏
async function loadGamesWithPagination(containerId, category = null, page = 1, perPage = 12) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // 显示加载中
        if (page === 1) {
            container.innerHTML = '<div class="loading-container"><div class="loading-text blink">LOADING...</div></div>';
        } else {
            const loadingMore = document.createElement('div');
            loadingMore.className = 'loading-more';
            loadingMore.innerHTML = '<div class="loading-text blink">LOADING MORE...</div>';
            container.appendChild(loadingMore);
        }
        
        // 确定加载哪个数据文件
        let dataUrl = 'data/games.json';
        if (category) {
            dataUrl = `data/categories/${category}.json`;
        }
        
        // 加载游戏数据
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error('Failed to load game data');
        }
        
        const games = await response.json();
        
        // 过滤和分页
        let filteredGames = games;
        if (category) {
            filteredGames = games.filter(game => game.category === category);
        }
        
        const paginatedGames = filteredGames.slice((page - 1) * perPage, page * perPage);
        const hasMoreGames = filteredGames.length > page * perPage;
        
        // 移除加载中提示
        if (page === 1) {
            container.innerHTML = '';
        } else {
            const loadingMore = container.querySelector('.loading-more');
            if (loadingMore) {
                container.removeChild(loadingMore);
            }
        }
        
        // 添加游戏卡片
        paginatedGames.forEach(game => {
            const gameCard = createGameCard(game);
            container.appendChild(gameCard);
        });
        
        // 添加"加载更多"按钮
        if (hasMoreGames) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.textContent = 'LOAD MORE GAMES';
            loadMoreBtn.addEventListener('click', () => {
                loadGamesWithPagination(containerId, category, page + 1, perPage);
                container.removeChild(loadMoreBtn);
            });
            container.appendChild(loadMoreBtn);
        }
        
        // 设置懒加载
        setupLazyLoading();
        
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// 创建游戏卡片
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // 检查WebP支持
    const webpSupport = isWebPSupported();
    const thumbnailSrc = webpSupport && game.thumbnailWebp ? game.thumbnailWebp : game.thumbnail;
    
    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 hover:z-10 group">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style="filter: blur(8px);"></div>
            <div class="relative z-10 p-4 bg-black bg-opacity-80 h-full flex flex-col">
                <a href="/games/${game.slug}.html" class="block flex-grow">
                    <div class="relative pb-[56.25%] mb-3 overflow-hidden rounded">
                        <div class="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 animate-pulse"></div>
                        <img 
                            class="lazy-image absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            data-src="${game.thumbnail}" 
                            data-src-webp="${game.thumbnailWebp || ''}" 
                            alt="${game.title}" 
                            src="/assets/images/placeholder.jpg"
                        >
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                        <div class="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                            ${game.category}
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors duration-300">${game.title}</h3>
                </a>
                <p class="text-gray-400 text-sm mb-3 line-clamp-2">${game.description}</p>
                <a href="/games/${game.slug}.html" class="play-now-btn">PLAY NOW</a>
            </div>
        </div>
    `;
    
    return card;
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    
    // 检查页面类型并加载相应的游戏
    const featuredContainer = document.getElementById('featured-games');
    if (featuredContainer) {
        loadFeaturedGames();
    }
    
    const categoryRows = document.querySelectorAll('.category-row');
    if (categoryRows.length > 0) {
        loadCategoryGames();
    }
    
    const categoryGamesContainer = document.getElementById('category-games');
    if (categoryGamesContainer) {
        const category = document.querySelector('.category-title').textContent.trim().split(' ')[0].toLowerCase();
        loadGamesWithPagination('category-games', category);
    }
});
# 设置UTF-8编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 设置工作目录为当前目录
$workingDir = Get-Location

# 创建必要的目录
if (!(Test-Path "games")) { New-Item -ItemType Directory -Path "games" }
if (!(Test-Path "data\categories")) { New-Item -ItemType Directory -Path "data\categories" -Force }
if (!(Test-Path "categories")) { New-Item -ItemType Directory -Path "categories" }

# 读取游戏数据
$games = Get-Content "data\games.json" -Raw | ConvertFrom-Json

# 获取游戏模板
$templateContent = Get-Content "templates\game.html" -Raw

# 为每个游戏创建页面
foreach ($game in $games) {
    Write-Host "Creating page for game: $($game.title)"
    
    $gameHtml = $templateContent
    $gameHtml = $gameHtml.Replace("{{GAME_TITLE}}", $game.title)
    $gameHtml = $gameHtml.Replace("{{GAME_DESCRIPTION}}", $game.description)
    $gameHtml = $gameHtml.Replace("{{GAME_SLUG}}", $game.slug)
    $gameHtml = $gameHtml.Replace("{{GAME_EMBED_SRC}}", $game.embedSrc)
    $gameHtml = $gameHtml.Replace("{{GAME_CATEGORY}}", $game.category)
    $gameHtml = $gameHtml.Replace("{{GAME_CONTROLS}}", $game.controls)
    
    $gamePath = "games\$($game.slug).html"
    $gameHtml | Set-Content $gamePath -Encoding UTF8
    Write-Host "  Page created: $gamePath"
}

# 按分类分组游戏
$categories = $games | ForEach-Object { $_.category } | Select-Object -Unique

# 为每个分类创建JSON文件
foreach ($category in $categories) {
    Write-Host "Creating JSON for category: $category"
    
    $categoryGames = $games | Where-Object { $_.category -eq $category }
    $categoryPath = "data\categories\$category.json"
    $categoryGames | ConvertTo-Json -Depth 10 | Set-Content $categoryPath -Encoding UTF8
    Write-Host "  JSON created: $categoryPath"
    
    # 更新分类页面HTML
    $categoryHtmlPath = "categories\$category.html"
    
    # 如果分类页面不存在，创建一个基础模板
    if (!(Test-Path $categoryHtmlPath)) {
        $categoryTitle = (Get-Culture).TextInfo.ToTitleCase($category)
        $categoryDescription = "Explore our collection of $category games."
        
        if ($category -eq "action") {
            $categoryDescription = "Experience the thrill of fast-paced gameplay with our collection of action games. Test your reflexes and skills in these exciting adventures."
        } elseif ($category -eq "puzzle") {
            $categoryDescription = "Challenge your mind with our collection of puzzle games. Solve complex problems, test your logic and enjoy strategic thinking in these brain-teasing adventures."
        } elseif ($category -eq "music") {
            $categoryDescription = "Feel the rhythm and beat with our collection of music games. Move to the melody, test your timing and express yourself in these interactive musical experiences."
        }
        
        $baseTemplate = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$categoryTitle Games - JoyRealm</title>
    <meta name="description" content="Explore exciting $category games on JoyRealm">
    <link rel="canonical" href="https://joyrealm.org/categories/$category.html">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/arcade.css?v=1.0.0">
</head>

<body class="arcade-body">
    <!-- CRT屏幕效果覆盖层 -->
    <div class="crt-overlay"></div>
    
    <!-- 头部 -->
    <header class="arcade-header">
        <div class="logo-container">
            <a href="/" class="arcade-logo">
                <span class="neon-yellow">Joy</span><span class="neon-pink">Realm</span>
            </a>
        </div>
        <nav class="arcade-nav">
            <a href="/" class="nav-btn">Home</a>
            <a href="/categories/action.html" class="nav-btn$($category -eq "action" ? " active" : "")">Action</a>
            <a href="/categories/puzzle.html" class="nav-btn$($category -eq "puzzle" ? " active" : "")">Puzzle</a>
            <a href="/categories/music.html" class="nav-btn$($category -eq "music" ? " active" : "")">Music</a>
        </nav>
        <div class="coin-slot">
            <button class="insert-coin-btn">INSERT COIN</button>
            <div class="coin-counter">CREDITS: 0</div>
        </div>
    </header>
    
    <main class="arcade-hall">
        <!-- 类别标题 -->
        <section class="category-header">
            <h1 class="category-title neon-green">$categoryTitle.ToUpper() GAMES</h1>
            <p class="category-description">
                $categoryDescription
            </p>
        </section>
        
        <!-- 游戏列表 -->
        <section class="games-grid">
            <div id="category-games" class="arcade-machines category-games">
                <!-- 游戏卡片将在此处生成 -->
            </div>
        </section>
    </main>
    
    <footer class="arcade-footer">
        <div class="footer-content">
            <div class="footer-logo">
                <span class="neon-yellow">Joy</span><span class="neon-pink">Realm</span>
            </div>
            <p class="copyright">© $([DateTime]::Now.Year) Joyrealm. All rights reserved.</p>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact</a>
            </div>
        </div>
    </footer>
    
    <!-- 音效资源 -->
    <audio id="coin-sound" src="../assets/sounds/coin.mp3" preload="auto"></audio>
    <audio id="button-sound" src="../assets/sounds/button-press.mp3" preload="auto"></audio>
    
    <!-- 脚本 -->
    <script src="../assets/js/arcade-effects.js"></script>
    <script src="../assets/js/category.js"></script>
</body>
</html>
"@
        $baseTemplate | Set-Content $categoryHtmlPath -Encoding UTF8
    }
    
    # 读取分类页面
    $categoryHtml = Get-Content $categoryHtmlPath -Raw
    
    # 生成该分类的游戏卡片HTML
    $gamesHtml = ""
    foreach ($game in $categoryGames) {
        $gamesHtml += @"
                <!-- $($game.title) 游戏卡片 -->
                <div class="arcade-cabinet" data-game-id="$($game.id)">
                    <div class="cabinet-screen">
                        <img 
                            src="../$($game.thumbnail)" 
                            alt="$($game.title)"
                            loading="lazy"
                        >
                        <button class="play-btn" data-game-slug="$($game.slug)">PLAY NOW</button>
                    </div>
                    <div class="cabinet-title neon-text">$($game.title)</div>
                    <div class="cabinet-controls">
                        <div class="control-btn red"></div>
                        <div class="control-btn blue"></div>
                        <div class="control-btn green"></div>
                        <div class="control-btn yellow"></div>
                    </div>
                </div>
                
"@
    }
    
    # 移除末尾的换行和空格
    $gamesHtml = $gamesHtml.TrimEnd()
    
    # 使用正则表达式替换游戏列表部分
    $pattern = '(?s)<div id="category-games" class="arcade-machines category-games">.*?</div>'
    $replacement = "<div id=`"category-games`" class=`"arcade-machines category-games`">`n$gamesHtml`n            </div>"
    $updatedHtml = [Regex]::Replace($categoryHtml, $pattern, $replacement)
    
    # 写回分类页面
    $updatedHtml | Set-Content $categoryHtmlPath -Encoding UTF8
    Write-Host "  Category page updated: $categoryHtmlPath"
}

Write-Host "Done! All game files and category pages have been created or updated."
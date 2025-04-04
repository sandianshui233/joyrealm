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

# Google Analytics 代码
$gaCode = @"
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-B41L93ERM8"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-B41L93ERM8');
    </script>
"@

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
    
    # 检查是否已经包含GA代码
    if ($gameHtml -notmatch "G-B41L93ERM8") {
        # 在</head>前添加GA代码
        $gameHtml = $gameHtml -replace "(?s)(<head>.*?)(?=</head>)", "`$1`n$gaCode"
    }
    
    $gamePath = "games\$($game.slug).html"
    $gameHtml | Set-Content $gamePath -Encoding UTF8
    Write-Host "  Page created: $gamePath"
}

# 按分类分组游戏
$categories = $games | ForEach-Object { $_.category } | Select-Object -Unique

# 为每个分类创建JSON文件
foreach ($category in $categories) {
    $categoryGames = $games | Where-Object { $_.category -eq $category }
    $categoryPath = "data\categories\$($category.ToLower()).json"
    $categoryGames | ConvertTo-Json -Depth 10 | Set-Content $categoryPath -Encoding UTF8
    Write-Host "Category JSON created: $categoryPath"
}

# 获取分类页面模板
$categoryTemplate = Get-Content "templates\category.html" -Raw

# 为每个分类创建页面
foreach ($category in $categories) {
    $categorySlug = $category.ToLower()
    $categoryHtmlPath = "categories\$categorySlug.html"
    
    # 检查分类页面是否已存在
    if (!(Test-Path $categoryHtmlPath)) {
        Write-Host "Creating new category page: $categoryHtmlPath"
        
        # 创建基础模板
        $baseTemplate = $categoryTemplate
        $baseTemplate = $baseTemplate.Replace("{{CATEGORY_NAME}}", $category)
        $baseTemplate = $baseTemplate.Replace("{{CATEGORY_SLUG}}", $categorySlug)
        
        # 检查是否已经包含GA代码
        if ($baseTemplate -notmatch "G-B41L93ERM8") {
            # 在</head>前添加GA代码
            $baseTemplate = $baseTemplate -replace "(?s)(<head>.*?)(?=</head>)", "`$1`n$gaCode"
        }
        
        $baseTemplate | Set-Content $categoryHtmlPath -Encoding UTF8
    }
    
    # 读取分类页面
    $categoryHtml = Get-Content $categoryHtmlPath -Raw
    
    # 如果页面不包含GA代码，添加它
    if ($categoryHtml -notmatch "G-B41L93ERM8") {
        $categoryHtml = $categoryHtml -replace "(?s)(<head>.*?)(?=</head>)", "`$1`n$gaCode"
        $categoryHtml | Set-Content $categoryHtmlPath -Encoding UTF8
        Write-Host "  Added GA code to: $categoryHtmlPath"
    }
    
    # 获取该分类的游戏
    $categoryGames = $games | Where-Object { $_.category -eq $category }
    
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

# 检查首页是否包含GA代码
$indexPath = "index.html"
if (Test-Path $indexPath) {
    $indexHtml = Get-Content $indexPath -Raw
    if ($indexHtml -notmatch "G-B41L93ERM8") {
        $indexHtml = $indexHtml -replace "(?s)(<head>.*?)(?=</head>)", "`$1`n$gaCode"
        $indexHtml | Set-Content $indexPath -Encoding UTF8
        Write-Host "Added GA code to index.html"
    } else {
        Write-Host "index.html already contains GA code"
    }
}

Write-Host "Done! All game files and category pages have been created or updated."
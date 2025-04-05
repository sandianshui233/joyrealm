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
    
    # 修改第49-53行
    # 修复的游戏容器替换 - 确保只替换一次
    if ($gameHtml -match '<div class="arcade-machines">') {
        $gameHtml = $gameHtml -replace '<div class="arcade-machines">', '<div id="category-games">'
        Write-Host "  替换了游戏容器标签"
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
}

Write-Host "`n全部完成！按任意键退出..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
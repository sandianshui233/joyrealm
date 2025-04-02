# 设置UTF-8编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 设置工作目录为当前目录
$workingDir = Get-Location

# 创建必要的目录
if (!(Test-Path "games")) { New-Item -ItemType Directory -Path "games" }
if (!(Test-Path "data\categories")) { New-Item -ItemType Directory -Path "data\categories" -Force }

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
}

Write-Host "Done! All game files have been created."
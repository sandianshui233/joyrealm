@echo off
chcp 936 >nul
setlocal enabledelayedexpansion

echo JoyRealm 游戏批量添加工具 v1.0
echo =============================

echo 本工具支持从Excel文件批量导入游戏
echo.
echo 第一步：准备Excel文件
echo   1. 创建一个新的Excel文件
echo   2. 第一行填写以下列标题：
echo      id,title,slug,category,description,embedSrc,controls,featured,imagePath
echo   3. 从第二行开始，每行填写一个游戏的信息
echo.
echo 第二步：将Excel文件另存为CSV格式
echo   1. 在Excel中点击"文件" -> "另存为"
echo   2. 选择保存类型为"CSV (逗号分隔)(*.csv)"
echo   3. 保存文件
echo.

set /p CSV_FILE=请输入游戏数据CSV文件路径 (拖拽文件到此处): 

if not exist "%CSV_FILE%" (
    echo 错误: 找不到CSV文件 "%CSV_FILE%"
    goto :EOF
)

echo.
echo 正在读取CSV文件...
echo.

rem 创建必要的目录
if not exist "games" mkdir games
if not exist "assets\images\games" mkdir assets\images\games
if not exist "assets\images\games\thumbnails" mkdir assets\images\games\thumbnails
if not exist "data\categories" mkdir data\categories
if not exist "templates" mkdir templates

rem 检查模板文件是否存在，如果不存在则创建
if not exist "templates\game-template.txt" (
    echo 创建游戏页面模板文件...
    
    echo ^<!DOCTYPE html^> > "templates\game-template.txt"
    echo ^<html lang="en"^> >> "templates\game-template.txt"
    echo ^<head^> >> "templates\game-template.txt"
    echo     ^<meta charset="UTF-8"^> >> "templates\game-template.txt"
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> "templates\game-template.txt"
    echo     ^<title^>{{GAME_TITLE}} - JoyRealm^</title^> >> "templates\game-template.txt"
    echo     ^<meta name="description" content="Play {{GAME_TITLE}} on JoyRealm - {{GAME_DESCRIPTION}}"^> >> "templates\game-template.txt"
    echo     ^<link rel="canonical" href="https://joyrealm.org/games/{{GAME_SLUG}}.html"^> >> "templates\game-template.txt"
    echo     ^<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"^> >> "templates\game-template.txt"
    echo     ^<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"^> >> "templates\game-template.txt"
    echo     ^<link rel="stylesheet" href="../assets/css/arcade.css?v=1.0.0"^> >> "templates\game-template.txt"
    echo     ^<link rel="stylesheet" href="../assets/css/game-detail.css?v=1.0.0"^> >> "templates\game-template.txt"
    echo ^</head^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo ^<body class="arcade-body"^> >> "templates\game-template.txt"
    echo     ^<!-- CRT屏幕效果覆盖层 --^> >> "templates\game-template.txt"
    echo     ^<div class="crt-overlay"^>^</div^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo     ^<!-- 头部 --^> >> "templates\game-template.txt"
    echo     ^<header class="arcade-header"^> >> "templates\game-template.txt"
    echo         ^<div class="logo-container"^> >> "templates\game-template.txt"
    echo             ^<a href="/" class="arcade-logo"^> >> "templates\game-template.txt"
    echo                 ^<span class="neon-yellow"^>Joy^</span^>^<span class="neon-pink"^>Realm^</span^> >> "templates\game-template.txt"
    echo             ^</a^> >> "templates\game-template.txt"
    echo         ^</div^> >> "templates\game-template.txt"
    echo         ^<nav class="arcade-nav"^> >> "templates\game-template.txt"
    echo             ^<a href="/" class="nav-btn"^>Home^</a^> >> "templates\game-template.txt"
    echo             ^<a href="/categories/action.html" class="nav-btn"^>Action^</a^> >> "templates\game-template.txt"
    echo             ^<a href="/categories/puzzle.html" class="nav-btn"^>Puzzle^</a^> >> "templates\game-template.txt"
    echo             ^<a href="/categories/music.html" class="nav-btn"^>Music^</a^> >> "templates\game-template.txt"
    echo         ^</nav^> >> "templates\game-template.txt"
    echo         ^<div class="coin-slot"^> >> "templates\game-template.txt"
    echo             ^<button class="insert-coin-btn"^>INSERT COIN^</button^> >> "templates\game-template.txt"
    echo             ^<div class="coin-counter"^>CREDITS: 0^</div^> >> "templates\game-template.txt"
    echo         ^</div^> >> "templates\game-template.txt"
    echo     ^</header^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo     ^<main class="game-detail"^> >> "templates\game-template.txt"
    echo         ^<!-- 游戏标题 --^> >> "templates\game-template.txt"
    echo         ^<h1 class="game-title neon-blue"^>{{GAME_TITLE}}^</h1^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo         ^<!-- 街机柜 --^> >> "templates\game-template.txt"
    echo         ^<div class="game-cabinet"^> >> "templates\game-template.txt"
    echo             ^<!-- 街机柜顶部 --^> >> "templates\game-template.txt"
    echo             ^<div class="cabinet-top"^> >> "templates\game-template.txt"
    echo                 ^<div class="cabinet-marquee"^> >> "templates\game-template.txt"
    echo                     ^<div class="marquee-text"^>{{GAME_TITLE}}^</div^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo             ^<!-- 街机柜屏幕 --^> >> "templates\game-template.txt"
    echo             ^<div class="cabinet-body"^> >> "templates\game-template.txt"
    echo                 ^<div class="screen-bezel"^> >> "templates\game-template.txt"
    echo                     ^<div class="game-frame"^> >> "templates\game-template.txt"
    echo                         ^<iframe frameborder="0" src="{{GAME_EMBED_SRC}}" allowfullscreen="" width="100%%" height="100%%"^>^</iframe^> >> "templates\game-template.txt"
    echo                     ^</div^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo             ^<!-- 街机柜控制面板 --^> >> "templates\game-template.txt"
    echo             ^<div class="cabinet-controls"^> >> "templates\game-template.txt"
    echo                 ^<div class="joystick"^> >> "templates\game-template.txt"
    echo                     ^<div class="joystick-base"^>^</div^> >> "templates\game-template.txt"
    echo                     ^<div class="joystick-stick"^>^</div^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo                 ^<div class="control-buttons"^> >> "templates\game-template.txt"
    echo                     ^<div class="control-btn red"^>^</div^> >> "templates\game-template.txt"
    echo                     ^<div class="control-btn blue"^>^</div^> >> "templates\game-template.txt"
    echo                     ^<div class="control-btn green"^>^</div^> >> "templates\game-template.txt"
    echo                     ^<div class="control-btn yellow"^>^</div^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo                 ^<div class="coin-button"^> >> "templates\game-template.txt"
    echo                     ^<button id="insert-coin-game" class="insert-coin-btn"^>INSERT COIN^</button^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo         ^</div^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo         ^<!-- 游戏信息 --^> >> "templates\game-template.txt"
    echo         ^<div class="game-info"^> >> "templates\game-template.txt"
    echo             ^<div class="info-card"^> >> "templates\game-template.txt"
    echo                 ^<h2 class="info-title neon-green"^>GAME INFO^</h2^> >> "templates\game-template.txt"
    echo                 ^<div class="info-content"^> >> "templates\game-template.txt"
    echo                     ^<p class="game-description"^>{{GAME_DESCRIPTION}}^</p^> >> "templates\game-template.txt"
    echo                     ^<div class="game-meta"^> >> "templates\game-template.txt"
    echo                         ^<div class="meta-item"^> >> "templates\game-template.txt"
    echo                             ^<span class="meta-label"^>Category:^</span^> >> "templates\game-template.txt"
    echo                             ^<span class="meta-value"^>{{GAME_CATEGORY}}^</span^> >> "templates\game-template.txt"
    echo                         ^</div^> >> "templates\game-template.txt"
    echo                         ^<div class="meta-item"^> >> "templates\game-template.txt"
    echo                             ^<span class="meta-label"^>Controls:^</span^> >> "templates\game-template.txt"
    echo                             ^<span class="meta-value"^>{{GAME_CONTROLS}}^</span^> >> "templates\game-template.txt"
    echo                         ^</div^> >> "templates\game-template.txt"
    echo                     ^</div^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo             ^<!-- 相关游戏 --^> >> "templates\game-template.txt"
    echo             ^<div class="related-games"^> >> "templates\game-template.txt"
    echo                 ^<h2 class="info-title neon-pink"^>RELATED GAMES^</h2^> >> "templates\game-template.txt"
    echo                 ^<div class="related-games-grid"^> >> "templates\game-template.txt"
    echo                     ^<!-- 相关游戏将通过JavaScript动态加载 --^> >> "templates\game-template.txt"
    echo                 ^</div^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo         ^</div^> >> "templates\game-template.txt"
    echo     ^</main^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo     ^<footer class="arcade-footer"^> >> "templates\game-template.txt"
    echo         ^<div class="footer-content"^> >> "templates\game-template.txt"
    echo             ^<div class="footer-logo"^> >> "templates\game-template.txt"
    echo                 ^<span class="neon-yellow"^>Joy^</span^>^<span class="neon-pink"^>Realm^</span^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo             ^<p class="copyright"^>© 2023 Joyrealm. All rights reserved.^</p^> >> "templates\game-template.txt"
    echo             ^<div class="footer-links"^> >> "templates\game-template.txt"
    echo                 ^<a href="#"^>Privacy Policy^</a^> >> "templates\game-template.txt"
    echo                 ^<a href="#"^>Terms of Service^</a^> >> "templates\game-template.txt"
    echo                 ^<a href="#"^>Contact^</a^> >> "templates\game-template.txt"
    echo             ^</div^> >> "templates\game-template.txt"
    echo         ^</div^> >> "templates\game-template.txt"
    echo     ^</footer^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo     ^<!-- 音效资源 --^> >> "templates\game-template.txt"
    echo     ^<audio id="coin-sound" src="../assets/sounds/coin.mp3" preload="auto"^>^</audio^> >> "templates\game-template.txt"
    echo     ^<audio id="button-sound" src="../assets/sounds/button-press.mp3" preload="auto"^>^</audio^> >> "templates\game-template.txt"
    echo. >> "templates\game-template.txt"
    echo     ^<!-- 脚本 --^> >> "templates\game-template.txt"
    echo     ^<script src="../assets/js/arcade-effects.js"^>^</script^> >> "templates\game-template.txt"
    echo     ^<script src="../assets/js/game-loader.js"^>^</script^> >> "templates\game-template.txt"
    echo     ^<script src="../assets/js/game-detail.js"^>^</script^> >> "templates\game-template.txt"
    echo ^</body^> >> "templates\game-template.txt"
    echo ^</html^> >> "templates\game-template.txt"
    
    echo 模板文件已创建: templates\game-template.txt
)

rem 检查games.json文件是否存在，如果不存在则创建
if not exist "data\games.json" (
    echo 创建游戏数据文件...
    
    echo [ > "data\games.json"
    echo ] >> "data\games.json"
    
    echo 游戏数据文件已创建: data\games.json
)

rem 跳过CSV文件的标题行
set skipline=1

echo 开始导入游戏数据...
echo.

for /f "usebackq tokens=1-9 delims=," %%a in ("%CSV_FILE%") do (
    if !skipline! equ 1 (
        set skipline=0
    ) else (
        set "GAME_ID=%%a"
        set "GAME_TITLE=%%b"
        set "GAME_SLUG=%%c"
        set "GAME_CATEGORY=%%d"
        set "GAME_DESCRIPTION=%%e"
        set "GAME_EMBED_SRC=%%f"
        set "GAME_CONTROLS=%%g"
        set "GAME_FEATURED=%%h"
        set "GAME_IMAGE_PATH=%%i"
        
        echo 处理游戏: !GAME_TITLE!
        
        rem 处理图片
        echo   - 处理图片...
        if exist "!GAME_IMAGE_PATH!" (
            rem 复制原始图片
            copy "!GAME_IMAGE_PATH!" "assets\images\games\!GAME_SLUG!.jpg" >nul
            
            rem 创建缩略图 (需要安装ImageMagick)
            where magick >nul 2>nul
            if !ERRORLEVEL! EQU 0 (
                magick "!GAME_IMAGE_PATH!" -resize 300x200 "assets\images\games\thumbnails\!GAME_SLUG!.jpg"
                magick "!GAME_IMAGE_PATH!" -resize 300x200 -quality 80 "assets\images\games\thumbnails\!GAME_SLUG!.webp"
                echo     已创建缩略图
            ) else (
                echo     警告: 未找到ImageMagick，无法创建缩略图
                echo     请手动创建缩略图: assets\images\games\thumbnails\!GAME_SLUG!.jpg
                copy "!GAME_IMAGE_PATH!" "assets\images\games\thumbnails\!GAME_SLUG!.jpg" >nul
            )
        ) else (
            echo     警告: 找不到图片文件 "!GAME_IMAGE_PATH!"
            echo     请手动添加图片到: assets\images\games\!GAME_SLUG!.jpg
        )
        
        rem 创建游戏详情页
        echo   - 创建游戏页面...
        type templates\game-template.txt > games\!GAME_SLUG!.html
        
        powershell -Command "(Get-Content games\!GAME_SLUG!.html) -replace '{{GAME_TITLE}}', '!GAME_TITLE!' -replace '{{GAME_DESCRIPTION}}', '!GAME_DESCRIPTION!' -replace '{{GAME_SLUG}}', '!GAME_SLUG!' -replace '{{GAME_EMBED_SRC}}', '!GAME_EMBED_SRC!' -replace '{{GAME_CATEGORY}}', '!GAME_CATEGORY!' -replace '{{GAME_CONTROLS}}', '!GAME_CONTROLS!' | Set-Content games\!GAME_SLUG!.html"
        
        rem 准备游戏JSON数据
        set "GAME_JSON={  \"id\": !GAME_ID!,  \"title\": \"!GAME_TITLE!\",  \"slug\": \"!GAME_SLUG!\",  \"category\": \"!GAME_CATEGORY!\",  \"description\": \"!GAME_DESCRIPTION!\",  \"thumbnail\": \"assets/images/games/thumbnails/!GAME_SLUG!.webp\",  \"originalImage\": \"assets/images/games/!GAME_SLUG!.jpg\",  \"embedSrc\": \"!GAME_EMBED_SRC!\",  \"controls\": \"!GAME_CONTROLS!\",  \"featured\": !GAME_FEATURED!}"
        
        rem 更新主游戏数据文件
        echo   - 更新游戏数据...
        powershell -Command "$content = Get-Content 'data\games.json' -Raw; $content = $content -replace '\]$', ',\n  !GAME_JSON!\n]'; $content | Set-Content 'data\games.json'"
        
        rem 更新分类游戏数据文件
        set CATEGORY_FILE=data\categories\!GAME_CATEGORY!.json
        
        if exist "!CATEGORY_FILE!" (
            powershell -Command "$content = Get-Content '!CATEGORY_FILE!' -Raw; $content = $content -replace '\]$', ',\n  !GAME_JSON!\n]'; $content | Set-Content '!CATEGORY_FILE!'"
        ) else (
            echo [> "!CATEGORY_FILE!"
            echo   !GAME_JSON!>> "!CATEGORY_FILE!"
            echo ]>> "!CATEGORY_FILE!"
        )
        
        echo   - 完成！
        echo.
    )
)

echo 所有游戏已成功添加到JoyRealm。
echo.
echo 如果你想创建Excel模板文件，请运行 create-excel-template.bat

pause
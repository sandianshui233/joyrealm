@echo off
chcp 936 >nul
setlocal enabledelayedexpansion

echo JoyRealm 游戏添加工具 v2.0
echo ===========================

set /p GAME_ID=请输入游戏ID (例如: 7): 
set /p GAME_TITLE=请输入游戏标题 (例如: Funny Walk Fall Run): 
set /p GAME_SLUG=请输入游戏Slug (例如: funny-walk-fall-run): 
set /p GAME_CATEGORY=请输入游戏类别 (action/puzzle/music): 
set /p GAME_DESCRIPTION=请输入游戏描述: 
set /p GAME_EMBED_SRC=请输入游戏嵌入链接: 
set /p GAME_CONTROLS=请输入游戏控制说明: 
set /p GAME_FEATURED=是否为特色游戏 (true/false): 
set /p GAME_IMAGE_PATH=请输入游戏图片路径 (拖拽图片到此处): 

echo.
echo 正在创建游戏页面...

if not exist "games" mkdir games
if not exist "assets\images\games" mkdir assets\images\games
if not exist "assets\images\games\thumbnails" mkdir assets\images\games\thumbnails

rem 处理图片
echo 正在处理图片...
if exist "%GAME_IMAGE_PATH%" (
    rem 复制原始图片
    copy "%GAME_IMAGE_PATH%" "assets\images\games\%GAME_SLUG%.jpg"
    
    rem 创建缩略图 (需要安装ImageMagick)
    where magick >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        magick "%GAME_IMAGE_PATH%" -resize 300x200 "assets\images\games\thumbnails\%GAME_SLUG%.jpg"
        magick "%GAME_IMAGE_PATH%" -resize 300x200 -quality 80 "assets\images\games\thumbnails\%GAME_SLUG%.webp"
        echo 已创建缩略图
    ) else (
        echo 警告: 未找到ImageMagick，无法创建缩略图
        echo 请手动创建缩略图: assets\images\games\thumbnails\%GAME_SLUG%.jpg
        copy "%GAME_IMAGE_PATH%" "assets\images\games\thumbnails\%GAME_SLUG%.jpg"
    )
) else (
    echo 错误: 找不到图片文件 "%GAME_IMAGE_PATH%"
    echo 请手动添加图片到: assets\images\games\%GAME_SLUG%.jpg
)

rem 创建游戏详情页
type templates\game-template.txt > games\%GAME_SLUG%.html

powershell -Command "(Get-Content games\%GAME_SLUG%.html) -replace '{{GAME_TITLE}}', '%GAME_TITLE%' -replace '{{GAME_DESCRIPTION}}', '%GAME_DESCRIPTION%' -replace '{{GAME_SLUG}}', '%GAME_SLUG%' -replace '{{GAME_EMBED_SRC}}', '%GAME_EMBED_SRC%' -replace '{{GAME_CATEGORY}}', '%GAME_CATEGORY%' -replace '{{GAME_CONTROLS}}', '%GAME_CONTROLS%' | Set-Content games\%GAME_SLUG%.html"

echo.
echo 游戏详情页已创建: games\%GAME_SLUG%.html

rem 更新游戏数据
echo 正在更新游戏数据...

rem 准备游戏JSON数据
set GAME_JSON={  "id": %GAME_ID%,  "title": "%GAME_TITLE%",  "slug": "%GAME_SLUG%",  "category": "%GAME_CATEGORY%",  "description": "%GAME_DESCRIPTION%",  "thumbnail": "assets/images/games/thumbnails/%GAME_SLUG%.webp",  "originalImage": "assets/images/games/%GAME_SLUG%.jpg",  "embedSrc": "%GAME_EMBED_SRC%",  "controls": "%GAME_CONTROLS%",  "featured": %GAME_FEATURED%}

rem 更新主游戏数据文件
powershell -Command "$content = Get-Content 'data\games.json' -Raw; $content = $content -replace '\]$', ',\n  %GAME_JSON%\n]'; $content | Set-Content 'data\games.json'"

rem 更新分类游戏数据文件
if not exist "data\categories" mkdir data\categories
set CATEGORY_FILE=data\categories\%GAME_CATEGORY%.json

if exist "%CATEGORY_FILE%" (
    powershell -Command "$content = Get-Content '%CATEGORY_FILE%' -Raw; $content = $content -replace '\]$', ',\n  %GAME_JSON%\n]'; $content | Set-Content '%CATEGORY_FILE%'"
) else (
    echo [> "%CATEGORY_FILE%"
    echo   %GAME_JSON%>> "%CATEGORY_FILE%"
    echo ]>> "%CATEGORY_FILE%"
)

echo.
echo 游戏数据已更新到:
echo - data\games.json
echo - %CATEGORY_FILE%

echo.
echo 完成！游戏"%GAME_TITLE%"已成功添加到JoyRealm。

pause
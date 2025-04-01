@echo off
chcp 936 >nul
setlocal enabledelayedexpansion

echo JoyRealm 游戏Excel模板生成工具
echo ==============================

echo 正在创建Excel模板文件...

echo id,title,slug,category,description,embedSrc,controls,featured,imagePath > games-template.csv
echo 7,Funny Walk Fall Run,funny-walk-fall-run,action,控制滑稽的角色，完成各种搞笑的行走、跌倒和奔跑挑战,https://html5.gamedistribution.com/3232d8d696ec4bc1989cd0b4a0ec1482/,鼠标点击或触摸开始游戏,false,D:\Downloads\funny-walk-fall-run.jpg >> games-template.csv
echo 8,Car Racing 3D,car-racing-3d,action,刺激的3D赛车游戏，体验速度与激情,https://html5.gamedistribution.com/car-racing-3d/,方向键控制方向，空格键加速,false,D:\Downloads\car-racing-3d.jpg >> games-template.csv

echo.
echo Excel模板文件已创建: games-template.csv
echo.
echo 使用说明:
echo 1. 用Excel打开 games-template.csv 文件
echo 2. 按照示例格式填写你要添加的游戏信息
echo 3. 保存文件 (保持CSV格式)
echo 4. 运行 batch-add-games.bat 导入游戏
echo.
echo 各字段说明:
echo - id: 游戏ID，从7开始递增
echo - title: 游戏标题
echo - slug: 游戏URL名称，小写字母，用连字符代替空格
echo - category: 游戏类别 (action/puzzle/music)
echo - description: 游戏描述
echo - embedSrc: 游戏嵌入链接
echo - controls: 游戏控制说明
echo - featured: 是否为特色游戏 (true/false)
echo - imagePath: 游戏图片的完整路径
echo.

pause
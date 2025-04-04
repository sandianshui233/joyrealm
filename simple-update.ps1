# 简化版CSV转JSON脚本
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "开始处理CSV数据..."

# 检查CSV文件是否存在
if (Test-Path "data\games.csv") {
    # 读取CSV
    $games = Import-Csv "data\games.csv"
    
    # 处理数据类型
    $processedGames = @()
    foreach ($game in $games) {
        $processedGame = [PSCustomObject]@{
            id = [int]$game.id
            title = $game.title
            slug = $game.slug
            category = $game.category
            description = $game.description
            thumbnail = $game.thumbnail
            embedSrc = $game.embedSrc
            controls = $game.controls
            featured = $game.featured -eq "true" -or $game.featured -eq "TRUE" -or $game.featured -eq "1"
        }
        $processedGames += $processedGame
    }
    
    # 保存为JSON
    $processedGames | ConvertTo-Json -Depth 10 | Set-Content "data\games.json" -Encoding UTF8
    Write-Host "成功：games.json已更新！"
    
    # 询问是否运行网站生成脚本
    $response = Read-Host "是否运行create-game-files.ps1来更新网站? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        if (Test-Path "create-game-files.ps1") {
            & .\create-game-files.ps1
        } else {
            Write-Host "错误：找不到create-game-files.ps1脚本！"
        }
    }
} else {
    Write-Host "错误：找不到data\games.csv文件！"
    Write-Host "请先创建此文件再运行脚本。"
}

Write-Host "处理完成！按任意键退出..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null

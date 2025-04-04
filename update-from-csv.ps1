# 设置UTF-8编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 设置工作目录为当前目录
$workingDir = Get-Location

# 创建必要的目录
if (!(Test-Path "data")) { New-Item -ItemType Directory -Path "data" }

# 检查CSV文件是否存在
if (!(Test-Path "data\games.csv")) {
    # 如果CSV不存在但JSON存在，则从JSON创建CSV模板
    if (Test-Path "data\games.json") {
        Write-Host "CSV文件不存在，正在从现有JSON创建CSV模板..."
        $games = Get-Content "data\games.json" -Raw | ConvertFrom-Json
        
        # 导出为CSV
        $games | Export-Csv -Path "data\games.csv" -NoTypeInformation -Encoding UTF8
        Write-Host "CSV模板已创建：data\games.csv"
        Write-Host "请用Excel编辑此文件添加新游戏，然后再次运行此脚本。"
        Write-Host "按任意键退出..."
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
        exit
    } else {
        # 如果两者都不存在，创建空CSV模板
        Write-Host "CSV和JSON都不存在，正在创建新的空CSV模板..."
        $headers = "id,title,slug,category,description,thumbnail,embedSrc,controls,featured"
        $headers | Set-Content "data\games.csv" -Encoding UTF8
        
        # 添加一个示例游戏
        $exampleGame = '1,Example Game,example-game,action,This is an example game description.,assets/images/games/example.jpg,https://example.com/game,Use arrow keys to move and space to jump.,true'
        Add-Content -Path "data\games.csv" -Value $exampleGame -Encoding UTF8
        
        Write-Host "空CSV模板已创建：data\games.csv，包含一个示例游戏"
        Write-Host "请用Excel编辑此文件添加游戏信息，然后再次运行此脚本。"
        Write-Host "按任意键退出..."
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
        exit
    }
}

# 读取CSV并转换为JSON
Write-Host "正在从CSV读取游戏数据..."
$games = Import-Csv -Path "data\games.csv" -Encoding UTF8

# 处理数据类型
Write-Host "正在处理数据..."
$processedGames = @()
foreach ($game in $games) {
    # 创建一个新对象，以确保数据类型正确
    $processedGame = [PSCustomObject]@{
        id = [int]$game.id
        title = $game.title
        slug = $game.slug
        category = $game.category
        description = $game.description
        thumbnail = $game.thumbnail
        embedSrc = $game.embedSrc
        controls = $game.controls
        featured = $game.featured -eq "true" -or $game.featured -eq "TRUE" -or $game.featured -eq "1" -or $game.featured -eq "yes"
    }
    $processedGames += $processedGame
}

# 保存为JSON
Write-Host "正在保存为JSON..."
$processedGames | ConvertTo-Json -Depth 10 | Set-Content "data\games.json" -Encoding UTF8
Write-Host "成功：games.json已更新！"

# 询问是否运行网站生成脚本
Write-Host "`n是否立即运行create-game-files.ps1来更新网站? (Y/N)"
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    if (Test-Path "create-game-files.ps1") {
        Write-Host "正在运行网站更新脚本..."
        & .\create-game-files.ps1
    } else {
        Write-Host "错误：找不到create-game-files.ps1脚本！"
        Write-Host "请确保它与此脚本位于同一目录。"
    }
}

Write-Host "`n全部完成！按任意键退出..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
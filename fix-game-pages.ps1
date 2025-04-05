# 设置UTF-8编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 获取所有游戏页面
$gameFiles = Get-ChildItem -Path "games\*.html"

foreach ($file in $gameFiles) {
    Write-Host "处理文件: $($file.FullName)"
    
    # 读取文件内容
    $content = Get-Content $file.FullName -Raw
    
    # 检查是否有重复的游戏容器
    if ($content -match '<div class="arcade-machines">') {
        # 替换游戏容器标签
        $content = $content -replace '<div class="arcade-machines">', '<div id="category-games">'
        Write-Host "  替换了游戏容器标签"
    }
    
    # 检查并清理相关游戏区域
    if ($content -match '<div class="related-games">') {
        # 确保相关游戏部分只有一个游戏容器
        $content = $content -replace '(<div class="related-games-grid">)[\s\S]*?(</div>\s*</div>\s*</div>)', '$1<!-- 相关游戏将通过JavaScript动态加载 -->$2'
        Write-Host "  清理了相关游戏区域"
    }
    
    # 确保游戏详情页只有一个游戏框架
    if ($content -match '(?<=<div class="game-frame">[\s\S]*?</div>[\s\S]*?</div>[\s\S]*?</div>)[\s\S]*?<div class="game-frame">') {
        $content = $content -replace '(?<=<div class="game-frame">[\s\S]*?</div>[\s\S]*?</div>[\s\S]*?</div>)[\s\S]*?<div class="game-frame">', '<div class="cabinet-controls">'
        Write-Host "  修复了重复的游戏框架"
    }
    
    # 保存修改后的内容
    $content | Set-Content $file.FullName -Encoding UTF8
    Write-Host "  文件已更新"
}

Write-Host "`n所有文件处理完成！按任意键退出..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
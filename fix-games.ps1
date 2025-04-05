# 设置UTF-8编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "开始修复游戏页面..."

# 修复游戏详情页
$gameFiles = Get-ChildItem -Path "games\*.html"

foreach ($file in $gameFiles) {
    Write-Host "处理文件: $($file.FullName)"
    
    # 读取文件内容
    $content = Get-Content $file.FullName -Raw
    
    # 直接查找和替换重复的游戏框架结构
    $startPattern = '<div class="game-frame">'
    $endPattern = '</div></div></div>'
    
    # 查找第一个游戏框架的位置
    $firstStart = $content.IndexOf($startPattern)
    if ($firstStart -ge 0) {
        $firstEnd = $content.IndexOf($endPattern, $firstStart) + $endPattern.Length
        
        # 查找第二个游戏框架的位置
        $secondStart = $content.IndexOf($startPattern, $firstEnd)
        if ($secondStart -ge 0) {
            $secondEnd = $content.IndexOf($endPattern, $secondStart) + $endPattern.Length
            
            # 删除第二个游戏框架
            $newContent = $content.Substring(0, $secondStart) + $content.Substring($secondEnd)
            
            # 保存修改后的内容
            $newContent | Set-Content $file.FullName -Encoding UTF8
            Write-Host "  删除了重复的游戏框架"
        } else {
            Write-Host "  未发现重复的游戏框架"
        }
    } else {
        Write-Host "  未找到游戏框架"
    }
}

Write-Host "`n所有文件处理完成！按任意键退出..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
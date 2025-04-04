@echo off
echo 正在转换CSV到JSON...

C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -Command "if (Test-Path 'data\games.csv') { $games = Import-Csv 'data\games.csv'; $games | ConvertTo-Json -Depth 10 | Set-Content 'data\games.json'; Write-Host 'JSON已更新' } else { Write-Host 'CSV文件不存在' }"

echo 是否运行create-game-files.ps1? (Y/N)
set /p response=
if /i "%response%"=="Y" (
    C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File create-game-files.ps1
)

echo 完成
pause
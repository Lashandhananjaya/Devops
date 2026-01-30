# MongoDB Setup Script for Windows
Write-Host "Starting MongoDB Setup..." -ForegroundColor Green

# Check if MongoDB is already installed
$mongoPath = "C:\Program Files\MongoDB\Server\*\bin\mongod.exe"
$mongoInstalled = Test-Path $mongoPath

if ($mongoInstalled) {
    Write-Host "MongoDB is already installed!" -ForegroundColor Green
}
else {
    Write-Host "MongoDB is not installed. Downloading..." -ForegroundColor Yellow
    
    $tempDir = "$env:TEMP\mongodb-setup"
    if (!(Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    $mongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14-signed.msi"
    $installerPath = "$tempDir\mongodb-installer.msi"
    
    Write-Host "Downloading MongoDB..." -ForegroundColor Cyan
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $mongoUrl -OutFile $installerPath -UseBasicParsing -ErrorAction Stop
    
    Write-Host "Installing MongoDB..." -ForegroundColor Cyan
    Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait
    
    Remove-Item -Path $installerPath -Force -ErrorAction SilentlyContinue
    Write-Host "MongoDB installed!" -ForegroundColor Green
}

# Start MongoDB Service
Write-Host "Starting MongoDB service..." -ForegroundColor Cyan
Start-Service MongoDB -ErrorAction SilentlyContinue

Write-Host "Setup complete! Run: npm start" -ForegroundColor Green

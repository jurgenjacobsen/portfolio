# updater.ps1
$BaseUrl = "https://jurgen.fyi/boilerplate"
$ManifestUrl = "$BaseUrl/manifest.json"

Write-Host "Fetching latest boilerplate manifest..." -ForegroundColor Cyan

try {
    $ManifestResponse = Invoke-WebRequest -Uri $ManifestUrl -UseBasicParsing
    $Manifest = $ManifestResponse.Content | ConvertFrom-Json

    Write-Host "Found version $($Manifest.version). Synchronizing files..." -ForegroundColor Green

    foreach ($File in $Manifest.files) {
        $FileUrl = "$BaseUrl/$File"
        $Destination = Join-Path -Path $PWD -ChildPath $File

        if (Test-Path $Destination) {
            Write-Host "Warning: File already exists: $File. Overwrite? (Y/N) " -ForegroundColor Yellow -NoNewline
            $Choice = Read-Host
            if ($Choice -notmatch "^[Yy]$") {
                Write-Host "Skipping $File..." -ForegroundColor Gray
                continue
            }
        }

        Invoke-WebRequest -Uri $FileUrl -OutFile $Destination -UseBasicParsing
        Write-Host "Updated: $File" -ForegroundColor Green
    }
    
    Write-Host "Boilerplate sync complete!" -ForegroundColor Cyan

} catch {
    Write-Host "Failed to sync boilerplate files. Check your connection or URL." -ForegroundColor Red
    Write-Host $_.Exception.Message
}
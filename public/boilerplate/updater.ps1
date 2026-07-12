# sync-bootstrap.ps1
$BaseUrl = "https://jurgen.fyi/boilerplate"
$ManifestUrl = "$BaseUrl/manifest.json"

Write-Host "Fetching latest bootstrap manifest..." -ForegroundColor Cyan

try {
    # 1. Get the manifest
    $ManifestResponse = Invoke-WebRequest -Uri $ManifestUrl -UseBasicParsing
    $Manifest = $ManifestResponse.Content | ConvertFrom-Json

    Write-Host "Found version $($Manifest.version). Synchronizing files..." -ForegroundColor Green

    # 2. Loop through and download each file
    foreach ($File in $Manifest.files) {
        $FileUrl = "$BaseUrl/$File"
        $Destination = Join-Path -Path $PWD -ChildPath $File

        # Safety Check: Warn before overwriting existing files
        if (Test-Path $Destination) {
            Write-Host "⚠️ File already exists: $File. Overwrite? (Y/N)" -ForegroundColor Yellow -NoNewline
            $Choice = Read-Host
            if ($Choice -notmatch "^[Yy]$") {
                Write-Host "Skipping $File..." -ForegroundColor Gray
                continue
            }
        }

        # Download the file
        Invoke-WebRequest -Uri $FileUrl -OutFile $Destination -UseBasicParsing
        Write-Host "✔ Updated: $File" -ForegroundColor Green
    }
    
    Write-Host "Bootstrap sync complete!" -ForegroundColor Cyan

} catch {
    Write-Host "Failed to sync bootstrap files. Check your connection or URL." -ForegroundColor Red
    Write-Host $_.Exception.Message
}
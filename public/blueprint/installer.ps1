# installer.ps1 - Jurgen Jacobsen's Web Dev Blueprint Scaffolder & Synchronizer
# Usage:
#   Direct web run:  irm https://jurgen.fyi/blueprint/installer.ps1 | iex
#   Local run:       .\installer.ps1 [-Update] [-Uninstall] [-Reset] [-Force] [-BaseUrl <url>]

[CmdletBinding()]
param (
    [switch]$Update,
    [switch]$Uninstall,
    [switch]$Reset,
    [switch]$Force,
    [string]$BaseUrl = "https://jurgen.fyi/blueprint"
)

$ErrorActionPreference = "Stop"
$TargetDir = $PWD.Path
$LockFileName = ".blueprint.json"
$LegacyLockFileName = ".boilerplate.json"
$LockFilePath = Join-Path -Path $TargetDir -ChildPath $LockFileName
$LegacyLockFilePath = Join-Path -Path $TargetDir -ChildPath $LegacyLockFileName
$ManifestUrl = "$BaseUrl/manifest.json"

function Write-Header {
    param ([string]$Text)
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "   $Text" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param ([string]$Text)
    Write-Host "> $Text" -ForegroundColor White
}

function Write-Success {
    param ([string]$Text)
    Write-Host "[+] $Text" -ForegroundColor Green
}

function Write-Warn {
    param ([string]$Text)
    Write-Host "[!] $Text" -ForegroundColor Yellow
}

function Write-Err {
    param ([string]$Text)
    Write-Host "[x] $Text" -ForegroundColor Red
}

function Get-RemoteManifest {
    $localManifest = Join-Path -Path $PSScriptRoot -ChildPath "manifest.json"
    $publicManifest = Join-Path -Path $TargetDir -ChildPath "public\blueprint\manifest.json"

    try {
        Write-Step "Fetching manifest from $ManifestUrl..."
        $response = Invoke-WebRequest -Uri $ManifestUrl -UseBasicParsing -TimeoutSec 5
        if ($response.Content -and -not ($response.Content.TrimStart().StartsWith("<"))) {
            return ($response.Content | ConvertFrom-Json)
        }
        throw "Remote endpoint returned non-JSON content (site not yet deployed or route redirected)."
    } catch {
        if ($PSScriptRoot -and (Test-Path -Path $localManifest)) {
            Write-Warn "Remote manifest unavailable. Using local fallback: $localManifest"
            return (Get-Content -Path $localManifest -Raw -Encoding UTF8 | ConvertFrom-Json)
        }
        if (Test-Path -Path $publicManifest) {
            Write-Warn "Remote manifest unavailable. Using local fallback: $publicManifest"
            return (Get-Content -Path $publicManifest -Raw -Encoding UTF8 | ConvertFrom-Json)
        }
        Write-Err "Failed to fetch manifest from $ManifestUrl"
        Write-Err $_.Exception.Message
        exit 1
    }
}

function Get-LocalLockfile {
    $path = $null
    if (Test-Path -Path $LockFilePath) {
        $path = $LockFilePath
    } elseif (Test-Path -Path $LegacyLockFilePath) {
        $path = $LegacyLockFilePath
    }

    if ($path) {
        try {
            $content = Get-Content -Path $path -Raw -Encoding UTF8
            return ($content | ConvertFrom-Json)
        } catch {
            Write-Warn "Could not parse existing lockfile ($path). It may be corrupt."
            return $null
        }
    }
    return $null
}

function Save-LocalLockfile {
    param (
        [string]$Version,
        [string[]]$InstalledFiles
    )
    $lockData = [ordered]@{
        version        = $Version
        installedAt    = (Get-Date).ToString("o")
        source         = $BaseUrl
        installedFiles = @($InstalledFiles)
    }
    $json = $lockData | ConvertTo-Json -Depth 4
    [System.IO.File]::WriteAllText($LockFilePath, $json, [System.Text.Encoding]::UTF8)
    if (Test-Path -Path $LegacyLockFilePath) {
        Remove-Item -Path $LegacyLockFilePath -Force -ErrorAction SilentlyContinue
    }
    Write-Success "Updated lockfile: $LockFileName"
}

function Download-BlueprintFile {
    param (
        [string]$FileName,
        [switch]$SkipConfirmation
    )
    $dest = Join-Path -Path $TargetDir -ChildPath $FileName
    $fileUrl = "$BaseUrl/$FileName"
    $localSource = Join-Path -Path $PSScriptRoot -ChildPath $FileName
    $publicSource = Join-Path -Path $TargetDir -ChildPath "public\blueprint\$FileName"

    # Avoid self-overwrite if running installer inside public/blueprint directory
    if ($PSScriptRoot -and ($PSScriptRoot -eq $TargetDir)) {
        Write-Warn "Running directly inside the template directory. Skipping download to prevent overwrite."
        return $true
    }

    if (Test-Path -Path $dest) {
        if (-not $SkipConfirmation -and -not $Force) {
            Write-Host "  File '$FileName' already exists. " -ForegroundColor Yellow -NoNewline
            Write-Host "Overwrite [Y], Skip [N], Backup [B]? (default: N): " -ForegroundColor White -NoNewline
            $ans = Read-Host
            if ($ans -match "^[Bb]$") {
                $bak = "$dest.bak"
                Copy-Item -Path $dest -Destination $bak -Force
                Write-Warn "Backed up existing '$FileName' to '$FileName.bak'"
            } elseif ($ans -notmatch "^[Yy]$") {
                Write-Host "  Skipping '$FileName'..." -ForegroundColor Gray
                return $false
            }
        }
    }

    # Try downloading from remote URL first
    try {
        $response = Invoke-WebRequest -Uri $fileUrl -UseBasicParsing -TimeoutSec 5
        if ($response.Content -and -not ($response.Content.TrimStart().StartsWith("<!doctype html"))) {
            [System.IO.File]::WriteAllBytes($dest, $response.RawContentStream.ToArray())
            Write-Success "Installed $FileName"
            return $true
        }
        throw "Remote URL returned HTML."
    } catch {
        # Fall back to local source file if present
        if ($PSScriptRoot -and (Test-Path -Path $localSource)) {
            Copy-Item -Path $localSource -Destination $dest -Force
            Write-Success "Installed $FileName (from local source)"
            return $true
        }
        if (Test-Path -Path $publicSource) {
            Copy-Item -Path $publicSource -Destination $dest -Force
            Write-Success "Installed $FileName (from local source)"
            return $true
        }
        Write-Err "Failed to acquire $FileName"
        Write-Err $_.Exception.Message
        return $false
    }
}

# ----------------------------------------------------
# ACTION: UNINSTALL
# ----------------------------------------------------
if ($Uninstall) {
    Write-Header "Blueprint - Clean Uninstall"
    $lock = Get-LocalLockfile

    if (-not $lock) {
        Write-Err "No lockfile ($LockFileName) found in current directory ($TargetDir)."
        Write-Err "Nothing to uninstall."
        exit 0
    }

    Write-Host "Files to be removed (tracked in lockfile):" -ForegroundColor Yellow
    foreach ($file in $lock.installedFiles) {
        Write-Host "  - $file" -ForegroundColor Gray
    }
    Write-Host "  - $LockFileName" -ForegroundColor Gray

    if (-not $Force) {
        Write-Host ""
        Write-Host "Proceed with removing tracked blueprint files? [y/N]: " -ForegroundColor White -NoNewline
        $ans = Read-Host
        if ($ans -notmatch "^[Yy]$") {
            Write-Host "Uninstall canceled." -ForegroundColor Gray
            exit 0
        }
    }

    foreach ($file in $lock.installedFiles) {
        $filePath = Join-Path -Path $TargetDir -ChildPath $file
        if (Test-Path -Path $filePath) {
            Remove-Item -Path $filePath -Force
            Write-Success "Removed $file"
        }
    }

    if (Test-Path -Path $LockFilePath) { Remove-Item -Path $LockFilePath -Force }
    if (Test-Path -Path $LegacyLockFilePath) { Remove-Item -Path $LegacyLockFilePath -Force }
    Write-Success "Removed lockfile"
    Write-Host ""
    Write-Host "Blueprint successfully uninstalled. User project files were left untouched." -ForegroundColor Green
    exit 0
}

# ----------------------------------------------------
# ACTION: RESET
# ----------------------------------------------------
if ($Reset) {
    Write-Header "Blueprint - Reset to Upstream Defaults"
    $lock = Get-LocalLockfile

    if (-not $lock) {
        Write-Warn "No lockfile found. Cannot reset a project that has not installed the blueprint."
        Write-Host "Run without flags to perform an initial install." -ForegroundColor Cyan
        exit 0
    }

    $manifest = Get-RemoteManifest

    if (-not $Force) {
        Write-Warn "Reset will overwrite all tracked blueprint files with fresh upstream templates."
        Write-Host "Local changes to tracked files will be overwritten." -ForegroundColor Yellow
        Write-Host "Proceed with reset? [y/N]: " -ForegroundColor White -NoNewline
        $ans = Read-Host
        if ($ans -notmatch "^[Yy]$") {
            Write-Host "Reset canceled." -ForegroundColor Gray
            exit 0
        }
    }

    $installedNow = @()
    foreach ($file in $lock.installedFiles) {
        $ok = Download-BlueprintFile -FileName $file -SkipConfirmation
        if ($ok) { $installedNow += $file }
    }

    Save-LocalLockfile -Version $manifest.version -InstalledFiles $installedNow
    Write-Host ""
    Write-Host "Blueprint files successfully reset to upstream version $($manifest.version)." -ForegroundColor Green
    exit 0
}

# ----------------------------------------------------
# ACTION: UPDATE
# ----------------------------------------------------
if ($Update) {
    Write-Header "Blueprint - Check & Synchronize Updates"
    $lock = Get-LocalLockfile

    if (-not $lock) {
        Write-Warn "No lockfile found in the current directory."
        Write-Host "Running full interactive install instead..." -ForegroundColor Cyan
    } else {
        $manifest = Get-RemoteManifest
        Write-Host "Installed version: $($lock.version)" -ForegroundColor Gray
        Write-Host "Remote version:    $($manifest.version)" -ForegroundColor Gray

        if ($lock.version -eq $manifest.version -and -not $Force) {
            Write-Success "Blueprint is already up-to-date (v$($manifest.version))."
            Write-Host "Tip: Use -Reset to restore default files or -Force to force re-download." -ForegroundColor Cyan
            exit 0
        }

        Write-Step "Updating tracked files to version $($manifest.version)..."
        $updatedFiles = @()
        foreach ($file in $lock.installedFiles) {
            $ok = Download-BlueprintFile -FileName $file
            if ($ok) { $updatedFiles += $file }
        }

        Save-LocalLockfile -Version $manifest.version -InstalledFiles $updatedFiles
        Write-Host ""
        Write-Host "Blueprint update complete (v$($manifest.version))!" -ForegroundColor Green
        exit 0
    }
}

# ----------------------------------------------------
# ACTION: DEFAULT (INTERACTIVE INSTALL / SCAFFOLD)
# ----------------------------------------------------
Write-Header "Jurgen.fyi | Blueprint"
Write-Host "Target Directory: $TargetDir" -ForegroundColor Gray
Write-Host ""

$manifest = Get-RemoteManifest
Write-Host "Found release v$($manifest.version) (Updated: $($manifest.updatedAt))" -ForegroundColor Green
Write-Host ""

$selectedFiles = @()

Write-Host "Select which configurations to install:" -ForegroundColor Cyan
Write-Host ""

foreach ($item in $manifest.files) {
    $promptHint = "[y/N]"
    if ($item.default) {
        $promptHint = "[Y/n]"
    }

    Write-Host "* $($item.name)" -ForegroundColor Yellow -NoNewline
    Write-Host " ($($item.category))" -ForegroundColor Gray
    Write-Host "  Description: $($item.description)" -ForegroundColor DarkGray
    Write-Host "  Install $promptHint? " -ForegroundColor White -NoNewline

    $ans = Read-Host
    $shouldInstall = $false

    if ([string]::IsNullOrWhiteSpace($ans)) {
        $shouldInstall = [bool]$item.default
    } elseif ($ans -match "^[Yy]$") {
        $shouldInstall = $true
    }

    if ($shouldInstall) {
        $selectedFiles += $item.name
    }
    Write-Host ""
}

if ($selectedFiles.Count -eq 0) {
    Write-Warn "No files selected. Exiting without changes."
    exit 0
}

Write-Header "Installing Selected Files"
$successfullyInstalled = @()

foreach ($file in $selectedFiles) {
    $ok = Download-BlueprintFile -FileName $file
    if ($ok) {
        $successfullyInstalled += $file
    }
}

if ($successfullyInstalled.Count -gt 0) {
    Save-LocalLockfile -Version $manifest.version -InstalledFiles $successfullyInstalled
    Write-Header "Setup Complete!"
    Write-Host "Installed $($successfullyInstalled.Count) blueprint file(s) into $TargetDir" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Cyan
    Write-Host "  irm $BaseUrl/installer.ps1 | iex              # Re-run installer" -ForegroundColor Gray
    Write-Host "  .\installer.ps1 -Update                       # Check & apply updates" -ForegroundColor Gray
    Write-Host "  .\installer.ps1 -Reset                        # Restore upstream defaults" -ForegroundColor Gray
    Write-Host "  .\installer.ps1 -Uninstall                    # Remove all blueprint files" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Warn "No files were modified."
}

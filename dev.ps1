param(
  [int]$Port = 8080,
  [switch]$NoOpen,
  [switch]$NoServe,
  [switch]$CleanOnly,
  [int]$CacheSeconds = -1
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg) {
  Write-Host $msg -ForegroundColor Cyan
}

function Write-Ok($msg) {
  Write-Host $msg -ForegroundColor Green
}

function Build-Site {
  param(
    [string]$RepoRoot
  )

  $siteOut = Join-Path $RepoRoot '_site'

  if (Test-Path $siteOut) {
    Remove-Item -Recurse -Force $siteOut
  }
  New-Item -ItemType Directory -Path $siteOut | Out-Null

  $indexPath = Join-Path $RepoRoot 'index.html'
  if (!(Test-Path $indexPath)) {
    throw "Missing index.html at $indexPath"
  }

  Copy-Item -Path $indexPath -Destination (Join-Path $siteOut 'index.html') -Force

  $sitesDir = Join-Path $RepoRoot 'sites'
  if (Test-Path $sitesDir) {
    # Copy all children of sites/ into _site/ (preserves paths like /learn/ai/transformers/intro/)
    Get-ChildItem -Path $sitesDir -Force | ForEach-Object {
      Copy-Item -Path $_.FullName -Destination $siteOut -Recurse -Force
    }
  }

  return $siteOut
}

function Test-PortInUse {
  param(
    [Parameter(Mandatory = $true)][int]$Port
  )

  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
    $listener.Start()
    return $false
  } catch {
    return $true
  } finally {
    if ($listener) {
      try { $listener.Stop() } catch { }
    }
  }
}

# Ensure we run from repo root (where this file lives)
$repoRoot = $PSScriptRoot

if ($CleanOnly) {
  $siteOut = Join-Path $repoRoot '_site'
  if (Test-Path $siteOut) {
    Remove-Item -Recurse -Force $siteOut
    Write-Ok "Removed _site/"
  } else {
    Write-Info "_site/ does not exist"
  }
  exit 0
}

Write-Info "Building site into _site/ (mirrors GitHub Actions)…"
$siteOut = Build-Site -RepoRoot $repoRoot
Write-Ok "Build complete: $siteOut"

if ($NoServe) {
  Write-Info "NoServe set; skipping local server."
  exit 0
}

# http-server caching: -c-1 disables cache; otherwise seconds
$cacheArg = if ($CacheSeconds -lt 0) { '-c-1' } else { "-c$CacheSeconds" }
if (Test-PortInUse -Port $Port) {
  $startPort = $Port
  Write-Info "Port $startPort is already in use. Searching for a free port…"

  $found = $false
  for ($offset = 1; $offset -le 25; $offset++) {
    $candidate = $startPort + $offset
    if (-not (Test-PortInUse -Port $candidate)) {
      $Port = $candidate
      $found = $true
      break
    }
  }

  if (-not $found) {
    throw "Could not find a free port in range $($startPort + 1)-$($startPort + 25). Stop the existing server or pass -Port <port>."
  }

  Write-Ok "Using port $Port instead."
}

$httpArgs = @(
  $siteOut,
  '-p',
  "$Port",
  $cacheArg
)

if (-not $NoOpen) {
  $httpArgs += '-o'
}

Write-Info "Serving _site/ on http://127.0.0.1:$Port (CTRL+C to stop)…"
Write-Info "(If prompted, allow npx to install http-server.)"

# Run via npx so you don't need a global install
& npx http-server @httpArgs

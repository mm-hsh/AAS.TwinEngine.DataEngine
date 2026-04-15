param(
  [ValidateSet('response-time', 'load', 'stress', 'endurance')]
  [string]$Profile = 'response-time',
  [string]$BaseUrl = 'http://localhost:8080'
)

$scriptPath = Join-Path $PSScriptRoot "scenarios/$Profile.js"

if (-not (Get-Command k6 -ErrorAction SilentlyContinue)) {
  Write-Error 'k6 is not installed or not in PATH.'
  exit 1
}

$env:BASE_URL = $BaseUrl
k6 run $scriptPath

param(
  [int]$Port = 4173,
  [switch]$NoBrowser
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverScript = Join-Path $scriptRoot "server.mjs"

if (-not (Test-Path $serverScript)) {
  throw "server.mjs was not found in $scriptRoot"
}

$arguments = @($serverScript)
if (-not $NoBrowser) {
  $arguments += "--open"
}

$env:PORT = "$Port"
Set-Location $scriptRoot
node @arguments

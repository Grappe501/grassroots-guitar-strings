# Sync approved Grassroots & Guitar Strings photos from RedDirt campaign folder
# into the event microsite asset tree. Run after adding images on H:.

$Source = "H:\SOSWebsite\RedDirt\public\media\campaign-photos\grassroot and guitars"
$DestRoot = "H:\SOSWebsite\grassroots-guitar-strings\assets\images\shared-history"

if (-not (Test-Path -LiteralPath $Source)) {
  Write-Host "Source folder not found: $Source"
  exit 1
}

$files = Get-ChildItem -LiteralPath $Source -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match '\.(jpe?g|png|webp|gif)$' }
if ($files.Count -eq 0) {
  Write-Host "No image files in source folder yet. Add photos to: $Source"
  exit 0
}

$i = 0
foreach ($f in $files) {
  $i++
  $bucket = switch -Regex ($f.Name) {
    '(?i)farm|forevermost' { 'farm-festival-one' }
    '(?i)rose' { 'rose-bud-festival' }
    '(?i)david' { 'kelly-and-david' }
    default { 'kelly-and-david' }
  }
  $destDir = Join-Path $DestRoot $bucket
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  $destName = ('{0:D2}{1}' -f $i, $f.Extension)
  Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $destDir $destName) -Force
  Write-Host "Copied $($f.Name) -> $bucket/$destName"
}

Write-Host "Done. Update docs/IMAGE_ASSET_REGISTER.json with captions and permissions."

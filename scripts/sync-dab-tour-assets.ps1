# Sync public-safe David Adam Byrnes tour assets from RedDirt into the event microsite.
# Excludes W9, wire info, credentials, riders, and stage plots (venue/internal use).

$SourceRoot = "H:\SOSWebsite\RedDirt\public\media\campaign-photos\grassroot and guitars\DAB Tour Assets"
$SiteRoot = "H:\SOSWebsite\grassroots-guitar-strings"
$BrandDir = Join-Path $SiteRoot "assets\brand"
$LiveDir = Join-Path $SiteRoot "assets\images\live"
$VideoDir = Join-Path $SiteRoot "assets\video"
$RegisterPath = Join-Path $SiteRoot "docs\DAB_ASSET_REGISTER.json"

if (-not (Test-Path -LiteralPath $SourceRoot)) {
  Write-Error "Source not found: $SourceRoot"
  exit 1
}

New-Item -ItemType Directory -Force -Path $BrandDir, $LiveDir, $VideoDir | Out-Null

$logoMap = @{
  "DAB Logos\Wide Screen Logos\56A98350-CC99-40A1-B0D0-784DA9A7FEE3.png" = "dab-logo-wide.png"
  "DAB Logos\Wide Screen Logos\3AA8D603-9A59-41D4-8591-1AB885D0DCDD.png" = "dab-logo-wide-alt.png"
  "DAB Logos\E5BFDF16-6B76-48F8-841A-7E3A35A90D2E.png" = "dab-logo-square.png"
  "DAB Logos\7625542D-EBEB-4A5C-AE25-420711F5E16A.png" = "dab-logo-mark.png"
  "DAB Logos\68A6EE58-E50F-4093-8532-C27B48BB9456.png" = "dab-logo-dark.png"
}

foreach ($entry in $logoMap.GetEnumerator()) {
  $src = Join-Path $SourceRoot $entry.Key
  if (Test-Path -LiteralPath $src) {
    Copy-Item -LiteralPath $src -Destination (Join-Path $BrandDir $entry.Value) -Force
    Write-Host "Logo -> $($entry.Value)"
  }
}

$liveIndex = 0
$liveSources = @(
  "Pics\Live Show Images\CBP00157.JPG",
  "Pics\Live Show Images\CBP01665.JPG",
  "Pics\Live Show Images\CBP01770.JPG",
  "Pics\Live Show Images\photo jun 06 2015, 11 29 07 pm.JPG",
  "Pics\Pics\CBP00398.JPG",
  "Pics\Pics\CBP04849.JPG",
  "Pics\Pics\IMG_2635.jpg",
  "Pics\Pics\IMG_3568.jpeg",
  "Pics\Pics\IMG_3581.jpeg",
  "Pics\Pics\IMG_3629.jpeg",
  "Pics\Pics\IMG_3638.jpeg",
  "Pics\Pics\IMG_3667.jpeg",
  "Pics\Pics\IMG_5331.JPG",
  "Pics\Pics\IMG_5332.JPG",
  "Pics\Pics\IMG_6104.jpeg",
  "Pics\Pics\IMG_6186.jpeg",
  "Pics\Pics\IMG_6192.jpeg",
  "Pics\Pics\IMG_6199.jpeg",
  "Pics\Pics\Photo Jul 19 2025, 7 51 50 PM.JPG",
  "Pics\Pics\Photo Jul 19 2025, 8 01 34 PM.JPG",
  "Pics\Pics\Photo Jul 19 2025, 8 01 50 PM.JPG"
)

$liveManifest = @()
foreach ($rel in $liveSources) {
  $src = Join-Path $SourceRoot $rel
  if (-not (Test-Path -LiteralPath $src)) { continue }
  $liveIndex++
  $ext = [System.IO.Path]::GetExtension($src).ToLower()
  $destName = "live-{0:D2}{1}" -f $liveIndex, $ext
  Copy-Item -LiteralPath $src -Destination (Join-Path $LiveDir $destName) -Force
  $liveManifest += @{
    file = "/assets/images/live/$destName"
    source = $rel
    alt = "David Adam Byrnes live on stage"
  }
  Write-Host "Live -> $destName"
}

$videoMap = @{
  "Promo Video\Wide screen promo video.MOV" = "promo-wide.mov"
  "Promo Video\Square promo video.mov" = "promo-square.mov"
  "Promo Video\Virtical promo video .mov" = "promo-vertical.mov"
}

$videoManifest = @()
foreach ($entry in $videoMap.GetEnumerator()) {
  $src = Join-Path $SourceRoot $entry.Key
  if (-not (Test-Path -LiteralPath $src)) { continue }
  Copy-Item -LiteralPath $src -Destination (Join-Path $VideoDir $entry.Value) -Force
  $videoManifest += @{
    file = "/assets/video/$($entry.Value)"
    source = $entry.Key
    label = $entry.Value
  }
  Write-Host "Video -> $($entry.Value)"
}

$register = @{
  syncedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
  sourceRoot = $SourceRoot
  excluded = @(
    "SIDE BYRNES W9-Wire Info",
    "DAB- Credentials-Security",
    "Riders",
    "STAGE PLOT-INPUT LIST"
  )
  brand = @(
    "/assets/brand/dab-logo-wide.png",
    "/assets/brand/dab-logo-wide-alt.png",
    "/assets/brand/dab-logo-square.png",
    "/assets/brand/dab-logo-mark.png",
    "/assets/brand/dab-logo-dark.png"
  )
  livePhotos = $liveManifest
  promoVideos = $videoManifest
}

$register | ConvertTo-Json -Depth 6 | Set-Content -Path $RegisterPath -Encoding UTF8
Write-Host "Register -> $RegisterPath"
Write-Host "Done. $($liveManifest.Count) live photos, $($videoManifest.Count) promo videos."

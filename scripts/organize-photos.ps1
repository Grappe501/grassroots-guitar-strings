# Sync + organize Grassroots event photos from RedDirt intake folder into story buckets.
$Source = "H:\SOSWebsite\RedDirt\public\media\campaign-photos\grassroot and guitars"
$root = "H:\SOSWebsite\grassroots-guitar-strings\assets\images\shared-history"
$imgRoot = "H:\SOSWebsite\grassroots-guitar-strings\assets\images"

if (-not (Test-Path -LiteralPath $Source)) {
  Write-Host "Source not found: $Source"
  exit 1
}

# Named subfolders map directly; otherwise use all root images in sort order.
$namedBuckets = @("farm-festival-one", "farm-festival-two", "rose-bud-festival", "kelly-and-david")
$usedNamed = $false

foreach ($bucket in $namedBuckets) {
  $srcDir = Join-Path $Source $bucket
  if (-not (Test-Path -LiteralPath $srcDir)) { continue }
  $files = Get-ChildItem -LiteralPath $srcDir -File | Where-Object { $_.Extension -match '\.(jpe?g|png|webp|gif)$' } | Sort-Object Name
  if ($files.Count -eq 0) { continue }
  $usedNamed = $true
  $destDir = Join-Path $root $bucket
  Get-ChildItem -LiteralPath $destDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  $n = 1
  foreach ($f in $files) {
    $ext = if ($f.Extension -match '\.(jpe?g)$') { ".jpg" } else { $f.Extension.ToLower() }
    $destName = "{0:D2}{1}" -f $n, $ext
    Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $destDir $destName) -Force
    Write-Host "Named: $($f.Name) -> $bucket/$destName"
    $n++
  }
}

if (-not $usedNamed) {
  $all = Get-ChildItem -LiteralPath $Source -File | Where-Object { $_.Extension -match '\.(jpe?g|png|webp|gif)$' } | Sort-Object Name
  if ($all.Count -eq 0) {
    Write-Host "No images found in $Source"
    exit 0
  }
  $buckets = @(
    @{ name = "farm-festival-one"; start = 0; count = 4 },
    @{ name = "farm-festival-two"; start = 4; count = 4 },
    @{ name = "rose-bud-festival"; start = 8; count = 3 },
    @{ name = "kelly-and-david"; start = 11; count = 4 }
  )
  foreach ($b in $buckets) {
    $destDir = Join-Path $root $b.name
    Get-ChildItem -LiteralPath $destDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    $n = 1
    for ($i = $b.start; $i -lt ($b.start + $b.count) -and $i -lt $all.Count; $i++) {
      $f = $all[$i]
      $destName = "{0:D2}.jpg" -f $n
      Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $destDir $destName) -Force
      Write-Host "Auto: $($f.Name) -> $($b.name)/$destName"
      $n++
    }
  }
}

# Poster: use IMG_5615 if present (strong event shot), else first farm photo.
$posterCandidates = @(
  (Join-Path $Source "IMG_5615.JPG"),
  (Join-Path $root "farm-festival-one\03.jpg"),
  (Join-Path $root "kelly-and-david\01.jpg")
)
foreach ($c in $posterCandidates) {
  if (Test-Path -LiteralPath $c) {
    Copy-Item -LiteralPath $c -Destination (Join-Path $imgRoot "event-poster.jpg") -Force
    Copy-Item -LiteralPath $c -Destination (Join-Path $imgRoot "event-poster-social.jpg") -Force
    Write-Host "Poster set from $c"
    break
  }
}

Write-Host "Done. $($all.Count) source images processed."

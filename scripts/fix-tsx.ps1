# Step 1: Remove orphan lines 691-846 (old 3-panel body + duplicate closing)
$file = "src/components/pages/SundayArchitect.tsx"
$lines = Get-Content $file
$keep = $lines[0..689] + $lines[846..($lines.Length-1)]
Set-Content $file $keep -Encoding UTF8
Write-Host "Step 1 done. Lines: $($keep.Length)"

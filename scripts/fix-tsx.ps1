$file = "src/components/pages/SundayArchitect.tsx"
$lines = Get-Content $file
# Remove lines 974-1039 (0-indexed: 973-1038) — the orphan old SacramentFlow return body
$keep = $lines[0..972] + $lines[1039..($lines.Length-1)]
Set-Content $file $keep -Encoding UTF8
Write-Host "Done. Lines: $($keep.Length)"

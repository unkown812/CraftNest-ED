npx --yes --package @playwright/cli playwright-cli resize 390 844 > $null 2>&1
Start-Sleep -Seconds 2
foreach ($route in @("/", "/shop", "/cart")) {
  npx --yes --package @playwright/cli playwright-cli goto "http://localhost:5173$route" > $null 2>&1
  Start-Sleep -Seconds 2
  $out = npx --yes --package @playwright/cli playwright-cli eval "() => document.documentElement.scrollWidth + '/' + document.documentElement.clientWidth" 2>&1 | Select-String -Pattern '^\s*"\d+/\d+"' | Select-Object -First 1
  Write-Output "$route -> $out"
}

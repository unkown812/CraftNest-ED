foreach ($r in @("/", "/shop", "/product/spiced-vanilla-amber-concrete-candle", "/cart", "/about", "/become-seller", "/contact", "/shipping-policy", "/returns-policy", "/privacy-policy", "/login", "/register")) {
  npx --yes --package @playwright/cli playwright-cli goto "http://localhost:5173$r" > $null 2>&1
  Start-Sleep -Seconds 3
  $info = npx --yes --package @playwright/cli playwright-cli eval "() => location.pathname + ' is404=' + !!document.querySelector('.empty-state')" 2>&1 | Select-String -Pattern 'is404' | Select-Object -First 1
  Write-Output "${r} => $info"
}

foreach ($r in @("/", "/product/spiced-vanilla-amber-concrete-candle", "/cart")) {
  npx --yes --package @playwright/cli playwright-cli goto "http://localhost:5173$r" > $null 2>&1
  Start-Sleep -Seconds 4
  $info = npx --yes --package @playwright/cli playwright-cli eval "() => ({ p: location.pathname, t: document.title, notfound: document.body.innerText.indexOf('This shelf is empty') > -1, empty: !!document.querySelector('.empty-state') })" > $null 2>&1
  $info = npx --yes --package @playwright/cli playwright-cli eval "() => ({ p: location.pathname, t: document.title, notfound: document.body.innerText.indexOf('This shelf is empty') > -1, empty: !!document.querySelector('.empty-state') })" 2>&1 | Select-String -Pattern 'notfound' | Select-Object -First 1
  Write-Output "${r} => $info"
}

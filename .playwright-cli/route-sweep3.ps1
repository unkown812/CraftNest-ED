foreach ($r in @("/seller/shop", "/seller/analytics", "/seller/products", "/seller/orders", "/admin/sellers", "/admin/users", "/admin/orders", "/admin/reports")) {
  npx --yes --package @playwright/cli playwright-cli goto "http://localhost:5173$r" > $null 2>&1
  Start-Sleep -Seconds 4
  $info = npx --yes --package @playwright/cli playwright-cli eval "() => ({ p: location.pathname, t: document.title, notfound: document.body.innerText.indexOf('This shelf is empty') > -1, dash: !!document.querySelector('.dash-sidebar') })" > $null 2>&1
  $info = npx --yes --package @playwright/cli playwright-cli eval "() => ({ p: location.pathname, t: document.title, notfound: document.body.innerText.indexOf('This shelf is empty') > -1, dash: !!document.querySelector('.dash-sidebar') })" 2>&1 | Select-String -Pattern 'notfound' | Select-Object -First 1
  Write-Output "${r} => $info"
}

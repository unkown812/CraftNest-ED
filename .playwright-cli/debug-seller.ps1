npx --yes --package @playwright/cli playwright-cli goto http://localhost:5173/login > $null 2>&1
Start-Sleep -Seconds 3
npx --yes --package @playwright/cli playwright-cli find "Seller" > $null 2>&1
npx --yes --package @playwright/cli click f4e64 > $null 2>&1
Start-Sleep -Seconds 2
npx --yes --package @playwright/cli playwright-cli find "Sign in" > $null 2>&1
npx --yes --package @playwright/cli click f4e90 > $null 2>&1
Start-Sleep -Seconds 6
npx --yes --package @playwright/cli playwright-cli goto http://localhost:5173/seller/dashboard > $null 2>&1
Start-Sleep -Seconds 5
npx --yes --package @playwright/cli playwright-cli eval "() => ({ path: location.pathname, tok: !!localStorage.getItem('token'), hasDash: !!document.querySelector('.dash-sidebar') })" > $null 2>&1
npx --yes --package @playwright/cli playwright-cli eval "() => ({ path: location.pathname, tok: !!localStorage.getItem('token'), hasDash: !!document.querySelector('.dash-sidebar') })" 2>&1 | Select-Object -First 3

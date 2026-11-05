npx --yes --package @playwright/cli playwright-cli resize 1440 900 > $null 2>&1
Start-Sleep -Seconds 2
npx --yes --package @playwright/cli playwright-cli goto http://localhost:5173/ > $null 2>&1
Start-Sleep -Seconds 3
npx --yes --package @playwright/cli playwright-cli eval "() => { const f = document.querySelector('footer'); const cs = getComputedStyle(f); const r = f.getBoundingClientRect(); return 'DESKTOP FOOTER display=' + cs.display + ' h=' + Math.round(r.height) + ' sw=' + document.documentElement.scrollWidth + '/' + document.documentElement.clientWidth; }" > $null 2>&1
npx --yes --package @playwright/cli playwright-cli eval "() => { const f = document.querySelector('footer'); const cs = getComputedStyle(f); const r = f.getBoundingClientRect(); return 'DESKTOP FOOTER display=' + cs.display + ' h=' + Math.round(r.height) + ' sw=' + document.documentElement.scrollWidth + '/' + document.documentElement.clientWidth; }" 2>&1 | Select-Object -First 3

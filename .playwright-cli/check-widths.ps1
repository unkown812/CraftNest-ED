foreach ($w in @(320, 390, 768, 1024, 1440)) {
  npx --yes --package @playwright/cli playwright-cli resize $w 844 > $null 2>&1
  Start-Sleep -Seconds 2
  npx --yes --package @playwright/cli playwright-cli goto http://localhost:5173/ > $null 2>&1
  Start-Sleep -Seconds 2
  $out = npx --yes --package @playwright/cli playwright-cli eval "() => { const n = document.querySelector('.mobile-bottom-nav'); const nav = n ? getComputedStyle(n).display : 'NO_NAV'; const t = document.querySelector('.nav-mobile-toggle'); const tog = t ? getComputedStyle(t).display : 'NO_TOGGLE'; const l = document.querySelector('.nav-desktop-links'); const links = l ? getComputedStyle(l).display : 'NO_LINKS'; return 'nav=' + nav + ' toggle=' + tog + ' links=' + links + ' sw=' + document.documentElement.scrollWidth + ' cw=' + document.documentElement.clientWidth; }" 2>&1 | Select-String -Pattern 'nav=' | Select-Object -First 1
  Write-Output "width=$w -> $out"
}

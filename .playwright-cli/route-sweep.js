const routes = [
  ['/', 'home'],
  ['/shop', 'shop'],
  ['/product/spiced-vanilla-amber-concrete-candle', 'product'],
  ['/cart', 'cart'],
  ['/about', 'about'],
  ['/become-seller', 'become-seller'],
  ['/contact', 'contact'],
  ['/shipping-policy', 'shipping'],
  ['/returns-policy', 'returns'],
  ['/privacy-policy', 'privacy'],
  ['/login', 'login'],
  ['/register', 'register'],
  ['/checkout', 'checkout-protected'],
  ['/order-success/abc123', 'order-success-protected'],
  ['/buyer/orders', 'buyer-orders-protected'],
  ['/buyer/wishlist', 'buyer-wishlist-protected'],
  ['/buyer/dashboard', 'buyer-dashboard-protected'],
  ['/seller/dashboard', 'seller-protected'],
  ['/admin/dashboard', 'admin-protected']
];

(async () => {
  const out = [];
  for (const [r, name] of routes) {
    await page.goto('http://localhost:5173' + r);
    await new Promise((res) => setTimeout(res, 3500));
    const info = await page.evaluate(() => ({
      path: location.pathname,
      title: document.title,
      is404: !!document.querySelector('.empty-state')
    }));
    out.push(name + ': ' + JSON.stringify(info));
  }
  return out.join(' || ');
})();

// ============================================================
//  Service Worker - 禁用缓存，强制每次从网络拉取最新文件
//  原因: data.js 经常更新，必须保证用户始终看到最新数据
// ============================================================

// 安装时立即激活，不等待旧标签页关闭
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

// 激活时：清除所有旧缓存，并立即接管所有打开的标签页
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// 所有请求直接走网络，完全不用缓存
// 如果网络失败（离线），再 fallback 到缓存（仅作为最后手段）
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// 生活職場実態点検手帳 - Service Worker
// 毎日決まった時間に通知を送る

let notificationTime = '21:00';

// インストール
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// アクティブ化
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// メインスレッドからのメッセージ受信
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_TIME') {
    notificationTime = event.data.time || '21:00';
  }
});

// 定期的にチェック（60秒ごと）
let lastNotifiedDate = '';
setInterval(() => {
  const now = new Date();
  const currentTime = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  const today = now.toISOString().slice(0,10);

  if (currentTime === notificationTime && lastNotifiedDate !== today) {
    lastNotifiedDate = today;
    self.registration.showNotification('📝 春闘手帳', {
      body: '今日の記録をつけましょう！仲間の声を集めて、たたかいの根拠に！',
      icon: './',
      badge: './',
      tag: 'daily-reminder',
      vibrate: [200, 100, 200],
      data: { url: './' }
    });
  }
}, 60000);

// 通知クリックでアプリを開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('./');
      }
    })
  );
});
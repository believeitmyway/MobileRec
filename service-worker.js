// Service Worker - モデルファイルのキャッシュ管理
const CACHE_NAME = 'pose-detection-cache-v1';
const MODEL_CACHE_NAME = 'tfjs-models-cache-v1';

// キャッシュするリソース
const CORE_ASSETS = [
    '/',
    '/index.html'
];

// TensorFlow.js と関連ライブラリのURL
const TFJS_URLS = [
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection@1.0.1/'
];

// インストール時
self.addEventListener('install', (event) => {
    console.log('[Service Worker] インストール中...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] コアアセットをキャッシュ');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] インストール完了');
                return self.skipWaiting(); // 即座にアクティブ化
            })
    );
});

// アクティベート時
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] アクティベート中...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 古いキャッシュを削除
                    if (cacheName !== CACHE_NAME && cacheName !== MODEL_CACHE_NAME) {
                        console.log('[Service Worker] 古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] アクティベート完了');
            return self.clients.claim(); // 即座に制御を開始
        })
    );
});

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // TensorFlow.js のモデルファイル（.bin, .json）はキャッシュファーストで取得
    if (url.hostname.includes('cdn.jsdelivr.net') || 
        url.hostname.includes('tfhub.dev') ||
        url.hostname.includes('storage.googleapis.com') ||
        event.request.url.includes('tfjs') ||
        event.request.url.includes('movenet') ||
        event.request.url.includes('face-detection') ||
        event.request.url.endsWith('.bin') ||
        event.request.url.endsWith('.json')) {
        
        event.respondWith(
            caches.open(MODEL_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] キャッシュから取得:', event.request.url);
                        return cachedResponse;
                    }
                    
                    // キャッシュになければネットワークから取得してキャッシュに保存
                    console.log('[Service Worker] ネットワークから取得してキャッシュ:', event.request.url);
                    return fetch(event.request).then((response) => {
                        // 成功したレスポンスのみキャッシュ
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    });
                });
            })
        );
        return;
    }
    
    // その他のリクエストは通常通りネットワークから取得
    event.respondWith(
        fetch(event.request).catch(() => {
            // ネットワークが利用できない場合はキャッシュを使用
            return caches.match(event.request);
        })
    );
});

// メッセージを受信したときの処理
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        caches.open(MODEL_CACHE_NAME).then((cache) => {
            cache.keys().then((keys) => {
                const cachedUrls = keys.map(req => req.url);
                const modelFilesCached = cachedUrls.filter(url => 
                    url.endsWith('.bin') || url.endsWith('.json')
                ).length;
                
                event.ports[0].postMessage({
                    type: 'CACHE_STATUS',
                    cached: modelFilesCached > 0,
                    fileCount: modelFilesCached
                });
            });
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(MODEL_CACHE_NAME).then(() => {
            console.log('[Service Worker] モデルキャッシュをクリア');
            event.ports[0].postMessage({
                type: 'CACHE_CLEARED',
                success: true
            });
        });
    }
});

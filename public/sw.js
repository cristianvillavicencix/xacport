// Service Worker para PWA
const CACHE_NAME = 'lbs-estimados-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Error al cachear:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en cache, devolver desde cache
        if (response) {
          return response;
        }
        
        // Si no está en cache, hacer request a la red
        return fetch(event.request)
          .then((response) => {
            // Verificar si es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta
            const responseToCache = response.clone();

            // Agregar al cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si falla la red, mostrar página offline básica
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Manejar notificaciones push (para futuras implementaciones)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push recibido');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de LBS',
    icon: 'https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png',
    badge: 'https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: 'https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: 'https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Latinos Business Support', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificación clickeada');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
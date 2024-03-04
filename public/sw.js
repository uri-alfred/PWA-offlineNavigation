importScripts('js/sw-utils.js')
//Crear las variables de cache
const CACHE_DYNAMIC = 'dynamic-v1' //Para los archivos que se van a descargar
const CACHE_STATIC = 'static-v2 '    //App shell
const CACHE_INMUTABLE = 'inmutable-v1'// CDN de terceros. LIBRERIAS


const CACHE_DYNAMIC_LIMIT = 50
//Funcion para limpiar el cache
const limpiarCache = (cacheName, numberItem) => {
    caches.open(cacheName)
        .then(cache => {
            cache.keys()
                .then(keys => {
                    if (keys.length > numberItem) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numberItem))
                    }
                })
        })

}
self.addEventListener('install', event => {

    const cahePromise = caches.open(CACHE_STATIC).then(cache => {

        return cache.addAll([

            '/',
            '/index.html',
            '/js/app.js',
            '/sw.js',
            'static/js/bundle.js',
            'favicon.ico',
            './pages/offline.html',
            'manifest.json',
            '/js/sw-utils.js',
        ])
    })
    const caheInmutable = caches.open(CACHE_INMUTABLE).then(cache => {

        return cache.addAll([

            'https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Roboto:wght@100&display=swap'

        ])
    })
    event.waitUntil(Promise.all([cahePromise, caheInmutable]))
})

//Proceso de activacion
self.addEventListener('activate', event => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC && key.includes('static')) {
                return caches.delete(key)
            }
            if (key !== CACHE_DYNAMIC && key.includes('dynamic')) {
                return caches.delete(key)
            }
        })
    })
    event.waitUntil(respuesta)
})
self.addEventListener('fetch', event => {
    //Cache with network fallback optimizado

    const respuesta = caches.match(event.request).then(res => {
        //si existe en cache lo regresa
        if (res) return res
        //No existen archivos
        // console.log(event.request.url)
        return fetch(event.request).then(newRes => {
            // Guardar en cache dinamico
            return actualizaCacheDinamico(CACHE_DYNAMIC, event.request, newRes)
        })
    })

    event.respondWith(respuesta)
})

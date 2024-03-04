//Guardar en el cache dinamico
const actualizaCacheDinamico = (dynamicCache, req, res) => {
   
    if (res.ok) {
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone())
            return res.clone()
        })
    } else {
        // error directo del servidor, cuando no existe en cache y tampoco hay internet
        //Si no logra obtener nada, retorna la respuesta original
        return res
    }
}
//Archivo auxiliar del sw
//Guardar en el cache dinamico

function actualizaCacheDinamico(dynamicCache, req, res) {
        if(res.ok){//Si lo hizo
                return caches.open(dynamicCache).then(cache =>{
                        cache.put(req, res.clone());//almacenar en el cache la request y clonar la res
                        return res.clone();
                });
        } else {
                return res;
        }
}
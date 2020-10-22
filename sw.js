//Imports
importScripts('js/sw-utils.js');


//Declarar 3 constantes
const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';/*aqui se pone cuando no se va a modificar*/

//Declarar arreglo appshell (estatico), va a contener todo lo que es necesario para la app
// lo que nosotros hicimos, no enlaces externos es decir hechas por terceros.
const APP_SHELL = [
        '/', //Esta siempre va, es necearia
        'index.html',
        'css/style',
        'img/favicon.ico',
        /*las imagenes pueden ir en el dynamico en caso que tengan que cambiarse por el usuario y crecer
        aqui solo va lo estatico*/
        'img/avatars/hulk.jpg',
        'img/avatars/iroman.jpg',
        'img/avatars/spiderman.jpg',
        'img/avatars/thor.jpg',
        'img/avatars/wolverine.jpg',
        'js/app.js'
];

//Aqui va todo lo que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
        'https://fonts.googleapis.com/css?family=Quicksand:300,400',
        'https://fonts.googleapis.com/css?family=Lato:400,300',
        'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
        'css/animate.css',
        'js/libs/jquery.js'
];

//      Procesos de instalacion, almacenar los appshell
self.addEventListener('install', e => {
        
        const cacheStatic = caches.open(STATIC_CACHE).then(cache => 
                cache.addAll(APP_SHELL));

        const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => 
                cache.addAll(APP_SHELL_INMUTABLE));

        e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

//      Proceso para borrar los caches viejos
self.addEventListener('activate', e => {
        const respuesta = caches.keys().then(keys => {
                keys.forEach(key =>{
                        if( key !== STATIC_CACHE && key.includes('static') ){
                                return caches.delete(key);
                        }
                });
        });
        e.waitUntil(respuesta);
        /*const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            // static-v4
            if (  key !== CACHE_STATIC_NAME && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });



    e.waitUntil( respuesta );*/
});

self.addEventListener('fetch', e => {
        
        const respuesta = caches.match(e.request).then(res => {
                if(res){
                        return res;
                } else {
                return fetch(e.request).then(newRes => {
                        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
                });
                }
        });
        e.respondWith(respuesta);
});
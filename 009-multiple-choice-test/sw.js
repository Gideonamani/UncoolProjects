const appCacheNames = ['gideonamani-testor-v1'];
const mainCache = appCacheNames[0];

self.addEventListener('install', event => {
	console.log("Installing SW");
	event.waitUntil(
		caches.open(mainCache).then(function(cache) {
			cache.addAll([
					"./",
					"./manifest.json",
					"./index.html",
					"./js/index.js",
					"./js/main.js",
					"./css/main.css",
					"./images/icons/icon-size-72.png",
					"./favicon.ico",
					// "./json/*",
					"./html/test.html",
					"./js/class-test.js",
					"./js/class-question.js"
				]);
		})
	);
});

self.addEventListener('activate', event => {
  event.waitUntil(
  	// deleting unused caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          const appCache = cacheName.startsWith("gideonamani-testor");
          const outOfDateCache = appCacheNames.indexOf(cacheName) < 0;
          const notTestCache = !cacheName.startsWith("gideonamani-testor-test-#");
          return (appCache && outOfDateCache && notTestCache);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );	
});

self.addEventListener('fetch', event => {
	// console.log(event.request);
	// console.log("event.request");
	// Promise.resolve().then( () => { 
	// 	console.log("inside the promise");
	// });
	event.respondWith(
		// look in the cache
		caches.open(mainCache).then( cache => {
		// if(event.request.url.includes("/images/structures/"))

			const urlPath = new URL(event.request.url).pathname;
			return caches.match(urlPath).then(retreivedResource => {
				if(retreivedResource) return retreivedResource;
				// if we can't find the resource in the catch, fetch it from network
				return fetchFromNetwork(event);
			})
		})
	)

});

function fetchFromNetwork (event){
	return fetch(event.request).then( response => {
		if(response.status == 404){
			return new Response("Oops Daisey, file not found.");
			// return fetch("404.html");
		}
		return response;
	}).catch( () => {
		return new Response("OFFLINE");
	})
}
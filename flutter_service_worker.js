'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "ac4840a8a65d0bcc70784a5160a9b87f",
"/": "ac4840a8a65d0bcc70784a5160a9b87f",
"main.dart.js": "6f3aaed206ecfb5b1e663f8721552f4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "a9ed7391b96f7368795ea0735c41b2ca",
"Archive.zip": "a5441cbe6aafca5c2ae5c19b1f8d2b6f",
"assets/AssetManifest.json": "2c678a93bd61bd1cc921a9ac76ffaa02",
"assets/NOTICES": "204842289777735b21d7295f4dbeb297",
"assets/FontManifest.json": "39500f784daf5f9a156a4421bca749b3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/assets/icons/hand.svg": "0dd568edcf732673ef3fe8315c2bbd11",
"assets/assets/icons/law-order.svg": "49dd6ac26fd72118755f4334cecbdf64",
"assets/assets/icons/chart-pie_w.svg": "d7b3b2e7ea6a8be8bfa5ff1047cc144e",
"assets/assets/icons/apartment.svg": "14dd57b43392ce1fada779683ed0af01",
"assets/assets/icons/calendar_w.svg": "0385341a63067b5a4ee0208efe053752",
"assets/assets/icons/notepad.svg": "786d0748844185d4750555e1c7b579a7",
"assets/assets/icons/auction_w.svg": "377e923073a784105d4a987801a87d9f",
"assets/assets/icons/company_w.svg": "c8e506cb8a9bec77da97365caf268243",
"assets/assets/icons/files-stack.svg": "30b04f4f390dd76b74f38c32c0c714be",
"assets/assets/icons/auction.svg": "3319dc62fc294b497005f3bf46a4c42c",
"assets/assets/icons/logo.png": "d42762293b99afe3f3a135059d6ebc42",
"assets/assets/icons/chart-pie.svg": "1c0d2fe5f6a38a1cd6a2dad73d4fe799",
"assets/assets/icons/law-order_w.svg": "69b6e5ad39609575cd74d5ddc0c070ef",
"assets/assets/icons/apartment-24px.png": "b35bcf4c7af4d3d552fe2dd5bc5b2c82",
"assets/assets/icons/hand_w.svg": "69ec292827587eafdaeb92781baab378",
"assets/assets/icons/files-stack_w.svg": "43a84e0d7dbce0b4a96b0b7ac1f9c77f",
"assets/assets/icons/apartment_w.svg": "3914b19849b7b785bc1cdf2b4f96f691",
"assets/assets/icons/notepad_w.svg": "8973b5a8eb8c8bca700cf80ba1c4a766",
"assets/assets/icons/calendar.svg": "cc5b4363523307e8fe3eb4f2e8efbbe0",
"assets/assets/icons/company.svg": "60c23d3cc25092b9db2d9a1c2d6ee864",
"assets/assets/fonts/Open_Sans/OpenSans-Light.ttf": "2d0bdc8df10dee036ca3bedf6f3647c6",
"assets/assets/fonts/Open_Sans/OpenSans-Italic.ttf": "f6238deb7f40a7a03134c11fb63ad387",
"assets/assets/fonts/Open_Sans/OpenSans-Bold.ttf": "1025a6e0fb0fa86f17f57cc82a6b9756",
"assets/assets/fonts/Open_Sans/OpenSans-Regular.ttf": "3ed9575dcc488c3e3a5bd66620bdf5a4"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

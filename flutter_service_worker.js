'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "82842f79a82f759cec1dff08ba51c7ea",
"index.html": "3dc91dd9431f32f9c02ff9f4035ed4d3",
"/": "3dc91dd9431f32f9c02ff9f4035ed4d3",
"main.dart.js": "80d798be439e19a3b3e1001d233e77d0",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "a9ed7391b96f7368795ea0735c41b2ca",
"Archive.zip": "dc984c66c290fbc8446928511724eb08",
"assets/AssetManifest.json": "ccf2145850d58ca3f5c688b33d6735d0",
"assets/NOTICES": "6cb2ec27497095bccb1999b731c6a118",
"assets/FontManifest.json": "061133d92cab4b9ccd1ceda1ca5c7152",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_widget_from_html_core/test/images/logo.png": "57838d52c318faff743130c3fcfae0c6",
"assets/packages/flutter_widget_from_html/test/images/logo.svg": "fdb46fc7657324f79bd97928651e8274",
"assets/packages/wakelock_web/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/assets/icons/hand.svg": "0dd568edcf732673ef3fe8315c2bbd11",
"assets/assets/icons/auction_w.png": "8458d0d5ba91bc69b25afc709401282b",
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
"assets/assets/icons/files-stack_w.png": "7b31e4929563a6d096d133f7f9b4d1ff",
"assets/assets/icons/files-stack_w.svg": "43a84e0d7dbce0b4a96b0b7ac1f9c77f",
"assets/assets/icons/apartment_w.svg": "3914b19849b7b785bc1cdf2b4f96f691",
"assets/assets/icons/notepad_w.svg": "8973b5a8eb8c8bca700cf80ba1c4a766",
"assets/assets/icons/calendar.svg": "cc5b4363523307e8fe3eb4f2e8efbbe0",
"assets/assets/icons/company.svg": "60c23d3cc25092b9db2d9a1c2d6ee864",
"assets/assets/icons/auction.png": "f62cdc3a533a766e4820f8a3138d2c61",
"assets/assets/icons/files-stack.png": "f3e4f8fe54a404551ff68ae0be16b397",
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
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
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
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
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
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
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

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

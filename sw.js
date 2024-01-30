const CACHE_NAME = `browser-portrait`;

self.addEventListener('install', event => {
  console.log('installing')
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      //'https://d3js.org/d3.v4.min.js',
      //'/node_modules/d3-cloud/build/d3.layout.cloud.js',
      '/',
      '/script.js',
      '/manifest.json',
    ]);
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "POST") {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  event.respondWith(
    (async () => {
      try {
        event.preventDefault();
        // const cloneRequest = event.request.clone();
        // const textData = await cloneRequest.text();
        // console.log("------------------textData-------------", textData);
        // const parsedBody = new URLSearchParams(textData);
        // console.log("-----------------------parsebody", parsedBody);
        // for (const [key, value] of parsedBody.entries()) {
        //   console.log("~~~~~key\r\n", key, "\r\n~~~~~value\r\n", value);

        // };
        const formData = await event.request.formData();
        // var stringifiedFormData = "service-worker::fetch > event.formData() > entries:\r\n";
        // for (var entry of formData) {
        //   stringifiedFormData += entry.toString() + "\r\n";
        //   if (entry[1] instanceof File) {
        //     tryReadFile(entry[1]);
        //   }
        //   if (entry[1] instanceof FileList) {
        //     for (var file of entry[1]) {
        //       tryReadFile(file);
        //     }
        //   }
        // }
        // console.debug(stringifiedFormData);
        const title = formData.getAll('mapped_title');
        const url = formData.getAll('mapped_url');
        const image = formData.getAll('mapped_files');
        return new Response(JSON.stringify(formData), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        console.warn("POST failed: ", e);
        return new Response("POST request fialed", { status: 500, statusText: "POST request fialed" });
      }
      // return fetch(event.request.url);
    })(),
  );
});

self.clients.matchAll().then(clients => {
  clients.forEach(client => {
    client.postMessage({ formData: formData });
  });
});


function tryReadFile(file) {
  try {
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
      var text = e.target.result;
      console.debug("Read file '", file, "': ", truncate_string(text));
    });
    reader.addEventListener('error', function () {
      console.warn("Failed to read file '", file, "'");
    });
    reader.readAsText(file);
  } catch (ex) {
    console.warn("Failed to start reading file '", file, "'");
  }
}

function truncate_string(str, length) {
  if (!length) {
    length = 100;
  }
  if (str.length > length) {
    return str.substring(0, length - 3) + "...";
  }
  return str;
}

// const cachedResponse = await cache.match(event.request);
// if (cachedResponse) {
//   return cachedResponse;
// } else {
//   try {
//     const fetchResponse = await fetch(event.request);
//     if (!event.request.url.startsWith('chrome-extension://')) {
//       cache.put(event.request, fetchResponse.clone());
//     }
//     return fetchResponse;
//   } catch (e) {
//     // Handle fetch error
//   }
// }
//   }) ());
// });


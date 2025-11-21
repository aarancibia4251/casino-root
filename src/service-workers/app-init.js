if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-workers/app-sw.js")
    .then(() => {
      console.log("con service worker");
    })
    .catch((e) => {
      console.log("Error al instalar SW", e);
    });
} else {
  console.log("no service worker");
}

import { registerApplication, start, LifeCycles } from "single-spa";
(window as any).global = window.globalThis;
// import "./service-workers/app-init.js";

registerApplication({
  name: "@arancibia/casino-client",
  app: () => System.import<LifeCycles>("@arancibia/casino-client"),
  activeWhen: ["/casino-project"],
});

registerApplication({
  name: "@arancibia/appsteps",
  app: () => System.import<LifeCycles>("@arancibia/appsteps"),
  activeWhen: ["/pwa-project"],
});

registerApplication({
  name: "@arancibia/bodega",
  app: () => System.import<LifeCycles>("@arancibia/bodega"),
  activeWhen: ["/bodega-project"],
});

registerApplication({
  name: "@arancibia/home",
  app: () => System.import<LifeCycles>("@arancibia/home"),
  activeWhen: (location) => location.pathname === "/home",
});

if (location.pathname === "/") {
  location.replace("/home");
}

const el = document.getElementById('projects');

window.addEventListener("single-spa:routing-event", (evt: CustomEvent) => {
  if (evt?.detail?.newUrl.includes("/home")) {
    el.style.display = "none";
  } else {
    el.style.display = "block";
  }
});

start({
  urlRerouteOnly: true,
});

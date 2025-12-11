import { registerApplication, start, LifeCycles } from "single-spa";
(window as any).global = window;

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


if (location.pathname === "/") {
  location.replace("/bodega-project");
}

start({
  urlRerouteOnly: true,
});

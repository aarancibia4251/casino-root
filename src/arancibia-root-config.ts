import { registerApplication, start, LifeCycles } from "single-spa";
import "./assets/scripts/service-workers/app-init.js";
(window as any).global = window;

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

start({
  urlRerouteOnly: true,
});

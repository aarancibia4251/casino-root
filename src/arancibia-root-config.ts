import { registerApplication, start, LifeCycles } from "single-spa";
(window as any).global = window;
import "./assets/css/styles.css";

registerApplication({
  name: "@arancibia/bodega",
  app: () => System.import<LifeCycles>("@arancibia/bodega"),
  activeWhen: ["/bodega-project"],
});

registerApplication({
  name: "@arancibia/colas",
  app: () => System.import<LifeCycles>("@arancibia/colas"),
  activeWhen: ["/colas-project"],
});

registerApplication({
  name: "@arancibia/casino",
  app: () => System.import<LifeCycles>("@arancibia/casino"),
  activeWhen: ["/casino-project"],
});

if (location.pathname === "/") {
  location.replace("/bodega-project");
}

start({
  urlRerouteOnly: true,
});

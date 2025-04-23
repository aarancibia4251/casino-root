import { registerApplication, start, LifeCycles } from "single-spa";

registerApplication({
  name: "@arancibia/casino-client",
  app: () => System.import<LifeCycles>("@arancibia/casino-client"),
  activeWhen: ["/"],
});

start({
  urlRerouteOnly: true,
});

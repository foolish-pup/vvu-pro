import { createSSRApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

import "uno.css";

import { setupStore } from "@/store";

export function createApp() {
  const app = createSSRApp(App);

  setupStore(app);
  app.use(setupPlugins);
  return {
    app,
  };
}

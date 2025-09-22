/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import createPlugin from './svcfw';
import './dayjs';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  app.use(vuetify);
  app.use(createPlugin);
}

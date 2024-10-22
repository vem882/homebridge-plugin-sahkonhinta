import type { API } from 'homebridge';

import { SahkoHintaPlatform } from './platform.js';
import { PLATFORM_NAME } from './settings.js';

/**
 * Tämä funktio rekisteröi alustan Homebridgessä
 */
export default (api: API) => {
  api.registerPlatform(PLATFORM_NAME, SahkoHintaPlatform);
};

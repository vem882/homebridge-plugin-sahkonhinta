import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';
import { SahkoHintaAccessory } from './accessory.js';

/**
 * Tämä on pääluokka, joka vastaa Homebridge-alustasi toiminnasta.
 */
export class SahkoHintaPlatform implements DynamicPlatformPlugin {
  private readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.info('Initializing platform:', PLATFORM_NAME);

    // Kun Homebridge käynnistyy
    this.api.on('didFinishLaunching', () => {
      this.log.info('Executed didFinishLaunching callback');
      this.discoverDevices();
    });
  }

  /**
   * Tässä voit löytää laitteet (esim. sähköhinnan hakeminen API:sta).
   */
  discoverDevices() {
    // Voit lisätä logiikan sähkönhinnan hakemiseen ja lisävarusteiden luomiseen täällä.
    const exampleDevice = {
      uniqueId: 'sahko-hinta-1',
      displayName: 'Sähkön hinta',
    };

    const uuid = this.api.hap.uuid.generate(exampleDevice.uniqueId);

    const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

    if (existingAccessory) {
      this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
      existingAccessory.context.device = exampleDevice;
      this.api.updatePlatformAccessories([existingAccessory]);
    } else {
      this.log.info('Adding new accessory:', exampleDevice.displayName);

      const accessory = new this.api.platformAccessory(exampleDevice.displayName, uuid);

      accessory.context.device = exampleDevice;

      new SahkoHintaAccessory(this, accessory);

      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }
  }

  /**
   * Homebridge pyytää alustalta lisävarustetta.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }
}

import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { SahkoHintaPlatform } from './platform.js';
import axios from 'axios';

export class SahkoHintaAccessory {
  private service: Service;
  private price: number = 0;

  constructor(
    private readonly platform: SahkoHintaPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.service = this.accessory.getService(this.platform.api.hap.Service.TemperatureSensor) ||
                   this.accessory.addService(this.platform.api.hap.Service.TemperatureSensor);

    this.service.getCharacteristic(this.platform.api.hap.Characteristic.CurrentTemperature)
      .onGet(this.getPrice.bind(this));

    this.fetchPrice();
    setInterval(() => this.fetchPrice(), 3600000); // Fetch every hour
  }

  async fetchPrice() {
    try {
      const response = await axios.get('https://www.sahkohinta-api.fi/api/v1/halpa', {
        params: { tunnit: 1, tulos: 'haja' },
      });
      this.price = parseFloat(response.data[0].hinta);
      this.platform.log.info(`Fetched electricity price: ${this.price} snt/kWh`);
    } catch (error) {
      this.platform.log.error('Error fetching electricity price:', error);
    }
  }

  getPrice(): CharacteristicValue {
    return this.price;
  }
}

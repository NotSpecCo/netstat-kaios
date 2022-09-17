import { sub } from 'date-fns';
import { NetworkType } from '../enums';
import type { App, Network, Sample } from '../models';
import { toApp, toSample } from '../utils/mappers';

const Navigator: any = navigator;
const isDevice = !!Navigator.mozApps;

export class Device {
  static getApps(): Promise<App[]> {
    if (!isDevice)
      return Promise.resolve([
        {
          name: 'My App 1',
          manifestUrl: 'app1',
          iconUrl: '/images/default_icon.png',
          role: '',
          stats: { [NetworkType.Wifi]: [], [NetworkType.Sim1]: [], [NetworkType.Sim2]: [] },
        },
        {
          name: 'My App 2',
          manifestUrl: 'app2',
          iconUrl: '/images/default_icon.png',
          role: '',
          stats: { [NetworkType.Wifi]: [], [NetworkType.Sim1]: [], [NetworkType.Sim2]: [] },
        },
        {
          name: 'My App 3',
          manifestUrl: 'app3',
          iconUrl: '/images/default_icon.png',
          role: '',
          stats: { [NetworkType.Wifi]: [], [NetworkType.Sim1]: [], [NetworkType.Sim2]: [] },
        },
        {
          name: 'My App 4',
          manifestUrl: 'app4',
          iconUrl: '/images/default_icon.png',
          role: '',
          stats: { [NetworkType.Wifi]: [], [NetworkType.Sim1]: [], [NetworkType.Sim2]: [] },
        },
        {
          name: 'My App 5',
          manifestUrl: 'app5',
          iconUrl: '/images/default_icon.png',
          role: '',
          stats: { [NetworkType.Wifi]: [], [NetworkType.Sim1]: [], [NetworkType.Sim2]: [] },
        },
      ]);

    return new Promise((resolve, reject) => {
      let req = Navigator.mozApps.mgmt.getAll();
      req.onsuccess = async function () {
        const results: App[] = this.result.map((a) => toApp(a));
        for (const result of results) {
          result.stats = await Device.getNetworkStats(result.manifestUrl);
        }
        resolve(results);
      };
      req.onerror = function () {
        reject(new Error(this.error.name + ' ' + this.error.message));
      };
    });
  }

  static async getNetworkStats(manifestUrl: string): Promise<{
    [NetworkType.Wifi]: Sample[];
    [NetworkType.Sim1]: Sample[];
    [NetworkType.Sim2]: Sample[];
  }> {
    const end = new Date();
    const start = sub(end, { days: 31 });

    try {
      const [wifi, sim1, sim2] = await Promise.all([
        this.getSamples(NetworkType.Wifi, start, end, manifestUrl),
        this.getSamples(NetworkType.Sim1, start, end, manifestUrl),
        this.getSamples(NetworkType.Sim2, start, end, manifestUrl),
      ]);

      return {
        [NetworkType.Wifi]: wifi,
        [NetworkType.Sim1]: sim1,
        [NetworkType.Sim2]: sim2,
      };
    } catch (err) {
      console.error(err);
    }

    return {
      [NetworkType.Wifi]: [],
      [NetworkType.Sim1]: [],
      [NetworkType.Sim2]: [],
    };
  }

  static getNetworks(): Promise<Network[]> {
    return new Promise((resolve, reject) => {
      let req = Navigator.mozNetworkStats.getAvailableNetworks();
      req.onsuccess = function () {
        resolve(this.result);
      };
      req.onerror = function () {
        reject(new Error(this.error.name + ' ' + this.error.message));
      };
    });
  }

  static async getSamples(
    networkType: NetworkType,
    start: Date,
    end: Date,
    manifestUrl: string
  ): Promise<Sample[]> {
    const networks = await this.getNetworks();
    const network = networks[networkType];
    const options = manifestUrl ? { appManifestURL: manifestUrl } : undefined;

    return new Promise((resolve, reject) => {
      let req = Navigator.mozNetworkStats.getSamples(network, start, end, options);
      req.onsuccess = function () {
        // console.log('stats result', this.result);
        resolve(this.result.data.reverse().map((a) => toSample(a)));
      };
      req.onerror = function () {
        reject(new Error(this.error.name + ' ' + this.error.message));
      };
    });
  }
}

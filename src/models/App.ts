import type { NetworkType } from '../enums';
import type { Sample } from './Sample';

export type App = {
  name: string;
  iconUrl: string;
  origin: string;
  manifestUrl: string;
  role: '' | 'system' | 'theme' | 'homescreen' | 'input';
  stats: {
    [NetworkType.Wifi]: Sample[];
    [NetworkType.Sim1]: Sample[];
    [NetworkType.Sim2]: Sample[];
  };
};

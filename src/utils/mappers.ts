import { NetworkType } from '../enums';
import type { App, Sample } from '../models';

export function toApp(source: any): App {
  const iconPath =
    source.manifest.icons?.['56'] ||
    source.manifest.icons?.['112'] ||
    source.manifest.icons?.['128'];

  return {
    name: source.manifest.name,
    manifestUrl: source.manifestURL,
    iconUrl: `${source.origin}${iconPath}`,
    role: source.role,
    stats: { [NetworkType.Wifi]: [], [NetworkType.Sim1]: [], [NetworkType.Sim2]: [] },
  };
}

export function toSample(source: any): Sample {
  return {
    date: source.date,
    received: source.rxBytes,
    sent: source.txBytes,
  };
}

import { writable } from 'svelte/store';
import type { App } from '../models';
import { Device } from '../services/device';

function createStore() {
  const store = writable<App[]>([]);

  async function refresh() {
    const apps = await Device.getApps();
    store.set(apps);
  }

  return {
    subscribe: store.subscribe,
    refresh,
  };
}

export const apps = createStore();

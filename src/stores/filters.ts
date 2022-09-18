import { writable } from 'svelte/store';
import { NetworkType } from '../enums';
import type { Filters } from '../models';

function createStore() {
  const store = writable<Filters>({
    dateRange: 31,
    networkType: NetworkType.Wifi,
  });

  return {
    subscribe: store.subscribe,
    update: function (data: Partial<Filters>) {
      store.update((previous) => ({ ...previous, ...data }));
    },
    updateOne: function <T extends keyof Filters>(key: T, value: Filters[T]) {
      store.update((previous) => ({ ...previous, [key]: value }));
    },
  };
}

export const filters = createStore();

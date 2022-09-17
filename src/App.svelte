<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';
  import { OnyxNavigation } from 'onyx-navigation';
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Onyx } from 'onyx-ui/services';
  import { onDestroy, onMount } from 'svelte';
  import Router, { location, pop, replace } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import AppDetail from './routes/AppDetail.svelte';
  import Home from './routes/Home.svelte';
  import Loading from './routes/Loading.svelte';
  import Redirect from './routes/Redirect.svelte';
  import { apps } from './stores/apps';
  import { settings } from './stores/settings';

  console.log(`Env: ${process.env.NODE_ENV}`);

  OnyxNavigation.startListening();

  const routes = {
    '/home/:type': Home,
    '/app/:appOrigin/:initialType': AppDetail,
    '/loading': Loading,
    '*': Redirect,
  };

  // TODO: Fix this in a better way
  document.addEventListener('keydown', (ev) => {
    if (
      ev.key === 'Backspace' &&
      $location !== '/' &&
      (ev.target as any).contentEditable !== 'true'
    ) {
      ev.preventDefault();
    }
  });
  const keys = OnyxKeys.subscribe(
    {
      onBackspace: async (ev) => !ev.detail.targetIsInput && pop(),
    },
    { priority: 0 }
  );

  onMount(async () => {
    replace('/loading');
    await apps.refresh();
    console.log('apps', $apps);
    replace('/');
  });

  onDestroy(() => keys.unsubscribe());

  $: Onyx.settings.update($settings);
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <Router {routes} />
</OnyxApp>

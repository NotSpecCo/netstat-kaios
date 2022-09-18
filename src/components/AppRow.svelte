<script lang="ts">
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import { push } from 'svelte-spa-router';
  import type { App } from '../models';

  export let app: App;
  export let dataUsed: number;
</script>

<NavItem
  navi={{
    itemId: app.origin,
    onSelect: () => push(`/app/${encodeURIComponent(app.origin)}`),
  }}
>
  <div class="root">
    <img src={app.iconUrl} alt="" class="icon" />
    <div class="name">{app.name}</div>
    <div class="data">{dataUsed} MB</div>
  </div>
</NavItem>

<style>
  .root {
    display: flex;
    align-items: center;
    padding: 5px;
  }
  .icon {
    height: 28px;
    width: 28px;
    margin-right: 5px;
  }
  .name {
    flex: 1;
  }
  .data {
    color: var(--accent-color);
  }
</style>

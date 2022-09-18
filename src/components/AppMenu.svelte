<script lang="ts">
  import InlineSelectRow from 'onyx-ui/components/form/InlineSelectRow.svelte';
  import ListHeader from 'onyx-ui/components/list/ListHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { IconSize } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import MdFormatListBulleted from 'svelte-icons/md/MdFormatListBulleted.svelte';
  import MdSettings from 'svelte-icons/md/MdSettings.svelte';
  import { push } from 'svelte-spa-router';
  import { NetworkType } from '../enums';
  import { filters } from '../stores/filters';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const items: MenuItem[] = [
    { id: 'stats', text: 'Stats', route: `/stats`, icon: MdFormatListBulleted },
    { id: 'settings', text: 'Settings', route: `/settings`, icon: MdSettings },
  ];
</script>

<NavGroup groupId="app-menu">
  <div class="header">
    <img class="logo" src="/images/icon_112.png" alt="" />
    <div class="app-name">Netstat</div>
  </div>
  <div class="scroller" data-nav-scroller>
    {#each items as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Small}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i),
          onSelect: () => {
            Onyx.appMenu.close();
            if (window.location.hash.startsWith(`#${item.route}`)) {
              return;
            }
            push(item.route);
          },
        }}
      />
    {/each}
    <ListHeader title="Filters" />
    <InlineSelectRow
      label="Date Range"
      value={$filters.dateRange}
      options={[
        { id: 1, label: 'Day' },
        { id: 7, label: 'Week' },
        { id: 31, label: 'Month' },
      ]}
      onChange={(val) => filters.updateOne('dateRange', Number(val))}
    />
    <InlineSelectRow
      label="Network"
      value={$filters.networkType}
      options={[
        { id: NetworkType.Wifi, label: 'Wi-Fi' },
        { id: NetworkType.Sim1, label: 'SIM 1' },
        { id: NetworkType.Sim2, label: 'SIM 2' },
      ]}
      onChange={(val) => filters.updateOne('networkType', Number(val))}
    />
  </div>
</NavGroup>

<style>
  :global([data-onyx-group-id='app-menu']) {
    border-radius: 0 var(--radius) var(--radius) 0;
    background-color: var(--card-color);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    padding: 10px;
    font-weight: var(--bold-font-weight);
    color: var(--accent-color);
    display: flex;
    align-items: center;
    font-size: 1.75rem;
  }
  .header > .app-name {
    margin-left: 5px;
    flex: 1;
  }
  .scroller {
    overflow-y: auto;
    flex: 1;
  }
  .logo {
    height: 28px;
    width: 28px;
  }
</style>

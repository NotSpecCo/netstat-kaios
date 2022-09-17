<script lang="ts">
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { replace } from 'svelte-spa-router';
  import AppRow from '../components/AppRow.svelte';
  import { NetworkType } from '../enums';
  import type { App, Sample } from '../models';
  import { apps } from '../stores/apps';

  export let params: { type: NetworkType };
  let type = Number(params.type);
  $: {
    type = Number(params.type);
  }

  type Result = {
    app: App;
    dataUsed: number;
  };

  let dateRange: number = 31;
  let results: Result[] = [];

  $: {
    results = $apps
      .map((app) => {
        return {
          app,
          dataUsed: addSamples(app.stats[type].slice(0, dateRange)),
        };
      })
      .sort((a, b) => {
        if (a.dataUsed > b.dataUsed) return -1;
        if (a.dataUsed < b.dataUsed) return 1;
        return 0;
      })
      .filter((app) => app.dataUsed > 0);
  }

  function addSamples(samples: Sample[]): number {
    const bytes = samples.reduce((acc, val) => {
      acc += val.sent;
      acc += val.received;
      return acc;
    }, 0);

    const megabytes = Number((bytes / 1e6).toFixed(2));
    return megabytes;
  }
</script>

<View>
  <ViewContent>
    <SelectRow
      label="Date Range"
      value={dateRange}
      options={[
        { id: 1, label: 'Day' },
        { id: 7, label: 'Week' },
        { id: 31, label: 'Month' },
      ]}
      onChange={(val) => (dateRange = Number(val))}
    />
    <SelectRow
      label="Type"
      value={type}
      options={[
        { id: NetworkType.Wifi, label: 'Wi-Fi' },
        { id: NetworkType.Sim1, label: 'SIM 1' },
        { id: NetworkType.Sim2, label: 'SIM 2' },
      ]}
      onChange={(val) => {
        replace(`/home/${val}`);
      }}
    />
    <div class="results">
      {#each results as result}
        <AppRow app={result.app} {type} dataUsed={result.dataUsed} />
      {:else}
        <Typography align="center">No apps used data during this time period.</Typography>
      {/each}
    </div>
  </ViewContent>
</View>

<style>
  .results {
    padding: 10px 0px;
  }
</style>

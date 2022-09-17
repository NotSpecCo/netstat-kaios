<script lang="ts">
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { NetworkType } from '../enums';
  import type { Sample } from '../models';
  import { apps } from '../stores/apps';

  type Result = {
    appIconUrl: string;
    appName: string;
    dataUsed: number;
  };

  let dateRange: number = 31;
  let type: NetworkType = NetworkType.Wifi;
  let results: Result[] = [];

  $: {
    results = $apps
      .filter((app) => !app.role)
      .map((app) => {
        return {
          appIconUrl: app.iconUrl,
          appName: app.name,
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
      onChange={(val) => (type = Number(val))}
    />
    <div class="results">
      {#each results as result}
        <div class="result">
          <img src={result.appIconUrl} alt="" class="icon" />
          <div class="name">{result.appName}</div>
          <div class="data">{result.dataUsed} MB</div>
        </div>
      {:else}
        <Typography align="center">No apps used data during this time period.</Typography>
      {/each}
    </div>
  </ViewContent>
</View>

<style>
  .result {
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

  .results {
    padding: 10px 0px;
  }
</style>

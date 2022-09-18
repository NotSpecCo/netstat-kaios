<script lang="ts">
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import AppRow from '../components/AppRow.svelte';
  import type { App, Sample } from '../models';
  import { apps } from '../stores/apps';
  import { filters } from '../stores/filters';

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
          dataUsed: addSamples(app.stats[$filters.networkType].slice(0, dateRange)),
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

  function getSubtitle(days: number): string {
    switch (days) {
      case 1:
        return 'Today';
      case 7:
        return 'This Week';
      case 31:
        return 'This Month';
    }
  }
</script>

<View>
  <ViewContent>
    <Typography type="titleLarge" align="center">Data Usage</Typography>
    <!-- <Typography align="center" padding="none">{getSubtitle($filters.dateRange)}</Typography> -->

    <div class="results">
      {#each results as result}
        <AppRow app={result.app} dataUsed={result.dataUsed} />
      {:else}
        <Typography align="center">No apps used data during this time period.</Typography>
      {/each}
    </div>
  </ViewContent>
</View>

<style>
  .results {
    padding: 0px 0px;
  }
</style>

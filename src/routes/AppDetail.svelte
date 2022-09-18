<script lang="ts">
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import type { Sample } from '../models';
  import { apps } from '../stores/apps';
  import { filters } from '../stores/filters';

  export let params: { appOrigin: string };

  const app = $apps.find((a) => a.origin === params.appOrigin);
  let samples: Sample[] = [];
  $: samples = app.stats[$filters.networkType];

  function formatData(bytes: number): string {
    const mb = (bytes / 1000000).toFixed(2);
    return `${mb}`;
  }
</script>

<View>
  <ViewContent>
    <Typography type="titleLarge" align="center">{app.name}</Typography>
    <div class="results">
      <table>
        <tr>
          <th class="date">Date</th>
          <th>Sent</th>
          <th>Rec</th>
        </tr>
        {#each samples as sample}
          <tr>
            <td class="date">{sample.date.toLocaleDateString().slice(0, -5)}</td>
            <td class="sent">{formatData(sample.sent)}</td>
            <td class="received">{formatData(sample.received)}</td>
          </tr>
        {/each}
      </table>
    </div>
  </ViewContent>
</View>

<style>
  .results {
  }
  table {
    padding: 10px 5px;
    border-collapse: collapse;
  }
  .date {
    text-align: left;
    width: 100%;
  }
  th,
  td {
    white-space: nowrap;
    padding: 5px;
  }
  tr {
    border-bottom: 1px solid var(--divider-color);
  }
  tr:nth-child(even) {
    background-color: var(--divider-color);
  }
</style>

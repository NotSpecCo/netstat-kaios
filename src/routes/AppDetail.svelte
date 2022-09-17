<script lang="ts">
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { NetworkType } from '../enums';
  import type { Sample } from '../models';
  import { apps } from '../stores/apps';

  export let params: { appOrigin: string; initialType: NetworkType };

  let type: NetworkType = Number(params.initialType);

  const app = $apps.find((a) => a.origin === params.appOrigin);
  let samples: Sample[] = [];
  $: samples = app.stats[type];

  function formatData(bytes: number): string {
    const mb = (bytes / 1000000).toFixed(2);
    return `${mb}`;
  }
</script>

<View>
  <ViewContent>
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
    padding: 10px 0px;
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
    background-color: #eaeaea;
  }
</style>

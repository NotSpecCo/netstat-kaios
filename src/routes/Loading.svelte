<script lang="ts">
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
</script>

<View>
  <ViewContent>
    <div class="root">
      <img src="/images/icon_128.png" alt="" />
      <Typography align="center">Loading data stats...</Typography>
    </div>
  </ViewContent>
</View>

<style>
  .root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .root > img {
    height: 64px;
    width: 64px;
  }
</style>

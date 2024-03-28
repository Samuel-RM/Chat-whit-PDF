<script>
  import { Alert } from "flowbite-svelte";
  import { APP_STATUS, appStatus } from "../store.ts";
  import StepUpload from "../components/StepUpload.svelte";
  import StepLoading from "../components/StepLoading.svelte";
  import StepChat from "../components/StepChat.svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload></StepUpload>
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading></StepLoading>
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert color="red">
    <span class="font-medium">Error, no se xd</span>
    ha ocurrido un error.
  </Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChat></StepChat>
{:else}
  <Alert color="red">
    <span class="font-medium">Accion no recmnocida</span>
    No sea pendejo vea, aprenda a leer.
    <p>Uknow...</p>
  </Alert>
{/if}

<style>
</style>

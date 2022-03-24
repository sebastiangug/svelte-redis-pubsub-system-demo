<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { onMount } from "svelte";

  export let channel: string;

  let socket: Socket;
  let open: boolean = false;
  let err: any;
  let viewers = 0;
  let donations = 0;
  let donate_sum = 100;

  onMount(() => {
    socket = io("http://localhost:3000", {
      host: "http://localhost",
      port: 3000,
      rememberUpgrade: true,
      upgrade: true,
      extraHeaders: {
        channel,
      },
    });

    socket.io.on("open", () => {
      open = true;
      err = undefined;
    });

    socket.io.on("close", () => {
      open = false;
    });

    socket.io.on("error", (error) => {
      err = error as any;
    });

    socket.on("VIEWERS", (data) => {
      console.log("EVENT EMITTED", "VIEWERS");

      console.log(data);
    });

    socket.connect();
  });

  const donate = () => {
    socket.emit("DONATION", donate_sum);
  };
</script>

<div
  style="border: 5px solid grey; padding: 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: space-between;"
>
  <div
    style="display: flex; flex-direction: row; justify-content: center; align-items: center;"
  >
    <p>Channel: <b> {channel} </b></p>
    <div
      style="width:50px; height: 50px; margin: 20px;"
      style:background={open ? "green" : "red"}
    />
  </div>

  <div>
    <p>Viewers: {viewers}</p>
    <p>Donations: {donations}</p>
  </div>

  <input bind:value={donate_sum} />
  <button on:click={donate}> Donate </button>

  {#if err}
    <div style="color: red;">
      <pre>{err}</pre>
    </div>
  {/if}
</div>

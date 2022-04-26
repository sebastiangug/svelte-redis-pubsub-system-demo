<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import { v4 as uuid } from "uuid";

  export let channel: string;

  let socket: Socket;
  let open: boolean = false;
  let err: any;
  let viewers = 0;
  let donations = 0;
  let donate_sum = 100;

  onMount(() => {
    const device_id = `${uuid()}:6266add9b122250deb621985:VIEWER`;
    socket = io("https://development.raiseitup.com/apis/live/gateway", {
      path: "/apis/live/gateway",
      rememberUpgrade: true,
      secure: true,
      upgrade: true,
      extraHeaders: {
        device_id,
        quabity_ashuance: "tXPS9D5umW",
      },
    });

    socket.io.on("open", () => {
      open = true;
      err = undefined;
    });

    socket.io.on("close", () => {
      console.log("close firing");
      open = false;
    });

    socket.io.on("error", (error) => {
      err = error as any;
    });

    socket.io.on("error", (error) => {
      err = error;

      console.log("ERROR");
    });

    socket.on("VIEWERS", (data) => {
      console.log("VIEWERS EVENT FIRING", data);
      viewers = data.viewers;
    });

    socket.on("DONATIONS", (data) => {
      donations = data?.donations ?? 0;
    });

    socket.on("API_ERROR", (error) => {
      console.log("API_ERROR");
      err = error;
      open = false;
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
      <pre>{JSON.stringify(err)}</pre>
    </div>
  {/if}
</div>

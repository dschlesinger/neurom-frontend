<script lang="ts">
 import * as Chart from "$lib/components/ui/chart/index.js";
 import * as Card from "$lib/components/ui/card/index"
 import { Axis, LineChart } from "layerchart";
 import { scaleLinear } from "d3-scale";

 let {
  data,
  sensor,
  bg_color
 } : {
  data: number[],
  sensor: string,
  bg_color: string
 } = $props();

 
 let graphData = $derived.by(() => {
    const raw = data ?? [];
    return raw.map((v, i) => ({
      x: i,
      y: v,
    }));
  });

  let series = $derived([
    {
      key: "y",
      label: "Value",
      color: "var(--chart-1)",
    },
  ]);

  const chartConfig = {
    y: { label: "Value", color: "var(--chart-1)" },
  } satisfies Chart.ChartConfig;
</script>
 
<Card.Root class={`${bg_color} h-fit border-slate-800 border-2`}>

  <Card.Header>

    <Card.Title>
      <div class="text-center p-1 rounded-md">
      { sensor }
      </div>
    </Card.Title>

  </Card.Header>

  <Card.Content>

    {#if data.length > 0}
        <Chart.Container inert config={chartConfig}>
          <LineChart
            data={graphData} 
            x="x"
            xScale={scaleLinear()}
            axis="x"
            {series}
            props={{
              spline: { strokeWidth: 2 },
            }}
          >
            <!-- <Axis placeholder='left' rule /> -->
            {#snippet tooltip()}
              <!-- <Chart.Tooltip /> -->
            {/snippet}
          </LineChart>
        </Chart.Container>
    {:else}
        <div>No data</div>
    {/if}

  </Card.Content>

</Card.Root>
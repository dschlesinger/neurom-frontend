<script lang="ts">
 import * as Chart from "$lib/components/ui/chart/index.js";
 import { LineChart } from "layerchart";
 import { scaleLinear } from "d3-scale";

 import { 
    gathered_sample_data
  } from "$lib/components/global_vars.svelte";
 
 let data = $derived.by(() => {
    const raw = gathered_sample_data.current[0].data ?? [];
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
 
{#if data.length > 0}
    <Chart.Container config={chartConfig}>
      <LineChart 
        {data} 
        x="x"
        xScale={scaleLinear()}
        axis="x"
        {series}
        props={{
          spline: { strokeWidth: 2 },
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip />
        {/snippet}
      </LineChart>
    </Chart.Container>
{:else}
    <div>No data</div>
{/if}
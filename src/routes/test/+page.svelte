<script lang='ts'>
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    import SensorCard from "$lib/components/sample/sensor-card.svelte";

    import {
		artifact_colors,
		gathered_sample_data,
        choose
	} from "$lib/components/global_vars.svelte";

    import * as Select from "$lib/components/ui/select/index.js";

    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { PieChart, Text } from "layerchart";

    import { FlaskConical, Zap, Check, X, FileText } from '@lucide/svelte';

    import {
        dataset_artifacts,
        available_datasets
    } from '$lib/components/global_vars.svelte'
    import { toast } from "svelte-sonner";

    let current_test_artifact = $state('Random');

    let current_selected_datasets = $state([
        available_datasets.current[0]
    ]);

    // Handle stages

    let testing_stage: 'info' | 'listening' | 'sample' = $state('info');

    interface TestResult {
        guess: string
        correct: string
    }

    let test_results: TestResult[] = $state([
        {
            guess: 'Single Blink',
            correct: 'Double Blink'
        },
        {
            guess: 'Double Blink',
            correct: 'Double Blink'
        },
        {
            guess: 'Single Blink',
            correct: 'Double Blink'
        },
    ])

    // tr by tr confusion matrix of scaling size
    let confusion_matrix = $derived.by(() => {

        let blank = Array(dataset_artifacts.current.length).fill(0).map(x => Array(dataset_artifacts.current.length).fill(0));

        for (let tr of test_results) {

            const c_index: number = dataset_artifacts.current.indexOf(tr.correct);
            const g_index: number = dataset_artifacts.current.indexOf(tr.guess);

            if (c_index < 0 || g_index < 0) {
                console.log('Encountered guesses not in list')
                continue;
            }

            // Add to confusion matrix
            blank[g_index][c_index] += 1;
        }

        // No longer blank
        return blank;

    })

    

    let chartData = $derived(
        test_results.reduce((a, c) => {
            if (c.guess == c.correct) {
                // Correct
                a[0].count += 1;
            }
            else {
                // Incorrect
                a[1].count += 1;
            }
            return a
        },
        [
            {
                type: 'correct',
                count: 0,
                color: "#0e0"
            },
            {
                type: 'incorrect',
                count: 0,
                color: "#e00"
            }
        ]
    ))

    $inspect(chartData)
    $inspect(test_results)

    // What to do
    let testing_artifact_name = $state('');
    let countdown_active: Boolean = $state(false);
    let countdown_counter = $state(3);
    
    // track last test
    let last_test = $derived(
        test_results.length == 0 ? {correct: '', guess: ''} : test_results[test_results.length-1]
    )

    const chartConfig = {
        total: { label: "Total" },
        correct: { label: "Correct", color: "var(--chart-1)" },
        wrong: { label: "Incorrect", color: "var(--chart-2)" },
    } satisfies Chart.ChartConfig;

</script>

{#snippet dataset_select()}
<Select.Root type="multiple" name="selectDatasets" bind:value={current_selected_datasets}>
    <Select.Trigger 
        class="bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-colors"
    >
        Select Datasets
    </Select.Trigger>
    <Select.Content class='bg-slate-900 text-white border border-slate-700'>
        <Select.Group>
        <Select.Label>Select Multiple to Combine</Select.Label>
        {#each available_datasets.current as ads}
            <Select.Item
                class='data-selected:bg-cyan-500/40'
                value={ads}
                label={ads}
            >
                {ads}
            </Select.Item>
        {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>
{/snippet}

<div class="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center p-4">

    <div class='w-full flex flex-col h-128 lg:h-full p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl'>

        <!-- Header -->
        <div class='w-full flex pb-4 gap-2'>

            <div class='w-1/3 flex justify-center gap-x-4 flex-wrap'>

                <Select.Root type="single" name="artifactTest" bind:value={current_test_artifact}>
                    <Select.Trigger 
                        class="bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                    >
                        Testing: { current_test_artifact }
                    </Select.Trigger>
                    <Select.Content class='bg-slate-900 text-white border border-slate-700'>
                        <Select.Group>
                        <Select.Label>Artifacts</Select.Label>
                        <Select.Item
                            class='data-selected:bg-cyan-500/40'
                            value='None'
                            label='None'
                        >
                            None
                        </Select.Item>
                        <Select.Item
                            class='data-selected:bg-cyan-500/40'
                            value='Random'
                            label='Random'
                        >
                            Random
                        </Select.Item>
                        {#each dataset_artifacts.current as ds}
                            <Select.Item
                                class='data-selected:bg-cyan-500/40'
                                value={ds}
                                label={ds}
                            >
                                {ds}
                            </Select.Item>
                        {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

                <div 
                    class="hidden lg:block">
                    {@render dataset_select()}
                </div>

            </div>

            <div class="w-1/3 text-center text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Test Model
            </div>

            <div class='w-1/3 flex justify-center'>
                <div 
                    class="block lg:hidden">
                    {@render dataset_select()}
                </div>
            </div>

        </div>

        <Separator class="bg-slate-700/50" />

        <!-- Stages here -->
        {#if testing_stage == 'info'}

            <!-- Accuracy and Confusion Matrix -->
            <div class='flex gap-x-6 w-full h-full justify-center items-start pt-8'>
                
                <!-- Accuracy pi chart -->
                <div class='flex-shrink-0'>
                    <Card.Root class="flex flex-col w-56 lg:w-72 bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700/50 shadow-xl">
                        <Card.Header class="items-center pb-2">
                            <Card.Title class='text-center text-lg'>Test Accuracy</Card.Title>
                            <Card.Description class='text-slate-400 text-center text-sm'>Over { test_results.length } Samples</Card.Description>
                        </Card.Header>
                        <Card.Content class="flex-1">
                            <Chart.Container inert config={chartConfig} class="mx-auto aspect-square">
                                <PieChart
                                    data={chartData}
                                    key="type"
                                    value="count"
                                    c="color"
                                    innerRadius={50}
                                    padding={14}
                                    props={{ pie: { motion: "tween" } }}
                                >
                                    {#snippet aboveMarks()}
                                        <!-- Text Accuracy display -->
                                        <Text
                                            value={`${
                                                Math.round(test_results.filter(
                                                    (c) => c.correct == c.guess
                                                ).length / test_results.length * 100)
                                            }%`}
                                            textAnchor="middle"
                                            verticalAnchor="middle"
                                            class="text-white fill-white text-2xl! lg:text-3xl! font-bold"
                                            dy={3}
                                        />
                                    {/snippet}
                                </PieChart>

                            </Chart.Container>
                        </Card.Content>
                    </Card.Root>
                </div>

                <!-- Confusion Matrix -->
                 <div class='flex-shrink-0 hidden md:block'>
                    <Card.Root class="flex flex-col w-56 lg:w-72 bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700/50 shadow-xl">
                        <Card.Header class="pb-2">
                            <Card.Title class='text-center text-lg'>Confusion Matrix</Card.Title>
                            <Card.Description class='text-slate-400 text-sm text-center'>With { dataset_artifacts.current.length } Artifacts</Card.Description>
                        </Card.Header>
                        <Card.Content class="flex-1">
                            <div class={`grid grid-cols-${dataset_artifacts.current.length} gap-1`}>
                                {#each confusion_matrix as row, r}
                                    {#each row as point, c}

                                        <div class="max-w-10 max-h-10">
                                            <Tooltip.Provider>
                                                <Tooltip.Root>
                                                    <Tooltip.Trigger>
                                                        <div
                                                        class={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${r == c ? 'bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/50 text-green-200' : 'bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 text-red-200'}`}
                                                    >
                                                        {point}
                                                    </div>
                                                    </Tooltip.Trigger
                                                    >
                                                    <Tooltip.Content class='bg-slate-950 border border-slate-700'>
                                                    <p>Guess: {dataset_artifacts.current[r]}</p>
                                                    <p>Correct: {dataset_artifacts.current[c]}</p>
                                                    </Tooltip.Content>
                                                </Tooltip.Root>
                                            </Tooltip.Provider>
                                        </div>
                                    {/each}
                                {/each}
                            </div>
                        </Card.Content>
                    </Card.Root>
                </div>

                <div class='absolute self-end mb-4 flex gap-x-2'>
                    <Button 
                        class='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg transition-all duration-200'
                        onclick={
                            async () => {

                                if (current_selected_datasets.length == 0) {
                                    toast.warning('No Dataset Selected')
                                    return
                                }

                                testing_stage = 'listening';

                                if (
                                    current_test_artifact == 'None'
                                ) {

                                }
                                else if (
                                    current_test_artifact == 'Random'
                                ) {
                                    testing_artifact_name = choose(dataset_artifacts.current)
                                }
                                else {
                                    testing_artifact_name = current_test_artifact
                                }

                                // Do count down
                                countdown_active = true;
                                countdown_counter = 3;
                                
                                for (let i = 0; i < 3; i++) {
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    countdown_counter--;
                                }
                                
                                countdown_active = false;
                                countdown_counter = 3;

                                // For debugging
                                setTimeout(() => {
                                    testing_stage = 'sample'
                                }, 1000)

                                // Ping backend and get

                                if (current_test_artifact != 'None') {                      
                                    test_results.push(
                                        {
                                            correct: testing_artifact_name,
                                            guess: choose(dataset_artifacts.current)
                                        }
                                    )
                                }
                            }
                        }
                    >
                        Run Test 
                        <FlaskConical size={18} class="ml-2" />
                    </Button>
                    <Button
                        class='bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white font-semibold shadow-lg transition-all duration-200'
                        onclick={() => {
                            // Get data on self test

                            // replace current tests
                        }}
                    >
                        Test on Data
                        <FileText size={18} class="ml-2" />
                    </Button>
            </div>

            </div>

        {:else if testing_stage == 'listening'}

            <div class="text-2xl font-semibold text-slate-200 mx-auto pt-10">
                Please do a <span class='italic text-cyan-400 font-bold'>{ testing_artifact_name }</span>
            </div>

            {#if countdown_active}

                <div class="my-auto self-center text-6xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                    {countdown_counter}
                </div>

            {:else}

                <div class="my-auto self-center flex flex-col gap-y-6 items-center">
                    <div class="motion-safe:animate-pulse drop-shadow-lg">
                        <Zap size={140} class="text-yellow-400" strokeWidth={1.5} />
                    </div>
                    <div class="text-slate-300 text-lg font-medium">Listening for Event...</div>
                </div>
            {/if}

        {:else if testing_stage == 'sample'}
                <div class='flex flex-col gap-y-6 h-full'>
                <div class="mx-auto w-full max-w-sm rounded-lg bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-4 shadow-xl border border-slate-700/50">
                    <div class="flex items-center gap-2 mb-3">
                        {#if last_test.guess == last_test.correct}
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/60 shadow-lg shadow-green-500/20">
                                <Check class='w-5 h-5 text-green-400' strokeWidth={3} />
                            </div>
                            <span class="text-base font-bold text-green-400">Correct!</span>
                        {:else} 
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/20 border border-red-500/60 shadow-lg shadow-red-500/20">
                                <X class='w-4 h-4 text-red-400' strokeWidth={3} />
                            </div>
                            <span class="text-base font-bold text-red-400">Incorrect</span>
                        {/if}
                    </div>

                    <div class="flex justify-between items-center border-t border-slate-700/50 pt-2">
                        <div class="flex gap-4">
                            <div class="flex items-center gap-2">
                                <span class="text-slate-400 text-xs font-medium">Your Guess:</span>
                                <span class="font-mono font-bold text-cyan-300 text-sm">{last_test.guess}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-slate-400 text-xs font-medium">Correct Answer:</span>
                                <span class="font-mono font-bold text-green-300 text-sm">{last_test.correct}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full flex-1 flex flex-col items-center justify-start px-4">
                        <div class="grid grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-6xl">
                            {#each gathered_sample_data.current as gsd, i}
                                <SensorCard
                                    sensor={gsd.sensor}
                                    data={gsd.data}
                                    bg_color={artifact_colors[i % artifact_colors.length]}
                                />
                            {/each}
                        </div>

                    </div>
                    <div class="flex justify-center gap-x-6 pt-4">

                        <!-- Continue Button -->
                        <Button
                            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold min-w-40 shadow-lg transition-all duration-200"
                            onclick={() => {
                                testing_stage = 'info'
                            }}
                        >
                            Continue
                        </Button>
                    </div>
            </div>

        {:else}
            <div class="text-slate-400 text-center pt-20">Unknown stage {testing_stage}</div>
        {/if}

    </div>

</div>
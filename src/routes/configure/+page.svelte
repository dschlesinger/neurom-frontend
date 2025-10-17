<script lang='ts'>

    import * as Tabs from "$lib/components/ui/tabs/index.js";

    import { 
        artifacts, 
        artifact_colors, 
        number_sample_per_artifact,
        gathered_sample_data,
    } from "$lib/components/global_vars.svelte";
    import ArtifactCard from "$lib/components/artifact/artifact-card.svelte";
    import SensorCard from "$lib/components/sample/sensor-card.svelte";
    import { toast } from "svelte-sonner";

    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Label } from "$lib/components/ui/dropdown-menu";
    import { Separator } from "$lib/components/ui/separator/index.js";

    import { Zap, Redo, Check, RefreshCcw } from '@lucide/svelte';
    import { resolve } from "$app/paths";
    // stuff for artifact selection

    let num_added: number = 0;

    let new_artifact: string = $state('');

    let active_tab: 'select' | 'gather' = $state('gather')

    function addArtifact(name: string) {

    if (!artifacts.current.map((a) => a.name).includes(name)) {

        artifacts.current.push(
            {
                name: name,
                color: artifact_colors[num_added % artifact_colors.length]
            }
        )

        num_added++;

        new_artifact = '';
    }
    else {
        toast.warning("Artifact already exists")
    }
    }

    function handleEnter(e) {
    if (e.key == 'Enter' && !(new_artifact == '')) {
        addArtifact(new_artifact)
    }
    }

    // stuff for data gathering

    // Either 'start', 'listening', 'reviewing', or 'complete' <-- When all samples gathered
    let data_gathering_stage: 'start' | 'listening' | 'reviewing' | 'complete' = $state('start');

    let current_artifact_index = $state(0);

    let current_sample_index = $state(0);

    let dataset_name = $state('');

    function resetGathering() {
        // Reset
        if (data_gathering_stage == 'start') {
            current_artifact_index = 0;
            current_sample_index = 0;
        }
        else {
            toast.warning('Must be on starting page to reset')
        }

        // Ping backend
    }

</script>

<div class='w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center p-8'>

    <!-- Tabs -->

    <Tabs.Root bind:value={active_tab} class='w-full max-w-6xl h-full max-h-[90vh] bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col overflow-hidden border border-slate-600/50'>
        <Tabs.List class='bg-slate-700/40 backdrop-blur-md rounded-lg p-1.5 mb-8 flex gap-2 border border-slate-600/50 mx-auto'>
            <Tabs.Trigger class='px-8 py-2.5 rounded-md transition-all duration-300 font-semibold text-slate-300 hover:text-white hover:bg-slate-600/30 data-[state=active]:bg-blue-800 data-[state=active]:text-white' value="select">
                Select Artifacts
            </Tabs.Trigger>
            <Tabs.Trigger class='px-8 py-2.5 rounded-md transition-all duration-300 font-semibold text-slate-300 hover:text-white hover:bg-slate-600/30 data-[state=active]:bg-red-800 data-[state=active]:text-white' value="gather">
                Gather Samples
            </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="select" class='flex-1 overflow-auto'>
            <div class='w-full flex flex-col gap-y-6 h-full min-h-fit bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-xl p-8 backdrop-blur-sm border border-slate-600/30 shadow-inner'>
                
                <!-- Input Section -->
                <div class='flex flex-col gap-4'>
                    <div class='flex gap-3 items-end'>
                        <div class='flex-1'>
                            <Label class='text-sm font-semibold text-slate-300 mb-2 block'>Create New Artifact</Label>
                            <Input 
                                class='w-full bg-slate-700/50 border-slate-600 focus:ring-blue-500 text-white' 
                                bind:value={new_artifact} 
                                placeholder='Enter artifact name...'
                                onkeydown={handleEnter}
                            />
                        </div>
                        <Button 
                            onclick={() => {if (new_artifact.trim()) addArtifact(new_artifact)}}
                            class='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-200'
                        >
                            Add Artifact
                        </Button>
                    </div>
                </div>

                <Separator class='bg-slate-600/30' />

                <!-- Artifacts Grid -->
                <div class='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 auto-rows-max'>
                    {#each artifacts.current as a, i}
                        <div class='transform transition-all duration-300 hover:scale-110 hover:z-10'>
                            <ArtifactCard artifact_name={a.name} bg_color={a.color} deleteSelf={() => {artifacts.current.splice(i, 1); artifacts.current = artifacts.current}} />
                        </div>
                    {/each}
                </div>


                <div class='flex pt-4 mt-auto items-center'>
                    <!-- Samples Configuration -->
                    <div class='bg-slate-700/40 backdrop-blur-md rounded-lg p-4 border border-slate-600/30 flex items-end gap-4'>
                        <div class='flex-1 flex'>
                            <Label class='text-sm font-semibold text-slate-300 mb-2 block w-full'>Samples per Artifact</Label>
                            <Input 
                                bind:value={number_sample_per_artifact.current} 
                                type='number' 
                                min='1'
                                class='w-32 bg-slate-700/50 border-slate-600 focus:ring-amber-500 text-white' 
                            />
                        </div>
                    </div>

                    <!-- Gather Data Button -->
                    <div class='ml-auto mr-10'>
                        <Button 
                            onclick={() => {active_tab = 'gather'}} 
                            class='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-200'
                        >
                            Gather Data
                        </Button>
                    </div>
                </div>

            </div>
        </Tabs.Content>

        <Tabs.Content value="gather" class='flex-1 overflow-auto'>
            <div class='w-full h-full bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-xl p-8 backdrop-blur-sm border border-slate-600/30 shadow-inner flex flex-col items-center'>
                
                <!-- Progress Bar -->
                <div class='w-128 absolute mb-10 bg-green-700/40 rounded-lg p-4 border border-slate-600/30 flex'>                     
                    <div class='w-9/10'>
                        <div class='flex justify-between items-center mb-2'>
                            <span class='text-sm font-semibold text-slate-300'>{ artifacts.current[current_artifact_index].name }</span>
                            <span class='text-sm font-semibold text-slate-300'>
                                {current_sample_index} / {number_sample_per_artifact.current}
                            </span>
                        </div>
                        <div class='w-full bg-slate-600/50 rounded-full h-2 overflow-hidden'>
                            <div 
                                class='bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300'
                                style='width: {artifacts.current.length > 0 ? (current_sample_index / (number_sample_per_artifact.current)) * 100 : 0}%'
                            ></div>
                        </div>
                    </div>
                    <Button
                        class='ml-auto'
                        size="icon"
                        variant='destructive'
                        onclick={resetGathering}
                    >
                        <RefreshCcw />
                    </Button>
                </div>

                {#if data_gathering_stage === 'start'}

                    <Button 
                        onclick={() => { 
                            data_gathering_stage = 'listening' 
                            // for later add route

                            // Timeout to move on for debugging
                            setTimeout(() => {
                                data_gathering_stage = 'reviewing'
                            }, 1000)
                        }}
                        class='my-auto self-center'
                    >
                        Gather Sample
                    </Button>

                {:else if data_gathering_stage === 'listening'}

                    <div class="flex flex-col gap-y-4 my-auto">
                        <div class='motion-safe:animate-pulse'>
                            <Zap size={128} color={'yellow'} />
                        </div>
                        <div class='text-white'>
                            Listening for Event...
                        </div>
                    </div>


                {:else if data_gathering_stage === 'reviewing'}

                    <div class='w-full h-full flex-col items-center pt-24'>
                        <div class='grid grid-cols-4 lg:grid-cols-6 gap-2'>

                            {#each gathered_sample_data.current as gsd, i}

                                <SensorCard sensor={gsd.sensor} data={gsd.data} bg_color={ artifact_colors[i % artifact_colors.length] } />

                            {/each}

                        </div>

                        <div class="pt-20 flex justify-center gap-x-20">
                            
                            <Button 
                                variant='destructive'
                                class='min-w-32'
                                onclick={() => {
                                    // Send ping to backend
                                }}
                            >
                                <Redo />
                                Redo Sample
                            </Button>

                            <Button 
                                class='bg-green-700 text-white min-w-32'
                                onclick={() => {
                                    // Increment logic

                                    current_sample_index += 1;

                                    // We are done
                                    if (
                                        current_artifact_index >= artifacts.current.length - 1 &&
                                        current_sample_index >= number_sample_per_artifact.current
                                    ) {
                                        data_gathering_stage = 'complete'
                                    }
                                    // We have reached the end of this artifact
                                    else if (
                                        current_sample_index >= number_sample_per_artifact.current
                                    ) {
                                        setTimeout(() => {
                                            current_artifact_index += 1;
                                            current_sample_index = 0;
                                        }, 300)

                                        data_gathering_stage = 'start';

                                    }
                                    else {
                                        // Nothing
                                        data_gathering_stage = 'start';
                                    }

                                }}
                            >
                                <Check />
                                Continue
                            </Button>

                        </div>             
                    </div>

                {:else if data_gathering_stage === 'complete'}

                    <div class='w-full h-full flex items-center justify-center'>

                        <div class='flex gap-x-2 mx-auto'>
                            <Input 
                                class='w-64 bg-slate-700/50 border-slate-600 focus:ring-blue-500 text-white' 
                                bind:value={dataset_name} 
                                placeholder='Name your dataset' 
                            />
                            <Button 
                                class='bg-green-700'
                                onclick={() => {
                                    // Ping Backend
                                }}
                            >
                                Save
                            </Button>
                        </div>

                        <Button
                            class='self-end absolute mb-5'
                            onclick={
                                () => {

                                    data_gathering_stage = 'start';

                                    resetGathering();
                                }
                            }
                        >
                            Make New Dataset <Redo />
                        </Button>

                    </div>

                {:else}
                    <div class='mx-auto self-center'>Unknown stage {data_gathering_stage}</div>
                {/if}

            </div>
        </Tabs.Content>
    </Tabs.Root>

</div>
<script lang='ts'>

    import Button from "$lib/components/ui/button/button.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import * as Select from "$lib/components/ui/select/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import { 
        RotateCcw as Reset
    } from '@lucide/svelte'

    import KeyBindingCard from '$lib/components/keybinding/card.svelte';

    import {
        available_datasets,
        dataset_artifacts,
        keybinding_presets,
        current_keybindings,

        type KeyBinding

    } from "$lib/components/global_vars.svelte";

    let current_selected_datasets = $state([
        available_datasets.current[0]
    ]);

    function artifactCombinationValid(artifacts: string[], index: number): boolean {
        // Return true if can be added false if not

        // Remove self
        let temp = [...current_keybindings.current.slice(0, index),...current_keybindings.current.slice(index + 1)];


        // Get previous artifacts
        let prev_artifacts = temp
            .map((v) => v.ordered_artifacts)
            //remove blanks
            .filter((v) => v.length > 0);

        let filtered_pa = []

        // iterate over
        for (let i = 0; i < artifacts.length; i++) {

            for (let pa of prev_artifacts) {

                // If we have exceeded the length will over lap this one
                if (pa.length <= i) {
                    return false
                }

                if (pa[i] == artifacts[i]) {
                    filtered_pa.push(pa)
                }
            }

            prev_artifacts = filtered_pa
            filtered_pa = []

        }

        // if a pa at this point then its first signals match
        // and one would always be triggered before the other
        // Meaning one is never going to be triggered
        return prev_artifacts.length == 0
    }

    let last_keybind_state = $state(JSON.stringify(current_keybindings.current))

    function compareKeybindState(current: KeyBinding[], saved: string): boolean {

        return saved == JSON.stringify(current_keybindings.current)

    }

    let keybind_up_to_date = $derived(compareKeybindState(current_keybindings.current, last_keybind_state));

</script>

{#snippet dataset_select()}
<Select.Root type="multiple" name="selectDatasets" bind:value={current_selected_datasets}>
    <Select.Trigger 
        class="bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50 focus:ring-cyan-500 transition-all duration-200"
    >
        Select Datasets
    </Select.Trigger>
    <Select.Content class='bg-slate-800 text-white border border-slate-700/50 backdrop-blur-md'>
        <Select.Group>
        <Select.Label class="text-slate-300">Select Multiple to Combine</Select.Label>
        {#each available_datasets.current as ads}
            <Select.Item
                class='data-selected:bg-cyan-500/40 hover:bg-slate-700/50 transition-colors'
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

{#snippet load_a_preset()}
<DropdownMenu.Root>

    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button class="bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50 focus:ring-cyan-500 transition-all duration-200" {...props}>Load a Preset</Button>
        {/snippet}
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class='w-48 bg-slate-800 border border-slate-700/50 backdrop-blur-md shadow-xl'>
        <DropdownMenu.Label class='text-sm text-slate-300 text-center font-semibold'>Available Presets</DropdownMenu.Label>
        <DropdownMenu.Separator class="bg-slate-700/30"></DropdownMenu.Separator>

        {#if keybinding_presets.current.length == 0}

        <div class="text-slate-400 text-sm text-center py-2">No Available Presets</div>

        {:else}
        <div class="flex flex-col gap-y-1 p-2">

            <Button
            variant='destructive'
            class='w-full bg-gradient-to-r from-red-500/30 to-red-600/20 hover:from-red-500/40 hover:to-red-600/30 text-red-300 border border-red-500/40 transition-all duration-200'
                onclick={() => {

                }}
            >
                Reset
            </Button>

            {#each keybinding_presets.current as kp}

                <Button
                    class='w-full bg-gradient-to-r from-cyan-500/30 to-blue-600/20 hover:from-cyan-500/40 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 transition-all duration-200'
                >
                    { kp }
                </Button>

            {/each}
        </div>
        {/if}

    </DropdownMenu.Content>

</DropdownMenu.Root>
{/snippet}

<div class='flex justify-center items-center w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8'>

    <div class='w-full flex flex-col min-h-128 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl'>

        <!-- Header -->
        <div class='flex w-full px-8 py-6 gap-4 items-center'>
            <div class='flex-1 flex justify-start gap-x-4'>
                {@render dataset_select()}
                <div class='hidden lg:block'>
                    {@render load_a_preset()}
                </div>
            </div>
            <div class='flex-1 text-center text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                Set Keybindings
            </div>
            <div class='flex-1 flex justify-end'>
                <div class='lg:hidden'>
                    {@render load_a_preset()}
                </div>
            </div>
        </div>
        
        <Separator class="bg-slate-600/30" />

        <!-- Keybindings -->
        <div class='grid grid-cols-5 lg:grid-cols-8 p-8 gap-3 flex-1'>

            {#each current_keybindings.current as ck, i}

                <KeyBindingCard 
                    deleteSelf={() => current_keybindings.current.splice(i, 1)} 
                    bind:keybinding={current_keybindings.current[i]}
                    checkValidArtifacts={artifactCombinationValid}
                    index={i}
                />

            {/each}

            <Button class='bg-gradient-to-r from-emerald-500/40 to-teal-600/30 hover:from-emerald-500/50 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/20'
                onclick={
                    () => {
                        current_keybindings.current.push(
                            {
                                ordered_artifacts: [],
                                keybind: {
                                    hold: false,
                                    keys: [[]]
                                },
                                reset: false
                            }
                        )
                    }
                }
            >
                +
            </Button>

        </div>

        <div class='px-8 pb-8 flex flex-col items-center gap-2'>

            <div class="">

                <Button 
                    class='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold w-64 shadow-lg hover:shadow-blue-500/20 transition-all duration-200'
                    onclick={
                        () => {
                            last_keybind_state = JSON.stringify(current_keybindings.current)
                        }
                    }
                >
                    Update Keybindings
                </Button>

                <Button 
                    variant='destructive'
                    onclick={
                        () => {
                            current_keybindings.current = JSON.parse(last_keybind_state)
                        }
                    }
                >
                    <Reset />
                </Button>

            </div>

            <div class='h-10 text-sm text-amber-400 font-medium'>
                {#if !keybind_up_to_date}
                    Keybindings not up to date
                {/if}
            </div>

        </div>

    </div>

    
</div>
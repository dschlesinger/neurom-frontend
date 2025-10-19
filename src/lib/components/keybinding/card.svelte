<script lang='ts'>

    import {
        type KeyBinding,
        dataset_artifacts
    } from '$lib/components/global_vars.svelte';

    import {
        Button, 
        buttonVariants 
    } from '$lib/components/ui/button/index.js';

    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Label } from "$lib/components/ui/label/index.ts";

    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
    
    import { MoveRight, Pencil, PencilOff } from '@lucide/svelte'

    import Separator from '../ui/separator/separator.svelte';
    import { toast } from 'svelte-sonner';

    let {
        keybinding = $bindable(),
        deleteSelf,
        checkValidArtifacts,
        index,
    } : {
        keybinding: KeyBinding,
        deleteSelf: Function,
        checkValidArtifacts: Function,
        index: number,
    } = $props();

    let artifact_editting_mode = $state(false)
    let editting_mode = $state(false);
    let dialog_open = $state(false);
    let keybinding_listening = $derived(editting_mode && dialog_open);

    let keysdown = $state(new Set()); // Use Set instead of array
    let recordedKeys = $state([]); // Store recorded key combinations
    let lastKeysCount = $state(0);

    let hold_checked = $state(keybinding.keybind.hold)

    const handleKeyDown = (e) => {
        if (!keybinding_listening) return;

        if (keysdown.size == 0 && keybinding.keybind.keys[0].length != 0) {
            keybinding.keybind.keys.push([])
        }
 
        // Should fix bug with repeat keys
        if (!keysdown.has(e.key)) {   
            recordedKeys.push(e.key)
        }

        // Add key to current set of held keys
        keysdown.add(e.key);
    };

    const handleKeyUp = (e) => {
        if (!keybinding_listening) return;

        keysdown.delete(e.key)

        if (keysdown.size == 0) {
            keybinding.keybind.keys[keybinding.keybind.keys.length - 1] = recordedKeys
            recordedKeys = []
        }
    };

    let save_artifacts = keybinding.ordered_artifacts;
    $effect(() => {
        if (keybinding.keybind.keys.length == 1) {
            keybinding.keybind.hold = hold_checked
        }
        else {
            keybinding.keybind.hold = false;
        }
    })

</script>

<svelte:document 
    on:keydown={handleKeyDown}
    on:keyup={handleKeyUp}
/>

<Dialog.Root bind:open={dialog_open}>
  <Dialog.Trigger class={`${buttonVariants()} bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white border border-slate-600/50 shadow-lg transition-all duration-200`}>
        {
            keybinding.reset ? 'Reset' : keybinding.keybind.keys[0].join(' ')
        }
</Dialog.Trigger>
  <Dialog.Content class='bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl backdrop-blur-sm'>
    <Dialog.Header>
      <Dialog.Title class='text-white text-lg font-semibold'>Change this keybind</Dialog.Title>
        <Separator class='my-3 bg-slate-700/30' />
    </Dialog.Header>
            <div class='self-start flex items-center gap-x-3 text-white flex-wrap'>

            <span class='text-sm font-semibold text-slate-300'>Artifacts</span>

            {#each keybinding.ordered_artifacts as koa, i}

                <Badge class='bg-gradient-to-r from-cyan-500/30 to-blue-600/20 border border-cyan-500/40 text-cyan-300 font-medium'>
                    {koa}
                </Badge>
                
                {#if i != keybinding.ordered_artifacts.length - 1}

                    <MoveRight size={16} class='text-slate-400' />

                {/if}

            {/each}

            {#if artifact_editting_mode}

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button class='bg-gradient-to-r from-emerald-500/40 to-teal-600/30 hover:from-emerald-500/50 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 transition-all duration-200'>
                            Add an Artifact
                        </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content class='bg-slate-800 border border-slate-700/50 backdrop-blur-md shadow-xl'>
                        <DropdownMenu.Group>
                            <div class='flex flex-col gap-y-1 p-2'>
                                {#each dataset_artifacts.current as da}
                                    <Button
                                        class='w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/30 transition-colors'
                                        onclick={() => {
                                            keybinding.ordered_artifacts.push(da)
                                        }}
                                    >
                                        {da}
                                    </Button>
                                {/each}
                            </div>
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

            {/if}

            <Button
                size='icon'
                class={artifact_editting_mode ? 'bg-gradient-to-r from-red-500/30 to-red-600/20 hover:from-red-500/40 hover:to-red-600/30 text-red-300 border border-red-500/40' : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50'}
                variant={artifact_editting_mode ? 'destructive' : 'default'}
                onclick={() => {
                    artifact_editting_mode = !artifact_editting_mode
                    if (artifact_editting_mode) {
                        keybinding.ordered_artifacts = []
                    }
                    else {
                        if (!checkValidArtifacts(keybinding.ordered_artifacts, index)) {

                            toast.warning('Artifact combination invalid, likely due to overlap with other combinations')
                            keybinding.ordered_artifacts = save_artifacts
                        }
                        else {
                            save_artifacts = keybinding.ordered_artifacts
                        }
                    }
                }}
            >

                {#if !artifact_editting_mode}
                    <Pencil size={16} />
                {:else}
                    <PencilOff size={16} />
                {/if}
            </Button>

        </div>

        {#if !keybinding.reset}

        <div class='self-start flex items-center gap-x-3 text-white flex-wrap'>

            <span class='text-sm font-semibold text-slate-300'>Keybinding</span>

            {#each keybinding.keybind.keys as press, i}

                <span class='text-slate-400'>(</span>

                {#each press as k, j}

                    <Badge class='bg-gradient-to-r from-violet-500/30 to-purple-600/20 border border-violet-500/40 text-violet-300 font-medium'>
                        {k}
                    </Badge>
                    
                    {#if j != press.length - 1}

                        <span class='text-slate-400'>,</span>

                    {/if}

                {/each}

                <span class='text-slate-400'>)</span>

                {#if i != keybinding.keybind.keys.length - 1}

                        <MoveRight size={16} class='text-slate-400' />

                {/if}

            {/each}

            <Button
                size='icon'
                class={editting_mode ? 'bg-gradient-to-r from-red-500/30 to-red-600/20 hover:from-red-500/40 hover:to-red-600/30 text-red-300 border border-red-500/40' : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50'}
                variant={editting_mode ? 'destructive' : 'default'}
                onclick={() => {
                    editting_mode = !editting_mode
                    if (editting_mode) {
                        keybinding.keybind.keys = [[]]
                    }
                }}
            >

                {#if !editting_mode}
                    <Pencil size={16} />
                {:else}
                    <PencilOff size={16} />
                {/if}
            </Button>

        </div>

        <div class='flex gap-x-3 items-center pt-2'>
            <Checkbox
                id='hold'
                class='border-slate-600 checked:bg-cyan-500'
                bind:checked={hold_checked}
                disabled={keybinding.keybind.keys.length != 1} 
            />
            <Label for="hold" class='text-slate-300 font-medium cursor-pointer'>
                {#if keybinding.keybind.keys.length == 1}
                    Continue holding key
                {:else}
                    <span class='text-slate-500'>Keybinding cannot have a sequence and be held</span>
                {/if}
            </Label> 
        </div>
        {/if}

        <div class='flex gap-x-3 items-center'>
            <Checkbox
                id='reset'
                class='border-slate-600 checked:bg-red-500'
                bind:checked={keybinding.reset}
            />
            <Label for="reset" class='text-slate-300 font-medium cursor-pointer'>
                Set this keybind to reset all held keydowns and clear the que
            </Label> 
        </div>

        <div class="mt-6 pt-4 border-t border-slate-700/30 flex gap-x-3">
            <Button
                class='flex-1 bg-gradient-to-r from-red-500/30 to-red-600/20 hover:from-red-500/40 hover:to-red-600/30 text-red-300 border border-red-500/40 font-semibold transition-all duration-200'
                onclick={() => {dialog_open = false; deleteSelf();}}
            >
                Delete this Keybind
            </Button>
            <Button
                class='flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg transition-all duration-200'
                onclick={() => {dialog_open = false;}}
            >
                Exit Modal
            </Button>
        </div>

  </Dialog.Content>
</Dialog.Root>
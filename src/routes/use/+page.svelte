<script lang='ts'>

    import {
        keybinding_que
    } from '$lib/components/global_vars.svelte'

    import {
        clearque
    } from '$lib/components/backend/websocket.svelte'

    import Button from '$lib/components/ui/button/button.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';

    import { MoveRight } from '@lucide/svelte';

</script>

<div class="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center p-4">

    <div class='w-full flex flex-col h-128 lg:h-full p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl'>

        <!-- Header -->
         <div class='w-full py-2 text-center text-2xl font-bold text-white'>
            Event Que
         </div>

         <Separator />

            
        <div class='mx-auto h-full flex items-center justify-center'>

            <div class="flex-col">
                <div class='flex items-center gap-x-2'>
                    
                    {#each keybinding_que.current as kb, i}

                        <div class="text-white text-lg p-2 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-mb border-slate-800 border-1 rounded-md">
                            {kb}
                        </div>

                        {#if i != keybinding_que.current.length - 1}

                            <MoveRight color='white' size={24} />
                        
                        {/if}

                    {/each}

                </div>

                <Button
                    variant='destructive'
                    onclick={clearque}
                >
                    Reset Que
                </Button>

            </div>

        </div>

    </div>


</div>
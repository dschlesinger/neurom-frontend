<script lang='ts'>

    import {
        keybinding_que
    } from '$lib/components/global_vars.svelte'

    import Separator from '$lib/components/ui/separator/separator.svelte';

    import { MoveLeft } from '@lucide/svelte';

</script>

<div class="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center p-4">

    <div class='w-full flex flex-col h-128 lg:h-full p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl'>

        <!-- Header -->
         <div class='w-full py-2 text-center text-2xl font-bold text-white'>
            Event Que
         </div>

         <Separator />

    </div>

    <div class='mx-auto justify-center'>

        {#each keybinding_que.current as kb, i}

            {kb}

            <MoveLeft color='white' size={12} />

        {/each}

    </div>

</div>
<script lang='ts'>

    import * as Card from "../ui/card/index.js";
    import Button from "../ui/button/button.svelte";

    import { TrashIcon } from "@lucide/svelte";

    let { artifact_name, bg_color, deleteSelf } = $props();

</script>

<Card.Root class={`max-w-36 aspect-square ${bg_color} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-md group hover:scale-105`}>

    <div class='w-full h-full flex flex-col justify-between p-5 relative'>
        <!-- Gradient overlay for depth -->
        <div class='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30 pointer-events-none'></div>
        
        <!-- Content -->
        <div class='relative z-10 flex flex-col items-center justify-center flex-1'>
            <Card.Title>
                <div class='text-center'>
                    <div class='bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-md rounded-xl p-3 px-3 border border-slate-500/30 group-hover:border-slate-400/50 transition-all duration-300 shadow-lg'>
                        <span class='text-white font-semibold text-sm truncate block'>
                            {artifact_name}
                        </span>
                    </div>
                </div>
            </Card.Title>
        </div>

        <!-- Footer with delete button -->
        <div class='relative z-10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <Button 
                class='bg-red-500/70 hover:bg-red-600 text-white border-0 p-2 h-8 w-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200' 
                variant='destructive' 
                onclick={deleteSelf}
            >
                <TrashIcon size={16} />
            </Button>
        </div>
    </div>
    
</Card.Root>
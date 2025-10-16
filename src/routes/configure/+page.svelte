<script lang='ts'>

  import * as Tabs from "$lib/components/ui/tabs/index.js";

  import { artifacts, artifact_colors } from "$lib/components/global_vars.svelte";
  import ArtifactCard from "$lib/components/artifact/artifact-card.svelte";

  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";

  let num_added: number = 0;

  let new_artifact: string = $state('');

  let active_tab: 'select' | 'gather' = $state('select')

  function addArtifact(name: string) {

    artifacts.current.push(
        {
            name: name,
            color: artifact_colors[num_added % artifact_colors.length]
        }
    )

    num_added++;

    new_artifact = '';

  }

</script>

<div class='w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center p-8'>

    <!-- Tabs -->

    <Tabs.Root bind:value={active_tab} class='w-full max-w-6xl h-full max-h-[90vh] bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col overflow-hidden border border-slate-600/50'>
        <Tabs.List class='bg-slate-700/40 backdrop-blur-md rounded-lg p-1.5 mb-8 flex gap-2 border border-slate-600/50 mx-auto'>
            <Tabs.Trigger class='px-8 py-2.5 rounded-md transition-all duration-300 font-semibold text-slate-300 hover:text-white hover:bg-slate-600/30 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50' value="select">
                Select Artifacts
            </Tabs.Trigger>
            <Tabs.Trigger class='px-8 py-2.5 rounded-md transition-all duration-300 font-semibold text-slate-300 hover:text-white hover:bg-slate-600/30 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50' value="gather">
                Gather Samples
            </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="select" class='flex-1 overflow-auto'>
            <div class='w-full flex flex-col gap-y-6 h-full bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-xl p-8 backdrop-blur-sm border border-slate-600/30 shadow-inner'>
                
                <!-- Input Section -->
                <div class='flex flex-col gap-4'>
                    <div class='flex gap-3 items-end'>
                        <div class='flex-1'>
                            <label class='text-sm font-semibold text-slate-300 mb-2 block'>Create New Artifact</label>
                            <Input 
                                class='w-full bg-slate-700/50 border-slate-600 focus:ring-blue-500 text-white' 
                                bind:value={new_artifact} 
                                placeholder='Enter artifact name...' 
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

                <!-- Gather Data Button -->
                <div class='flex justify-end pt-4 mt-auto'>
                    <Button 
                        onclick={() => {active_tab = 'gather'}} 
                        class='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-200'
                    >
                        Gather Data
                    </Button>
                </div>

            </div>
        </Tabs.Content>

        <Tabs.Content value="gather" class='flex-1 overflow-auto'>
            <div class='w-full h-full bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-xl p-8 backdrop-blur-sm border border-slate-600/30 shadow-inner flex items-center justify-center'>
                <div class='text-center'>
                    <p class='text-slate-400 text-lg font-medium mb-2'>Gather Samples</p>
                    <p class='text-slate-500 text-sm'>Content coming soon...</p>
                </div>
            </div>
        </Tabs.Content>
    </Tabs.Root>

</div>
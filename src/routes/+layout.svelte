<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Keyboard, CircleOff  } from '@lucide/svelte';
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

	import {
		connectionStatus
	} from '$lib/components/global_vars.svelte';

	function muse_status_to_color(status: string): string {
		switch (status) {
			case 'streaming':
				return 'bg-green-500';
			case 'buffering':
				return 'bg-yellow-500';
			case 'not connected':
				return 'bg-red-500';
			default:
				console.log('Unknown muse status', status)
				return 'bg-red-500';
		}
	}

	let { children } = $props();

	interface Route {
		name: string
		route: string
	};

	const routes: Route[] = [
		{
			'name': 'Home',
			'route': '/'
		},
		{
			'name': 'Configure',
			'route': '/configure'
		},
		{
			'name': 'Test',
			'route': '/test'
		},
		{
			'name': 'Keybindings',
			'route': '/keybinding'
		},
	];

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />

<!-- Nav Bar -->
<div class='w-screen h-screen flex flex-col'>
	<nav 
		class='w-full px-6 py-3 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 backdrop-blur-md shadow-lg'
	>
		<!-- Logo/Brand -->
		<div class='flex items-center gap-3'>
			<div class='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
				<span class='text-white font-bold text-sm'>NM</span>
			</div>
			<span class='font-semibold text-white text-lg'>NeuroM Studio</span>
		</div>

		<!-- Navigation Links -->
		<div class='flex items-center gap-2 ml-12'>
			{#each routes as r}
				<a href={r.route} class='px-4 py-2 text-slate-300 hover:text-white transition-colors duration-200 font-medium rounded-md hover:bg-slate-700/50'>
					{r.name}
				</a>
			{/each}
		</div>

		<!-- Status Indicator -->
		<div class='ml-auto'>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<button 
							{...props}
							class='flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500 transition-all duration-200 text-white font-medium shadow-md hover:shadow-lg'
						>
							<div class={`w-3 h-3 rounded-full animate-pulse ${connectionStatus.backend ? 'bg-green-500' : 'bg-red-500'}`}></div>
							<span class='text-sm'>Status</span>
						</button>
					{/snippet}
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class='w-72 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 text-white rounded-lg shadow-xl'>
					<DropdownMenu.Group>
						<DropdownMenu.Label class='text-center text-sm font-semibold py-3 px-4 border-b border-slate-600'>
							Connection Status
						</DropdownMenu.Label>
						
						<div class='p-4 space-y-3'>
							<!-- Backend Status -->
							<div class='flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600/50'>
								<div class={`w-3 h-3 rounded-full ${connectionStatus.backend ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
								<div>
									<p class='text-sm font-medium'>Backend</p>
									<p class='text-xs text-slate-400'>{connectionStatus.backend ? 'Connected' : 'Disconnected'}</p>
								</div>
							</div>

							<!-- Muse Status -->
							<div class='flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600/50'>
								<div class={`w-3 h-3 rounded-full ${muse_status_to_color(connectionStatus.muse)} ${connectionStatus.muse === 'streaming' ? 'animate-pulse' : ''}`}></div>
								<div>
									<p class='text-sm font-medium'>Muse Headset</p>
									<p class='text-xs text-slate-400 capitalize'>{connectionStatus.muse}</p>
								</div>
							</div>

							<!-- Keybindings Status -->
							<a href='/keybinding' class='flex hover:bg-blue-500 items-center gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600/50'>
								{#if connectionStatus.keybindings}
									<Keyboard size={18} class='stroke-green-500' />
								{:else}
									<CircleOff size={18} class='stroke-red-500' />
								{/if}
								<div>
									<p class='text-sm font-medium'>Keybindings</p>
									<p class='text-xs text-slate-400'>{connectionStatus.keybindings ? 'Enabled' : 'Disabled'}</p>
								</div>
							</a>
						</div>
					</DropdownMenu.Group>
				</DropdownMenu.Content>

			</DropdownMenu.Root>
		</div>

	</nav>

	<main class='flex-1 overflow-auto'>
		{@render children?.()}
	</main>
</div>
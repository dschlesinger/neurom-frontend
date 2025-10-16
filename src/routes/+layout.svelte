<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Keyboard, CircleOff  } from '@lucide/svelte';


	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

	// Import Later
	interface ConnectionStatusProps {
		backend: Boolean
		muse: 'streaming' | 'buffering' | 'not connected'
		keybindings: Boolean
	};

	const connectionStatus: ConnectionStatusProps = {
		'backend': false,
		'muse': 'not connected',
		'keybindings': false,
	}

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
	];

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Nav Bar -->
<div class='w-screen h-screen'>
	<nav 
		class='p-2 w-full flex pl-10 justify-start gap-x-4 bg-gradient-to-l from-purple-800 to-blue-950'
	>

		{#each routes as r}
			<Button class='min-w-fit w-24' href={r.route}>{r.name}</Button>
		{/each}

		<div class='ml-auto pr-10'>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button class='bg-blue-950' {...props}>
							<div class='flex gap-x-1 items-center'>
								<div class={`w-5 h-5 border-1 border-black rounded-full ${connectionStatus.backend ? 'bg-green-500' : 'bg-red-500'}`}></div>
								<div>
									Backend Connection
								</div>
							</div>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class='w-64 bg-slate-800 border-black text-white'>
					<DropdownMenu.Group>
						<DropdownMenu.Label class='text-center text-md'>Connection Status</DropdownMenu.Label>
      					<DropdownMenu.Separator class='bg-black' />
						<DropdownMenu.Label>
							<div class='flex gap-x-1 items-center p-1'>
								<div class={`w-5 h-5 border-1 border-black rounded-full ${connectionStatus.backend ? 'bg-green-500' : 'bg-red-500'}`}></div>
								<div>
									Backend is{connectionStatus.backend ? ' ' : ' not '}connected
								</div>
							</div>
							<div class='flex gap-x-1 items-center p-1'>
								<div class={`w-5 h-5 border-1 border-black rounded-full ${muse_status_to_color(connectionStatus.muse)}`}></div>
								<div>
									Muse is {connectionStatus.muse}
								</div>
							</div>
							<div class='flex gap-x-1 items-center p-1'>
							  {#if connectionStatus.keybindings}
							  	<Keyboard size=18 class='stroke-green-500' />
							  {:else}
							  	<CircleOff size=18 class='stroke-red-500' />
							  {/if}
								<div>
									Keybindings are {connectionStatus.keybindings ? 'on' : 'off'}
								</div>
							</div>
						</DropdownMenu.Label>
					</DropdownMenu.Group>
				</DropdownMenu.Content>

			</DropdownMenu.Root>
		</div>

	</nav>

	{@render children?.()}
</div>
import {
    connectionStatus
} from '$lib/components/global_vars.svelte'

import {
    handle_message
} from '$lib/components/backend/recieve.svelte.ts'

export let websocket: WebSocket | undefined;

// Handle reception

export async function connectToBackend() {
    console.log('Attempting connection')
    try {

        websocket = new WebSocket('ws://localhost:8000/event-manager');

        websocket.onclose = () => {
            connectionStatus.current.backend = false;
            connectionStatus.current.muse = 'not connected';
            connectionStatus.current.keybindings = false;
            setTimeout(connectToBackend, 3000);  // Try reconnecting in 3 seconds
        };

        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Websocket received message')
            console.log(message)
            handle_message(message)
        }

        websocket.onopen = (event) => {
            connectionStatus.current.backend = true

            websocket.send(
            JSON.stringify({
                'type': 'ping',
                'data': {}
            })
    )

        }

        websocket.onerror = (error) => {
            connectionStatus.current.backend = false;
            connectionStatus.current.muse = 'not connected';
            connectionStatus.current.keybindings = false;
        };

    }

    catch (error) {
        console.log('websocket connection failed')
        console.log(error)

        connectionStatus.current.backend = false;
        connectionStatus.current.muse = 'not connected';
        connectionStatus.current.keybindings = false;
    }
}
import {
    connectionStatus,
    current_selected_datasets,
    keybindings_on,
    current_keybindings,
    keybinding_que
} from '$lib/components/global_vars.svelte'

import {
    handle_message
} from '$lib/components/backend/recieve.svelte.ts'

export let websocket: WebSocket | undefined;
export let statusUpdater: EventSource | undefined;
export let queUpdater: EventSource | undefined;

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
            }))

            connectToStatusUpdater();
            connectToKeybindQue();

            get_datasets_list();
            get_all_keybinds();
            get_functional_kbs();

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

function connectToStatusUpdater() {

    try {

        statusUpdater = new EventSource('http://localhost:8000/status-updates');

        statusUpdater.onopen = () => {
            console.log('Status updater connected')
        }

        statusUpdater.onmessage = ((m) => {
            let s = JSON.parse(m.data);
            console.log('streaming recieved', s);
            connectionStatus.current.muse = s.status;
        })

        statusUpdater.onerror = (error) => {
            statusUpdater.close()
            connectionStatus.current.muse = 'not connected'

            setTimeout(connectToStatusUpdater, 3000);
        }

    }
    
    catch (error) {
        console.log('status updater error')
        statusUpdater = undefined;
    }

}

function connectToKeybindQue() {

    try {

        queUpdater = new EventSource('http://localhost:8000/keybinding-que');

        queUpdater.onopen = () => {
            console.log('Keybinding que connected')
        }

        queUpdater.onmessage = ((m) => {
            let s = JSON.parse(m.data);
            console.log('que recieved', s);
            keybinding_que.current = s.que;
        })

        queUpdater.onerror = (error) => {
            queUpdater.close()
            keybinding_que.current = [];

            setTimeout(connectToKeybindQue, 3000);
        }

    }
    
    catch (error) {
        console.log('status updater error')
        queUpdater = undefined;
    }

}

export function saveKeybindings(name: string) {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'save_keybinds',
            'data': {
                'name': name,
                'keybinds': current_keybindings.current,
            }
        })
    )

}

export function get_functional_kbs() {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'get_functional_kbs',
            'data': {}
        })
    )

}

export function loadKeybindingPreset(name: string) {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'load_keybinds',
            'data': {
                'name': name
            }
        })
    )

}

export function pingBackend(): undefined {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'ping',
            'data': {}
        })
    )

}

export function lastAnomNoGood(): undefined {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'last_anomoly_no_good',
            'data': {}
        })
    )

    debugDP();

}

export function sendDatasetUpdate(datasets: string): undefined {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'change_used_datasets',
            'data': {
                'used_datasets': current_selected_datasets.current
            }
        })
    )

    debugDP();

}


export function get_datasets_list() {
    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'list_available_datasets',
            'data': {
            }
        })
    )
}

export function resetDatapoints(): undefined {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'reset_anomoly_gathering',
            'data': {}
        })
    )

    debugDP();

}

export function debugDP(): undefined {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'debug_datapoint',
            'data': {}
        })
    )

}

export function saveDataset(datasetName: string) {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'save_dataset',
            'data': {
                'dataset_name': datasetName
            }
        })
    )

}

export function startTest(classification: string): undefined {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'start_test',
            'data': {
                'classification': classification
            }
        })
    )

}

export function clearque() {
    
    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'clear_que',
            'data': {}
        })
    )
}

export function get_all_keybinds() {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'get_all_keybindings',
            'data': {}
        })
    )

}


export function startAnomolyDetection(name: string) {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'start_anomoly_detection',
            'data': {
                'classification': name
            }
        })
    )

}

export function setKeybinds() {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'set_keybinds',
            'data': {
                'keybindings': current_keybindings.current
            }
        })
    )

}

export function updateKeybindOn() {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'turn_keybinds',
            'data': {
                'state': keybindings_on.current
            }
        })
    )

}

export function testOnData() {

    if (websocket === undefined) {
        console.log('No websocket connection')
        return
    }

    websocket.send(
        JSON.stringify({
            'type': 'test_on_data',
            'data': {}
        })
    )

}

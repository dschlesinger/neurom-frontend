// Send signals for websocket

import {
    websocket
} from '$lib/components/backend/websocket.svelte.ts'

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

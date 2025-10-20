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
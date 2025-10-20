import {
    gathered_sample_data,
    data_gathering_stage
} from '$lib/components/global_vars.svelte'

export function handle_message(message: Map<string, any>): undefined {

    switch (message['type']) {

        case 'ping':

            console.log('ping')

            break;
    
        case 'gathered_datapoint':

            gathered_sample_data.current = message['data']['potentials'];
            data_gathering_stage.current = 'reviewing';

            break;

        default:

            console.log('Message type unknown', message)

    }

}
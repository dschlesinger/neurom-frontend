import {
    gathered_sample_data,
    data_gathering_stage,
    available_datasets,
    dataset_artifacts,
    test_results,
    testing_stage
} from '$lib/components/global_vars.svelte'

export function handle_message(message: Map<string, any>): undefined {

    console.log(message)

    switch (message['type']) {

        case 'ping':

            console.log('ping')

            break;
    
        case 'gathered_datapoint':

            gathered_sample_data.current = message['data']['potentials'];
            data_gathering_stage.current = 'reviewing';

            break;

        case 'update_datasets':

            available_datasets.current = message['data']['datasets']

            break;

        case 'update_artifacts':

            dataset_artifacts.current = message['data']['artifacts']

            break;

        case 'test_result':

            test_results.current.push(message['data']['result'])

            testing_stage.current = 'sample'

            break;

        default:

            console.log('Message type unknown', message)

    }

}
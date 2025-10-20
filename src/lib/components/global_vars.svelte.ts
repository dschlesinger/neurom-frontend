export const artifact_colors = [
  "bg-gradient-to-br from-slate-300 to-slate-400",      // Gray gradient
  "bg-gradient-to-br from-blue-300 to-cyan-400",        // Blue to cyan
  "bg-gradient-to-br from-emerald-300 to-teal-400",     // Green to teal
  "bg-gradient-to-br from-amber-300 to-orange-400",     // Amber to orange
  "bg-gradient-to-br from-rose-300 to-pink-400",        // Rose to pink
  "bg-gradient-to-br from-violet-300 to-purple-400",    // Violet to purple
  "bg-gradient-to-br from-cyan-300 to-blue-400",        // Cyan to blue
  "bg-gradient-to-br from-orange-300 to-amber-400",     // Orange to amber
  "bg-gradient-to-br from-teal-300 to-emerald-400",     // Teal to emerald
  "bg-gradient-to-br from-fuchsia-300 to-rose-400",     // Fuchsia to rose
  "bg-gradient-to-br from-lime-300 to-green-400",       // Lime to green
  "bg-gradient-to-br from-sky-300 to-blue-400",         // Sky to blue
  "bg-gradient-to-br from-indigo-300 to-purple-400",    // Indigo to purple
  "bg-gradient-to-br from-red-300 to-rose-400",         // Red to rose
  "bg-gradient-to-br from-green-300 to-teal-400",       // Green to teal
  "bg-gradient-to-br from-yellow-300 to-amber-400",     // Yellow to amber
  "bg-gradient-to-br from-pink-300 to-fuchsia-400",     // Pink to fuchsia
  "bg-gradient-to-br from-purple-300 to-indigo-400",    // Purple to indigo
  "bg-gradient-to-br from-neutral-300 to-slate-400",    // Neutral gradient
  "bg-gradient-to-br from-stone-300 to-neutral-400"     // Stone gradient
]

interface ConnectionStatusProps {
    backend: Boolean
    muse: 'streaming' | 'buffering' | 'not connected'
    keybindings: Boolean
};

export let connectionStatus: {current: ConnectionStatusProps} = $state({
    current: {
        'backend': false,
        'muse': 'not connected',
        'keybindings': false,
    }
})

export let number_sample_per_artifact: {current: number} = $state({current: 5})

interface Artifact {
    name: string
    color: string
};

export let artifacts: {current: Artifact[]} = $state({
    current: [
        {
            name: 'Single Blink',
            color: artifact_colors[artifact_colors.length - 4]
        },
        {
            name: 'Double Blink',
            color: artifact_colors[artifact_colors.length - 3]
        },
        {
            name: 'Left Look',
            color: artifact_colors[artifact_colors.length - 2]
        },
        {
            name: 'Right Look',
            color: artifact_colors[artifact_colors.length - 1]
        },
    ]
})

// Get from backend, dummy data for now
export let dataset_artifacts = $state({
    current: []
})

// Fetch from backend
export let available_datasets = $state({
    current: []
})

// Keybinding presets
export let keybinding_presets = $state({
    current: [
        'Basic 9',
        'Snake 4'
    ]
})

export interface KeyAction {
    // Whether to hold key down
    hold: Boolean

    // [[concurrently], [then]]
    keys: string[][]
}

export interface KeyBinding {
    // artifacts que in order
    ordered_artifacts: string[]

    keybind: KeyAction

    // if keybind is set to reset
    // Keys held down and que
    // Superceedes keybind, keybind is not run
    reset: boolean
}

export let current_keybindings: {current: KeyBinding[]} = $state({
    current: [
        {
            ordered_artifacts: ['Single Blink'],
            keybind: {
                hold: false,
                keys: [['space']]
            },
            reset: false
        },
        {
            ordered_artifacts: ['Double Blink'],
            keybind: {
                hold: true,
                keys: [['w']]
            },
            reset: false
        },
        {
            ordered_artifacts: ['Left Look', 'Left Look'],
            keybind: {
                hold: false,
                keys: [['a', 'w'], ['c', 'v']]
            },
            reset: false
        },
    ]
})

interface SensorSampleData {
    sensor: string
    data: number[]
}

export let gathered_sample_data: {current: SensorSampleData[]} = $state({current: []})

export function choose(choices: any[]) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export let current_selected_datasets = $state({current: []});

// For controlling progression of configure
export let data_gathering_stage: {current: "begin" | "start" | "listening" | "reviewing" | "complete"} =
		$state({current: "begin"});

export interface TestResult {
    guess: string
    correct: string
}

export let test_results: {current: TestResult[]} = $state({
    current: []
})

export let testing_stage: {current: 'info' | 'listening' | 'sample'} = $state({current: 'info'});
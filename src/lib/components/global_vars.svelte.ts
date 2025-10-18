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
    current: [
        'Single Blink',
        'Double Blink',
        'Left Look',
        'Right Look',
    ]
})

// Fetch from backend
export let available_datasets = $state({
    current: [
        'Dataset 1',
        'Dataset 2',
        'Dataset 3'
    ]
})

interface SensorSampleData {
    sensor: string
    data: number[]
}

export let gathered_sample_data: {current: SensorSampleData[]} = $state({current: [
    {
        sensor: 'Sensor 1',
        data: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    },
    {
        sensor: 'Sensor 2',
        data: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    },
    {
        sensor: 'Sensor 3',
        data: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    },
    {
        sensor: 'Sensor 4',
        data: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    },
]})

export function choose(choices: any[]) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
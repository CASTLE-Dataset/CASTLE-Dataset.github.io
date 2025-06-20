import videoData from './videos.json' // Ensure this file is in the same directory

export const DAYS = [1, 2, 3, 4]
export const PEOPLE = Array.from(
    new Set(videoData.map((v: { Stream: string }) => v.Stream))
).sort()

export const startHour = Math.min(
    ...videoData.filter((v) => v.Day === 1).map((v) => parseInt(v.Time.split(':')[0])
))
export const endHour = Math.max(
    ...videoData.filter((v) => v.Day === 1).map((v) => parseInt(v.Time.split(':')[0]))
)

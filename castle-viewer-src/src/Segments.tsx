// components/Timeline.jsx
import React, { useEffect, useState } from 'react'
import { Segment } from 'types'
import { loadSegments } from 'utils'

const formatTime = (hour: number, seconds: number): string => {
    return `${String(hour).padStart(2, '0')}:${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

const CATEGORIES: Record<string, string> = {
    // Food & Drink
    Eating: '#e74c3c',
    Drinking: '#d35400',
    Cooking: '#e67e22',
    'Making Tea': '#c0392b',
    'Making Coffee': '#8e2b2b',
    'Setting Table': '#f39c12',
    'Serving Food': '#e67e22',
    'Serving Drink': '#d35400',

    // Household
    Cleaning: '#27ae60',
    'Washing dishes': '#2ecc71',
    'Moving Furniture': '#16a085',

    // Work / Study
    Meeting: '#2980b9',
    Talking: '#3498db',
    Discussing: '#5dade2',
    'Using Laptop': '#1f618d',
    'Using Phone': '#154360',

    // Leisure
    Reading: '#9b59b6',
    'Watching TV': '#8e44ad',
    'Playing Games': '#bb8fce',
    'Playing Guitar': '#af7ac5',
    'Leisure Activities': '#7d3c98',

    // Movement / Posture
    Walking: '#16a085',
    Sitting: '#7f8c8d',
    Driving: '#95a5a6',
}

function Segments({
    day,
    person,
    currentHour,
}: {
    day: string
    person: string
    currentHour: number
}) {
    const [segments, setSegments] = useState<Segment[]>([])
    const [currentVideoTime, setCurrentVideoTime] = useState(0)

    useEffect(() => {
        loadSegments(day, person).then((data) => {
            setSegments(data as Segment[])
        })
    }, [day, person])

    const currentVideoTimeReal = () => {
        const video = document.getElementById(
            'youtube-player'
        ) as HTMLIFrameElement
        const player = (window as any).YT?.get(video?.id)
        if (player && player.getCurrentTime) {
            return Math.floor(player.getCurrentTime())
        }
        return 0
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideoTime(currentVideoTimeReal())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const currentActivities = segments.filter(
        (seg) =>
            parseInt(seg.hour) === currentHour &&
            currentVideoTime >= seg.start_time &&
            currentVideoTime < seg.end_time
    )
    const seg = currentActivities[0] || {
        description: 'None',
        start_time: 0,
        end_time: 0,
        hour: currentHour.toString(),
    }

    return (
        <div
            className="relative border-l-2 border-gray-300 pl-4"
            style={{ maxWidth: '100dvw' }}
        >
            <div
                style={{
                    color: CATEGORIES[seg.description] || '#999',
                    marginBottom: 8,
                    fontWeight: 'bold',
                    fontSize: 32,
                }}
            >
                <p>
                    {seg.description} (
                    {formatTime(parseInt(seg.hour), seg.start_time)} -{' '}
                    {formatTime(parseInt(seg.hour), seg.end_time)})
                </p>
            </div>
            {/*Legend*/}
            <div
                className="flex gap-2"
                style={{
                    maxWidth: '100dvw',
                    flexWrap: 'wrap',
                    marginBottom: 12,
                }}
            >
                {Object.entries(CATEGORIES).map(([category, color]) => (
                    <div key={category} className="flex">
                        <div
                            style={{
                                backgroundColor: color,
                                height: 16,
                                width: 16,
                                borderRadius: 4,
                            }}
                        ></div>
                        <span>{category}</span>
                    </div>
                ))}
            </div>
            <SegmentTimeline startHour={8} endHour={20} segments={segments} />
        </div>
    )
}
export default Segments

const SegmentTimeline = ({
    startHour,
    endHour,
    segments,
}: {
    startHour: number
    endHour: number
    segments: Segment[]
}) => {
    return (
        <div
            className="segment-timeline space-y-4"
            style={{ position: 'relative', width: '100dvw' }}
        >
            {Array.from({ length: endHour + 1 - startHour }, (_, i) => {
                const hour = startHour + i

                // segments that overlap this hour
                const hourSegments = segments.filter(
                    (seg) => seg.hour === hour.toString()
                )

                return (
                    <div key={hour}>
                        <div
                            className="relative flex"
                            style={{ overflow: 'scroll', gap: 0 }}
                        >
                            <span style={{ width: 56, flexShrink: 0 }}>
                                {hour}:00
                            </span>

                            {hourSegments.map((seg, j) => {
                                const left = Math.max(
                                    0,
                                    (seg.start_time / 3600) * 90
                                )
                                const right = Math.min(
                                    100,
                                    (seg.end_time / 3600) * 90
                                )
                                const width = right - left

                                return (
                                    <div
                                        key={j}
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`,
                                            backgroundColor:
                                                CATEGORIES[seg.description] ||
                                                '#999',
                                            height: 20,
                                        }}
                                        title={seg.description}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

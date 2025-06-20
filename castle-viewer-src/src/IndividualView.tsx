import { PEOPLE, DAYS, endHour, startHour } from 'constant'
import { useEffect, useMemo, useRef, useState } from 'react'
import Youtube from 'react-youtube'
import { VideoEntry } from 'types'
import videoData from './videos.json' // Ensure this file is in the same directory
import { linkToId } from 'utils'

const Timeline = ({
    playerRef,
    currentIndex,
    endHour,
    startHour,
    onSliderClick,
    filteredVideos,
    currentVideoTime: propsCurrentVideoTime,
}: {
    playerRef: React.MutableRefObject<any>
    currentIndex: number
    endHour: number
    startHour: number
    onSliderClick: (e: React.MouseEvent<HTMLDivElement>) => void
    currentVideoTime: number
    filteredVideos: (VideoEntry | null)[]
}) => {
    const [currentVideoTime, setCurrentVideoTime] = useState(0)
    useEffect(() => {
        setCurrentVideoTime(propsCurrentVideoTime)
    }, [propsCurrentVideoTime])

    useEffect(() => {
        const interval = setInterval(() => {
            const currentVideoTime =
                playerRef.current?.getCurrentTime?.() || propsCurrentVideoTime
            setCurrentVideoTime(currentVideoTime)
        }, 1000)
        return () => clearInterval(interval)
    }, [propsCurrentVideoTime])

    const currentSeekBarPosition = currentIndex * 3600 + currentVideoTime
    const barWidth = (endHour - startHour + 1) * 3600

    return (
        <div className="timeline-container" onClick={onSliderClick}>
            <div
                className="seek-bar"
                style={{
                    left: `${(currentSeekBarPosition / barWidth) * 100}%`,
                }}
            >
                <div className="seek-bar-thumb">
                    <span className="material-icons">arrow_drop_down</span>
                </div>
            </div>
            <div className="timeline">
                {Array.from({ length: endHour + 1 - startHour }, (_, i) => {
                    const hour = startHour + i
                    const hasVideo = filteredVideos[i]
                    return (
                        <div
                            key={hour}
                            className={`hour-block ${
                                hasVideo ? 'has-video' : ''
                            }`}
                        >
                            <span>{hour}:00</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function IndividualView() {
    const [selectedDay, setSelectedDay] = useState<number>(1)
    const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0])
    const [currentHour, setCurrentHour] = useState<number>(0)
    const [currentVideoTime, setCurrentVideoTime] = useState<number>(0)
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const playerRef = useRef<any>()
    const filteredVideos = useMemo(() => {
        const matchedVideos: VideoEntry[] = videoData.filter(
            (v: VideoEntry) =>
                v.Day === selectedDay && v.Stream === selectedPerson
        )

        const filteredVideos = Array.from(
            { length: endHour + 1 - startHour },
            (_, i) => {
                const hour = startHour + i
                return (
                    matchedVideos.find(
                        (v) => parseInt(v.Time.split(':')[0]) === hour
                    ) || null
                )
            }
        )
        return filteredVideos
    }, [selectedDay, selectedPerson])

    const onEnd = () => {
        if (currentHour + 1 < filteredVideos.length) {
            setCurrentHour(currentHour + 1)
            setCurrentVideoTime(0)
        }
    }

    const onPersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerson = e.target.value
        setSelectedPerson(newPerson)
        setCurrentVideoTime(playerRef.current?.getCurrentTime() || 0)
    }

    const onSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const totalWidth = rect.width

        const newHour = Math.floor(
            (clickX / totalWidth) * (endHour - startHour + 1)
        )
        const newVideo = filteredVideos[newHour]
        if (!newVideo || !playerRef.current) return

        const newTimeInSeconds = Math.floor(
            (clickX / totalWidth) * ((endHour - startHour + 1) * 3600)
        )
        const timeWithinHour = newTimeInSeconds % 3600
        setCurrentVideoTime(timeWithinHour)
        playerRef.current.seekTo(timeWithinHour, true)

        const videoId = linkToId(newVideo.Link)
        playerRef.current.loadVideoById({
            videoId,
            startSeconds: timeWithinHour,
        })
        setCurrentHour(newHour)
    }

    const video = filteredVideos[currentHour]
    return (
        <>
            <div className="flex gap-2 mb-4">
                <div>
                    <label>Day: </label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                    >
                        {DAYS.map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Person: </label>
                    <select value={selectedPerson} onChange={onPersonChange}>
                        {PEOPLE.map((person) => (
                            <option key={person} value={person}>
                                {person}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <Timeline
                    playerRef={playerRef}
                    currentIndex={currentHour}
                    currentVideoTime={currentVideoTime}
                    endHour={endHour}
                    startHour={startHour}
                    onSliderClick={onSliderClick}
                    filteredVideos={filteredVideos}
                />
                {filteredVideos.length > 0 && video && (
                    <Youtube
                        videoId={linkToId(video.Link)}
                        onReady={(event) => {
                            console.log('Video ready:', video.Link)
                            playerRef.current = event.target
                        }}
                        onEnd={onEnd}
                        opts={{
                            playerVars: {
                                autoplay: 1,
                                controls: 1,
                                start: currentVideoTime,
                                rel: 0,
                                showinfo: 0,
                                enablejsapi: 1,
                            },
                            width: '100%',
                            height: `${windowWidth / 16 * 9}px`, // Maintain 16:9 aspect ratio
                        }}
                    />
                )}
            </div>
        </>
    )
}

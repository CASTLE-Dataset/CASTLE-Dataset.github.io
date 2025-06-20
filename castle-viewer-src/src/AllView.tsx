import { DAYS, PEOPLE, endHour, startHour } from 'constant'
import { useEffect, useMemo, useRef, useState } from 'react'
import Youtube from 'react-youtube'
import { VideoEntry } from 'types'
import { gridCols, linkToId } from 'utils'
import placeholderImage from './placeholder.png'
import videoData from './videos.json' // Ensure this file is in the same directory
import './timeline.scss'
import 'video.scss'

const Timeline = ({
    playerRefs,
    currentIndex,
    endHour,
    startHour,
    onSliderClick,
    currentVideoTime: propsCurrentVideoTime,
    videoMatrix: filteredVideos,
}: {
    playerRefs: React.MutableRefObject<any>
    currentIndex: number
    endHour: number
    startHour: number
    onSliderClick: (e: React.MouseEvent<HTMLDivElement>) => void
    currentVideoTime: number
    videoMatrix: { [stream: string]: (VideoEntry | null)[] }
}) => {
    const [currentVideoTime, setCurrentVideoTime] = useState(0)
    useEffect(() => {
        setCurrentVideoTime(propsCurrentVideoTime)
    }, [propsCurrentVideoTime])

    useEffect(() => {
        const interval = setInterval(() => {
            const currentVideoTime =
                playerRefs.current?.getCurrentTime?.() || propsCurrentVideoTime
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
                    const hasVideo = Object.values(filteredVideos).some(
                        (videos) => videos[i] !== null
                    )
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

const AllView = () => {
    const [selectedDay, setSelectedDay] = useState<number>(1)
    const [currentHour, setCurrentHour] = useState<number>(0)
    const [currentVideoTime, setCurrentVideoTime] = useState<number>(0)
    const [selectedPeople, setSelectedPeople] = useState<boolean[]>(
        Array(PEOPLE.length).fill(false)
    )

    const playerRefs = useRef<any[]>([])
    const [videoMatrix, setVideoMatrix] = useState<{
        [stream: string]: (VideoEntry | null)[]
    }>({})

    useMemo(() => {
        const streams = Array.from(
            new Set(
                videoData
                    .filter((v) => v.Day === selectedDay)
                    .map((v) => v.Stream)
            )
        )

        const matrix: { [stream: string]: (VideoEntry | null)[] } = {}
        streams.forEach((stream) => {
            const entries = videoData.filter(
                (v) => v.Day === selectedDay && v.Stream === stream
            )
            matrix[stream] = Array.from(
                { length: endHour + 1 - startHour },
                (_, i) => {
                    const hour = startHour + i
                    return (
                        entries.find(
                            (e) => parseInt(e.Time.split(':')[0]) === hour
                        ) || null
                    )
                }
            )
        })
        setVideoMatrix(matrix)
    }, [selectedDay])

    const [paused, setPaused] = useState(true)
    const togglePause = () => {
        setPaused(!paused)
        if (paused) {
            playAll()
        } else {
            pauseAll()
        }
    }

    const pauseAll = () => {
        setPaused(true)
        let currentTime = currentVideoTime
        console.log('Pausing all videos at time:', currentTime)
        playerRefs.current.forEach((player) => {
            if (player) {
                player.pauseVideo()
                currentTime = player.getCurrentTime()
            }
        })
        setCurrentVideoTime(currentTime)
    }

    const playAll = () => {
        setPaused(false)
        playerRefs.current.forEach((player) => {
            if (player) {
                player.seekTo(currentVideoTime, true)
                player.playVideo()
            }
        })
    }

    const onEnd = () => {
        if (currentHour + 1 < endHour - startHour + 1) {
            setCurrentHour(currentHour + 1)
            setCurrentVideoTime(0)
        }
    }

    const onSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
        pauseAll()
        setPaused(true)
        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const totalWidth = rect.width

        const newHour = Math.floor(
            (clickX / totalWidth) * (endHour - startHour + 1)
        )

        const newTimeInSeconds = Math.floor(
            (clickX / totalWidth) * ((endHour - startHour + 1) * 3600)
        )
        const timeWithinHour = newTimeInSeconds % 3600
        setCurrentHour(newHour)
        setCurrentVideoTime(timeWithinHour)

        PEOPLE.forEach((stream, index) => {
            const newVideo = videoMatrix[stream]?.[newHour]
            if (!newVideo || !playerRefs.current[index]) return
            const videoId = linkToId(newVideo.Link)
            playerRefs.current[index].loadVideoById({
                videoId,
                startSeconds: timeWithinHour,
            })
        })
    }
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const videoWidth = useMemo(() => {
        const margin = 16 // Adjust for padding
        const minVideoWidth = 240 // desired minimum width per video
        const maxVideoWidth = 920 // desired maximum width per video
        const availableWidth = windowWidth
        const idealVideoPerRow = gridCols(windowWidth)
        const numVideos = selectedPeople.filter(Boolean).length

        if (numVideos < idealVideoPerRow) {
            return Math.min(
                Math.max(minVideoWidth, availableWidth / numVideos - margin),
                maxVideoWidth
            )
        }
        console.log('idealVideoPerRow', idealVideoPerRow)
        return Math.max(
            minVideoWidth,
            availableWidth / idealVideoPerRow - margin
        )
    }, [selectedPeople, windowWidth])

    console.log('windowWidth', windowWidth)
    console.log('videoWidth', videoWidth)

    return (
        <div>
            <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
            >
                {DAYS.map((day) => (
                    <option key={day} value={day}>
                        Day {day}
                    </option>
                ))}
            </select>
            <div>
                <div className="checkbox-list">
                    {PEOPLE.map((person) => (
                        <label key={person}>
                            <input
                                type="checkbox"
                                checked={selectedPeople[PEOPLE.indexOf(person)]}
                                onChange={(e) => {
                                    const newSelectedPeople = [
                                        ...selectedPeople,
                                    ]
                                    newSelectedPeople[PEOPLE.indexOf(person)] =
                                        e.target.checked
                                    setSelectedPeople(newSelectedPeople)
                                    // if we are removing, we need to remove the player reference
                                    if (!e.target.checked) {
                                        playerRefs.current[
                                            PEOPLE.indexOf(person)
                                        ]?.pauseVideo()
                                        playerRefs.current[
                                            PEOPLE.indexOf(person)
                                        ] = null
                                    } else {
                                        // if we are adding, we need to pause all players
                                        pauseAll()
                                    }
                                }}
                            />
                            {person}
                        </label>
                    ))}
                </div>
                <div className="checkbox-list">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedPeople.every((p) => p)}
                            onChange={(e) => {
                                const newSelectedPeople = selectedPeople.map(
                                    () => e.target.checked
                                )
                                setSelectedPeople(newSelectedPeople)
                                pauseAll()
                            }}
                        />
                        All
                    </label>
                    <label style={{ width: '200px' }}>
                        <input
                            type="checkbox"
                            checked={selectedPeople.every((p) => !p)}
                            onChange={(e) => {
                                const newSelectedPeople = selectedPeople.map(
                                    () => !e.target.checked
                                )
                                setSelectedPeople(newSelectedPeople)
                                // if we are deselecting all, we need to pause all players
                                pauseAll()
                                playerRefs.current = playerRefs.current.map(
                                    () => null
                                )
                            }}
                        />
                        Deselect All
                    </label>
                </div>
            </div>
            {selectedPeople.every((p) => !p) && (
                <span className="error">Please select at least one person</span>
            )}
            <Timeline
                currentVideoTime={currentVideoTime}
                playerRefs={playerRefs}
                currentIndex={currentHour}
                endHour={endHour}
                startHour={startHour}
                onSliderClick={onSliderClick}
                videoMatrix={videoMatrix}
            />
            <button
                className={paused ? 'play-button' : 'play-button outline'}
                onClick={togglePause}
            >
                {paused ? (
                    <>
                        <span className="material-icons">play_circle</span>
                        <span>Play</span>
                    </>
                ) : (
                    <>
                        <span className="material-icons">pause</span>
                        <span>Pause</span>
                    </>
                )}
            </button>
            <div
                className="video-grid"
                style={{
                    gridTemplateColumns: `repeat(auto-fit, minmax(${videoWidth}px, 1fr))`,
                }}
            >
                {PEOPLE.map(
                    (stream, i) =>
                        selectedPeople[PEOPLE.indexOf(stream)] && (
                            <VideoWithLoader
                                key={stream}
                                videoLink={
                                    videoMatrix[stream]?.[currentHour]?.Link
                                }
                                videoWidth={videoWidth}
                                onReady={(event) => {
                                    const player = event.target
                                    playerRefs.current[i] = player
                                }}
                                onEnd={onEnd}
                                name={stream}
                            />
                        )
                )}
            </div>
        </div>
    )
}

const VideoWithLoader = ({
    videoLink,
    onReady,
    onEnd,
    name,
    videoWidth = 200,
}: {
    videoLink?: string
    onReady: (event: any) => void
    onEnd?: () => void
    name: string
    videoWidth?: number
}) => {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
    }, [videoLink])

    return (
        <div className="video-wrapper">
            <p
                className="video-name"
                style={{
                    width: videoWidth,
                    color: !videoLink
                        ? '#ccc'
                        : isLoading
                          ? '#282A36'
                          : '#16c66f',
                }}
            >
                {name} {videoLink ? '' : '(N/A)'}
            </p>
            {videoLink ? (
                <div className="video-container" style={{ width: videoWidth }}>
                    <div
                        className={
                            isLoading ? 'video-loader' : 'video-loader loaded'
                        }
                    >
                        <span>Loading...</span>
                    </div>
                    <Youtube
                        iframeClassName="youtube-iframe"
                        videoId={linkToId(videoLink)}
                        opts={{
                            width: videoWidth,
                            height: (videoWidth / 16) * 9,
                            playerVars: {
                                autoplay: 0,
                                controls: 0,
                                rel: 0,
                                showinfo: 0,
                            },
                        }}
                        onReady={(event) => {
                            setIsLoading(false)
                            onReady(event)
                            event.target.pauseVideo()
                        }}
                        onEnd={onEnd}
                    />
                </div>
            ) : (
                <img
                    src={placeholderImage}
                    alt="No video available"
                    style={{
                        width: videoWidth,
                        height: (videoWidth / 16) * 9,
                    }}
                />
            )}
        </div>
    )
}

export default AllView

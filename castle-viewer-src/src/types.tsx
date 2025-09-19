export type VideoEntry = {
    Day: number
    Stream: string
    Time: string
    Link: string
}

export type Segment = {
    description: string
    start_time: number
    end_time: number
    start_seconds: number
    end_seconds: number
    transcript: string
    hour: string
}

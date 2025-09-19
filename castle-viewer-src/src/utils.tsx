import Papa from 'papaparse'
import { Segment } from 'types'

export const linkToId = (link: string): string => {
    const match = link.match(
        /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/))([^&]+)/
    )
    return match ? match[1] : ''
}

export const gridCols = (windowWidth: number): number => {
    if (windowWidth < 600) return 1
    if (windowWidth < 900) return 2
    if (windowWidth < 1200) return 3
    if (windowWidth < 1600) return 4
    return 6
}

export async function loadSegments(day: string, person: string) {
    return new Promise((resolve, reject) => {
        const filePath = `http://localhost:9000/segments/${day}/${person}_timeline.csv`
        console.log('Loading segments from:', filePath)

        try {
            const response = fetch(filePath)
            response
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`)
                    }
                    return res.text()
                })
                .then((csvText) => {
                    Papa.parse(csvText, {
                        header: true,
                        complete: (results) => {
                            console.log('Parsed segments:', results.data)
                            resolve(results.data)
                        },
                        error: (error) => {
                            console.error('Error parsing CSV:', error)
                            reject(error)
                        },
                    })
                })
                .catch((error) => {
                    console.error('Fetch error:', error)
                    reject(error)
                })
        } catch (error) {
            console.error('Unexpected error:', error)
            reject(error)
        }
    })
}

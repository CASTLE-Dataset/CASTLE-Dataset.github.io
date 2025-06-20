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

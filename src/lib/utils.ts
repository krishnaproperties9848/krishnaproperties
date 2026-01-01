import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export type BrochureMediaItem =
    | { type: "image"; url: string }
    | { type: "video"; url: string; thumbnailUrl: string | null }

export function extractGoogleDriveFileId(input: string): string | null {
    if (!input) return null

    try {
        const url = new URL(input)
        const id = url.searchParams.get("id")
        if (id) return id
    } catch {
        // ignore
    }

    const match1 = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    const match2 = input.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    const match3 = input.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)

    if (match1) return match1[1]
    if (match2) return match2[1]
    if (match3) return match3[1]

    return null
}

export function googleDriveToDownloadUrl(shareLink: string): string | null {
    const fileId = extractGoogleDriveFileId(shareLink)
    if (!fileId) return null
    return `https://drive.google.com/uc?export=download&id=${fileId}`
}

export function googleDriveToViewUrl(shareLink: string): string | null {
    const fileId = extractGoogleDriveFileId(shareLink)
    if (!fileId) return null
    return googleDriveToThumbnailUrl(fileId, 2000)
}

export function googleDriveToThumbnailUrl(input: string, width: number): string | null {
    const fileId = extractGoogleDriveFileId(input) ?? input
    if (!fileId) return null
    const safeWidth = Math.max(16, Math.min(2000, Math.floor(width)))
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${safeWidth}`
}

export function googleDriveToFastImageUrl(input: string, width: number): string | null {
    const fileId = extractGoogleDriveFileId(input) ?? input
    if (!fileId) return null
    const safeWidth = Math.max(16, Math.min(2000, Math.floor(width)))
    return `https://lh3.googleusercontent.com/d/${fileId}=w${safeWidth}`
}

export function getImageCandidateUrls(input: string, width: number): string[] {
    if (!input) return []

    const safeWidth = Math.max(16, Math.min(2000, Math.floor(width)))
    const fileId = extractGoogleDriveFileId(input)
    if (!fileId) return [input]

    const candidates = [
        googleDriveToFastImageUrl(fileId, safeWidth),
        googleDriveToThumbnailUrl(fileId, safeWidth),
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        input,
    ].filter(Boolean) as string[]

    return Array.from(new Set(candidates))
}

export function resolveImageUrl(input: string, width: number): string {
    if (!input) return input

    const safeWidth = Math.max(16, Math.min(2000, Math.floor(width)))

    try {
        const url = new URL(input)
        const host = url.hostname.toLowerCase()

        if (host === "drive.google.com" && url.pathname === "/thumbnail") {
            url.searchParams.set("sz", `w${safeWidth}`)
            return url.toString()
        }

        if (host === "drive.google.com" && url.pathname === "/uc") {
            const exp = url.searchParams.get("export")
            const id = url.searchParams.get("id")
            if (exp === "view" && id) {
                return googleDriveToThumbnailUrl(id, safeWidth) || input
            }
        }
    } catch {
        // ignore
    }

    const isDrive = input.includes("drive.google.com") || input.includes("docs.google.com")
    if (!isDrive) return input

    const thumb = googleDriveToFastImageUrl(input, safeWidth) || googleDriveToThumbnailUrl(input, safeWidth)
    return thumb || input
}

export function extractYouTubeVideoId(input: string): string | null {
    if (!input) return null

    try {
        const url = new URL(input)
        const host = url.hostname.toLowerCase()

        if (host === "youtu.be") {
            const id = url.pathname.replace(/^\//, "").split("/")[0]
            return id || null
        }

        if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
            const v = url.searchParams.get("v")
            if (v) return v

            const parts = url.pathname.split("/").filter(Boolean)
            const embedIndex = parts.indexOf("embed")
            if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1]

            const shortsIndex = parts.indexOf("shorts")
            if (shortsIndex >= 0 && parts[shortsIndex + 1]) return parts[shortsIndex + 1]
        }
    } catch {
        // ignore
    }

    const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\s?/]+)/)
    return match?.[1] ?? null
}

export function youTubeToEmbedUrl(input: string): string {
    const id = extractYouTubeVideoId(input)
    if (!id) return input
    return `https://www.youtube.com/embed/${id}`
}

export function youTubeToThumbnailUrl(input: string): string | null {
    const id = extractYouTubeVideoId(input)
    if (!id) return null
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}

export function buildBrochureMediaItems(args: {
    coverImageUrl?: string | null
    galleryUrls?: Array<string | null | undefined>
    videos?: Array<{ url: string; thumbnail_url?: string | null }>
}): BrochureMediaItem[] {
    const imageUrls = [args.coverImageUrl, ...(args.galleryUrls || [])].filter(Boolean) as string[]
    const items: BrochureMediaItem[] = imageUrls.map((url) => ({ type: "image", url }))

    for (const video of args.videos || []) {
        if (!video?.url) continue
        const thumbnailUrl = video.thumbnail_url ?? youTubeToThumbnailUrl(video.url)
        items.push({ type: "video", url: video.url, thumbnailUrl })
    }

    return items
}

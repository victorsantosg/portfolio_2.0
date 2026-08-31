import { NextResponse } from "next/server"
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"

/**
 * Sanitizes markdown and formatting for human neural speech
 */
function cleanSpeech(rawText: string): string {
  if (!rawText) return ""
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "$1 arroba $2")
    .replace(/[*_~`#>\\]/g, "")
    .replace(/[•▪▸►■✦✧★\-\–\—]/g, " ")
    .replace(/\/\//g, " - ")
    .replace(/\+55\s*(\d{2})\s*(\d{4,5})-?(\d{4})/g, "DDD $1, $2 $3")
    .replace(/J\.A\.R\.V\.I\.S\./gi, "Járvis")
    .replace(/\bJARVIS\b/gi, "Járvis")
    .replace(/\bJarvis\b/g, "Járvis")
    .replace(/[:;]+/g, ",")
    .replace(/\n+/g, ", ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim()
}

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json()
    const cleanText = cleanSpeech(text)

    if (!cleanText) {
      return NextResponse.json({ error: "Texto vazio" }, { status: 400 })
    }

    // Default: Antonio (Brazilian Portuguese Neural Voice with Jarvis AI cadence)
    const selectedVoice = voice || "pt-BR-AntonioNeural"

    const tts = new MsEdgeTTS()
    await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    const { audioStream } = await tts.toStream(cleanText, {
      pitch: "-4Hz",
      rate: "+30%",
      volume: "+0%",
    })

    const chunks: Buffer[] = []
    await new Promise<void>((resolve, reject) => {
      audioStream.on("data", (chunk: Buffer) => chunks.push(chunk))
      audioStream.on("end", () => resolve())
      audioStream.on("error", (err: any) => reject(err))
    })

    const audioBuffer = Buffer.concat(chunks)

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error: any) {
    console.error("Erro no Microsoft Edge Neural TTS:", error)
    return NextResponse.json({ error: error.message || "Erro gerando áudio" }, { status: 500 })
  }
}

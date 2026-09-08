"use client"

export interface SpeechRequest {
  id?: string
  text: string
  source: "tour" | "holodeck" | "assistant" | "drone" | string
  onStart?: () => void
  onEnd?: () => void
  onError?: (err: any) => void
  onLoading?: (loading: boolean) => void
}

export interface VoiceState {
  isSpeaking: boolean
  isLoading: boolean
  isMuted: boolean
  currentSource: string | null
  currentText: string | null
  queueLength: number
}

/**
 * Normaliza e limpa textos para pronúncia natural no sintetizador Edge Neural TTS
 */
export function cleanSpeechText(rawText: string): string {
  if (!rawText) return ""
  return rawText
    // Remove links markdown deixando o texto
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove URLs
    .replace(/https?:\/\/[^\s)]+/g, "")
    // Converte emails para formato falado
    .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "$1 arroba $2")
    // Remove símbolos de formatação markdown
    .replace(/[*_~`#>\\]/g, "")
    // Remove marcadores de lista, bullets e setas
    .replace(/[•▪▸►■✦✧★\-\–\—]/g, " ")
    .replace(/\/\//g, " - ")
    // Pronuncia telefones no formato brasileiro
    .replace(/\+55\s*(\d{2})\s*(\d{4,5})-?(\d{4})/g, "DDD $1, $2 $3")
    // Ajusta pronúncia do Jarvis
    .replace(/J\.A\.R\.V\.I\.S\./gi, "Járvis")
    .replace(/\bJARVIS\b/gi, "Járvis")
    .replace(/\bJarvis\b/g, "Járvis")
    // Pontuações
    .replace(/[:;]+/g, ",")
    .replace(/\n\n+/g, ". ")
    .replace(/\n+/g, ", ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim()
}

/**
 * Centralizador de voz J.A.R.V.I.S.
 * Garante que NENHUMA voz sobreponha outra. Se uma voz estiver falando,
 * qualquer nova solicitação aguarda na fila FIFO até a atual terminar.
 */
class JarvisVoiceManager {
  private queue: SpeechRequest[] = []
  private currentRequest: SpeechRequest | null = null
  private currentAudio: HTMLAudioElement | null = null
  private abortController: AbortController | null = null
  private isProcessing = false
  private muted = false
  private isLoading = false
  private listeners: Set<(state: VoiceState) => void> = new Set()

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jarvis_voice_enabled")
      if (saved !== null) {
        this.muted = saved === "false"
      }
      this.initAutoplayUnlock()
    }
  }

  private initAutoplayUnlock() {
    if (typeof window === "undefined") return
    const unlock = () => {
      if (this.currentAudio && this.currentAudio.paused && !this.muted) {
        this.currentAudio.play().catch(() => {})
      }
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("click", unlock)
      window.removeEventListener("touchstart", unlock)
      window.removeEventListener("keydown", unlock)
    }
    window.addEventListener("pointerdown", unlock, { once: true })
    window.addEventListener("click", unlock, { once: true })
    window.addEventListener("touchstart", unlock, { once: true })
    window.addEventListener("keydown", unlock, { once: true })
  }

  public getState(): VoiceState {
    return {
      isSpeaking: !!this.currentAudio && !this.currentAudio.paused,
      isLoading: this.isLoading,
      isMuted: this.muted,
      currentSource: this.currentRequest?.source || null,
      currentText: this.currentRequest?.text || null,
      queueLength: this.queue.length,
    }
  }

  public subscribe(listener: (state: VoiceState) => void): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    const state = this.getState()
    this.listeners.forEach((cb) => cb(state))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("jarvis-voice-state-change", { detail: state }))
    }
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setMuted(muted: boolean) {
    this.muted = muted
    if (typeof window !== "undefined") {
      localStorage.setItem("jarvis_voice_enabled", String(!muted))
    }
    if (muted) {
      this.stopAll()
    }
    this.notify()
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  /**
   * Enfileira um texto para leitura pelo Jarvis.
   * Se já houver algo sendo lido, este texto AGUARDA a leitura atual terminar.
   */
  public speak(req: SpeechRequest) {
    if (this.muted) {
      req.onEnd?.()
      return
    }

    const sanitized = cleanSpeechText(req.text)
    if (!sanitized) {
      req.onEnd?.()
      return
    }

    // Prevenção de duplicação idêntica consecutiva
    if (
      (this.currentRequest && this.currentRequest.source === req.source && cleanSpeechText(this.currentRequest.text) === sanitized) ||
      this.queue.some((item) => item.source === req.source && cleanSpeechText(item.text) === sanitized)
    ) {
      return
    }

    this.queue.push({
      ...req,
      text: sanitized,
    })

    this.notify()
    this.processQueue()
  }

  /**
   * Processa a fila de forma sequencial garantindo que nunca haja sobreposição
   */
  private async processQueue() {
    if (this.isProcessing || this.currentAudio) {
      return
    }

    if (this.queue.length === 0) {
      this.currentRequest = null
      this.isLoading = false
      this.notify()
      return
    }

    if (this.muted) {
      this.queue = []
      this.currentRequest = null
      this.isLoading = false
      this.notify()
      return
    }

    this.isProcessing = true
    const nextReq = this.queue.shift()!
    this.currentRequest = nextReq
    this.isLoading = true
    nextReq.onLoading?.(true)
    this.notify()

    try {
      this.abortController = new AbortController()

      // Cancela sínteses nativas residuais se houverem
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }

      const res = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nextReq.text }),
        signal: this.abortController.signal,
      })

      if (!res.ok) {
        throw new Error(`TTS HTTP error ${res.status}`)
      }

      const blob = await res.blob()
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      this.currentAudio = audio
      this.isLoading = false
      nextReq.onLoading?.(false)

      audio.onplay = () => {
        nextReq.onStart?.()
        this.notify()
      }

      audio.onended = () => {
        try {
          URL.revokeObjectURL(audioUrl)
        } catch (_) {}
        this.currentAudio = null
        nextReq.onEnd?.()
        this.isProcessing = false
        this.notify()
        // Processa o próximo da fila automaticamente
        this.processQueue()
      }

      audio.onerror = (e) => {
        console.warn("Audio playback error:", e)
        try {
          URL.revokeObjectURL(audioUrl)
        } catch (_) {}
        this.currentAudio = null
        this.isLoading = false
        nextReq.onLoading?.(false)
        nextReq.onError?.(e)
        this.isProcessing = false
        this.notify()
        this.processQueue()
      }

      await audio.play()
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("Jarvis Voice error:", err)
        nextReq.onError?.(err)
      }
      this.isLoading = false
      nextReq.onLoading?.(false)
      this.currentAudio = null
      this.isProcessing = false
      this.notify()
      this.processQueue()
    }
  }

  /**
   * Interrompe a reprodução de uma fonte específica ou remove itens pendentes dessa fonte.
   * Se for a fonte atualmente em reprodução, para imediatamente e avança para a próxima da fila.
   */
  public stop(source?: string) {
    if (!source) {
      this.stopAll()
      return
    }

    // Remove itens pendentes dessa fonte na fila
    this.queue = this.queue.filter((item) => item.source !== source)

    // Se o áudio atual for dessa fonte, interrompe e libera a fila
    if (this.currentRequest && this.currentRequest.source === source) {
      if (this.abortController) {
        this.abortController.abort()
        this.abortController = null
      }
      if (this.currentAudio) {
        try {
          this.currentAudio.pause()
          this.currentAudio.currentTime = 0
        } catch (_) {}
        this.currentAudio = null
      }
      this.isLoading = false
      this.isProcessing = false
      this.currentRequest = null
      this.notify()
      // Avança para a próxima fonte da fila
      this.processQueue()
    } else {
      this.notify()
    }
  }

  /**
   * Para absolutamente tudo e zera a fila
   */
  public stopAll() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      } catch (_) {}
      this.currentAudio = null
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    this.queue = []
    this.currentRequest = null
    this.isLoading = false
    this.isProcessing = false
    this.notify()
  }

  /**
   * Pausa o áudio atualmente em reprodução
   */
  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause()
      this.notify()
    }
  }

  /**
   * Retoma o áudio pausado
   */
  public resume() {
    if (this.currentAudio && this.currentAudio.paused && !this.muted) {
      this.currentAudio.play().catch(() => {})
      this.notify()
    }
  }

  public isSpeaking(): boolean {
    return !!this.currentAudio && !this.currentAudio.paused
  }

  public isSourceSpeaking(source: string): boolean {
    return this.isSpeaking() && this.currentRequest?.source === source
  }
}

// Singleton global
export const jarvisVoice = new JarvisVoiceManager()

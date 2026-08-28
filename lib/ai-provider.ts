import Groq from "groq-sdk"

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
})

/**
 * Call Groq Cloud with Llama 3.3 70B
 */
async function callGroq(messages: Message[], systemPrompt: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured")
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ],
    temperature: 0.6,
    max_tokens: 450,
  })

  const reply = completion.choices[0]?.message?.content
  if (!reply) throw new Error("Empty response from Groq")
  return reply
}

/**
 * Call Google Gemini API as Seamless Fallback
 */
async function callGemini(messages: Message[], systemPrompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  // Format messages for Google Generative Language API
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Olá J.A.R.V.I.S." }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 450,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!reply) throw new Error("Empty response from Gemini")
  return reply
}

/**
 * Resilient AI Engine with Automatic Failover
 * 1. Tries Groq Cloud (Llama 3.3 70B)
 * 2. If Groq is unavailable or fails, automatically switches to Google Gemini (Gemini 1.5 Flash)
 */
export async function generateJarvisResponse(
  messages: Message[],
  systemPrompt: string
): Promise<{ reply: string; provider: "groq" | "gemini" }> {
  // 1. Try Primary: Groq Cloud
  try {
    const reply = await callGroq(messages, systemPrompt)
    return { reply, provider: "groq" }
  } catch (groqError: any) {
    console.warn("⚠️ Groq Cloud indisponível ou com rate limit. Alternando para Google Gemini...", groqError?.message)

    // 2. Try Fallback: Google Gemini
    try {
      const reply = await callGemini(messages, systemPrompt)
      return { reply, provider: "gemini" }
    } catch (geminiError: any) {
      console.error("❌ Ambos os provedores de IA (Groq e Gemini) falharam:", geminiError?.message)
      throw new Error("Falha temporária em todas as redes neurais (Groq e Gemini).")
    }
  }
}

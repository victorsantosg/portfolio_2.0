import Groq from "groq-sdk"

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
})

/**
 * Helper to clean thinking tags (<think>...</think>) from reasoning models
 */
function cleanAiResponse(text: string): string {
  if (!text) return ""
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()
}

/**
 * Call Google Gemini with specific model
 */
async function callGemini(model: string, messages: Message[], systemPrompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) throw new Error("GEMINI_API_KEY not configured")

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`

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
        maxOutputTokens: 1200,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini [${model}] ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!reply) throw new Error(`Empty response from Gemini [${model}]`)
  return cleanAiResponse(reply)
}

/**
 * Call Groq Cloud with specific model
 */
async function callGroq(model: string, messages: Message[], systemPrompt: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured")

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ],
    temperature: 0.6,
    max_tokens: 1200,
  })

  const reply = completion.choices[0]?.message?.content
  if (!reply) throw new Error(`Empty response from Groq [${model}]`)
  return cleanAiResponse(reply)
}

/**
 * Failover em 4 Camadas Ativas (Gemini 3.6 Flash -> Gemini 3.5 Flash Lite -> Groq GPT-OSS 120B -> Groq Qwen 3.6 27B)
 */
export async function generateJarvisResponse(
  messages: Message[],
  systemPrompt: string
): Promise<{ reply: string; provider: string; model: string }> {
  // 1º Provedor (Principal): Google Gemini 3.6 Flash
  try {
    const reply = await callGemini("gemini-3.6-flash", messages, systemPrompt)
    return { reply, provider: "gemini", model: "gemini-3.6-flash" }
  } catch (err1: any) {
    console.warn("⚠️ Camada 1 (Gemini 3.6 Flash) falhou. Alternando para Camada 2 (Gemini 3.5 Flash Lite)...", err1?.message)
  }

  // 2º Provedor (Contingência 1): Google Gemini 3.5 Flash Lite
  try {
    const reply = await callGemini("gemini-3.5-flash-lite", messages, systemPrompt)
    return { reply, provider: "gemini", model: "gemini-3.5-flash-lite" }
  } catch (err2: any) {
    console.warn("⚠️ Camada 2 (Gemini 3.5 Flash Lite) falhou. Alternando para Camada 3 (Groq GPT-OSS 120B)...", err2?.message)
  }

  // 3º Provedor (Contingência 2): Groq Cloud (GPT-OSS 120B)
  try {
    const reply = await callGroq("openai/gpt-oss-120b", messages, systemPrompt)
    return { reply, provider: "groq", model: "openai/gpt-oss-120b" }
  } catch (err3: any) {
    console.warn("⚠️ Camada 3 (Groq GPT-OSS 120B) falhou. Alternando para Camada 4 (Groq Qwen 3.6 27B)...", err3?.message)
  }

  // 4º Provedor (Contingência 3): Groq Cloud (Qwen 3.6 27B)
  try {
    const reply = await callGroq("qwen/qwen3.6-27b", messages, systemPrompt)
    return { reply, provider: "groq", model: "qwen/qwen3.6-27b" }
  } catch (err4: any) {
    console.error("❌ Todas as 4 camadas neurais falharam:", err4?.message)
    throw new Error("Falha temporária em todas as redes neurais conectadas.")
  }
}

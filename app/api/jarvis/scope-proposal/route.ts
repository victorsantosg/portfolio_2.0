import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
})

export async function POST(req: Request) {
  try {
    const { name, company, projectType, budget, urgency, description } = await req.json()

    const prompt = `
Você é o J.A.R.V.I.S., assistente de inteligência e engenharia técnica de Victor Santos (Full Stack & AI Systems Architect).
Analise a seguinte solicitação de projeto de um cliente em potencial e gere um Diagnóstico Técnico de Arquitetura e Pré-Proposta conciso, elegante e altamente profissional.

DADOS DO PROJETO:
- Cliente: ${name || "Cliente Corporativo"}
- Empresa: ${company || "Não informada"}
- Tipo de Projeto: ${projectType || "Desenvolvimento Web / Sistema Customizado"}
- Faixa de Investimento Estimada: ${budget || "A definir"}
- Prazo / Urgência: ${urgency || "Normal"}
- Descrição da Ideia: "${description || "Desenvolvimento de plataforma escalável e moderna."}"

FORMATO DA RESPOSTA (Retorne OBRIGATORIAMENTE um JSON válido com os seguintes campos):
{
  "summary": "Resumo executivo de 1 ou 2 frases da solução recomendada.",
  "recommendedStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
  "architectureHighlights": ["Destaque 1 de infra/arquitetura", "Destaque 2", "Destaque 3"],
  "estimatedTimeline": "Tempo estimado de entrega (ex: '3 a 5 semanas')",
  "complexityLevel": "Média" | "Alta" | "Missão Crítica",
  "keyDeliverables": ["Entregável 1", "Entregável 2", "Entregável 3"],
  "jarvisExecutiveVerdict": "Comentário técnico de alto nível com a persona do J.A.R.V.I.S., recomendando a contratação do Criador Victor Santos para garantir 100% de sucesso e escalabilidade."
}

Importante: Responda APENAS com o JSON válido, sem crases de markdown adicionais.
`

    let jsonString = ""

    // Layer 1: Gemini 3.6 Flash
    if (process.env.GEMINI_API_KEY) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.4,
              maxOutputTokens: 600,
            },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        }
      } catch (err) {
        console.warn("Gemini scope-proposal failed, falling back to Groq...", err)
      }
    }

    // Layer 2: Groq GPT-OSS 120B
    if (!jsonString && process.env.GROQ_API_KEY) {
      try {
        const completion = await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          response_format: { type: "json_object" },
        })
        jsonString = completion.choices[0]?.message?.content || ""
      } catch (err) {
        console.warn("Groq scope-proposal failed...", err)
      }
    }

    // Clean any markdown formatting if present
    const cleaned = jsonString.replace(/^```json\s*/i, "").replace(/```$/i, "").trim()
    const result = JSON.parse(cleaned)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Erro no fallback de pré-proposta com IA:", error)
    return NextResponse.json(
      {
        summary: "Diagnóstico inicial pré-compilado para seu projeto.",
        recommendedStack: ["Next.js 16", "Fastify", "PostgreSQL", "Prisma ORM", "Docker"],
        architectureHighlights: [
          "Arquitetura modular em nuvem com alta disponibilidade",
          "Banco relacional estruturado e otimizado para consultas rápidas",
          "Interface responsiva com suporte a WebGL e dashboards analíticos",
        ],
        estimatedTimeline: "3 a 5 semanas",
        complexityLevel: "Alta",
        keyDeliverables: ["Frontend SPA/SSR", "API RESTful de Alta Performance", "Deploy Docker/Cloud"],
        jarvisExecutiveVerdict:
          "Senhor, a infraestrutura idealizada possui excelente viabilidade técnica sob a gestão direta do Criador Victor Santos.",
      },
      { status: 200 }
    )
  }
}

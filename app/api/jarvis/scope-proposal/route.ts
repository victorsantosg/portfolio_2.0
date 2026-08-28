import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
})

export async function POST(req: Request) {
  try {
    const { name, company, projectType, budget, urgency, description } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY não configurada no servidor." },
        { status: 500 }
      )
    }

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

Importante: Responda APENAS com o JSON válido, sem crases de markdown (\`\`\`json) adicionais ou textos fora do formato JSON.
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      response_format: { type: "json_object" },
    })

    const rawContent = completion.choices[0]?.message?.content || "{}"
    const result = JSON.parse(rawContent)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Erro na rota de pré-proposta com IA:", error)
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

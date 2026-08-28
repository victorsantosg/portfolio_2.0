# 🔑 Guia Completo: Como Cadastrar e Configurar Chaves de API de IA (Gemini & Groq)

Este guia prático ensina o passo a passo de como obter, cadastrar e gerenciar com segurança as chaves de API do **Google Gemini** e da **Groq Cloud** para uso em qualquer projeto (Next.js, Node.js, Python, React, Docker ou VPS).

---

## 📋 1. Resumo das Chaves & Modelos Ativos

| Provedor | Variável de Ambiente | Modelos Oficiais Ativos | Características Principais |
| :--- | :--- | :--- | :--- |
| **Google Gemini** | `GEMINI_API_KEY` | `gemini-3.6-flash`<br>`gemini-3.5-flash-lite` | Ultra-inteligente, respostas naturais em português, alta cota gratuita. |
| **Groq Cloud** | `GROQ_API_KEY` | `openai/gpt-oss-120b`<br>`qwen/qwen3.6-27b` | Velocidade extrema em LPUs (~300ms), robusto para raciocínio técnico. |

---

## 🛠️ 2. Como Obter Novas Chaves Gratuitas

### 🟢 Opção A: Google Gemini API (Google AI Studio)
1. Acesse o portal: [https://aistudio.google.com/](https://aistudio.google.com/)
2. Faça login com sua conta do Google.
3. No menu lateral esquerdo, clique em **"Get API key"** (ou **"Obter chave de API"**).
4. Clique em **"Create API key"** (Criar chave em novo projeto ou projeto existente).
5. Copie a chave gerada.

### 🟠 Opção B: Groq Cloud API
1. Acesse o portal: [https://console.groq.com/](https://console.groq.com/)
2. Faça login (com Google, GitHub ou Email).
3. No menu lateral, vá em **"API Keys"**.
4. Clique no botão **"Create API Key"**.
5. Dê um nome (ex: `meu-novo-projeto`) e clique em **Submit**.
6. Copie a chave imediatamente (ela começa com `gsk_...` e só aparece uma vez).

---

## 💻 3. Como Cadastrar em Projetos Locais (Ambiente de Desenvolvimento)

### Passo 1: Criar o arquivo `.env.local`
Na raiz do seu projeto, crie um arquivo chamado `.env.local` (ou `.env`):

```env
# Google Gemini API Key
GEMINI_API_KEY=sua_chave_gemini_aqui

# Groq Cloud API Key
GROQ_API_KEY=gsk_sua_chave_groq_aqui
```

### Passo 2: Proteger no `.gitignore` (MUITO IMPORTANTE)
Certifique-se de que o seu arquivo `.gitignore` contém as seguintes linhas para **NUNCA** enviar suas chaves para o GitHub:

```gitignore
# Arquivos de Variáveis de Ambiente
.env
.env.local
.env*.local
```

---

## ☁️ 4. Como Cadastrar em Produção

### 🅰️ Na Vercel (Deploy Web / Next.js)
1. Acesse seu painel: [https://vercel.com/](https://vercel.com/)
2. Selecione o seu projeto (ex: `portfolio_2.0`).
3. Vá na aba superior **Settings** (Configurações).
4. No menu lateral esquerdo, clique em **Environment Variables**.
5. Adicione as duas variáveis:
   - **Key:** `GEMINI_API_KEY` | **Value:** `Cole sua chave Gemini` | Marque: `Production`, `Preview`, `Development` -> Clique em **Save**.
   - **Key:** `GROQ_API_KEY` | **Value:** `Cole sua chave Groq` | Marque: `Production`, `Preview`, `Development` -> Clique em **Save**.
6. Vá na aba **Deployments** e clique em **Redeploy** para aplicar as novas variáveis.

---

### 🅱️ No Docker / Coolify / VPS Linux
Se você for subir seu projeto via Docker ou Docker Compose:

#### No `docker-compose.yml`:
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
    env_file:
      - .env
```

#### No Linux VPS (`/etc/environment` ou `.bashrc`):
```bash
export GEMINI_API_KEY="sua_chave_gemini_aqui"
export GROQ_API_KEY="sua_chave_groq_aqui"
```

---

## 🧠 5. Snippet de Código Pronto: Failover em 4 Camadas

Copie e cole este módulo (`ai-provider.ts`) no seu projeto para ter redundância automática de 100% de disponibilidade:

```typescript
// lib/ai-provider.ts
import Groq from "groq-sdk"

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

function cleanAiResponse(text: string): string {
  return (text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim()
}

// 1. Chamada Google Gemini
async function callGemini(model: string, messages: Message[], systemPrompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) throw new Error("GEMINI_API_KEY não configurada")

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Olá" }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
    }),
  })

  if (!response.ok) throw new Error(`Gemini [${model}] status ${response.status}`)
  const data = await response.json()
  return cleanAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text)
}

// 2. Chamada Groq Cloud
async function callGroq(model: string, messages: Message[], systemPrompt: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY não configurada")

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
    ],
    temperature: 0.6,
    max_tokens: 500,
  })

  return cleanAiResponse(completion.choices[0]?.message?.content || "")
}

// 3. Função Principal com Failover em Cascata
export async function generateAiResponse(
  messages: Message[],
  systemPrompt: string
): Promise<{ reply: string; provider: string; model: string }> {
  // 1ª Camada: Gemini 3.6 Flash (Principal)
  try {
    const reply = await callGemini("gemini-3.6-flash", messages, systemPrompt)
    return { reply, provider: "gemini", model: "gemini-3.6-flash" }
  } catch (e) {
    console.warn("Camada 1 falhou, alternando para Camada 2...")
  }

  // 2ª Camada: Gemini 3.5 Flash Lite
  try {
    const reply = await callGemini("gemini-3.5-flash-lite", messages, systemPrompt)
    return { reply, provider: "gemini", model: "gemini-3.5-flash-lite" }
  } catch (e) {
    console.warn("Camada 2 falhou, alternando para Camada 3...")
  }

  // 3ª Camada: Groq GPT-OSS 120B
  try {
    const reply = await callGroq("openai/gpt-oss-120b", messages, systemPrompt)
    return { reply, provider: "groq", model: "openai/gpt-oss-120b" }
  } catch (e) {
    console.warn("Camada 3 falhou, alternando para Camada 4...")
  }

  // 4ª Camada: Groq Qwen 3.6 27B
  try {
    const reply = await callGroq("qwen/qwen3.6-27b", messages, systemPrompt)
    return { reply, provider: "groq", model: "qwen/qwen3.6-27b" }
  } catch (e) {
    throw new Error("Todas as camadas de contingência falharam.")
  }
}
```

---

## 🔒 6. Regras de Ouro de Segurança

1. **Nunca use chaves no Frontend**: Sempre chame suas chaves em rotas de API no servidor (`/api/...` ou backend Express/Fastify/Python).
2. **Nunca faça Commit do `.env`**: Mantenha sempre `.env*` no `.gitignore`.
3. **Se uma chave vazar**: Revogue-a imediatamente no console da Groq ou Google AI Studio e gere uma nova em 10 segundos.

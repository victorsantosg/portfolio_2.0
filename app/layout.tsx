import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Victor Santos | Full Stack Developer • AI & Automation',
  description: 'Portfólio de Victor Santos. Full Stack Developer especializado em aplicações web e microsserviços (Next.js, Python, PostgreSQL, Docker) e soluções de IA (OmniRoute, Agentes Autônomos, MCP Protocol).',
  keywords: ['full stack developer', 'next.js', 'python', 'postgresql', 'docker', 'ai automation', 'ai agents', 'mcp protocol', 'fastify'],
  authors: [{ name: 'Victor Santos' }],
  openGraph: {
    title: 'Victor Santos | Full Stack Developer • AI & Automation',
    description: 'Desenvolvedor Full Stack focado em sistemas corporativos com Next.js, Python, PostgreSQL, Docker e agentes autônomos de IA.',
    url: 'https://victorsantos.dev',
    siteName: 'Victor Santos Portfolio',
    images: [
      {
        url: '/chatbot_ia_cover.png',
        width: 1200,
        height: 630,
        alt: 'Victor Santos Portfolio Showcase',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victor Santos | Full Stack Developer • AI & Automation',
    description: 'Full Stack Developer focado em Next.js, Python, PostgreSQL, Docker e Automação com Agentes de IA.',
    images: ['/chatbot_ia_cover.png'],
  },
  icons: {
    icon: '/logovs-orange.svg',
    apple: '/logovs-orange.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Victor Santos',
    jobTitle: 'Full Stack Developer | AI & Automation',
    url: 'https://victorsantos.dev',
    sameAs: [
      'https://github.com/victorsantosg',
      'https://www.linkedin.com/in/victor-santos-0a86021b7/',
    ],
    knowsAbout: ['Next.js', 'Fastify', 'TypeScript', 'Python', 'PostgreSQL', 'Docker', 'AI Agents', 'MCP Protocol'],
  }

  return (
    <html lang="pt-BR" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Toaster position="bottom-left" theme="dark" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

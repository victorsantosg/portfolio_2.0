import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Victor Santos | Next.js Developer & Data Specialist',
  description: 'Portfólio de Victor Santos. Especialista em desenvolvimento Next.js (Web/Mobile/PWA), automações de processos (RPA) com Python, e infraestrutura ágil com Docker e Coolify.',
  keywords: ['next.js', 'pwa', 'docker', 'coolify', 'python', 'rpa', 'automação', 'data analyst', 'react', 'desenvolvedor full-stack'],
  authors: [{ name: 'Victor Santos' }],
  openGraph: {
    title: 'Victor Santos | Next.js Developer & Data Specialist',
    description: 'Desenvolvedor Full-Stack focado em aplicações web modernas com Next.js, automações inteligentes em Python e sistemas de alta performance.',
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
    title: 'Victor Santos | Next.js Developer & Data Specialist',
    description: 'Especialista em Next.js, automações com Python e arquitetura web escalável.',
    images: ['/chatbot_ia_cover.png'],
  },
  icons: {
    icon: '/logovs.svg',
    apple: '/logovs.svg',
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
    jobTitle: 'Next.js Developer & Data Specialist',
    url: 'https://victorsantos.dev',
    sameAs: [
      'https://github.com/victorsantosg',
      'https://www.linkedin.com/in/victor-santos-0a86021b7/',
    ],
    knowsAbout: ['Next.js', 'React', 'Python', 'RPA', 'Docker', 'PostgreSQL', 'Tailwind CSS'],
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

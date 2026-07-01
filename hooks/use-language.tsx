"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/translations"

type Language = "pt" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.pt
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language") as Language
    if (saved === "pt" || saved === "en") {
      setLanguageState(saved)
    } else {
      const browserLang = typeof navigator !== "undefined" && navigator.language.startsWith("en") ? "en" : "pt"
      setLanguageState(browserLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

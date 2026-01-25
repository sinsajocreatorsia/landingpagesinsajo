'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/lib/i18n'

interface WorkshopLayoutProps {
  children: ReactNode
}

export default function WorkshopLayout({ children }: WorkshopLayoutProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}

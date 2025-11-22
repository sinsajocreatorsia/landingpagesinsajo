'use client'

import { ReactNode } from 'react'
import ParticleBackground from '@/components/effects/ParticleBackground'
import ChatWidget from '@/components/chat/ChatWidget'

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <ParticleBackground />
      {children}
      <ChatWidget />
    </>
  )
}

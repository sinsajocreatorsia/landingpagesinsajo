'use client'

import { ReactNode } from 'react'
import ParticleBackground from '@/components/effects/ParticleBackground'
import ChatWidget from '@/components/chat/ChatWidget'
import AIRobotAnimation from '@/components/effects/AIRobotAnimation'

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <ParticleBackground />
      <AIRobotAnimation />
      {children}
      <ChatWidget />
    </>
  )
}

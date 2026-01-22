'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) return null

  const timeUnits = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {timeUnits.map((unit) => (
        <div
          key={unit.label}
          className="bg-[#200F5D]/50 backdrop-blur-sm border border-[#2CB6D7]/30 rounded-xl p-3 min-w-[80px] text-center"
        >
          <div className="text-3xl font-bold text-[#2CB6D7]">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-[#FCFEFB]/70 uppercase tracking-wide">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  )
}

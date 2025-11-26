import { NextRequest, NextResponse } from 'next/server'

const CAL_API_KEY = process.env.CAL_API_KEY
const CAL_USERNAME = process.env.CAL_USERNAME || 'sinsajo-creators-1mvqb7'
const CAL_EVENT_SLUG = '30min'

interface TimeSlot {
  time: string
  date: string
  formatted: string
}

export async function GET(request: NextRequest) {
  try {
    if (!CAL_API_KEY) {
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      )
    }

    // Get current date and next 7 days
    const now = new Date()
    const startDate = new Date(now)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 7)
    endDate.setHours(23, 59, 59, 999)

    // Format dates for Cal.com API
    const startTime = startDate.toISOString()
    const endTime = endDate.toISOString()

    // Fetch availability from Cal.com
    const response = await fetch(
      `https://api.cal.com/v1/availability?apiKey=${CAL_API_KEY}&username=${CAL_USERNAME}&eventTypeSlug=${CAL_EVENT_SLUG}&startTime=${startTime}&endTime=${endTime}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Cal.com API error:', await response.text())
      // Return fallback slots based on current time
      return NextResponse.json({
        slots: generateFallbackSlots(),
        bookingLink: `https://cal.com/${CAL_USERNAME}/${CAL_EVENT_SLUG}`,
      })
    }

    const data = await response.json()

    // Process available slots and pick the next 2-3 best options
    const availableSlots = processAvailability(data)

    return NextResponse.json({
      slots: availableSlots.slice(0, 3),
      bookingLink: `https://cal.com/${CAL_USERNAME}/${CAL_EVENT_SLUG}`,
    })
  } catch (error: any) {
    console.error('Error fetching availability:', error)
    // Return fallback slots
    return NextResponse.json({
      slots: generateFallbackSlots(),
      bookingLink: `https://cal.com/${CAL_USERNAME}/${CAL_EVENT_SLUG}`,
    })
  }
}

function processAvailability(data: any): TimeSlot[] {
  const slots: TimeSlot[] = []
  const now = new Date()

  // Cal.com returns availability in different formats depending on the endpoint
  // Handle the busy/available times format
  if (data.busy) {
    // Generate slots excluding busy times
    return generateSlotsExcludingBusy(data.busy)
  }

  if (data.slots) {
    for (const date in data.slots) {
      const daySlots = data.slots[date]
      for (const slot of daySlots) {
        const slotDate = new Date(slot.time || slot)
        if (slotDate > now) {
          slots.push({
            time: slotDate.toISOString(),
            date: slotDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
            formatted: formatSlotForDisplay(slotDate),
          })
        }
      }
    }
  }

  // Sort by date and return
  return slots.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
}

function generateSlotsExcludingBusy(busyTimes: any[]): TimeSlot[] {
  const slots: TimeSlot[] = []
  const now = new Date()
  const workingHours = { start: 9, end: 18 } // 9 AM to 6 PM

  // Generate next 3 days of potential slots
  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    const date = new Date(now)
    date.setDate(date.getDate() + dayOffset)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // Generate hourly slots
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const slotTime = new Date(date)
      slotTime.setHours(hour, 0, 0, 0)

      // Skip if in the past
      if (slotTime <= now) continue

      // Check if slot is busy
      const isBusy = busyTimes.some(busy => {
        const busyStart = new Date(busy.start)
        const busyEnd = new Date(busy.end)
        return slotTime >= busyStart && slotTime < busyEnd
      })

      if (!isBusy) {
        slots.push({
          time: slotTime.toISOString(),
          date: slotTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
          formatted: formatSlotForDisplay(slotTime),
        })
      }

      if (slots.length >= 3) break
    }

    if (slots.length >= 3) break
  }

  return slots
}

function generateFallbackSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const now = new Date()
  const currentHour = now.getHours()

  // Determine next available slots based on current time
  let nextSlotDate = new Date(now)

  // If after 5 PM, start from next day
  if (currentHour >= 17) {
    nextSlotDate.setDate(nextSlotDate.getDate() + 1)
    nextSlotDate.setHours(10, 0, 0, 0)
  } else if (currentHour < 9) {
    nextSlotDate.setHours(10, 0, 0, 0)
  } else {
    // Round up to next hour + 1
    nextSlotDate.setHours(currentHour + 2, 0, 0, 0)
  }

  // Skip weekends
  while (nextSlotDate.getDay() === 0 || nextSlotDate.getDay() === 6) {
    nextSlotDate.setDate(nextSlotDate.getDate() + 1)
  }

  // Generate 2 slots
  for (let i = 0; i < 2; i++) {
    const slotTime = new Date(nextSlotDate)

    if (i === 1) {
      // Second slot: next day or later same day
      if (slotTime.getHours() < 15) {
        slotTime.setHours(slotTime.getHours() + 3)
      } else {
        slotTime.setDate(slotTime.getDate() + 1)
        slotTime.setHours(10, 0, 0, 0)
        // Skip weekends
        while (slotTime.getDay() === 0 || slotTime.getDay() === 6) {
          slotTime.setDate(slotTime.getDate() + 1)
        }
      }
    }

    slots.push({
      time: slotTime.toISOString(),
      date: slotTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      formatted: formatSlotForDisplay(slotTime),
    })
  }

  return slots
}

function formatSlotForDisplay(date: Date): string {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const day = dayNames[date.getDay()]
  const dayNum = date.getDate()
  const hour = date.getHours()
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12

  return `${day} ${dayNum} a las ${hour12}:00 ${ampm}`
}

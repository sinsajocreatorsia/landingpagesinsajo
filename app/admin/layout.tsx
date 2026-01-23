import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Sinsajo Workshop',
  description: 'Panel de administración del workshop',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

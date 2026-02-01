'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react'

interface AdminSidebarProps {
  user: {
    email: string
    role: string
  }
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Cupones',
    href: '/admin/coupons',
    icon: Ticket,
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    // Redirect to logout endpoint
    window.location.href = '/api/auth/logout'
  }

  return (
    <div className="w-64 bg-gradient-to-b from-[#022133] to-[#200F5D] text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Hanna SaaS</h2>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-2 text-sm">
          <p className="text-white/50 text-xs mb-1">Sesión</p>
          <p className="text-white truncate">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

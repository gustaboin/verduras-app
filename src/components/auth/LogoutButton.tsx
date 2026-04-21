'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router   = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
    >
      Cerrar sesión
    </button>
  )
}
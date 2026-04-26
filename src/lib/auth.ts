import { createServerSupabase } from './supabase-server'

export async function getUsuarioActual() {
  const supabase = await createServerSupabase()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return perfil
}
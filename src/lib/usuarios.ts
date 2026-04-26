import { createServerSupabase } from './supabase-server'

export async function getUsuarios() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/perfiles?select=*&order=created_at.desc`, {
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}

export async function crearUsuario(email: string, password: string, nombre: string, rol: 'admin' | 'operador') {
  const supabase = await createServerSupabase()

  // Crear usuario en Supabase Auth usando service role
  // Esto requiere la SERVICE_ROLE_KEY — la usamos solo server-side
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,  // confirma el email automáticamente
    }),
  })

  const nuevoUser = await res.json()
  if (nuevoUser.error) throw new Error(nuevoUser.error.message ?? nuevoUser.msg)

  // Actualiza el perfil que creó el trigger con nombre y rol
  const { error } = await supabase
    .from('perfiles')
    .update({ nombre, rol })
    .eq('id', nuevoUser.id)
  if (error) throw error
}

export async function toggleActivoUsuario(id: string, activo: boolean) {
  const supabase = await createServerSupabase()
  const { error } = await supabase
    .from('perfiles')
    .update({ activo })
    .eq('id', id)
  if (error) throw error
}

export async function updateRolUsuario(id: string, rol: 'admin' | 'operador') {
  const supabase = await createServerSupabase()
  const { error } = await supabase
    .from('perfiles')
    .update({ rol })
    .eq('id', id)
  if (error) throw error
}
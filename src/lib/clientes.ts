import { supabase } from './supabase'
import type { Database } from '@/types/database'

type Cliente = Database['public']['Tables']['clientes']['Row']
type ClienteInsert = Database['public']['Tables']['clientes']['Insert']
type ClienteUpdate = Database['public']['Tables']['clientes']['Update']

// Lista con puesto y mercado si tiene
export async function getClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select(`
      id, razon_social, nrodoc, email, telefono,
      estado, localidad, provincia, created_at,
      puestos (
        codigo_puesto,
        mercados ( nombre )
      )
    `)
    .order('razon_social')

  if (error) throw error
  return data
}

// Un cliente por ID
export async function getClienteById(id: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select(`
      *,
      puestos (
        id, codigo_puesto,
        mercados ( id, nombre )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Crear
export async function createCliente(cliente: ClienteInsert) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single()

  if (error) throw error
  return data
}

// Editar
export async function updateCliente(id: string, cliente: ClienteUpdate) {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Cambiar estado (activo / inactivo / suspendido)
export async function updateEstadoCliente(
  id: string,
  estado: 'activo' | 'inactivo' | 'suspendido'
) {
  const { error } = await supabase
    .from('clientes')
    .update({ estado })
    .eq('id', id)

  if (error) throw error
}
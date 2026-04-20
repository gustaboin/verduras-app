import { supabase } from './supabase'
import type { Database } from '@/types/database'

type ProductoInsert = Database['public']['Tables']['productos']['Insert']
type ProductoUpdate = Database['public']['Tables']['productos']['Update']
type PresentacionInsert = Database['public']['Tables']['productos_presentacion']['Insert']

// ============================================================
// CATÁLOGOS
// ============================================================

export async function getCalidades() {
  const { data, error } = await supabase
    .from('calidades')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data
}

export async function getTiposEnvase() {
  const { data, error } = await supabase
    .from('tipos_envase')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data
}

export async function getUnidades() {
  const { data, error } = await supabase
    .from('unidades')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data
}

// ============================================================
// PRODUCTOS BASE
// ============================================================

export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, descripcion,
      padre:padre_id ( id, nombre )
    `)
    .order('nombre')
  if (error) throw error
  return data
}

export async function getProductoById(id: number) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      padre:padre_id ( id, nombre ),
      productos_presentacion (
        id, descripcion, kg_por_unidad, unidades_por_envase,
        calidades ( nombre ),
        tipos_envase ( nombre ),
        unidades ( nombre, abreviatura )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProducto(producto: ProductoInsert) {
  const { data, error } = await supabase
    .from('productos')
    .insert(producto)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProducto(id: number, producto: ProductoUpdate) {
  const { data, error } = await supabase
    .from('productos')
    .update(producto)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================================
// PRESENTACIONES
// ============================================================

export async function createPresentacion(presentacion: PresentacionInsert) {
  const { data, error } = await supabase
    .from('productos_presentacion')
    .insert(presentacion)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePresentacion(id: number) {
  const { error } = await supabase
    .from('productos_presentacion')
    .delete()
    .eq('id', id)
  if (error) throw error
}
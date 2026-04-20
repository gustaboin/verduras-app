/*import { supabase } from './supabase'

export async function upsertCalidad(nombre: string) {
  const { error } = await supabase
    .from('calidades')
    .insert({ nombre })
  if (error) throw error
}

export async function upsertTipoEnvase(nombre: string) {
  const { error } = await supabase
    .from('tipos_envase')
    .insert({ nombre })
  if (error) throw error
}

export async function upsertUnidad(nombre: string, abreviatura: string) {
  const { error } = await supabase
    .from('unidades')
    .insert({ nombre, abreviatura })
  if (error) throw error
}

export async function deleteCalidad(id: number) {
  const { error } = await supabase.from('calidades').delete().eq('id', id)
  if (error) throw error
}

export async function deleteTipoEnvase(id: number) {
  const { error } = await supabase.from('tipos_envase').delete().eq('id', id)
  if (error) throw error
}

export async function deleteUnidad(id: number) {
  const { error } = await supabase.from('unidades').delete().eq('id', id)
  if (error) throw error
}
*/
import { supabase } from './supabase'

// ============================================================
// CHOFERES
// ============================================================

export async function getChoferes() {
  const { data, error } = await supabase
    .from('choferes')
    .select('*, transportes(nombre)')
    .order('nombre')
  if (error) throw error
  return data
}

export async function createChofer(chofer: {
  nombre: string
  telefono: string | null
  licencia: string | null
  transportista_id: number | null
}) {
  const { error } = await supabase.from('choferes').insert(chofer)
  if (error) throw error
}

export async function toggleActivoChofer(id: number, activo: boolean) {
  const { error } = await supabase
    .from('choferes')
    .update({ activo })
    .eq('id', id)
  if (error) throw error
}

// ============================================================
// VEHÍCULOS
// ============================================================

export async function getVehiculos() {
  const { data, error } = await supabase
    .from('vehiculos')
    .select('*, transportes(nombre), tipos_vehiculo(nombre)')
    .order('patente')
  if (error) throw error
  return data
}

export async function createVehiculo(vehiculo: {
  patente: string
  descripcion: string | null
  transportista_id: number | null
  tipo_vehiculo_id: number | null
}) {
  const { error } = await supabase.from('vehiculos').insert(vehiculo)
  if (error) throw error
}

export async function toggleActivoVehiculo(id: number, activo: boolean) {
  const { error } = await supabase
    .from('vehiculos')
    .update({ activo })
    .eq('id', id)
  if (error) throw error
}

export async function getTiposVehiculo() {
  const { data, error } = await supabase
    .from('tipos_vehiculo')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data
}

// ============================================================
// MERCADOS Y PUESTOS
// ============================================================

export async function getMercados() {
  const { data, error } = await supabase
    .from('mercados')
    .select('*, puestos(id, codigo_puesto, descripcion)')
    .order('nombre')
  if (error) throw error
  return data
}

export async function createMercado(mercado: {
  nombre: string
  ciudad: string | null
  provincia: string | null
}) {
  const { data, error } = await supabase
    .from('mercados')
    .insert(mercado)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleActivoMercado(id: number, activo: boolean) {
  const { error } = await supabase
    .from('mercados')
    .update({ activo })
    .eq('id', id)
  if (error) throw error
}

export async function createPuesto(puesto: {
  mercado_id: number
  codigo_puesto: string
  descripcion: string | null
}) {
  const { error } = await supabase.from('puestos').insert(puesto)
  if (error) throw error
}

export async function deletePuesto(id: number) {
  const { error } = await supabase.from('puestos').delete().eq('id', id)
  if (error) throw error
}

// ============================================================
// CATÁLOGOS (calidades, envases, unidades) — ya los tenías
// ============================================================

export async function getCalidades() {
  const { data, error } = await supabase
    .from('calidades').select('*').order('nombre')
  if (error) throw error
  return data
}

export async function getTiposEnvase() {
  const { data, error } = await supabase
    .from('tipos_envase').select('*').order('nombre')
  if (error) throw error
  return data
}

export async function getUnidades() {
  const { data, error } = await supabase
    .from('unidades').select('*, abreviatura').order('nombre')
  if (error) throw error
  return data
}

export async function insertCalidad(nombre: string) {
  const { error } = await supabase.from('calidades').insert({ nombre })
  if (error) throw error
}

export async function insertTipoEnvase(nombre: string) {
  const { error } = await supabase.from('tipos_envase').insert({ nombre })
  if (error) throw error
}

export async function insertUnidad(nombre: string, abreviatura: string) {
  const { error } = await supabase.from('unidades').insert({ nombre, abreviatura })
  if (error) throw error
}

export async function deleteCalidad(id: number) {
  const { error } = await supabase.from('calidades').delete().eq('id', id)
  if (error) throw error
}

export async function deleteTipoEnvase(id: number) {
  const { error } = await supabase.from('tipos_envase').delete().eq('id', id)
  if (error) throw error
}

export async function deleteUnidad(id: number) {
  const { error } = await supabase.from('unidades').delete().eq('id', id)
  if (error) throw error
}

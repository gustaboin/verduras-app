import { supabase } from './supabase'

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
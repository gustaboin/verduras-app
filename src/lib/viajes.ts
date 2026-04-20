import { supabase } from './supabase'

export async function getViajes() {
  const { data, error } = await supabase
    .from('viajes')
    .select(`
      id, fecha, estado, observaciones,
      choferes ( nombre ),
      vehiculos ( patente, descripcion ),
      transportes ( nombre ),
      pedido_viajes ( id )
    `)
    .order('fecha', { ascending: false })
  if (error) throw error
  return data
}

export async function getViajeById(id: number) {
  const { data, error } = await supabase
    .from('viajes')
    .select(`
      *,
      choferes ( id, nombre, telefono ),
      vehiculos ( id, patente, descripcion ),
      transportes ( id, nombre ),
      pedido_viajes (
        id, estado,
        pedidos (
          id, codigo, observaciones,
          clientes ( razon_social, localidad, referencias_entrega ),
          pedido_items (
            id, cantidad, cantidad_enviada, es_recortable,
            productos_presentacion (
              id, descripcion, kg_por_unidad,
              productos ( nombre ),
              tipos_envase ( nombre ),
              unidades ( abreviatura )
            ),
            calidad_requerida:calidades!pedido_items_calidad_requerida_id_fkey ( nombre )
          )
        )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getChoferes() {
  const { data, error } = await supabase
    .from('choferes')
    .select('id, nombre, transportista_id')
    .eq('activo', true)
    .order('nombre')
  if (error) throw error
  return data
}

export async function getVehiculos() {
  const { data, error } = await supabase
    .from('vehiculos')
    .select('id, patente, descripcion, transportista_id')
    .eq('activo', true)
    .order('patente')
  if (error) throw error
  return data
}

export async function getTransportes() {
  const { data, error } = await supabase
    .from('transportes')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre')
  if (error) throw error
  return data
}

// Pedidos disponibles para asignar a un viaje
export async function getPedidosAsignables() {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id, codigo, fecha_compromiso,
      clientes ( razon_social, localidad ),
      pedido_items ( id )
    `)
    .in('estado', ['PENDIENTE', 'PREPARANDO'])
    .order('fecha_compromiso', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data
}

export async function createViaje(viaje: {
  fecha: string
  transportista_id: number | null
  chofer_id: number | null
  vehiculo_id: number | null
  observaciones: string | null
}) {
  const { data, error } = await supabase
    .from('viajes')
    .insert(viaje)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function asignarPedidoAViaje(pedidoId: string, viajeId: number) {
  const { error } = await supabase
    .from('pedido_viajes')
    .insert({ pedido_id: pedidoId, viaje_id: viajeId, estado: 'ASIGNADO' })
  if (error) throw error

  // Cambia el pedido a PREPARANDO
  await supabase
    .from('pedidos')
    .update({ estado: 'PREPARANDO' })
    .eq('id', pedidoId)
}

export async function desasignarPedidoDeViaje(pedidoViajeId: number, pedidoId: string) {
  const { error } = await supabase
    .from('pedido_viajes')
    .delete()
    .eq('id', pedidoViajeId)
  if (error) throw error

  // Vuelve el pedido a PENDIENTE
  await supabase
    .from('pedidos')
    .update({ estado: 'PENDIENTE' })
    .eq('id', pedidoId)
}

export async function registrarCarga(
  viajeId: number,
  pedidoItemId: number,
  cantidadCargada: number
) {
  // Upsert: si ya existe una carga para este item en este viaje, la actualiza
  const { error: errorCarga } = await supabase
    .from('cargas_viaje')
    .upsert(
      { viaje_id: viajeId, pedido_item_id: pedidoItemId, cantidad_cargada: cantidadCargada },
      { onConflict: 'viaje_id,pedido_item_id' }
    )
  if (errorCarga) throw errorCarga

  // Actualiza cantidad_enviada en el item del pedido
  const { error: errorItem } = await supabase
    .from('pedido_items')
    .update({ cantidad_enviada: cantidadCargada })
    .eq('id', pedidoItemId)
  if (errorItem) throw errorItem
}

export async function despacharViaje(viajeId: number, pedidoIds: string[]) {
  // Marca el viaje como finalizado
  await supabase
    .from('viajes')
    .update({ estado: 'FINALIZADO' })
    .eq('id', viajeId)

  // Marca todos los pedido_viajes como despachados
  await supabase
    .from('pedido_viajes')
    .update({ estado: 'DESPACHADO' })
    .eq('viaje_id', viajeId)

  // Marca los pedidos como despachados
  for (const pedidoId of pedidoIds) {
    await supabase
      .from('pedidos')
      .update({ estado: 'DESPACHADO' })
      .eq('id', pedidoId)
  }
}

export async function updateEstadoViaje(
  id: number,
  estado: 'PLANIFICADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO'
) {
  const { error } = await supabase
    .from('viajes')
    .update({ estado })
    .eq('id', id)
  if (error) throw error
}
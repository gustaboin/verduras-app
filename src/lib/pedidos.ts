import { supabase } from './supabase'

export async function getPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id, codigo, estado, fecha_pedido, fecha_compromiso, observaciones,
      clientes ( razon_social, localidad ),
      pedido_items ( id )
    `)
    .order('fecha_pedido', { ascending: false })
  if (error) throw error
  return data
}

export async function getPedidoById(id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      clientes ( id, razon_social, localidad, provincia, telefono ),
      puestos ( codigo_puesto, mercados ( nombre ) ),
      pedido_items (
        id, cantidad, cantidad_enviada, es_recortable,
        calidad_requerida_id, calidad_enviada_id,
        productos_presentacion (
          id, descripcion, kg_por_unidad,
          productos ( nombre ),
          calidades ( nombre ),
          tipos_envase ( nombre ),
          unidades ( abreviatura )
        ),
        calidad_requerida:calidades!pedido_items_calidad_requerida_id_fkey ( nombre ),
        calidad_enviada:calidades!pedido_items_calidad_enviada_id_fkey ( nombre )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createPedidoConItems(
  pedido: {
    cliente_id: string
    puesto_id: number | null
    fecha_pedido: string
    fecha_compromiso: string | null
    observaciones: string | null
  },
  items: {
    producto_presentacion_id: number
    cantidad: number
    calidad_requerida_id: number | null
    es_recortable: boolean
  }[]
) {
  // Primero creamos el pedido
  const { data: nuevoPedido, error: errorPedido } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single()
  if (errorPedido) throw errorPedido

  // Luego insertamos todos los items de una sola vez
  const { error: errorItems } = await supabase
    .from('pedido_items')
    .insert(items.map(item => ({
      ...item,
      pedido_id: nuevoPedido.id,
    })))
  if (errorItems) throw errorItems

  return nuevoPedido
}

export async function updateEstadoPedido(
  id: string,
  estado: 'PENDIENTE' | 'PREPARANDO' | 'DESPACHADO' | 'PARCIAL' | 'CANCELADO'
) {
  const { error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
  if (error) throw error
}

export async function updateObservaciones(id: string, observaciones: string) {
  const { error } = await supabase
    .from('pedidos')
    .update({ observaciones })
    .eq('id', id)
  if (error) throw error
}

export async function deletePedidoItem(id: number) {
  const { error } = await supabase
    .from('pedido_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}
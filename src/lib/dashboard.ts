import { createServerSupabase } from './supabase-server'

export async function getResumenDia() {
  const supabase = await createServerSupabase()
  const hoy = new Date().toISOString().split('T')[0]

  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select(`
      id, codigo, estado, fecha_pedido, fecha_compromiso,
      clientes ( razon_social, localidad ),
      pedido_items ( id )
    `)
    .gte('fecha_pedido', hoy)
    .order('created_at', { ascending: false })

  if (error) throw error

  const pendientes  = pedidos?.filter(p => p.estado === 'PENDIENTE')  ?? []
  const confirmados = pedidos?.filter(p => p.estado === 'CONFIRMADO') ?? []
  const cerrados    = pedidos?.filter(p => p.estado === 'CERRADO')    ?? []
  const cancelados  = pedidos?.filter(p => p.estado === 'CANCELADO')  ?? []

  return { pedidos: pedidos ?? [], pendientes, confirmados, cerrados, cancelados }
}   
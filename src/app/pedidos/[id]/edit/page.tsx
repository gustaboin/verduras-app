import { getPedidoById } from '@/lib/pedidos'
import { getClientesSelect } from '@/lib/clientes'
import { getCalidades } from '@/lib/productos'
import { supabase } from '@/lib/supabase'
import EditPedidoForm, { type ItemForm } from '@/components/pedidos/EditPedidoForm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPedidoPage({ params }: Props) {
  const { id } = await params

  const pedido = await getPedidoById(id).catch(() => null)
  if (!pedido) notFound()

  // Solo PENDIENTE puede editarse
  if (pedido.estado !== 'PENDIENTE') redirect(`/pedidos/${id}`)

  const [clientes, calidades, { data: presentaciones }] = await Promise.all([
    getClientesSelect(),
    getCalidades(),
    supabase.from('productos_presentacion').select(`
      id, descripcion, kg_por_unidad,
      productos ( nombre ),
      calidades ( nombre ),
      tipos_envase ( nombre ),
      unidades ( abreviatura )
    `).order('id'),
  ])

    
  // Mapea los items existentes al formato que espera el form
const itemsIniciales = (pedido.pedido_items as {
  cantidad: number
  calidad_requerida_id: number | null
  es_recortable: boolean
  productos_presentacion: {
    id: number
    kg_por_unidad: number | null
    productos: { nombre: string } | null
    calidades: { nombre: string } | null
    tipos_envase: { nombre: string } | null
    unidades: { abreviatura: string | null } | null
  } | null
}[]).map((item): ItemForm => ({
  producto_presentacion_id: item.productos_presentacion?.id ?? 0,
  presentacion_label: [
    item.productos_presentacion?.productos?.nombre,
    item.productos_presentacion?.calidades?.nombre,
    item.productos_presentacion?.tipos_envase?.nombre,
    item.productos_presentacion?.kg_por_unidad
      ? `${item.productos_presentacion.kg_por_unidad}${item.productos_presentacion?.unidades?.abreviatura ?? ''}`
      : null,
  ].filter(Boolean).join(' · '),
  cantidad: item.cantidad,
  calidad_requerida_id: item.calidad_requerida_id,
  es_recortable: item.es_recortable,
}))

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href={`/pedidos/${id}`} className="text-sm text-muted-foreground hover:underline">
          ← Volver al pedido
        </Link>
        <h1 className="text-2xl font-semibold mt-2">
          Editar {pedido.codigo}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Solo podés editar pedidos en estado PENDIENTE
        </p>
      </div>

      <EditPedidoForm
        pedidoId={id}
        clienteIdInicial={pedido.cliente_id!}
        fechaPedidoInicial={pedido.fecha_pedido}
        fechaCompromisoInicial={pedido.fecha_compromiso ?? ''}
        observacionesIniciales={pedido.observaciones ?? ''}
        itemsIniciales={itemsIniciales}
        clientes={clientes}
        presentaciones={presentaciones ?? []}
        calidades={calidades}
      />
    </div>
  )
}
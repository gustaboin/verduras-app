import { getPedidoById } from '@/lib/pedidos'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EstadoPedidoSelector from '@/components/pedidos/EstadoPedidoSelector'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({ params }: Props) {
  const { id } = await params
  const pedido = await getPedidoById(id).catch(() => null)

  if (!pedido) notFound()

  const cliente = pedido.clientes as { razon_social: string; localidad: string; telefono: string | null }
  const items   = pedido.pedido_items as {
  id: number
  cantidad: number
  cantidad_enviada: number
  es_recortable: boolean
  calidad_requerida: { nombre: string } | null
  productos_presentacion: {
    descripcion: string | null
    kg_por_unidad: number | null
    productos: { nombre: string } | null
    tipos_envase: { nombre: string } | null
    unidades: { abreviatura: string | null } | null
  } | null
}[]
  

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <Link href="/pedidos" className="text-sm text-muted-foreground hover:underline">
          ← Volver a pedidos
        </Link>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-semibold font-mono">{pedido.codigo}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {cliente?.razon_social} — {cliente?.localidad}
            </p>
          </div>
          <EstadoPedidoSelector pedidoId={pedido.id} estadoActual={pedido.estado!} />
          {pedido.estado === 'PENDIENTE' && (
          <Link
            href={`/pedidos/${pedido.id}/edit`}
            className="rounded-md border px-4 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Editar pedido
          </Link>
        )}
        </div>
      </div>

      {/* Info general */}
      <section className="grid grid-cols-3 gap-4 text-sm">
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Fecha pedido</p>
          <p className="font-medium">
            {new Date(pedido.fecha_pedido).toLocaleDateString('es-AR')}
          </p>
        </div>
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Fecha compromiso</p>
          <p className="font-medium">
            {pedido.fecha_compromiso
              ? new Date(pedido.fecha_compromiso).toLocaleDateString('es-AR')
              : '—'
            }
          </p>
        </div>
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Teléfono cliente</p>
          <p className="font-medium">{cliente?.telefono ?? '—'}</p>
        </div>
      </section>

      {/* Observaciones */}
      {pedido.observaciones && (
        <section className="rounded-md border p-4 text-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Observaciones</p>
          <p>{pedido.observaciones}</p>
        </section>
      )}

      {/* Items */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Ítems del pedido</h2>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Presentación</th>
                <th className="text-left px-4 py-3 font-medium">Cant. pedida</th>
                <th className="text-left px-4 py-3 font-medium">Cant. enviada</th>
                <th className="text-left px-4 py-3 font-medium">Cal. requerida</th>
                <th className="text-left px-4 py-3 font-medium">Recortable</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {item.productos_presentacion?.productos?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[
                      item.productos_presentacion?.tipos_envase?.nombre,
                      item.productos_presentacion?.kg_por_unidad
                        ? `${item.productos_presentacion.kg_por_unidad}${item.productos_presentacion?.unidades?.abreviatura ?? ''}`
                        : null
                    ].filter(Boolean).join(' · ')}
                  </td>
                  <td className="px-4 py-3">{item.cantidad}</td>
                  <td className="px-4 py-3">
                    {item.cantidad_enviada > 0 ? item.cantidad_enviada : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.calidad_requerida?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {item.es_recortable ? '✓' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
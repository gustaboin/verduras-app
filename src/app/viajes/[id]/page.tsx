import { getViajeById, getPedidosAsignables } from '@/lib/viajes'
import ViajeDetalle from '@/components/viajes/ViajeDetalle'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ViajeDetailPage({ params }: Props) {
  const { id } = await params
  const viajeId = Number(id)

  const [viaje, pedidosAsignables] = await Promise.all([
    getViajeById(viajeId).catch(() => null),
    getPedidosAsignables(),
  ])

  if (!viaje) notFound()

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <Link href="/viajes" className="text-sm text-muted-foreground hover:underline">
          ← Volver a viajes
        </Link>
        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Viaje #{viaje.id}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(viaje.fecha).toLocaleString('es-AR')}
              {viaje.choferes && ` · ${(viaje.choferes as any).nombre}`}
              {viaje.vehiculos && ` · ${(viaje.vehiculos as any).patente}`}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            {
              PLANIFICADO: 'bg-yellow-100 text-yellow-700',
              EN_CURSO:    'bg-blue-100 text-blue-700',
              FINALIZADO:  'bg-green-100 text-green-700',
              CANCELADO:   'bg-red-100 text-red-600',
            }[viaje.estado!] ?? ''
          }`}>
            {viaje.estado}
          </span>
        </div>
      </div>

      <ViajeDetalle
        viajeId={viaje.id}
        estadoViaje={viaje.estado!}
        pedidoViajes={viaje.pedido_viajes as any}
        pedidosAsignables={pedidosAsignables}
      />
    </div>
  )
}
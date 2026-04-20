'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  asignarPedidoAViaje,
  desasignarPedidoDeViaje,
  registrarCarga,
  despacharViaje,
} from '@/lib/viajes'

type PedidoAsignable = {
  id: string
  codigo: string | null
  fecha_compromiso: string | null
  clientes: { razon_social: string; localidad: string } | null
  pedido_items: { id: number }[]
}

type PedidoViaje = {
  id: number
  estado: string
  pedidos: {
    id: string
    codigo: string | null
    observaciones: string | null
    clientes: {
      razon_social: string
      localidad: string
      referencias_entrega: string | null
    } | null
    pedido_items: {
      id: number
      cantidad: number
      cantidad_enviada: number
      es_recortable: boolean
      productos_presentacion: {
        descripcion: string | null
        kg_por_unidad: number | null
        productos: { nombre: string } | null
        tipos_envase: { nombre: string } | null
        unidades: { abreviatura: string | null } | null
      } | null
      calidad_requerida: { nombre: string } | null
    }[]
  } | null
}

interface Props {
  viajeId: number
  estadoViaje: string
  pedidoViajes: PedidoViaje[]
  pedidosAsignables: PedidoAsignable[]
}

export default function ViajeDetalle({
  viajeId,
  estadoViaje,
  pedidoViajes,
  pedidosAsignables,
}: Props) {
  const router  = useRouter()
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [pedidoSeleccionado, setPedido] = useState('')

  // Cargas en edición: { [pedidoItemId]: cantidadCargada }
  const [cargas, setCargas] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {}
    pedidoViajes.forEach(pv => {
      pv.pedidos?.pedido_items.forEach(item => {
        init[item.id] = item.cantidad_enviada ?? 0
      })
    })
    return init
  })

  const finalizado = estadoViaje === 'FINALIZADO' || estadoViaje === 'CANCELADO'

  async function handleAsignar() {
    if (!pedidoSeleccionado) return
    setLoading(true)
    setError(null)
    try {
      await asignarPedidoAViaje(pedidoSeleccionado, viajeId)
      router.refresh()
      setPedido('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDesasignar(pedidoViajeId: number, pedidoId: string) {
    setLoading(true)
    try {
      await desasignarPedidoDeViaje(pedidoViajeId, pedidoId)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGuardarCargas() {
    setLoading(true)
    setError(null)
    try {
      // Guarda todas las cargas modificadas
      const promises = Object.entries(cargas).map(([itemId, cantidad]) =>
        registrarCarga(viajeId, Number(itemId), cantidad)
      )
      await Promise.all(promises)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDespachar() {
    if (!confirm('¿Confirmás el despacho? Esto marcará el viaje y los pedidos como DESPACHADO.')) return
    setLoading(true)
    try {
      // Primero guarda las cargas
      await handleGuardarCargas()
      const pedidoIds = pedidoViajes.map(pv => pv.pedidos!.id)
      await despacharViaje(viajeId, pedidoIds)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Pedidos ya asignados (para no mostrarlos en el selector)
  const idsAsignados = new Set(pedidoViajes.map(pv => pv.pedidos?.id))
  const asignablesDisponibles = pedidosAsignables.filter(p => !idsAsignados.has(p.id))

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ASIGNAR PEDIDOS */}
      {!finalizado && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Asignar pedidos</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Pedido disponible</label>
              <select
                value={pedidoSeleccionado}
                onChange={e => setPedido(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccioná un pedido...</option>
                {asignablesDisponibles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} — {p.clientes?.razon_social} ({p.clientes?.localidad})
                    {p.fecha_compromiso
                      ? ` · compromiso: ${new Date(p.fecha_compromiso).toLocaleDateString('es-AR')}`
                      : ''
                    }
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAsignar}
              disabled={!pedidoSeleccionado || loading}
              className="rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80 disabled:opacity-40 transition-colors"
            >
              + Asignar
            </button>
          </div>
          {asignablesDisponibles.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No hay pedidos pendientes para asignar.
            </p>
          )}
        </section>
      )}

      {/* PEDIDOS ASIGNADOS Y CARGA */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Pedidos en este viaje ({pedidoViajes.length})
          </h2>
          {!finalizado && pedidoViajes.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGuardarCargas}
                disabled={loading}
                className="rounded-md border px-4 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Guardar cargas
              </button>
              <button
                type="button"
                onClick={handleDespachar}
                disabled={loading}
                className="rounded-md bg-green-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Confirmar despacho
              </button>
            </div>
          )}
        </div>

        {pedidoViajes.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Todavía no hay pedidos asignados a este viaje.
          </p>
        )}

        {pedidoViajes.map(pv => {
          const pedido = pv.pedidos
          if (!pedido) return null
          const cliente = pedido.clientes

          return (
            <div key={pv.id} className="rounded-md border overflow-hidden">
              {/* Header del pedido */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                <div>
                  <span className="font-mono font-semibold">{pedido.codigo}</span>
                  <span className="text-muted-foreground ml-3 text-sm">
                    {cliente?.razon_social} — {cliente?.localidad}
                  </span>
                  {cliente?.referencias_entrega && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      📍 {cliente.referencias_entrega}
                    </p>
                  )}
                </div>
                {!finalizado && (
                  <button
                    type="button"
                    onClick={() => handleDesasignar(pv.id, pedido.id)}
                    disabled={loading}
                    className="text-xs text-red-500 hover:underline disabled:opacity-40"
                  >
                    Quitar del viaje
                  </button>
                )}
              </div>

              {/* Items con campo de carga */}
              <table className="w-full text-sm">
                <thead className="bg-muted/20 text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Producto</th>
                    <th className="text-left px-4 py-2 font-medium">Presentación</th>
                    <th className="text-left px-4 py-2 font-medium">Calidad req.</th>
                    <th className="text-left px-4 py-2 font-medium">Pedido</th>
                    <th className="text-left px-4 py-2 font-medium">Recortable</th>
                    <th className="text-left px-4 py-2 font-medium">Cargado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pedido.pedido_items.map(item => {
                    const pp = item.productos_presentacion
                    return (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="px-4 py-2 font-medium">
                          {pp?.productos?.nombre ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground text-xs">
                          {[
                            pp?.tipos_envase?.nombre,
                            pp?.kg_por_unidad
                              ? `${pp.kg_por_unidad}${pp?.unidades?.abreviatura ?? ''}`
                              : null
                          ].filter(Boolean).join(' · ')}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {item.calidad_requerida?.nombre ?? '—'}
                        </td>
                        <td className="px-4 py-2">{item.cantidad}</td>
                        <td className="px-4 py-2">
                          {item.es_recortable ? '✓' : '—'}
                        </td>
                        <td className="px-4 py-2">
                          {finalizado ? (
                            <span className={
                              cargas[item.id] < item.cantidad
                                ? 'text-orange-600 font-medium'
                                : 'text-green-600 font-medium'
                            }>
                              {cargas[item.id] ?? 0}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={cargas[item.id] ?? 0}
                              onChange={e =>
                                setCargas(prev => ({
                                  ...prev,
                                  [item.id]: Number(e.target.value)
                                }))
                              }
                              className="w-20 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </section>
    </div>
  )
}
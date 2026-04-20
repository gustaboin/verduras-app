'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ViajeRow = {
  id: number
  fecha: string
  estado: string
  choferes: { nombre: string } | null
  vehiculos: { patente: string; descripcion: string | null } | null
  transportes: { nombre: string } | null
  pedido_viajes: { id: number }[]
}

const ESTADO_BADGE: Record<string, string> = {
  PLANIFICADO: 'bg-yellow-100 text-yellow-700',
  EN_CURSO:    'bg-blue-100 text-blue-700',
  FINALIZADO:  'bg-green-100 text-green-700',
  CANCELADO:   'bg-red-100 text-red-600',
}

export default function ViajesTable({ viajes }: { viajes: ViajeRow[] }) {
  const router = useRouter()
  const [filtroEstado, setFiltroEstado] = useState('')

  const filtrados = viajes.filter(v =>
    filtroEstado ? v.estado === filtroEstado : true
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos los estados</option>
          {['PLANIFICADO','EN_CURSO','FINALIZADO','CANCELADO'].map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {filtrados.length} viaje{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Fecha</th>
              <th className="text-left px-4 py-3 font-medium">Transporte</th>
              <th className="text-left px-4 py-3 font-medium">Chofer</th>
              <th className="text-left px-4 py-3 font-medium">Vehículo</th>
              <th className="text-left px-4 py-3 font-medium">Pedidos</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron viajes
                </td>
              </tr>
            )}
            {filtrados.map(v => (
              <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  {new Date(v.fecha).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3">{v.transportes?.nombre ?? '—'}</td>
                <td className="px-4 py-3">{v.choferes?.nombre ?? '—'}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {v.vehiculos?.patente ?? '—'}
                  {v.vehiculos?.descripcion &&
                    <span className="text-muted-foreground ml-1">({v.vehiculos.descripcion})</span>
                  }
                </td>
                <td className="px-4 py-3">{v.pedido_viajes.length}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[v.estado] ?? ''}`}>
                    {v.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => router.push(`/viajes/${v.id}`)}
                    className="rounded px-3 py-1 text-xs border hover:bg-muted transition-colors"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
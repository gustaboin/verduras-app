'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PedidoRow = {
  id: string
  codigo: string | null
  estado: string
  fecha_pedido: string
  fecha_compromiso: string | null
  clientes: { razon_social: string; localidad: string } | null
  pedido_items: { id: number }[]
}

const ESTADO_BADGE: Record<string, string> = {
  PENDIENTE:   'bg-yellow-100 text-yellow-700',
  PREPARANDO:  'bg-blue-100 text-blue-700',
  DESPACHADO:  'bg-green-100 text-green-700',
  PARCIAL:     'bg-orange-100 text-orange-700',
  CANCELADO:   'bg-red-100 text-red-600',
}

const ESTADOS = ['PENDIENTE', 'PREPARANDO', 'DESPACHADO', 'PARCIAL', 'CANCELADO']

export default function PedidosTable({ pedidos }: { pedidos: PedidoRow[] }) {
  const router = useRouter()
  const [busqueda, setBusqueda]       = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const filtrados = pedidos.filter(p => {
    const matchBusqueda = (
      p.clientes?.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo?.toLowerCase().includes(busqueda.toLowerCase())
    )
    const matchEstado = filtroEstado ? p.estado === filtroEstado : true
    return matchBusqueda && matchEstado
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por cliente o código..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full max-w-xs rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtrados.length} pedido{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Código</th>
              <th className="text-left px-4 py-3 font-medium">Cliente</th>
              <th className="text-left px-4 py-3 font-medium">Fecha pedido</th>
              <th className="text-left px-4 py-3 font-medium">Compromiso</th>
              <th className="text-left px-4 py-3 font-medium">Ítems</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron pedidos
                </td>
              </tr>
            )}
            {filtrados.map(p => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono font-medium">{p.codigo ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.clientes?.razon_social}</div>
                  <div className="text-xs text-muted-foreground">{p.clientes?.localidad}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(p.fecha_pedido).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.fecha_compromiso
                    ? new Date(p.fecha_compromiso).toLocaleDateString('es-AR')
                    : '—'
                  }
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.pedido_items.length}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[p.estado] ?? ''}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => router.push(`/pedidos/${p.id}`)}
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
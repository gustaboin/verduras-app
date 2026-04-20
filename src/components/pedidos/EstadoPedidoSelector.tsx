'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateEstadoPedido } from '@/lib/pedidos'

const ESTADOS = ['PENDIENTE', 'PREPARANDO', 'DESPACHADO', 'PARCIAL', 'CANCELADO'] as const
type Estado = typeof ESTADOS[number]

const ESTADO_BADGE: Record<Estado, string> = {
  PENDIENTE:   'bg-yellow-100 text-yellow-700',
  PREPARANDO:  'bg-blue-100 text-blue-700',
  DESPACHADO:  'bg-green-100 text-green-700',
  PARCIAL:     'bg-orange-100 text-orange-700',
  CANCELADO:   'bg-red-100 text-red-600',
}

interface Props {
  pedidoId: string
  estadoActual: string
}

export default function EstadoPedidoSelector({ pedidoId, estadoActual }: Props) {
  const router  = useRouter()
  const [estado, setEstado]   = useState(estadoActual as Estado)
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value as Estado
    setLoading(true)
    try {
      await updateEstadoPedido(pedidoId, nuevo)
      setEstado(nuevo)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${ESTADO_BADGE[estado]}`}>
        {estado}
      </span>
      <select
        value={estado}
        onChange={handleChange}
        disabled={loading}
        className="rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        {ESTADOS.map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
    </div>
  )
}
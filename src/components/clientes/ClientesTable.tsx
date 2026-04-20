'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateEstadoCliente } from '@/lib/clientes'

type ClienteRow = {
  id: string
  razon_social: string
  nrodoc: string
  email: string | null
  telefono: string | null
  estado: string
  localidad: string
  provincia: string
  puestos: {
    codigo_puesto: string
    mercados: { nombre: string } | null
  } | null
}

interface Props {
  clientes: ClienteRow[]
}

const ESTADO_BADGE: Record<string, string> = {
  activo:     'bg-green-100 text-green-700',
  inactivo:   'bg-gray-100 text-gray-500',
  suspendido: 'bg-red-100 text-red-600',
}

export default function ClientesTable({ clientes }: Props) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [cambiandoEstado, setCambiandoEstado] = useState<string | null>(null)

  const filtrados = clientes.filter(c =>
    c.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.nrodoc.includes(busqueda) ||
    c.localidad.toLowerCase().includes(busqueda.toLowerCase())
  )

  async function handleEstado(
    id: string,
    estadoActual: string
  ) {
    // Toggle simple: activo ↔ inactivo
    const nuevo = estadoActual === 'activo' ? 'inactivo' : 'activo'
    setCambiandoEstado(id)
    try {
      await updateEstadoCliente(id, nuevo as 'activo' | 'inactivo' | 'suspendido')
      router.refresh()
    } finally {
      setCambiandoEstado(null)
    }
  }

  return (
    <div className="space-y-4">

      {/* Buscador */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por razón social, CUIT o localidad..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Razón social</th>
              <th className="text-left px-4 py-3 font-medium">CUIT/DNI</th>
              <th className="text-left px-4 py-3 font-medium">Localidad</th>
              <th className="text-left px-4 py-3 font-medium">Puesto</th>
              <th className="text-left px-4 py-3 font-medium">Contacto</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron clientes
                </td>
              </tr>
            )}
            {filtrados.map(c => (
              <tr
                key={c.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{c.razon_social}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.nrodoc}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.localidad}, {c.provincia}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.puestos
                    ? `${c.puestos.mercados?.nombre} — ${c.puestos.codigo_puesto}`
                    : <span className="text-xs italic">Sin puesto</span>
                  }
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div>{c.email ?? '—'}</div>
                  <div className="text-xs">{c.telefono ?? ''}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[c.estado] ?? ''}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => router.push(`/clientes/${c.id}`)}
                      className="rounded px-3 py-1 text-xs border hover:bg-muted transition-colors"
                    >
                      Ver / Editar
                    </button>
                    <button
                      onClick={() => handleEstado(c.id, c.estado)}
                      disabled={cambiandoEstado === c.id}
                      className="rounded px-3 py-1 text-xs border hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      {cambiandoEstado === c.id
                        ? '...'
                        : c.estado === 'activo' ? 'Desactivar' : 'Activar'
                      }
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ProductoRow = {
  id: number
  nombre: string
  descripcion: string | null
  padre: { id: number; nombre: string } | null
}

interface Props {
  productos: ProductoRow[]
}

export default function ProductosTable({ productos }: Props) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Separamos bases de variantes para mostrarlos agrupados
  const bases    = filtrados.filter(p => !p.padre)
  const variantes = filtrados.filter(p => !!p.padre)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Tipo</th>
              <th className="text-left px-4 py-3 font-medium">Variante de</th>
              <th className="text-left px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron productos
                </td>
              </tr>
            )}
            {filtrados.map(p => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.padre
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {p.padre ? 'Variante' : 'Base'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.padre?.nombre ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.descripcion ?? '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => router.push(`/productos/${p.id}`)}
                    className="rounded px-3 py-1 text-xs border hover:bg-muted transition-colors"
                  >
                    Ver / Editar
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
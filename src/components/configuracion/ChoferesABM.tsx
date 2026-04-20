'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createChofer, toggleActivoChofer } from '@/lib/configuracion'

type Chofer = {
  id: number
  nombre: string
  telefono: string | null
  licencia: string | null
  activo: boolean
  transportes: { nombre: string } | null
}

type Transporte = { id: number; nombre: string }

export default function ChoferesABM({
  choferes,
  transportes,
}: {
  choferes: Chofer[]
  transportes: Transporte[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [form, setForm]       = useState({
    nombre: '', telefono: '', licencia: '', transportista_id: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createChofer({
        nombre:           form.nombre,
        telefono:         form.telefono  || null,
        licencia:         form.licencia  || null,
        transportista_id: form.transportista_id ? Number(form.transportista_id) : null,
      })
      setForm({ nombre: '', telefono: '', licencia: '', transportista_id: '' })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(id: number, activo: boolean) {
    await toggleActivoChofer(id, !activo)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Formulario alta */}
      <form onSubmit={handleSubmit} className="rounded-md border p-4 space-y-3 bg-muted/20">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Nuevo chofer
        </p>
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-medium">Nombre *</label>
            <input
              name="nombre" value={form.nombre} onChange={handleChange} required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Teléfono</label>
            <input
              name="telefono" value={form.telefono} onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Licencia</label>
            <input
              name="licencia" value={form.licencia} onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-medium">Transportista</label>
            <select
              name="transportista_id" value={form.transportista_id} onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sin asignar</option>
              {transportes.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit" disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : '+ Agregar chofer'}
        </button>
      </form>

      {/* Lista */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Teléfono</th>
              <th className="text-left px-4 py-3 font-medium">Licencia</th>
              <th className="text-left px-4 py-3 font-medium">Transportista</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {choferes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  No hay choferes cargados
                </td>
              </tr>
            )}
            {choferes.map(c => (
              <tr key={c.id} className={`hover:bg-muted/30 transition-colors ${!c.activo ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium">{c.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.telefono ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.licencia ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.transportes?.nombre ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(c.id, c.activo)}
                    className="text-xs border rounded px-3 py-1 hover:bg-muted transition-colors"
                  >
                    {c.activo ? 'Desactivar' : 'Activar'}
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
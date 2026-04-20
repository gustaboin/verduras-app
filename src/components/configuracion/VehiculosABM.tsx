'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVehiculo, toggleActivoVehiculo } from '@/lib/configuracion'

type Vehiculo = {
  id: number
  patente: string
  descripcion: string | null
  activo: boolean
  transportes: { nombre: string } | null
  tipos_vehiculo: { nombre: string } | null
}

type Transporte   = { id: number; nombre: string }
type TipoVehiculo = { id: number; nombre: string }

export default function VehiculosABM({
  vehiculos, transportes, tiposVehiculo,
}: {
  vehiculos: Vehiculo[]
  transportes: Transporte[]
  tiposVehiculo: TipoVehiculo[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [form, setForm]       = useState({
    patente: '', descripcion: '', transportista_id: '', tipo_vehiculo_id: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createVehiculo({
        patente:          form.patente.toUpperCase(),
        descripcion:      form.descripcion      || null,
        transportista_id: form.transportista_id ? Number(form.transportista_id) : null,
        tipo_vehiculo_id: form.tipo_vehiculo_id ? Number(form.tipo_vehiculo_id) : null,
      })
      setForm({ patente: '', descripcion: '', transportista_id: '', tipo_vehiculo_id: '' })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(id: number, activo: boolean) {
    await toggleActivoVehiculo(id, !activo)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-md border p-4 space-y-3 bg-muted/20">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Nuevo vehículo
        </p>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Patente *</label>
            <input
              name="patente" value={form.patente} onChange={handleChange} required
              placeholder="ABC123"
              className="w-full rounded-md border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Descripción</label>
            <input
              name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Ej: Camión blanco"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
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
          <div className="space-y-1">
            <label className="text-xs font-medium">Tipo</label>
            <select
              name="tipo_vehiculo_id" value={form.tipo_vehiculo_id} onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sin especificar</option>
              {tiposVehiculo.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit" disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : '+ Agregar vehículo'}
        </button>
      </form>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Patente</th>
              <th className="text-left px-4 py-3 font-medium">Descripción</th>
              <th className="text-left px-4 py-3 font-medium">Tipo</th>
              <th className="text-left px-4 py-3 font-medium">Transportista</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  No hay vehículos cargados
                </td>
              </tr>
            )}
            {vehiculos.map(v => (
              <tr key={v.id} className={`hover:bg-muted/30 transition-colors ${!v.activo ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-mono font-medium">{v.patente}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.descripcion ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.tipos_vehiculo?.nombre ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.transportes?.nombre ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    v.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {v.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(v.id, v.activo)}
                    className="text-xs border rounded px-3 py-1 hover:bg-muted transition-colors"
                  >
                    {v.activo ? 'Desactivar' : 'Activar'}
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
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createViaje } from '@/lib/viajes'

type Transporte = { id: number; nombre: string }
type Chofer     = { id: number; nombre: string; transportista_id: number | null }
type Vehiculo   = { id: number; patente: string; descripcion: string | null; transportista_id: number | null }

interface Props {
  transportes: Transporte[]
  choferes:    Chofer[]
  vehiculos:   Vehiculo[]
}

export default function NuevoViajeForm({ transportes, choferes, vehiculos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const [form, setForm] = useState({
    fecha:            new Date().toISOString().slice(0, 16), // datetime-local
    transportista_id: '',
    chofer_id:        '',
    vehiculo_id:      '',
    observaciones:    '',
  })

  // Filtra choferes y vehículos según el transportista seleccionado
  const chofersFiltrados  = form.transportista_id
    ? choferes.filter(c => c.transportista_id === Number(form.transportista_id))
    : choferes

  const vehiculosFiltrados = form.transportista_id
    ? vehiculos.filter(v => v.transportista_id === Number(form.transportista_id))
    : vehiculos

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      // Si cambia el transportista, resetea chofer y vehículo
      if (name === 'transportista_id') {
        next.chofer_id  = ''
        next.vehiculo_id = ''
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const viaje = await createViaje({
        fecha:            form.fecha,
        transportista_id: form.transportista_id ? Number(form.transportista_id) : null,
        chofer_id:        form.chofer_id        ? Number(form.chofer_id)        : null,
        vehiculo_id:      form.vehiculo_id      ? Number(form.vehiculo_id)      : null,
        observaciones:    form.observaciones    || null,
      })
      router.push(`/viajes/${viaje.id}`)
    } catch (err: any) {
      setError(err.message ?? 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1">
          <label className="text-sm font-medium">Fecha y hora *</label>
          <input
            name="fecha"
            type="datetime-local"
            value={form.fecha}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label className="text-sm font-medium">Transportista</label>
          <select
            name="transportista_id"
            value={form.transportista_id}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sin especificar</option>
            {transportes.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Chofer</label>
          <select
            name="chofer_id"
            value={form.chofer_id}
            onChange={handleChange}
            disabled={chofersFiltrados.length === 0}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <option value="">Sin asignar</option>
            {chofersFiltrados.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Vehículo</label>
          <select
            name="vehiculo_id"
            value={form.vehiculo_id}
            onChange={handleChange}
            disabled={vehiculosFiltrados.length === 0}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <option value="">Sin asignar</option>
            {vehiculosFiltrados.map(v => (
              <option key={v.id} value={v.id}>
                {v.patente}{v.descripcion ? ` — ${v.descripcion}` : ''}
              </option>
            ))}
          </select>
          {form.transportista_id && vehiculosFiltrados.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Este transportista no tiene vehículos cargados todavía.
            </p>
          )}
        </div>

        <div className="col-span-2 space-y-1">
          <label className="text-sm font-medium">
            Observaciones <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creando...' : 'Crear viaje'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
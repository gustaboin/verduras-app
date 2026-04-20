'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPresentacion } from '@/lib/productos'

type Calidad     = { id: number; nombre: string }
type TipoEnvase  = { id: number; nombre: string }
type Unidad      = { id: number; nombre: string; abreviatura: string | null }

interface Props {
  productoId: number
  calidades:    Calidad[]
  tiposEnvase:  TipoEnvase[]
  unidades:     Unidad[]
}

export default function PresentacionForm({
  productoId, calidades, tiposEnvase, unidades
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const [form, setForm] = useState({
    calidad_id:          '',
    envase_id:           '',
    unidad_id:           '',
    kg_por_unidad:       '',
    unidades_por_envase: '',
    descripcion:         '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createPresentacion({
        producto_id:         productoId,
        calidad_id:          form.calidad_id          ? Number(form.calidad_id)          : null,
        envase_id:           form.envase_id           ? Number(form.envase_id)           : null,
        unidad_id:           form.unidad_id           ? Number(form.unidad_id)           : null,
        kg_por_unidad:       form.kg_por_unidad       ? Number(form.kg_por_unidad)       : null,
        unidades_por_envase: form.unidades_por_envase ? Number(form.unidades_por_envase) : null,
        descripcion:         form.descripcion         || null,
      })

      router.push(`/productos/${productoId}`)
      router.refresh()
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
        <div className="space-y-1">
          <label className="text-sm font-medium">Calidad</label>
          <select
            name="calidad_id"
            value={form.calidad_id}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sin especificar</option>
            {calidades.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Tipo de envase</label>
          <select
            name="envase_id"
            value={form.envase_id}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sin especificar</option>
            {tiposEnvase.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Unidad de medida</label>
          <select
            name="unidad_id"
            value={form.unidad_id}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sin especificar</option>
            {unidades.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre} {u.abreviatura ? `(${u.abreviatura})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">KG por unidad</label>
          <input
            name="kg_por_unidad"
            type="number"
            step="0.01"
            min="0"
            value={form.kg_por_unidad}
            onChange={handleChange}
            placeholder="Ej: 20"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Unidades por envase</label>
          <input
            name="unidades_por_envase"
            type="number"
            step="0.01"
            min="0"
            value={form.unidades_por_envase}
            onChange={handleChange}
            placeholder="Ej: 9"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label className="text-sm font-medium">
            Descripción <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder='Ej: "Caja 10kg calidad extra"'
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : 'Agregar presentación'}
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
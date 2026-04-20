'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMercado, toggleActivoMercado, createPuesto, deletePuesto } from '@/lib/configuracion'

type Puesto = { id: number; codigo_puesto: string; descripcion: string | null }
type Mercado = {
  id: number
  nombre: string
  ciudad: string | null
  provincia: string | null
  activo: boolean
  puestos: Puesto[]
}

export default function MercadosABM({ mercados }: { mercados: Mercado[] }) {
  const router = useRouter()
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [expandido, setExpandido]     = useState<number | null>(null)

  const [formMercado, setFormMercado] = useState({
    nombre: '', ciudad: '', provincia: '',
  })
  const [formPuesto, setFormPuesto]   = useState({
    mercado_id: '', codigo_puesto: '', descripcion: '',
  })

  async function handleCrearMercado(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createMercado({
        nombre:    formMercado.nombre,
        ciudad:    formMercado.ciudad    || null,
        provincia: formMercado.provincia || null,
      })
      setFormMercado({ nombre: '', ciudad: '', provincia: '' })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCrearPuesto(e: React.FormEvent) {
    e.preventDefault()
    if (!formPuesto.mercado_id) return
    setLoading(true)
    setError(null)
    try {
      await createPuesto({
        mercado_id:    Number(formPuesto.mercado_id),
        codigo_puesto: formPuesto.codigo_puesto,
        descripcion:   formPuesto.descripcion || null,
      })
      setFormPuesto({ mercado_id: formPuesto.mercado_id, codigo_puesto: '', descripcion: '' })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletePuesto(id: number) {
    if (!confirm('¿Eliminar este puesto?')) return
    try {
      await deletePuesto(id)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Nuevo mercado */}
      <form onSubmit={handleCrearMercado} className="rounded-md border p-4 space-y-3 bg-muted/20">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Nuevo mercado / zona
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Nombre *</label>
            <input
              value={formMercado.nombre}
              onChange={e => setFormMercado(p => ({ ...p, nombre: e.target.value }))}
              required
              placeholder="Ej: Mercado Central"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Ciudad</label>
            <input
              value={formMercado.ciudad}
              onChange={e => setFormMercado(p => ({ ...p, ciudad: e.target.value }))}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Provincia</label>
            <input
              value={formMercado.provincia}
              onChange={e => setFormMercado(p => ({ ...p, provincia: e.target.value }))}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <button
          type="submit" disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : '+ Agregar mercado'}
        </button>
      </form>

      {/* Lista de mercados con puestos expandibles */}
      <div className="space-y-2">
        {mercados.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No hay mercados cargados.</p>
        )}
        {mercados.map(m => (
          <div key={m.id} className="rounded-md border overflow-hidden">
            {/* Header mercado */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandido(expandido === m.id ? null : m.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{m.nombre}</span>
                {m.ciudad && (
                  <span className="text-xs text-muted-foreground">
                    {m.ciudad}, {m.provincia}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {m.puestos.length} puesto{m.puestos.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  m.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {m.activo ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggleActivoMercado(m.id, !m.activo).then(() => router.refresh())
                  }}
                  className="text-xs border rounded px-2 py-1 hover:bg-muted transition-colors"
                >
                  {m.activo ? 'Desactivar' : 'Activar'}
                </button>
                <span className="text-muted-foreground text-xs">
                  {expandido === m.id ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Puestos expandidos */}
            {expandido === m.id && (
              <div className="border-t">
                {/* Lista puestos */}
                {m.puestos.length > 0 && (
                  <table className="w-full text-sm">
                    <thead className="bg-muted/20 text-muted-foreground">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium">Código</th>
                        <th className="text-left px-4 py-2 font-medium">Descripción</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {m.puestos.map(p => (
                        <tr key={p.id} className="hover:bg-muted/20">
                          <td className="px-4 py-2 font-mono">{p.codigo_puesto}</td>
                          <td className="px-4 py-2 text-muted-foreground">{p.descripcion ?? '—'}</td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleDeletePuesto(p.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Agregar puesto */}
                <form
                  onSubmit={e => {
                    setFormPuesto(p => ({ ...p, mercado_id: String(m.id) }))
                    handleCrearPuesto(e)
                  }}
                  className="flex gap-3 items-end px-4 py-3 bg-muted/10 border-t"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Código puesto *</label>
                    <input
                      value={formPuesto.mercado_id === String(m.id) ? formPuesto.codigo_puesto : ''}
                      onChange={e => setFormPuesto(p => ({
                        ...p,
                        mercado_id: String(m.id),
                        codigo_puesto: e.target.value
                      }))}
                      required
                      placeholder="Ej: Sector A-15"
                      className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Descripción</label>
                    <input
                      value={formPuesto.mercado_id === String(m.id) ? formPuesto.descripcion : ''}
                      onChange={e => setFormPuesto(p => ({
                        ...p,
                        mercado_id: String(m.id),
                        descripcion: e.target.value
                      }))}
                      className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                  >
                    + Puesto
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
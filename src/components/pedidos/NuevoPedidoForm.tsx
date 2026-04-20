'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPedidoConItems } from '@/lib/pedidos'

type Cliente      = { id: string; razon_social: string; nrodoc: string; puesto_id: number | null }
type Presentacion = {
  id: number
  descripcion: string | null
  kg_por_unidad: number | null
  productos: { nombre: string } | null
  calidades: { nombre: string } | null
  tipos_envase: { nombre: string } | null
  unidades: { abreviatura: string | null } | null
}
type Calidad = { id: number; nombre: string }

interface ItemForm {
  producto_presentacion_id: number
  presentacion_label: string
  cantidad: number
  calidad_requerida_id: number | null
  es_recortable: boolean
}

interface Props {
  clientes: Cliente[]
  presentaciones: Presentacion[]
  calidades: Calidad[]
}

export default function NuevoPedidoForm({ clientes, presentaciones, calidades }: Props) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Cabecera del pedido
  const [form, setForm] = useState({
    cliente_id:       '',
    fecha_pedido:     new Date().toISOString().split('T')[0],
    fecha_compromiso: '',
    observaciones:    '',
  })

  // Items en memoria (no se guardan hasta submit)
  const [items, setItems] = useState<ItemForm[]>([])

  // Estado del selector de item nuevo
  const [itemNuevo, setItemNuevo] = useState({
    producto_presentacion_id: '',
    cantidad: '',
    calidad_requerida_id: '',
    es_recortable: false,
  })

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleItemChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value
    setItemNuevo(prev => ({ ...prev, [e.target.name]: value }))
  }

  function agregarItem() {
    if (!itemNuevo.producto_presentacion_id || !itemNuevo.cantidad) return

    const presentacion = presentaciones.find(
      p => p.id === Number(itemNuevo.producto_presentacion_id)
    )
    if (!presentacion) return

    // Label para mostrar en la tabla antes de guardar
    const label = [
      presentacion.productos?.nombre,
      presentacion.calidades?.nombre,
      presentacion.tipos_envase?.nombre,
      presentacion.kg_por_unidad
        ? `${presentacion.kg_por_unidad}${presentacion.unidades?.abreviatura ?? ''}`
        : null,
    ].filter(Boolean).join(' · ')

    setItems(prev => [...prev, {
      producto_presentacion_id: Number(itemNuevo.producto_presentacion_id),
      presentacion_label: label,
      cantidad: Number(itemNuevo.cantidad),
      calidad_requerida_id: itemNuevo.calidad_requerida_id
        ? Number(itemNuevo.calidad_requerida_id)
        : null,
      es_recortable: itemNuevo.es_recortable,
    }])

    // Reset selector
    setItemNuevo({
      producto_presentacion_id: '',
      cantidad: '',
      calidad_requerida_id: '',
      es_recortable: false,
    })
  }

  function quitarItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      setError('Agregá al menos un ítem al pedido')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const nuevoPedido = await createPedidoConItems(
        {
          cliente_id:       form.cliente_id,
          puesto_id:        clientes.find(c => c.id === form.cliente_id)?.puesto_id ?? null,
          fecha_pedido:     form.fecha_pedido,
          fecha_compromiso: form.fecha_compromiso || null,
          observaciones:    form.observaciones    || null,
        },
        items.map(({ presentacion_label, ...item }) => item)
      )
      router.push(`/pedidos/${nuevoPedido.id}`)
    } catch (err: any) {
      setError(err.message ?? 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* CABECERA */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Datos del pedido
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium">Cliente *</label>
            <select
              name="cliente_id"
              value={form.cliente_id}
              onChange={handleFormChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccioná un cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.razon_social} — {c.nrodoc}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Fecha del pedido *</label>
            <input
              name="fecha_pedido"
              type="date"
              value={form.fecha_pedido}
              onChange={handleFormChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Fecha compromiso <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <input
              name="fecha_compromiso"
              type="date"
              value={form.fecha_compromiso}
              onChange={handleFormChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium">
              Observaciones <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleFormChange}
              rows={2}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </section>

      {/* ÍTEMS */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Ítems del pedido
        </h2>

        {/* Selector de item nuevo */}
        <div className="rounded-md border p-4 space-y-3 bg-muted/20">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Agregar ítem
          </p>
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium">Presentación</label>
              <select
                name="producto_presentacion_id"
                value={itemNuevo.producto_presentacion_id}
                onChange={handleItemChange}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccioná...</option>
                {presentaciones.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.productos?.nombre} · {p.calidades?.nombre} · {p.tipos_envase?.nombre}
                    {p.kg_por_unidad ? ` · ${p.kg_por_unidad}${p.unidades?.abreviatura ?? ''}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Cantidad</label>
              <input
                name="cantidad"
                type="number"
                min="0.01"
                step="0.01"
                value={itemNuevo.cantidad}
                onChange={handleItemChange}
                placeholder="0"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Calidad requerida</label>
              <select
                name="calidad_requerida_id"
                value={itemNuevo.calidad_requerida_id}
                onChange={handleItemChange}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Cualquiera</option>
                {calidades.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="es_recortable"
                checked={itemNuevo.es_recortable}
                onChange={handleItemChange}
                className="rounded"
              />
              Cantidad recortable (acepta menos)
            </label>

            <button
              type="button"
              onClick={agregarItem}
              disabled={!itemNuevo.producto_presentacion_id || !itemNuevo.cantidad}
              className="rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80 disabled:opacity-40 transition-colors"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Lista de items agregados */}
        {items.length > 0 && (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Presentación</th>
                  <th className="text-left px-4 py-3 font-medium">Cantidad</th>
                  <th className="text-left px-4 py-3 font-medium">Calidad req.</th>
                  <th className="text-left px-4 py-3 font-medium">Recortable</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{item.presentacion_label}</td>
                    <td className="px-4 py-3">{item.cantidad}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {calidades.find(c => c.id === item.calidad_requerida_id)?.nombre ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {item.es_recortable ? '✓' : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => quitarItem(i)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Todavía no agregaste ítems al pedido.
          </p>
        )}
      </section>

      {/* ACCIONES */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : `Crear pedido (${items.length} ítem${items.length !== 1 ? 's' : ''})`}
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
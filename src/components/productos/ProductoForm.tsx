'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProducto, updateProducto } from '@/lib/productos'
import type { Database } from '@/types/database'

type Producto = Database['public']['Tables']['productos']['Row']
type ProductoBase = { id: number; nombre: string }

interface Props {
  producto?: Producto
  productosBase: ProductoBase[]  // para el select de padre
}

export default function ProductoForm({ producto, productosBase }: Props) {
  const router = useRouter()
  const esEdicion = !!producto

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre:      producto?.nombre      ?? '',
    descripcion: producto?.descripcion ?? '',
    padre_id:    producto?.padre_id?.toString() ?? '',
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
      const payload = {
        nombre:      form.nombre,
        descripcion: form.descripcion || null,
        padre_id:    form.padre_id ? Number(form.padre_id) : null,
      }

      if (esEdicion) {
        await updateProducto(producto.id, payload)
        router.refresh()
      } else {
        const nuevo = await createProducto(payload)
        router.push(`/productos/${nuevo.id}`)
      }
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

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nombre *</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Lechuga Criolla"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Variante de <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <select
            name="padre_id"
            value={form.padre_id}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Es un producto base</option>
            {productosBase
              .filter(p => p.id !== producto?.id) // no puede ser padre de sí mismo
              .map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))
            }
          </select>
          <p className="text-xs text-muted-foreground">
            Si es una variedad, elegí el producto padre. Ej: "Criolla" es variante de "Lechuga"
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Descripción <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
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
          {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
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
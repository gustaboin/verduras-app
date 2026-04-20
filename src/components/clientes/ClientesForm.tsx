'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCliente, updateCliente } from '@/lib/clientes'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Cliente = Database['public']['Tables']['clientes']['Row']
type Puesto = Database['public']['Tables']['puestos']['Row'] & {
  mercados: Database['public']['Tables']['mercados']['Row'] | null
}

interface Props {
  cliente?: Cliente
}

const ESTADO_OPTIONS = ['activo', 'inactivo', 'suspendido'] as const
const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
]

export default function ClienteForm({ cliente }: Props) {
  const router = useRouter()
  const esEdicion = !!cliente

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [puestos, setPuestos] = useState<Puesto[]>([])

  const [form, setForm] = useState({
    razon_social:        cliente?.razon_social        ?? '',
    nrodoc:              cliente?.nrodoc              ?? '',
    email:               cliente?.email               ?? '',
    telefono:            cliente?.telefono            ?? '',
    calle:               cliente?.calle               ?? '',
    numero:              cliente?.numero              ?? '',
    depto:               cliente?.depto               ?? '',
    localidad:           cliente?.localidad           ?? '',
    provincia:           cliente?.provincia           ?? '',
    codigo_postal:       cliente?.codigo_postal       ?? '',
    referencias_entrega: cliente?.referencias_entrega ?? '',
    puesto_id:           cliente?.puesto_id           ?? '',
    estado:              cliente?.estado              ?? 'activo',
  })

  // Carga puestos con su mercado para el select
  useEffect(() => {
    supabase
      .from('puestos')
      .select('*, mercados(id, nombre)')
      .then(({ data }) => setPuestos((data as Puesto[]) ?? []))
  }, [])

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
        ...form,
        puesto_id: form.puesto_id || null,   // vacío → null en DB
      }

      if (esEdicion) {
        await updateCliente(cliente.id, payload)
      } else {
        await createCliente(payload)
      }

      router.push('/clientes')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* DATOS PRINCIPALES */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Datos principales
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium">Razón social *</label>
            <input
              name="razon_social"
              value={form.razon_social}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">CUIT / DNI *</label>
            <input
              name="nrodoc"
              value={form.nrodoc}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ESTADO_OPTIONS.map(e => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      {/* DOMICILIO */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Domicilio de entrega
        </h2>

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium">Calle *</label>
            <input
              name="calle"
              value={form.calle}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Número</label>
            <input
              name="numero"
              value={form.numero}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Depto</label>
            <input
              name="depto"
              value={form.depto}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium">Localidad *</label>
            <input
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Provincia *</label>
            <select
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccioná...</option>
              {PROVINCIAS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Código postal *</label>
            <input
              name="codigo_postal"
              value={form.codigo_postal}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-4 space-y-1">
            <label className="text-sm font-medium">Referencias de entrega</label>
            <textarea
              name="referencias_entrega"
              value={form.referencias_entrega}
              onChange={handleChange}
              rows={2}
              placeholder='Ej: "Portón azul frente a la plaza"'
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </section>

      {/* PUESTO EN MERCADO (opcional) */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Puesto en mercado <span className="normal-case font-normal">(opcional)</span>
        </h2>

        <div className="space-y-1 max-w-sm">
          <label className="text-sm font-medium">Puesto asignado</label>
          <select
            name="puesto_id"
            value={form.puesto_id}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sin puesto</option>
            {puestos.map(p => (
              <option key={p.id} value={p.id}>
                {p.mercados?.nombre} — {p.codigo_puesto}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ACCIONES */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear cliente'}
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
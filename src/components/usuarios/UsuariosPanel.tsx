'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Perfil = {
  id: string
  email: string
  nombre: string | null
  rol: string
  activo: boolean
  created_at: string
}

export default function UsuariosPanel({ usuarios }: { usuarios: Perfil[] }) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [form, setForm]       = useState({
    email: '', password: '', nombre: '', rol: 'operador',
  })

  async function handleCrear(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/usuarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm({ email: '', password: '', nombre: '', rol: 'operador' })
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(id: string, activo: boolean) {
    await fetch('/api/usuarios/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, activo: !activo }),
    })
    router.refresh()
  }

  async function handleRol(id: string, rol: string) {
    await fetch('/api/usuarios/rol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rol }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Formulario nuevo usuario */}
      <form onSubmit={handleCrear} className="rounded-md border p-4 space-y-3 bg-muted/20">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Nuevo usuario
        </p>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Nombre</label>
            <input
              value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Contraseña *</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
              minLength={6}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Rol</label>
            <select
              value={form.rol}
              onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="operador">Operador</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creando...' : '+ Crear usuario'}
        </button>
      </form>

      {/* Lista */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Rol</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map(u => (
              <tr key={u.id} className={`hover:bg-muted/30 transition-colors ${!u.activo ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium">{u.nombre ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.rol}
                    onChange={e => handleRol(u.id, e.target.value)}
                    className="rounded border px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="operador">Operador</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(u.id, u.activo)}
                    className="text-xs border rounded px-3 py-1 hover:bg-muted transition-colors"
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
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
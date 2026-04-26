import { getResumenDia } from '@/lib/dashboard'
import Link from 'next/link'

const ESTADO_BADGE: Record<string, string> = {
  PENDIENTE:  'bg-yellow-100 text-yellow-700',
  CONFIRMADO: 'bg-blue-100 text-blue-700',
  CERRADO:    'bg-green-100 text-green-700',
  CANCELADO:  'bg-red-100 text-red-600',
}

export default async function DashboardPage() {
  const { pedidos, pendientes, confirmados, cerrados, cancelados } = await getResumenDia()

  const hoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1 capitalize">{hoy}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border p-5 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total hoy</p>
          <p className="text-3xl font-bold">{pedidos.length}</p>
          <p className="text-xs text-muted-foreground">pedidos ingresados</p>
        </div>
        <div className="rounded-xl border p-5 space-y-1 border-yellow-200 bg-yellow-50">
          <p className="text-xs text-yellow-700 uppercase tracking-wide font-medium">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-700">{pendientes.length}</p>
          <p className="text-xs text-yellow-600">esperando confirmación</p>
        </div>
        <div className="rounded-xl border p-5 space-y-1 border-blue-200 bg-blue-50">
          <p className="text-xs text-blue-700 uppercase tracking-wide font-medium">Confirmados</p>
          <p className="text-3xl font-bold text-blue-700">{confirmados.length}</p>
          <p className="text-xs text-blue-600">en preparación</p>
        </div>
        <div className="rounded-xl border p-5 space-y-1 border-green-200 bg-green-50">
          <p className="text-xs text-green-700 uppercase tracking-wide font-medium">Cerrados</p>
          <p className="text-3xl font-bold text-green-700">{cerrados.length}</p>
          <p className="text-xs text-green-600">despachados hoy</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Pedidos de hoy</h2>
          <Link href="/pedidos" className="text-sm text-muted-foreground hover:underline">
            Ver todos →
          </Link>
        </div>

        {pedidos.length === 0 ? (
          <div className="rounded-xl border p-12 text-center text-muted-foreground">
            <p className="text-lg">Sin pedidos por hoy</p>
            <p className="text-sm mt-1">Los pedidos ingresados hoy aparecerán acá</p>
            <Link
              href="/pedidos/nuevo"
              className="inline-block mt-4 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + Nuevo pedido
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Código</th>
                  <th className="text-left px-4 py-3 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium">Localidad</th>
                  <th className="text-left px-4 py-3 font-medium">Compromiso</th>
                  <th className="text-left px-4 py-3 font-medium">Ítems</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {pedidos.map(p => {
                  const cliente = p.clientes as { razon_social: string; localidad: string } | null
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">{p.codigo ?? '—'}</td>
                      <td className="px-4 py-3 font-medium">{cliente?.razon_social}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cliente?.localidad}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.fecha_compromiso
                          ? new Date(p.fecha_compromiso).toLocaleDateString('es-AR')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {(p.pedido_items as { id: number }[]).length}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[p.estado!] ?? ''}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/pedidos/${p.id}`}
                          className="rounded px-3 py-1 text-xs border hover:bg-muted transition-colors"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cancelados.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Cancelados hoy ({cancelados.length})
          </h2>
          <div className="rounded-xl border border-red-100 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {cancelados.map(p => {
                  const cliente = p.clientes as { razon_social: string } | null
                  return (
                    <tr key={p.id} className="opacity-60 hover:opacity-100 transition-opacity">
                      <td className="px-4 py-2 font-mono text-xs">{p.codigo}</td>
                      <td className="px-4 py-2">{cliente?.razon_social}</td>
                      <td className="px-4 py-2 text-right">
                        <Link href={`/pedidos/${p.id}`} className="text-xs text-muted-foreground hover:underline">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
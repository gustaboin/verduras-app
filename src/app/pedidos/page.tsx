
import { getPedidos } from '@/lib/pedidos'
import PedidosTable from '@/components/pedidos/PedidosTable'
import Link from 'next/link'
import { getUsuarioActual } from '@/lib/auth'

export default async function PedidosPage() {
  const pedidos = await getPedidos()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de pedidos y seguimiento de estado
          </p>
        </div>
        <Link
          href="/pedidos/nuevo"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Nuevo pedido
        </Link>
      </div>

      <PedidosTable pedidos={pedidos} />
    </div>
  )
}


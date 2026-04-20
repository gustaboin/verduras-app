import { getClientes } from '@/lib/clientes'
import ClientesTable from '@/components/clientes/ClientesTable'
import Link from 'next/link'

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de clientes y domicilios de entrega
          </p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Nuevo cliente
        </Link>
      </div>

      <ClientesTable clientes={clientes} />
    </div>
  )
}
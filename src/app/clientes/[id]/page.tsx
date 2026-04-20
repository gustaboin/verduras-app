import { getClienteById } from '@/lib/clientes'
import ClienteForm from '@/components/clientes/ClienteForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function ClienteDetailPage({ params }: Props) {
  const cliente = await getClienteById(params.id).catch(() => null)

  if (!cliente) notFound()

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/clientes" className="text-sm text-muted-foreground hover:underline">
          ← Volver a clientes
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{cliente.razon_social}</h1>
        <p className="text-sm text-muted-foreground">CUIT/DNI: {cliente.nrodoc}</p>
      </div>

      <ClienteForm cliente={cliente} />
    </div>
  )
}
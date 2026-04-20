import ClienteForm from '@/components/clientes/ClientesForm'
import Link from 'next/link'

export default function NuevoClientePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/clientes" className="text-sm text-muted-foreground hover:underline">
          ← Volver a clientes
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Nuevo cliente</h1>
      </div>

      <ClienteForm />
    </div>
  )
}
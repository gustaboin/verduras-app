import { getViajes } from '@/lib/viajes'
import ViajesTable from '@/components/viajes/ViajesTable'
import Link from 'next/link'

export default async function ViajesPage() {
  const viajes = await getViajes()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Viajes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Logística y despacho de pedidos
          </p>
        </div>
        <Link
          href="/viajes/nuevo"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Nuevo viaje
        </Link>
      </div>
      <ViajesTable viajes={viajes} />
    </div>
  )
}
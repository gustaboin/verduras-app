import { getChoferes, getVehiculos, getTransportes } from '@/lib/viajes'
import NuevoViajeForm from '@/components/viajes/NuevoViajeForm'
import Link from 'next/link'

export default async function NuevoViajePage() {
  const [choferes, vehiculos, transportes] = await Promise.all([
    getChoferes(),
    getVehiculos(),
    getTransportes(),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/viajes" className="text-sm text-muted-foreground hover:underline">
          ← Volver a viajes
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Nuevo viaje</h1>
      </div>
      <NuevoViajeForm
        transportes={transportes}
        choferes={choferes}
        vehiculos={vehiculos}
      />
    </div>
  )
}
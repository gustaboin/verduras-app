import {
  getChoferes, getVehiculos, getTiposVehiculo, getMercados
} from '@/lib/configuracion'
import { getTransportes } from '@/lib/viajes'
import ChoforesABM   from '@/components/configuracion/ChoforesABM'
import VehiculosABM  from '@/components/configuracion/VehiculosABM'
import MercadosABM   from '@/components/configuracion/MercadosABM'
import ConfigTabs    from '@/components/configuracion/ConfigTabs'

export default async function ConfiguracionPage() {
  const [choferes, vehiculos, tiposVehiculo, mercados, transportes] = await Promise.all([
    getChoferes(),
    getVehiculos(),
    getTiposVehiculo(),
    getMercados(),
    getTransportes(),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choferes, vehículos, mercados y catálogos
        </p>
      </div>

      <ConfigTabs
        choferes={choferes}
        vehiculos={vehiculos}
        tiposVehiculo={tiposVehiculo}
        mercados={mercados}
        transportes={transportes}
      />
    </div>
  )
}
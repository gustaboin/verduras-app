'use client'

import { useState } from 'react'
import ChoforesABM  from './ChoferesABM'
import VehiculosABM from './VehiculosABM'
import MercadosABM  from './MercadosABM'

const TABS = ['Choferes', 'Vehículos', 'Mercados y puestos'] as const
type Tab = typeof TABS[number]

export default function ConfigTabs({ choferes, vehiculos, tiposVehiculo, mercados, transportes }: any) {
  const [tab, setTab] = useState<Tab>('Choferes')

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 border-b">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {tab === 'Choferes'           && <ChoforesABM  choferes={choferes} transportes={transportes} />}
      {tab === 'Vehículos'          && <VehiculosABM vehiculos={vehiculos} transportes={transportes} tiposVehiculo={tiposVehiculo} />}
      {tab === 'Mercados y puestos' && <MercadosABM  mercados={mercados} />}
    </div>
  )
}
import { getClientesSelect } from '@/lib/clientes'
import { getCalidades } from '@/lib/productos'
import { supabase } from '@/lib/supabase'
import NuevoPedidoForm from '@/components/pedidos/NuevoPedidoForm'
import Link from 'next/link'

export default async function NuevoPedidoPage() {
  const [clientes, calidades, { data: presentaciones }] = await Promise.all([
    getClientesSelect(),
    getCalidades(),
    supabase.from('productos_presentacion').select(`
      id, descripcion, kg_por_unidad,
      productos ( nombre ),
      calidades ( nombre ),
      tipos_envase ( nombre ),
      unidades ( abreviatura )
    `).order('id'),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/pedidos" className="text-sm text-muted-foreground hover:underline">
          ← Volver a pedidos
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Nuevo pedido</h1>
      </div>

      <NuevoPedidoForm
        clientes={clientes}
        presentaciones={presentaciones ?? []}
        calidades={calidades}
      />
    </div>
  )
}
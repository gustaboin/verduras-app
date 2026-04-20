import { getProductoById, getProductos, getCalidades, getTiposEnvase, getUnidades } from '@/lib/productos'
import ProductoForm from '@/components/productos/ProductoForm'
import PresentacionForm from '@/components/productos/PresentacionForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductoDetailPage({ params }: Props) {
  const { id } = await params
  const productoId = Number(id)

  const [producto, productos, calidades, tiposEnvase, unidades] = await Promise.all([
    getProductoById(productoId).catch(() => null),
    getProductos(),
    getCalidades(),
    getTiposEnvase(),
    getUnidades(),
  ])

  if (!producto) notFound()

  return (
    <div className="p-6 space-y-10">
      <div>
        <Link href="/productos" className="text-sm text-muted-foreground hover:underline">
          ← Volver a productos
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{producto.nombre}</h1>
        {producto.padre && (
          <p className="text-sm text-muted-foreground">
            Variante de: {(producto.padre as any).nombre}
          </p>
        )}
      </div>

      {/* Editar producto */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Datos del producto</h2>
        <ProductoForm producto={producto} productosBase={productos} />
      </section>

      {/* Presentaciones existentes */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Presentaciones</h2>

        {producto.productos_presentacion.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este producto no tiene presentaciones todavía.
          </p>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Descripción</th>
                  <th className="text-left px-4 py-3 font-medium">Calidad</th>
                  <th className="text-left px-4 py-3 font-medium">Envase</th>
                  <th className="text-left px-4 py-3 font-medium">Unidad</th>
                  <th className="text-left px-4 py-3 font-medium">KG/u</th>
                  <th className="text-left px-4 py-3 font-medium">u/envase</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {producto.productos_presentacion.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">{p.descripcion ?? '—'}</td>
                    <td className="px-4 py-3">{p.calidades?.nombre ?? '—'}</td>
                    <td className="px-4 py-3">{p.tipos_envase?.nombre ?? '—'}</td>
                    <td className="px-4 py-3">{p.unidades?.nombre ?? '—'}</td>
                    <td className="px-4 py-3">{p.kg_por_unidad ?? '—'}</td>
                    <td className="px-4 py-3">{p.unidades_por_envase ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Agregar presentación inline */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-4">Agregar presentación</h3>
          <PresentacionForm
            productoId={productoId}
            calidades={calidades}
            tiposEnvase={tiposEnvase}
            unidades={unidades}
          />
        </div>
      </section>
    </div>
  )
}
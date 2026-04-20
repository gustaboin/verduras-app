import { getProductos } from '@/lib/productos'
import ProductosTable from '@/components/productos/ProductosTable'
import Link from 'next/link'

export default async function ProductosPage() {
  const productos = await getProductos()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Productos base y sus variantes
          </p>
        </div>
        <Link
          href="/productos/nuevo"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Nuevo producto
        </Link>
      </div>

      <ProductosTable productos={productos} />
    </div>
  )
}
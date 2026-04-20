import { getProductos } from '@/lib/productos'
import ProductoForm from '@/components/productos/ProductoForm'
import Link from 'next/link'

export default async function NuevoProductoPage() {
  const productos = await getProductos()

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/productos" className="text-sm text-muted-foreground hover:underline">
          ← Volver a productos
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Nuevo producto</h1>
      </div>

      <ProductoForm productosBase={productos} />
    </div>
  )
}
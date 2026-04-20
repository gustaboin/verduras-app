import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Verduras App',
  description: 'Sistema de pedidos y logística',
}

const NAV_ITEMS = [
  { href: '/clientes',  label: 'Clientes',   icon: '👥' },
  { href: '/productos', label: 'Productos',  icon: '🥦' },
  { href: '/pedidos',   label: 'Pedidos',    icon: '📋' },
  { href: '/viajes',    label: 'Viajes',     icon: '🚛' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <div className="flex h-screen overflow-hidden">

          {/* Sidebar */}
          <aside className="w-56 shrink-0 border-r bg-muted/30 flex flex-col">
            <div className="px-5 py-5 border-b">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Sistema</p>
              <h1 className="text-base font-semibold mt-0.5">Verduras App</h1>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="px-5 py-4 border-t">
              <p className="text-xs text-muted-foreground">v0.1.0</p>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}
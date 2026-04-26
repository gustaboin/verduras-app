import { getUsuarios } from '@/lib/usuarios'
import { getUsuarioActual } from '@/lib/auth'
import UsuariosPanel from '@/components/usuarios/UsuariosPanel'
import { redirect } from 'next/navigation'

export default async function UsuariosPage() {
  const yo = await getUsuarioActual()
  if (yo?.rol !== 'admin') redirect('/pedidos')

  const usuarios = await getUsuarios()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestión de accesos al sistema
        </p>
      </div>
      <UsuariosPanel usuarios={usuarios} />
    </div>
  )
}
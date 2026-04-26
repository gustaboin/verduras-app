import { NextResponse, type NextRequest } from 'next/server'
import { updateRolUsuario } from '@/lib/usuarios'
import { getUsuarioActual } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const yo = await getUsuarioActual()
  if (yo?.rol !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id, rol } = await request.json()
  await updateRolUsuario(id, rol)
  return NextResponse.json({ ok: true })
}
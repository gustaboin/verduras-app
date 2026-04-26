import { NextResponse, type NextRequest } from 'next/server'
import { toggleActivoUsuario } from '@/lib/usuarios'
import { getUsuarioActual } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const yo = await getUsuarioActual()
  if (yo?.rol !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id, activo } = await request.json()
  await toggleActivoUsuario(id, activo)
  return NextResponse.json({ ok: true })
}
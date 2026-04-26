import { NextResponse, type NextRequest } from 'next/server'
import { crearUsuario } from '@/lib/usuarios'
import { getUsuarioActual } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const yo = await getUsuarioActual()
  if (yo?.rol !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  try {
    const { email, password, nombre, rol } = await request.json()
    await crearUsuario(email, password, nombre, rol)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error inesperado' },
      { status: 500 }
    )
  }
}
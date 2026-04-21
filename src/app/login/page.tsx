import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm space-y-6 p-8 bg-background rounded-xl border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Ingresar</h1>
          <p className="text-sm text-muted-foreground">
            Sistema de pedidos y logística
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
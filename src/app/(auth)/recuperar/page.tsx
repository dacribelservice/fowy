import RecoveryForm from '@/components/auth/RecoveryForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | FOWY',
  description: 'Restablece tu acceso a la plataforma FOWY de forma segura.',
}

export default function RecoveryPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fowy-red/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fowy-purple/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <RecoveryForm />
    </main>
  )
}

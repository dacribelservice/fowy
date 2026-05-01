'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Icono de Google personalizado para mayor fidelidad de marca
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('¡Bienvenido de nuevo!')
        router.push('/explorar')
        router.refresh()
      }
    } catch (err) {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        setIsGoogleLoading(false)
      }
    } catch (err) {
      toast.error('Error al conectar con Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md p-8 glass-morphism rounded-fowy-lg shadow-premium relative overflow-hidden"
    >
      {/* Luces de fondo decorativas (Ethereal Glow) */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-fowy-red/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fowy-purple/10 blur-[100px] rounded-full" />

      <div className="relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-20">
            <Image 
              src="/assets/fowy png.png" 
              alt="FOWY Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Social Login - 2.1.2 */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full py-3.5 px-4 mb-6 flex items-center justify-center gap-3 bg-slate-100/80 border border-slate-200/60 rounded-[20px] text-slate-600 font-semibold hover:bg-slate-200/80 hover:border-slate-300/60 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 cursor-pointer"
        >
          {isGoogleLoading ? (
            <div className="fowy-spinner !w-5 !h-5 !border-t-slate-400 !border-right-slate-400" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          Continuar con Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/30 backdrop-blur-sm px-3 text-slate-400 font-semibold">o</span>
          </div>
        </div>

        {/* Email Form - 2.1.3 */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
              Correo Electrónico
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@fowy.pro"
                className="w-full pl-12 pr-4 py-3.5 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
                Contraseña
              </label>
              <Link 
                href="/recuperar" 
                className="text-xs font-bold text-fowy-red hover:text-fowy-orange transition-colors"
              >
                ¿La olvidaste?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-fowy-energy rounded-[20px] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-fowy-red/30 hover:shadow-fowy-red/40 hover:translate-y-[-1px] active:scale-[0.98] active:translate-y-0 transition-all disabled:opacity-70 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <div className="fowy-spinner" />
            ) : (
              <>
                Entrar <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Auxiliares - 2.1.4 */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-fowy-red font-bold hover:underline decoration-2 underline-offset-4">
              Regístrate ahora
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

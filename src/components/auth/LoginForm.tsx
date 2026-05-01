'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

// Icono de Google personalizado para mayor fidelidad de marca
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

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
        // La redirección será manejada por el middleware o el estado de la sesión
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-fowy-energy bg-clip-text text-transparent mb-2">
            Inicia Sesión
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Entra a la experiencia FOWY
          </p>
        </div>

        {/* Social Login - 2.1.2 */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full py-3.5 px-4 mb-6 flex items-center justify-center gap-3 bg-white border border-slate-100 rounded-[20px] text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 cursor-pointer"
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-fowy-red rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5 text-fowy-red" />
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
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

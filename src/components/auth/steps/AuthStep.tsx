'use client'

import { Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

interface AuthStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

export default function AuthStep({ formData, updateFormData, onNext, isLoading, setIsLoading }: AuthStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    onNext() // Move to profile step without creating user yet
  }

  const handleGoogleRegister = async () => {
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
    <div className="space-y-6">
      {/* Social Register */}
      <button
        onClick={handleGoogleRegister}
        disabled={isGoogleLoading}
        className="w-full py-3.5 px-4 flex items-center justify-center gap-3 bg-slate-100/80 border border-slate-200/60 rounded-[20px] text-slate-600 font-semibold hover:bg-slate-200/80 hover:border-slate-300/60 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 cursor-pointer"
      >
        {isGoogleLoading ? (
          <div className="fowy-spinner !w-5 !h-5 !border-t-slate-400 !border-right-slate-400" />
        ) : (
          <GoogleIcon className="w-5 h-5" />
        )}
        Registrarse con Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/30 backdrop-blur-sm px-3 text-slate-400 font-semibold">o crea una cuenta</span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Correo Electrónico
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Contraseña
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-12 pr-12 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium text-sm"
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

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Confirmar Contraseña
          </label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              placeholder="Repite tu contraseña"
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium text-sm"
            />
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
              Crear Cuenta <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

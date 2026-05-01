'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

export default function RecoveryForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const supabase = createClient()

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/actualizar-password`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        setIsSubmitted(true)
        toast.success('Enlace de recuperación enviado')
      }
    } catch (err) {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md p-8 glass-morphism rounded-fowy-lg shadow-premium relative overflow-hidden"
    >
      {/* Luces de fondo decorativas */}
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

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recuperar Contraseña</h2>
                <p className="text-sm text-slate-500 px-4">
                  Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              <form onSubmit={handleRecovery} className="space-y-5">
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
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-fowy-energy rounded-[20px] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-fowy-red/30 hover:shadow-fowy-red/40 hover:translate-y-[-1px] active:scale-[0.98] active:translate-y-0 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="fowy-spinner" />
                  ) : (
                    <>
                      Enviar Enlace <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">¡Correo Enviado!</h3>
                <p className="text-sm text-slate-500">
                  Hemos enviado las instrucciones a <br />
                  <span className="font-bold text-slate-700">{email}</span>
                </p>
              </div>
              <p className="text-xs text-slate-400 px-6">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-fowy-red font-bold text-sm hover:underline"
              >
                Intentar con otro correo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-fowy-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

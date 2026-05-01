'use client'

import { User, Phone, CheckCircle2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProfileStepProps {
  formData: any
  updateFormData: (data: any) => void
  onFinish: () => void
  onBack: () => void
  isLoading: boolean
}

export default function ProfileStep({ formData, updateFormData, onFinish, onBack, isLoading }: ProfileStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFinish()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Cuéntanos sobre ti</h2>
        <p className="text-slate-400 text-sm">Necesitamos estos datos para personalizar tu experiencia.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Nombre Completo
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="Ej: Juan Pérez"
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Teléfono de Contacto
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="Ej: +57 300 123 4567"
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-[20px] font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Atrás
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-4 bg-fowy-energy rounded-[20px] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-fowy-red/30 hover:shadow-fowy-red/40 hover:translate-y-[-1px] active:scale-[0.98] active:translate-y-0 transition-all disabled:opacity-70 cursor-pointer"
          >
            Finalizar <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

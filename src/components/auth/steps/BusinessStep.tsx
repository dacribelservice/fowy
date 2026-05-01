'use client'

import { Store, Tag, ArrowRight, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { storageService } from '@/services/storageService'
import { toast } from 'sonner'

interface BusinessStepProps {
  formData: any
  updateFormData: (data: any) => void
  onFinish: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function BusinessStep({ 
  formData, 
  updateFormData, 
  onFinish, 
  onBack, 
  isLoading, 
  setIsLoading 
}: BusinessStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload a Supabase (opcional: podemos hacerlo al final, pero mejor validar aquí)
    setIsUploading(true)
    try {
      const publicUrl = await storageService.uploadFile(file, 'logos', {
        maxWidth: 800,
        quality: 0.7
      })
      updateFormData({ logoUrl: publicUrl })
      toast.success('Logo subido correctamente')
    } catch (err) {
      toast.error('Error al subir el logo')
      setLogoPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFinish()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Tu Negocio</h2>
        <p className="text-slate-400 text-sm">Configura la identidad de tu establecimiento.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo Upload */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group">
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-10 h-10 text-slate-300" />
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="fowy-spinner !w-6 !h-6" />
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo del Negocio</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Nombre del Negocio
          </label>
          <div className="relative group">
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
              placeholder="Ej: Hamburguesas del Parque"
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all placeholder:text-slate-300 font-medium text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-[2px]">
            Tipo de Negocio / Categoría
          </label>
          <div className="relative group">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-fowy-red transition-colors" />
            <select
              required
              value={formData.businessType}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-fowy-red/10 focus:border-fowy-red/30 transition-all font-medium text-sm appearance-none"
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option value="restaurante">Restaurante</option>
              <option value="cafeteria">Cafetería</option>
              <option value="bar">Bar / Pub</option>
              <option value="tienda">Tienda de Barrio</option>
              <option value="otro">Otro</option>
            </select>
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
            disabled={isLoading || isUploading}
            className="flex-[2] py-4 bg-fowy-energy rounded-[20px] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-fowy-red/30 hover:shadow-fowy-red/40 hover:translate-y-[-1px] active:scale-[0.98] active:translate-y-0 transition-all disabled:opacity-70 cursor-pointer"
          >
            Finalizar <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

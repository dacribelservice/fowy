'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useRegistrationWizard } from '@/hooks/useRegistrationWizard'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import AuthStep from './steps/AuthStep'
import ProfileStep from './steps/ProfileStep'
import BusinessStep from './steps/BusinessStep'
import SuccessStep from './steps/SuccessStep'

export default function RegisterForm() {
  const { 
    step, 
    formData, 
    updateFormData, 
    isLoading, 
    setIsLoading, 
    nextStep, 
    prevStep,
    setStep
  } = useRegistrationWizard()

  const supabase = createClient()
  
  // Detectar sesión activa (útil para OAuth/Google)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && step === 'auth') {
        updateFormData({
          email: user.email || '',
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
        })
        setStep('profile')
      }
    }
    checkUser()
  }, [])

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
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'auth' && (
              <AuthStep 
                formData={formData} 
                updateFormData={updateFormData} 
                onNext={nextStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {step === 'profile' && (
              <ProfileStep 
                formData={formData} 
                updateFormData={updateFormData} 
                onNext={nextStep}
                onBack={prevStep}
                isLoading={isLoading}
              />
            )}
            {step === 'business' && (
              <BusinessStep 
                formData={formData} 
                updateFormData={updateFormData} 
                onFinish={async () => {
                  setIsLoading(true)
                  const supabase = createClient()
                  try {
                    const { data: { session } } = await supabase.auth.getSession()

                    if (session) {
                      // Usuario OAuth (Google): Ya tiene cuenta, actualizamos perfil y creamos negocio
                      const { error: profileError } = await supabase
                        .from('profiles')
                        .update({ 
                          full_name: formData.fullName,
                          role: 'business_owner'
                        })
                        .eq('id', session.user.id)
                      
                      if (profileError) throw profileError

                      // Buscar categoría si coincide con el tipo
                      const { data: categories } = await supabase
                        .from('categories')
                        .select('id')
                        .ilike('name', formData.businessType)
                        .limit(1)

                      const { error: businessError } = await supabase
                        .from('businesses')
                        .insert({
                          name: formData.businessName,
                          owner_id: session.user.id,
                          logo_url: formData.logoUrl,
                          category_id: categories?.[0]?.id || null,
                          status: false,
                          slug: `${formData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random() * 1000)}`
                        })

                      if (businessError) throw businessError

                      toast.success('¡Registro completado exitosamente!')
                      nextStep()
                    } else {
                      // Usuario Email: Usamos signUp atómico (el trigger handle_new_user hace el resto)
                      const { error } = await supabase.auth.signUp({
                        email: formData.email,
                        password: formData.password,
                        options: {
                          data: {
                            full_name: formData.fullName,
                            phone: formData.phone,
                            business_name: formData.businessName,
                            business_type: formData.businessType,
                            logo_url: formData.logoUrl,
                            role: 'business_owner'
                          },
                          emailRedirectTo: `${window.location.origin}/auth/callback`,
                        },
                      })

                      if (error) {
                        toast.error(error.message)
                      } else {
                        toast.success('¡Registro exitoso! Revisa tu correo para confirmar.')
                        nextStep()
                      }
                    }
                  } catch (err: any) {
                    console.error('Registration error:', err)
                    toast.error(err.message || 'Error al finalizar el registro')
                  } finally {
                    setIsLoading(false)
                  }
                }}
                onBack={prevStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {step === 'success' && (
              <SuccessStep />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Link to Login - solo visible en pasos iniciales */}
        {step !== 'success' && (
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-400 text-sm font-medium">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-fowy-red font-bold hover:underline decoration-2 underline-offset-4">
                Inicia sesión
              </Link>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

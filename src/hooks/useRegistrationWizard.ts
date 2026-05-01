import { useState } from 'react'

export type RegistrationStep = 'auth' | 'profile' | 'business' | 'success'

export interface RegistrationFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  businessName: string
  businessType: string
  logoUrl?: string
}

const initialFormData: RegistrationFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phone: '',
  businessName: '',
  businessType: '',
  logoUrl: '',
}

/**
 * Hook personalizado para gestionar el estado de un registro multi-paso (Wizard).
 * Centraliza la navegación, validación y persistencia temporal de los datos.
 */
export function useRegistrationWizard() {
  const [step, setStep] = useState<RegistrationStep>('auth')
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)

  const updateFormData = (data: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (step === 'auth') setStep('profile')
    else if (step === 'profile') setStep('business')
    else if (step === 'business') setStep('success')
  }

  const prevStep = () => {
    if (step === 'profile') setStep('auth')
    else if (step === 'business') setStep('profile')
  }

  const reset = () => {
    setStep('auth')
    setFormData(initialFormData)
  }

  return {
    step,
    formData,
    isLoading,
    setIsLoading,
    updateFormData,
    nextStep,
    prevStep,
    reset,
    setStep
  }
}

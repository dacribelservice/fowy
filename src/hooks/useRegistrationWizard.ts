import { useState } from 'react'

export type RegistrationStep = 'auth' | 'profile' | 'success'

export interface RegistrationFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
}

const initialFormData: RegistrationFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phone: '',
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
    else if (step === 'profile') setStep('success')
  }

  const prevStep = () => {
    if (step === 'profile') setStep('auth')
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

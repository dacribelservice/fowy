'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react'
import Link from 'next/link'

export default function SuccessStep() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          ¡Todo listo! <PartyPopper className="w-6 h-6 text-fowy-red" />
        </h2>
        <p className="text-slate-400 font-medium">
          Tu cuenta ha sido creada exitosamente. 
          Solo debes confirmar tu registro desde el correo electrónico que te enviamos.
        </p>
      </div>

      <div className="w-full pt-4">
        <Link
          href="/login"
          className="w-full py-4 bg-fowy-energy rounded-[20px] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-fowy-red/30 hover:shadow-fowy-red/40 hover:translate-y-[-1px] active:scale-[0.98] active:translate-y-0 transition-all cursor-pointer"
        >
          Ir al Login <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

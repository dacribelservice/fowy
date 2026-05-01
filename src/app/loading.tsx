"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative">
        {/* Animated Background Pulse */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 bg-fowy-red/20 rounded-full blur-2xl"
        />
        
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100 overflow-hidden p-4"
        >
          <motion.img
            src="/assets/icono rojo favicon.png"
            alt="FOWY"
            className="w-full h-full object-contain"
            animate={{ 
              rotateY: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col items-center"
      >
        <h2 className="text-xl font-black text-slate-800 tracking-tighter">FOWY</h2>
        <div className="mt-2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-1.5 h-1.5 rounded-full bg-fowy-red"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

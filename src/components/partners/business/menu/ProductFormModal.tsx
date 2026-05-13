"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  X, 
  Upload, 
  Tag, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Zap,
  TrendingUp,
  Package,
  Layers,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import PremiumImage from "@/components/admin/shared/PremiumImage";
import { useCategoryManager } from "@/hooks/useCategoryManager";
import { useProductManager, type Product } from "@/hooks/useProductManager";
import { storageService } from "@/services/storageService";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductFormModalProps {
  businessId: string;
  onClose: () => void;
  onSuccess?: () => void;
  productToEdit?: Product;
}

export default function ProductFormModal({ businessId, onClose, onSuccess, productToEdit }: ProductFormModalProps) {
  const { categories } = useCategoryManager(businessId);
  const { addProduct, updateProduct } = useProductManager(businessId);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isGlobal = !!productToEdit?.global_product_id;
  const globalProduct = productToEdit?.global_products;

  // Form State
  const [name, setName] = useState(productToEdit?.name || "");
  const [description, setDescription] = useState(() => {
    if (isGlobal && productToEdit && globalProduct) {
      if (productToEdit.description === globalProduct.description) {
        return "";
      }
    }
    return productToEdit?.description || "";
  });
  const [price, setPrice] = useState(productToEdit?.price?.toString() || "");
  const [categoryName, setCategoryName] = useState(productToEdit?.category_name || "");
  const [imageUrl, setImageUrl] = useState(productToEdit?.image_url || "");
  const [inStock, setInStock] = useState(productToEdit?.in_stock ?? true);
  const [isNew, setIsNew] = useState(productToEdit?.is_new ?? false);
  const [isOffer, setIsOffer] = useState(productToEdit?.is_offer ?? false);
  const [isRecommended, setIsRecommended] = useState(productToEdit?.is_recommended ?? false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(productToEdit?.image_url || null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalImageUrl = imageUrl;
      
      // Upload image if selected (only if not a global product)
      const file = isGlobal ? null : fileInputRef.current?.files?.[0];
      if (file) {
        finalImageUrl = await storageService.uploadFile(file, 'products', {
          path: `${businessId}/products`,
          shouldCompress: true,
          maxWidth: 1024,
          quality: 0.8
        });
      }

      const productData = {
        name: isGlobal ? null : name,
        description: (isGlobal && description.trim() === "") ? null : description,
        price: parseFloat(price),
        category_name: categoryName,
        image_url: isGlobal ? null : finalImageUrl,
        in_stock: inStock,
        is_active: true,
        is_new: isNew,
        is_offer: isOffer,
        is_recommended: isRecommended
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
        toast.success("Producto actualizado correctamente");
      } else {
        await addProduct(productData);
        toast.success("Producto creado con éxito");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Ocurrió un error al guardar el producto";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const sheetVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { x: "100%", transition: { ease: "easeInOut", duration: 0.3 } }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sheetVariants}
        className="relative w-full max-w-xl bg-white shadow-premium flex flex-col h-full overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-fowy-secondary/10 rounded-xl flex items-center justify-center text-fowy-secondary">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {productToEdit ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Motor de Menú v2.0</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Image Upload Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={16} className="text-fowy-secondary" />
                  Imagen del Producto
                </label>
                {isGlobal && (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
                    <Lock size={12} /> Bloqueado
                  </span>
                )}
              </div>
              <div 
                onClick={isGlobal ? undefined : () => fileInputRef.current?.click()}
                className={cn(
                  "relative aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center group",
                  previewUrl 
                    ? "border-transparent bg-slate-100" 
                    : "border-slate-200 bg-slate-50 hover:border-fowy-secondary/40 hover:bg-white",
                  isGlobal ? "cursor-default border-slate-100" : "cursor-pointer"
                )}
              >
                {previewUrl ? (
                  <>
                    <PremiumImage 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full" 
                    />
                    {!isGlobal && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold flex items-center gap-2">
                          <Upload size={16} /> Cambiar Imagen
                        </div>
                      </div>
                    )}
                    {isGlobal && (
                      <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10 shadow-sm uppercase tracking-wider">
                        <Lock size={10} /> Imagen Oficial
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:text-fowy-secondary group-hover:scale-110 transition-all">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Subir Fotografía</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">JPG, PNG o WEBP</p>
                  </>
                )}
                {!isGlobal && (
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Tag size={16} className="text-fowy-secondary" />
                    Nombre del Producto
                  </label>
                  {isGlobal && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200 uppercase tracking-wider">
                      <Lock size={10} /> Catálogo Oficial
                    </span>
                  )}
                </div>
                <input 
                  required
                  disabled={isGlobal}
                  type="text" 
                  placeholder="Ej: Hamburguesa Especial"
                  className={cn(
                    "w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 transition-all font-medium",
                    isGlobal 
                      ? "bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed" 
                      : "bg-slate-50 border-slate-100 focus:bg-white text-slate-700"
                  )}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <DollarSign size={16} className="text-fowy-secondary" />
                    Precio
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 font-bold"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Layers size={16} className="text-fowy-secondary" />
                    Categoría
                  </label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 focus:bg-white transition-all text-slate-700 font-medium appearance-none"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-fowy-secondary" />
                  Descripción
                </label>
                <textarea 
                  rows={3}
                  placeholder={isGlobal ? (globalProduct?.description || "Heredará descripción del catálogo global.") : "Describe los ingredientes, tamaño o detalles especiales..."}
                  className={cn(
                    "w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-fowy-secondary/20 transition-all font-medium resize-none",
                    isGlobal && !description
                      ? "bg-slate-50 border-slate-100 placeholder:text-slate-400 placeholder:italic"
                      : "bg-slate-50 border-slate-100 focus:bg-white text-slate-700"
                  )}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {isGlobal && (
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
                    {description 
                      ? "✍️ Versión personalizada. Limpia el texto por completo para heredar de nuevo la descripción oficial." 
                      : "💡 Heredando descripción original del catálogo de Fowy (actúa como sugerencia)."}
                  </p>
                )}
              </div>
            </div>

            {/* Premium Toggles (Engine 14.3.4) */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Sparkles size={16} className="text-fowy-secondary" />
                Atributos Especiales
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Nuevo */}
                <button
                  type="button"
                  onClick={() => setIsNew(!isNew)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                    isNew 
                      ? "bg-fowy-blue/5 border-fowy-blue text-fowy-blue shadow-sm" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isNew ? "bg-fowy-blue text-white" : "bg-slate-50 text-slate-400")}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Nuevo</p>
                    <p className="text-[10px] opacity-70 font-medium">Badge de novedad</p>
                  </div>
                </button>

                {/* Oferta */}
                <button
                  type="button"
                  onClick={() => setIsOffer(!isOffer)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                    isOffer 
                      ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isOffer ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-400")}>
                    <Tag size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Oferta</p>
                    <p className="text-[10px] opacity-70 font-medium">Precio especial</p>
                  </div>
                </button>

                {/* Recomendado */}
                <button
                  type="button"
                  onClick={() => setIsRecommended(!isRecommended)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                    isRecommended 
                      ? "bg-purple-50 border-purple-500 text-purple-600 shadow-sm" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isRecommended ? "bg-purple-500 text-white" : "bg-slate-50 text-slate-400")}>
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Favorito</p>
                    <p className="text-[10px] opacity-70 font-medium">Más pedido</p>
                  </div>
                </button>

                {/* In Stock */}
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                    inStock 
                      ? "bg-green-50 border-green-500 text-green-600 shadow-sm" 
                      : "bg-red-50 border-red-500 text-red-600 shadow-sm"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", inStock ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{inStock ? "Disponible" : "Agotado"}</p>
                    <p className="text-[10px] opacity-70 font-medium">Control de stock</p>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-shake">
                <AlertCircle size={18} />
                <p className="font-medium">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
          >
            Cancelar
          </button>
          <button 
            form="product-form"
            type="submit"
            disabled={loading}
            className="flex-[2] py-4 bg-fowy-secondary text-white rounded-2xl font-bold shadow-premium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                {productToEdit ? "Actualizar Producto" : "Guardar Producto"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

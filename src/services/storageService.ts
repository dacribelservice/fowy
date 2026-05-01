import { createClient } from '@/utils/supabase/client'
import { compressImage } from '@/utils/imageCompression'

export type BucketName = 'logos' | 'products' | 'payment-proofs' | 'banners' | 'identity-documents' | 'categories'

/**
 * Servicio centralizado para la gestión de archivos en Supabase Storage.
 * Implementa compresión automática y generación de rutas seguras.
 */
export const storageService = {
  /**
   * Sube un archivo a un bucket de Supabase con opciones de compresión opcionales.
   * @returns La URL pública del archivo subido.
   */
  async uploadFile(
    file: File,
    bucket: BucketName,
    options: {
      path?: string,
      shouldCompress?: boolean,
      maxWidth?: number,
      quality?: number
    } = {}
  ): Promise<string> {
    const supabase = createClient()
    const { 
      path = '', 
      shouldCompress = true, 
      maxWidth = 800, 
      quality = 0.8 
    } = options

    try {
      let fileToUpload: Blob | File = file
      
      // Solo comprimir si es imagen y se solicita
      if (shouldCompress && file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file, maxWidth, quality)
        } catch (compressionError) {
          console.warn('Image compression failed, uploading original file:', compressionError)
          fileToUpload = file
        }
      }

      // Generar nombre de archivo único
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const fullPath = path ? `${path}/${fileName}`.replace(/\/+/g, '/') : fileName

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fullPath, fileToUpload, {
          contentType: file.type,
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fullPath)

      return publicUrl
    } catch (error) {
      console.error(`Error uploading to ${bucket}:`, error)
      throw error
    }
  },

  /**
   * Elimina un archivo del storage a partir de su URL pública.
   */
  async deleteFileByUrl(url: string, bucket: BucketName): Promise<void> {
    const supabase = createClient()
    try {
      // Extraer el path relativo de la URL pública
      const urlParts = url.split(`/public/${bucket}/`)
      if (urlParts.length < 2) return

      const path = urlParts[1]
      const { error } = await supabase.storage.from(bucket).remove([path])
      if (error) throw error
    } catch (error) {
      console.error(`Error deleting from ${bucket}:`, error)
    }
  }
}

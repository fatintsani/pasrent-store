import { createClient } from "./client";
import imageCompression from "browser-image-compression";

interface UploadProgress {
  status: "compressing" | "uploading" | "success" | "error" | "idle";
  progress: number;
  message?: string;
}

export async function compressAndUploadImage(
  file: File,
  bucket: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. Compress Image
    onProgress?.({ status: "compressing", progress: 0, message: "Mengompresi gambar..." });
    
    const options = {
      maxSizeMB: 0.5, // 500KB
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      onProgress: (p: number) => {
        onProgress?.({ status: "compressing", progress: p, message: `Mengompresi (${p}%)...` });
      }
    };
    
    const compressedFile = await imageCompression(file, options);
    
    // 2. Upload to Supabase
    onProgress?.({ status: "uploading", progress: 0, message: "Menyiapkan unggahan..." });
    const supabase = createClient();
    
    const fileExt = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Actually upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedFile, {
        upsert: false,
        contentType: compressedFile.type,
      });

    // Supabase JS doesn't have a reliable XHR upload progress callback in the modern v2 client for simple `.upload()`
    // However, it's fast because it's compressed!
    onProgress?.({ status: "uploading", progress: 100, message: "Menyimpan ke server..." });

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    onProgress?.({ status: "success", progress: 100, message: "Selesai!" });

    return { success: true, url: publicUrlData.publicUrl };

  } catch (error: any) {
    console.error("Upload error:", error);
    onProgress?.({ status: "error", progress: 0, message: error.message || "Gagal mengunggah gambar" });
    return { success: false, error: error.message || "Terjadi kesalahan saat mengunggah" };
  }
}

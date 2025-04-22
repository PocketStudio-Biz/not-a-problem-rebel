import { createClient } from "@supabase/supabase-js";

// Security configuration
const SECURITY_CONFIG = {
  URL_PATTERN: /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/,
  KEY_PATTERN: /^eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ] as const,
    ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "gif", "webp"] as const,
  },
} as const;

// Initialize client with environment variables
export const supabase = createClient(
  "https://qsevudeuwedgofdemsc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZXZ1ZGV1d2VkZ29mZHdlbXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDkzNjMsImV4cCI6MjA2MDYyNTM2M30.Rz0kTOHqDGdXamqAUyJel8j-CkDcc-i1iUY8vprhYAk",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Secure file name generation
const generateSecureFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomId = crypto.randomUUID().slice(0, 8);
  const sanitizedName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32);

  return `${timestamp}-${randomId}-${sanitizedName}`;
};

// Secure file upload utility
async function uploadImage(file: File, bucket: string = "images") {
  try {
    // Size validation
    if (file.size > SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE) {
      throw new Error(
        `File size must be less than ${SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`
      );
    }

    // Type validation
    if (!SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any)) {
      throw new Error(
        `Invalid file type. Allowed types: ${SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.join(", ")}`
      );
    }

    // Extension validation
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (
      !SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(fileExt as any)
    ) {
      throw new Error(
        `Invalid file extension. Allowed extensions: ${SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.join(", ")}`
      );
    }

    // Generate secure filename
    const fileName = generateSecureFileName(file.name);
    const path = `uploads/${fileName}`;

    // Upload with strict settings
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false, // Prevent overwriting existing files
        contentType: file.type,
        cacheControl: "3600",
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", (error as Error).message);
    throw new Error("Failed to upload image. Please try again.");
  }
}

// Secure file deletion with path validation
async function deleteImage(path: string, bucket: string = "images") {
  try {
    // Validate path format
    if (!/^uploads\/[\w.-]+$/.test(path)) {
      throw new Error("Invalid file path format");
    }

    const { data, error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Deletion failed:", (error as Error).message);
    throw new Error("Failed to delete image");
  }
}

// Secure URL getter
async function getImageUrl(path: string, bucket: string = "images") {
  try {
    // Validate path format
    if (!/^uploads\/[\w.-]+$/.test(path)) {
      throw new Error("Invalid file path format");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error("Failed to get image URL:", (error as Error).message);
    throw new Error("Failed to get image URL");
  }
}

export { uploadImage, deleteImage, getImageUrl };

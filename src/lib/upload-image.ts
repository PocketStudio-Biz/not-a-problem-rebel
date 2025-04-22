import { supabase } from "./supabase";

export async function uploadImage(file: File) {
  try {
    // Size validation
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File size must be less than 5MB`);
    }

    // Type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Extension validation
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedExtensions.includes(fileExt)) {
      throw new Error(
        `Invalid file extension. Allowed extensions: ${allowedExtensions.join(", ")}`
      );
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().slice(0, 8);
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 32);

    const fileName = `${timestamp}-${randomId}-${sanitizedName}`;
    const filePath = `public/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return {
      path: data.path,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

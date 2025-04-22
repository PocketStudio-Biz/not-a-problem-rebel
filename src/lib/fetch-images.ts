import { supabase } from "./supabase";

export interface ImageItem {
  id: string;
  url: string;
  name: string;
  created_at: string;
  size: number;
}

/**
 * Fetches a list of images from Supabase storage
 * @param bucket The storage bucket name
 * @param limit Maximum number of images to fetch
 * @param folder Folder path within the bucket
 * @returns Array of image objects with URLs and metadata
 */
export async function fetchImages(
  bucket: string = "images",
  limit: number = 50,
  folder: string = "public"
): Promise<ImageItem[]> {
  try {
    // List all files in the specified path
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Filter out directories and non-image files
    const imageFiles = data.filter(
      (item) =>
        !item.id.endsWith("/") && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
    );

    // Create an array of image objects with public URLs
    const images = imageFiles.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(`${folder}/${file.name}`);

      return {
        id: file.id,
        url: publicUrl,
        name: file.name,
        created_at: file.created_at,
        size: file.metadata?.size || 0,
      };
    });

    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}

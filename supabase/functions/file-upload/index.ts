import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { verifyAuth } from "../_shared/auth-middleware.ts";
import { logAuditEvent } from "../_shared/audit-log.ts";

// Security configuration
const SECURITY_CONFIG = {
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "gif", "webp"],
  },
  RATE_LIMIT: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    KEY_PREFIX: "upload_rate_limit",
    GLOBAL_LIMIT: 100, // Global rate limit per hour
  },
  CORS: {
    ALLOWED_ORIGINS: [
      // Add your domains here
      "https://notaproblemtosolve.supabase.co",
      "http://localhost:8080",
      "http://localhost:3000",
    ],
    METHODS: ["POST", "OPTIONS"],
    HEADERS: ["Content-Type", "Authorization"],
    MAX_AGE: "86400",
  },
  SECURITY_HEADERS: {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none';",
    "Cache-Control": "no-store, max-age=0",
  },
};

// Rate limiting using Deno KV
class RateLimiter {
  private kv: Deno.Kv | null = null;

  async init() {
    if (!this.kv) {
      this.kv = await Deno.openKv();
    }
  }

  async close() {
    if (this.kv) {
      await this.kv.close();
      this.kv = null;
    }
  }

  async isAllowed(ip: string, userId: string = "anonymous"): Promise<boolean> {
    await this.init();
    if (!this.kv) throw new Error("KV store not initialized");

    // Use both IP and user ID for rate limiting
    const key = [SECURITY_CONFIG.RATE_LIMIT.KEY_PREFIX, ip, userId];
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;

    const result = await this.kv.get(key);
    const requests: number[] = result.value || [];
    const validRequests = requests.filter((time) => time > windowStart);

    if (validRequests.length >= SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
      await this.close();
      return false;
    }

    // Also check global rate limit
    if (await this.isGlobalRateExceeded()) {
      await this.close();
      return false;
    }

    validRequests.push(now);
    await this.kv.set(key, validRequests, {
      expireIn: SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
    });
    await this.close();
    return true;
  }

  async isGlobalRateExceeded(): Promise<boolean> {
    if (!this.kv) throw new Error("KV store not initialized");

    const key = ["global_rate_limit"];
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;

    const result = await this.kv.get(key);
    const requests: number[] = result.value || [];
    const validRequests = requests.filter((time) => time > windowStart);

    if (validRequests.length >= SECURITY_CONFIG.RATE_LIMIT.GLOBAL_LIMIT) {
      return true;
    }

    validRequests.push(now);
    await this.kv.set(key, validRequests, {
      expireIn: SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
    });
    return false;
  }
}

// File validation
class FileValidator {
  static validateFileMetadata(
    fileType: string,
    fileSize: number,
    fileName: string
  ): { valid: boolean; error?: string } {
    // Size validation
    if (fileSize > SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${
          SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE / 1024 / 1024
        }MB`,
      };
    }

    // Type validation
    if (!SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(fileType)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.join(
          ", "
        )}`,
      };
    }

    // Extension validation
    const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
    if (!SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(fileExt)) {
      return {
        valid: false,
        error: `Invalid file extension. Allowed extensions: ${SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_EXTENSIONS.join(
          ", "
        )}`,
      };
    }

    return { valid: true };
  }

  static generateSecureFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().slice(0, 8);
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 32);

    return `${timestamp}-${randomId}-${sanitizedName}`;
  }
}

// CORS headers management
class CorsManager {
  static getHeaders(origin: string | null): Record<string, string> {
    const allowedOrigin = SECURITY_CONFIG.CORS.ALLOWED_ORIGINS.includes(
      origin || ""
    )
      ? origin
      : SECURITY_CONFIG.CORS.ALLOWED_ORIGINS[0];

    return {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": SECURITY_CONFIG.CORS.METHODS.join(", "),
      "Access-Control-Allow-Headers": SECURITY_CONFIG.CORS.HEADERS.join(", "),
      "Access-Control-Max-Age": SECURITY_CONFIG.CORS.MAX_AGE,
      ...SECURITY_CONFIG.SECURITY_HEADERS,
    };
  }
}

// Response helper
class ResponseHelper {
  static json(
    data: unknown,
    status: number,
    corsHeaders: Record<string, string>
  ) {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = CorsManager.getHeaders(origin);
  const clientIP = req.headers.get("x-real-ip") || "unknown";

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Method validation
  if (req.method !== "POST") {
    return ResponseHelper.json(
      { success: false, message: `Method ${req.method} not allowed` },
      405,
      corsHeaders
    );
  }

  // Initialize Supabase admin client for privileged operations
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Verify authentication using middleware
    const { user, error, status } = await verifyAuth(req);

    if (!user) {
      return ResponseHelper.json(
        { success: false, message: error || "Authentication required" },
        status || 401,
        corsHeaders
      );
    }

    // Rate limiting
    const rateLimiter = new RateLimiter();
    const isAllowed = await rateLimiter.isAllowed(clientIP, user.id);

    if (!isAllowed) {
      // Log rate limit event
      await logAuditEvent(supabaseAdmin, {
        userId: user.id,
        action: "rate_limit_exceeded",
        details: {
          endpoint: "file-upload",
          ip: clientIP,
          userAgent: req.headers.get("user-agent"),
        },
        ipAddress: clientIP,
        userAgent: req.headers.get("user-agent"),
        resourceType: "edge_function",
        resourceId: "file-upload",
      });

      return ResponseHelper.json(
        {
          success: false,
          message: "Too many upload requests. Please try again later.",
        },
        429,
        corsHeaders
      );
    }

    // Parse and validate request body
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return ResponseHelper.json(
        { success: false, message: "No file provided" },
        400,
        corsHeaders
      );
    }

    // Server-side validation of file
    const validation = FileValidator.validateFileMetadata(
      file.type,
      file.size,
      file.name
    );

    if (!validation.valid) {
      // Log validation failure
      await logAuditEvent(supabaseAdmin, {
        userId: user.id,
        action: "file_validation_failed",
        details: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          validationError: validation.error,
        },
        ipAddress: clientIP,
        userAgent: req.headers.get("user-agent"),
        resourceType: "storage",
      });

      return ResponseHelper.json(
        { success: false, message: validation.error },
        400,
        corsHeaders
      );
    }

    // Generate secure filename
    const secureFileName = FileValidator.generateSecureFileName(file.name);
    const filePath = `uploads/${user.id}/${secureFileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Create user directory if it doesn't exist
    try {
      // We'll make a simple probe request to see if the directory exists
      const { error: listError } = await supabaseAdmin.storage
        .from("images")
        .list(`uploads/${user.id}`);

      // If we get a 404 error, the directory doesn't exist
      if (listError && listError.message.includes("not found")) {
        // Upload an empty file to create the directory
        const emptyFile = new Uint8Array(0);
        await supabaseAdmin.storage
          .from("images")
          .upload(`uploads/${user.id}/.directory`, emptyFile, {
            contentType: "application/x-directory",
            upsert: true,
          });
      }
    } catch (dirError) {
      // If this fails, we'll still try to upload the file anyway
      console.error("Error checking/creating directory:", dirError);
    }

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("images")
      .upload(filePath, fileData, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);

      // Log upload failure
      await logAuditEvent(supabaseAdmin, {
        userId: user.id,
        action: "file_upload_failed",
        details: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          error: error.message,
        },
        ipAddress: clientIP,
        userAgent: req.headers.get("user-agent"),
        resourceType: "storage",
        resourceId: filePath,
      });

      return ResponseHelper.json(
        { success: false, message: "Upload failed" },
        500,
        corsHeaders
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("images")
      .getPublicUrl(filePath);

    // Log successful upload
    await logAuditEvent(supabaseAdmin, {
      userId: user.id,
      action: "file_upload_success",
      details: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        filePath: data.path,
      },
      ipAddress: clientIP,
      userAgent: req.headers.get("user-agent"),
      resourceType: "storage",
      resourceId: data.path,
    });

    return ResponseHelper.json(
      {
        success: true,
        path: data.path,
        url: urlData.publicUrl,
      },
      200,
      corsHeaders
    );
  } catch (error) {
    console.error("Server error:", error.message);

    // Try to log the error if possible
    try {
      const { user } = await verifyAuth(req);
      if (user) {
        await logAuditEvent(supabaseAdmin, {
          userId: user.id,
          action: "server_error",
          details: {
            endpoint: "file-upload",
            error: error.message,
          },
          ipAddress: clientIP,
          userAgent: req.headers.get("user-agent"),
          resourceType: "edge_function",
          resourceId: "file-upload",
        });
      }
    } catch {
      // Ignore error logging failures
    }

    return ResponseHelper.json(
      { success: false, message: "Server error" },
      500,
      corsHeaders
    );
  }
});

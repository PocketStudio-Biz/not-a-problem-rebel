import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export interface AuthUser {
  id: string;
  email?: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: any;
  aud: string;
  role?: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error?: string;
  status?: number;
}

/**
 * Middleware to verify JWT authentication token
 * @param req Request object
 * @returns Object containing user if authenticated, or error information
 */
export async function verifyAuth(req: Request): Promise<AuthResult> {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return {
        user: null,
        error: "Missing authorization header",
        status: 401,
      };
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const { data, error } = await supabaseClient.auth.getUser(token);

    if (error || !data.user) {
      console.error("Auth verification error:", error?.message);
      return {
        user: null,
        error: error?.message || "Invalid token",
        status: 401,
      };
    }

    return { user: data.user as AuthUser };
  } catch (err) {
    console.error("Auth verification exception:", err);
    return {
      user: null,
      error: "Server error during authentication",
      status: 500,
    };
  }
}

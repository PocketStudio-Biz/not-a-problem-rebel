import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Content-Security-Policy":
    "default-src 'self'; connect-src *; worker-src 'self' blob:;",
};

serve(async (req) => {
  console.log("Request received:", req.method, req.url);
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
      status: 204,
    });
  }

  try {
    const body = await req.json();
    console.log("Request body:", body);
    const { email, name } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({
          error: "Invalid email format",
        }),
        {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Call MailerLite API
    const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
    console.log("API Key present:", !!MAILERLITE_API_KEY);
    const MAILERLITE_GROUP_ID =
      Deno.env.get("MAILERLITE_GROUP_ID") || "151642012109506020";
    console.log("Using group ID:", MAILERLITE_GROUP_ID);

    if (!MAILERLITE_API_KEY) {
      console.error("MailerLite API key not found");
      return new Response(
        JSON.stringify({
          error: "Configuration error - API key missing",
        }),
        {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Making request to MailerLite API...");
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          fields: {
            name: name || "",
          },
          groups: [MAILERLITE_GROUP_ID],
        }),
      }
    );

    const result = await response.json();
    console.log("MailerLite API response:", response.status, result);

    if (!response.ok) {
      console.error("MailerLite API error:", result);
      return new Response(
        JSON.stringify({
          error: "Failed to subscribe",
          status: response.status,
          details: result,
        }),
        {
          status: response.status,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Successfully subscribed user:", email);
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
      status: 204,
    });
  }

  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

    const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
    const MAILERLITE_GROUP_ID =
      Deno.env.get("MAILERLITE_GROUP_ID") || "151642012109506020";

    if (!MAILERLITE_API_KEY) {
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
          fields: { name: name || "" },
          groups: [MAILERLITE_GROUP_ID],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
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

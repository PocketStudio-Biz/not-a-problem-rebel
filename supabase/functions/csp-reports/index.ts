import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

/**
 * Edge function to collect Content Security Policy violation reports
 * These can be used to identify potential XSS attacks and other security issues
 */
serve(async (req) => {
  // CORS headers for reporting endpoint
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  try {
    // Parse the CSP report
    let reportData;
    const contentType = req.headers.get("content-type") || "";

    // Handle different report formats
    if (contentType.includes("application/json")) {
      reportData = await req.json();
    } else if (contentType.includes("application/csp-report")) {
      const rawReport = await req.json();
      reportData = rawReport["csp-report"];
    } else {
      // Unknown format, try to parse as JSON
      try {
        reportData = await req.json();
      } catch (e) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Invalid report format",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    }

    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get IP and user agent for the report
    const sourceIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Store the report in the database
    const { error } = await supabaseAdmin.from("csp_violation_reports").insert({
      report: reportData,
      user_agent: userAgent,
      source_ip: sourceIp,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      console.error("Error storing CSP report:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error processing report",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Successfully stored the report
    return new Response(
      JSON.stringify({
        success: true,
        message: "CSP report received",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error processing CSP report:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error processing report",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

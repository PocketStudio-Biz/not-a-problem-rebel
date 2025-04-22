/**
 * Audit logging utility for Supabase Edge Functions
 * Records security-relevant actions to the audit_logs table
 */

interface AuditLogParams {
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: string;
  resourceId?: string;
}

/**
 * Log a security-relevant event to the audit_logs table
 * @param supabaseAdmin Supabase client with admin/service role permissions
 * @param params Audit log parameters
 */
export async function logAuditEvent(
  supabaseAdmin: any,
  params: AuditLogParams
) {
  const {
    userId,
    action,
    details,
    ipAddress,
    userAgent,
    resourceType,
    resourceId,
  } = params;

  try {
    // Sanitize details to prevent oversized JSON
    const sanitizedDetails = sanitizeObject(details);

    const { error } = await supabaseAdmin.from("audit_logs").insert({
      user_id: userId,
      action,
      details: sanitizedDetails,
      ip_address: ipAddress,
      user_agent: userAgent,
      resource_type: resourceType,
      resource_id: resourceId,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      console.error("Error logging audit event:", error.message);
    }
  } catch (err) {
    console.error("Failed to log audit event:", err);
  }
}

/**
 * Sanitize an object to prevent oversized JSON and sensitive data leakage
 * @param obj The object to sanitize
 * @returns Sanitized object
 */
function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  // Define sensitive keys that should be redacted
  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "key",
    "authorization",
    "credit_card",
    "ssn",
    "social_security",
  ];

  for (const [key, value] of Object.entries(obj)) {
    // Check if this is a sensitive key that should be redacted
    const isKeyMaybeSensitive = sensitiveKeys.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey)
    );

    if (isKeyMaybeSensitive) {
      // Redact sensitive values
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      // Recursively sanitize nested objects
      if (Array.isArray(value)) {
        // Limit array size
        result[key] = value
          .slice(0, 10)
          .map((item) =>
            typeof item === "object" && item !== null
              ? sanitizeObject(item)
              : item
          );
      } else {
        // Process object
        result[key] = sanitizeObject(value);
      }
    } else if (typeof value === "string" && value.length > 1000) {
      // Truncate long strings
      result[key] = value.substring(0, 1000) + "... [truncated]";
    } else {
      // Pass through other values
      result[key] = value;
    }
  }

  return result;
}

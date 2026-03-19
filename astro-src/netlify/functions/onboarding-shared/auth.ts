// =============================================================================
// ONBOARDING AUTH - Shared constant-time authentication helpers
// =============================================================================
// Provides timing-safe comparison for secrets/passwords to prevent
// timing-based side-channel attacks on authentication endpoints.
// =============================================================================

import { timingSafeEqual } from "crypto";
import type { HandlerEvent } from "@netlify/functions";

/**
 * Constant-time string comparison to prevent timing attacks.
 * Compares two strings without leaking length or content information
 * through response timing differences.
 */
export function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) {
    // Constant-time dummy comparison to prevent timing leaks on length mismatch
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Verify the internal API secret from Authorization header.
 * Used by background functions that are invoked internally.
 */
export function verifyInternalAuth(event: HandlerEvent): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    console.error("[auth] INTERNAL_API_SECRET not configured");
    return false;
  }
  const provided = event.headers["authorization"]?.replace("Bearer ", "");
  if (!provided) return false;
  return safeCompare(provided, secret);
}

/**
 * Verify the admin password from Authorization header.
 * Used by admin-facing endpoints (e.g. admin-leads).
 */
export function verifyAdminAuth(event: HandlerEvent): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("[auth] ADMIN_PASSWORD not configured");
    return false;
  }
  const provided = event.headers["authorization"]?.replace("Bearer ", "");
  if (!provided) return false;
  return safeCompare(provided, adminPassword);
}

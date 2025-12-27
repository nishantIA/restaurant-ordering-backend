import { randomBytes } from 'crypto';

/**
 * Generate a unique session ID for anonymous users
 * Format: sess_<random-32-chars>
 * Example: sess_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 */
export function generateSessionId(): string {
  const randomString = randomBytes(16).toString('hex');
  return `sess_${randomString}`;
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  const regex = /^sess_[a-f0-9]{32}$/;
  return regex.test(sessionId);
}

/**
 * Generate a request ID for tracking
 * Format: req_<timestamp>_<random-8-chars>
 * Example: req_1703760000000_a1b2c3d4
 */
export function generateRequestId(): string {
  const timestamp = Date.now();
  const randomString = randomBytes(4).toString('hex');
  return `req_${timestamp}_${randomString}`;
}

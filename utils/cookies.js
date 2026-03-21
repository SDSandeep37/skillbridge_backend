/**
 * Create a JWT token cookie in the response
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to store in cookie
 * @param {string} maxAge - Cookie expiration time in milliseconds (default: 1 hour)
 */
export function createTokenCookie(res, token, maxAge = 3600000) {
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    // secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // sameSite: "none", // CSRF protection
    maxAge: maxAge, // Cookie expiration in milliseconds
    path: "/", // Cookie available for all routes
  });
}

/**
 * Destroy/clear the JWT token cookie from the response
 * @param {Object} res - Express response object
 */
export function destroyTokenCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // sameSite: "none",
    path: "/",
  });
}

/**
 * Get JWT token from request cookies
 * @param {Object} req - Express request object
 * @returns {string|null} - JWT token or null if not found
 */
export function getTokenFromCookie(req) {
  return req.cookies?.token || null;
}

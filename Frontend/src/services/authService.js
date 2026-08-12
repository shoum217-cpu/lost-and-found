/**
 * authService.js – Authentication helpers.
 *
 * Usage example (after backend is running):
 *   const data = await signUp('email@test.com', 'password', 'John Doe')
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Sign up a new user with email + password.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 */
export async function signUp(email, password, fullName) {
  // TODO: implement with fetch(`${API_URL}/auth/register`, { method: 'POST', ... })
  console.log('signUp called (stub)', { email, fullName })
  throw new Error('Authentication not yet implemented.')
}

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 */
export async function signIn(email, password) {
  // TODO: implement with fetch(`${API_URL}/auth/login`, { method: 'POST', ... })
  console.log('signIn called (stub)', { email })
  throw new Error('Authentication not yet implemented.')
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  // TODO: implement removing token from local storage / calling API
  console.log('signOut called (stub)')
  throw new Error('Authentication not yet implemented.')
}

/**
 * Get the currently authenticated user session.
 */
export async function getSession() {
  // TODO: implement getting user info from JWT in local storage / API
  return null
}

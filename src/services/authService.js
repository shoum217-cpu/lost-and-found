/**
 * authService.js – Authentication helpers.
 *
 * Currently these are stubs. Replace the bodies with real Supabase calls
 * once authentication is set up.
 *
 * Usage example (after Supabase is connected):
 *   import { supabase } from '../lib/supabase'
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
 */

// import { supabase } from '../lib/supabase'

/**
 * Sign up a new user with email + password.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 */
export async function signUp(email, password, fullName) {
  // TODO: implement with supabase.auth.signUp()
  console.log('signUp called (stub)', { email, fullName })
  throw new Error('Authentication not yet implemented.')
}

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 */
export async function signIn(email, password) {
  // TODO: implement with supabase.auth.signInWithPassword()
  console.log('signIn called (stub)', { email })
  throw new Error('Authentication not yet implemented.')
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  // TODO: implement with supabase.auth.signOut()
  console.log('signOut called (stub)')
  throw new Error('Authentication not yet implemented.')
}

/**
 * Get the currently authenticated user session.
 */
export async function getSession() {
  // TODO: implement with supabase.auth.getSession()
  return null
}

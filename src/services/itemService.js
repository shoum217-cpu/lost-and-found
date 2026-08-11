/**
 * itemService.js – CRUD operations for Lost & Found items.
 *
 * Currently returns mock data. When Supabase is connected, replace
 * the mock returns with real database queries.
 *
 * Future Supabase table: `items`
 *   - id (uuid, primary key)
 *   - user_id (uuid, references auth.users)
 *   - type ('found' | 'lost')
 *   - title (text)
 *   - category (text)
 *   - description (text)
 *   - location (text)
 *   - date (date)
 *   - status ('open' | 'claimed' | 'returned')
 *   - image_url (text, nullable)
 *   - created_at (timestamptz)
 */

import { mockItems } from '../data/mockItems'
// import { supabase } from '../lib/supabase'

/**
 * Fetch all items. Optionally filter by type and/or search query.
 * @param {{ type?: 'lost'|'found', query?: string, category?: string }} filters
 * @returns {Promise<Array>}
 */
export async function getItems(filters = {}) {
  // --- Mock implementation ---
  let results = [...mockItems]

  if (filters.type && filters.type !== 'all') {
    results = results.filter(item => item.type === filters.type)
  }
  if (filters.category && filters.category !== 'All') {
    results = results.filter(item => item.category === filters.category)
  }
  if (filters.query) {
    const q = filters.query.toLowerCase()
    results = results.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    )
  }

  return results

  // --- Future Supabase implementation ---
  // let query = supabase.from('items').select('*').order('created_at', { ascending: false })
  // if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type)
  // if (filters.category && filters.category !== 'All') query = query.eq('category', filters.category)
  // if (filters.query) query = query.ilike('title', `%${filters.query}%`)
  // const { data, error } = await query
  // if (error) throw error
  // return data
}

/**
 * Fetch a single item by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getItemById(id) {
  // --- Mock implementation ---
  return mockItems.find(item => item.id === id) ?? null

  // --- Future Supabase implementation ---
  // const { data, error } = await supabase.from('items').select('*').eq('id', id).single()
  // if (error) throw error
  // return data
}

/**
 * Create a new item report.
 * @param {Object} itemData
 * @returns {Promise<Object>}
 */
export async function createItem(itemData) {
  // TODO: implement with supabase.from('items').insert(itemData)
  console.log('createItem called (stub)', itemData)
  throw new Error('Item creation not yet implemented.')
}

/**
 * Update an item's status (e.g., mark as returned).
 * @param {string} id
 * @param {'open'|'claimed'|'returned'} status
 * @returns {Promise<Object>}
 */
export async function updateItemStatus(id, status) {
  // TODO: implement with supabase.from('items').update({ status }).eq('id', id)
  console.log('updateItemStatus called (stub)', { id, status })
  throw new Error('Item update not yet implemented.')
}

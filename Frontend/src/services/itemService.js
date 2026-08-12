/**
 * itemService.js – CRUD operations for Lost & Found items.
 *
 * Currently returns mock data. Once the backend is connected, replace
 * the mock returns with real database queries via fetch.
 *
 * Future MongoDB collection: `items`
 */

import { mockItems } from '../data/mockItems'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  // --- Future API implementation ---
  // const queryParams = new URLSearchParams(filters).toString();
  // const res = await fetch(`${API_URL}/items?${queryParams}`);
  // if (!res.ok) throw new Error('Failed to fetch items');
  // return res.json();
}

/**
 * Fetch a single item by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getItemById(id) {
  // --- Mock implementation ---
  return mockItems.find(item => item.id === id) ?? null

  // --- Future API implementation ---
  // const res = await fetch(`${API_URL}/items/${id}`);
  // if (!res.ok) throw new Error('Failed to fetch item');
  // return res.json();
}

/**
 * Create a new item report.
 * @param {Object} itemData
 * @returns {Promise<Object>}
 */
export async function createItem(itemData) {
  // TODO: implement with fetch(`${API_URL}/items`, { method: 'POST', body: JSON.stringify(itemData), ... })
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
  // TODO: implement with fetch(`${API_URL}/items/${id}`, { method: 'PUT', body: JSON.stringify({ status }), ... })
  console.log('updateItemStatus called (stub)', { id, status })
  throw new Error('Item update not yet implemented.')
}

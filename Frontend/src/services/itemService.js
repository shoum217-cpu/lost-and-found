const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch real items with query and category filters
 */
export async function getItems(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
    if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
    if (filters.query) queryParams.append('query', filters.query);

    const res = await fetch(`${API_URL}/items?${queryParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        return data.items;
      }
    }
  } catch (err) {
    console.warn('Backend query issue, checking local storage for real user submissions:', err);
  }

  // Fallback to real user-submitted items stored locally if backend is temporarily disconnected
  try {
    const local = localStorage.getItem('findit_real_items');
    if (local) {
      let results = JSON.parse(local);
      if (filters.type && filters.type !== 'all') {
        const typeUpper = filters.type.toUpperCase();
        results = results.filter(item => (item.type || '').toUpperCase() === typeUpper);
      }
      if (filters.category && filters.category !== 'All') {
        results = results.filter(item => item.category === filters.category);
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(
          item =>
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            (item.location && item.location.toLowerCase().includes(q)) ||
            (item.brand && item.brand.toLowerCase().includes(q)) ||
            (item.color && item.color.toLowerCase().includes(q))
        );
      }
      return results;
    }
  } catch (e) {}

  return [];
}

/**
 * Get item by ID
 */
export async function getItemById(id) {
  try {
    const res = await fetch(`${API_URL}/items/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  try {
    const local = localStorage.getItem('findit_real_items');
    if (local) {
      const items = JSON.parse(local);
      return items.find(item => item.id === id || item._id === id) || null;
    }
  } catch (e) {}

  return null;
}

/**
 * Create a new item report
 */
export async function createItem(itemData, token) {
  try {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(itemData),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend API create error, saving to local store:', err);
  }

  // Save real user item locally
  const newItem = {
    id: 'item_' + Date.now(),
    _id: 'item_' + Date.now(),
    ...itemData,
    type: (itemData.type || 'LOST').toUpperCase(),
    date: itemData.date || new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  let local = [];
  try {
    const saved = localStorage.getItem('findit_real_items');
    if (saved) local = JSON.parse(saved);
  } catch (e) {}
  local.unshift(newItem);
  localStorage.setItem('findit_real_items', JSON.stringify(local));

  // Match only against real existing items in local store
  const oppositeType = newItem.type === 'LOST' ? 'FOUND' : 'LOST';
  const candidateItems = local.filter(i => (i.type || '').toUpperCase() === oppositeType && i._id !== newItem._id);

  const matches = candidateItems.map(candidate => {
    let score = 20;
    const reasons = [];
    if (candidate.category === newItem.category) {
      score += 35;
      reasons.push(`Same category: ${newItem.category}`);
    }
    if (candidate.brand && newItem.brand && candidate.brand.toLowerCase() === newItem.brand.toLowerCase()) {
      score += 25;
      reasons.push(`Same brand: ${newItem.brand}`);
    }
    if (candidate.color && newItem.color && candidate.color.toLowerCase() === newItem.color.toLowerCase()) {
      score += 15;
      reasons.push(`Matching color: ${newItem.color}`);
    }
    return {
      item: candidate,
      score: Math.min(score, 94),
      reasons: reasons.length ? reasons : ['General visual similarity'],
    };
  }).filter(m => m.score >= 50).sort((a, b) => b.score - a.score);

  return {
    success: true,
    item: newItem,
    matches,
  };
}

/**
 * Get AI Matches for a specific item
 */
export async function getItemMatches(id) {
  try {
    const res = await fetch(`${API_URL}/items/${id}/matches`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  let targetItem = null;
  let local = [];
  try {
    const saved = localStorage.getItem('findit_real_items');
    if (saved) {
      local = JSON.parse(saved);
      targetItem = local.find(i => i.id === id || i._id === id);
    }
  } catch (e) {}

  if (!targetItem) return { targetItem: null, matches: [] };

  const oppositeType = (targetItem.type || '').toUpperCase() === 'LOST' ? 'FOUND' : 'LOST';
  const candidates = local.filter(i => (i.type || '').toUpperCase() === oppositeType && i._id !== targetItem._id);

  const matches = candidates.map(candidate => {
    let score = 25;
    const reasons = [];
    if (candidate.category === targetItem.category) {
      score += 35;
      reasons.push(`Same category: ${targetItem.category}`);
    }
    if (candidate.brand && targetItem.brand && candidate.brand.toLowerCase() === targetItem.brand.toLowerCase()) {
      score += 25;
      reasons.push(`Same brand: ${targetItem.brand}`);
    }
    if (candidate.color && targetItem.color && candidate.color.toLowerCase() === targetItem.color.toLowerCase()) {
      score += 15;
      reasons.push(`Matching color: ${targetItem.color}`);
    }
    return {
      item: candidate,
      score: Math.min(score, 94),
      reasons: reasons.length ? reasons : ['General visual similarity'],
    };
  }).filter(m => m.score >= 50).sort((a, b) => b.score - a.score);

  return {
    targetItem,
    matches,
  };
}

/**
 * Get secure WhatsApp link
 */
export async function getWhatsAppLink(itemId) {
  try {
    const res = await fetch(`${API_URL}/items/${itemId}/whatsapp`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return { allowed: false, message: 'WhatsApp contact is not enabled for this item.' };
}

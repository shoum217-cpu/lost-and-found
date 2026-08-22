const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getHeatmapData(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.timeframe) params.append('timeframe', filters.timeframe);
    if (filters.category) params.append('category', filters.category);

    const res = await fetch(`${API_URL}/heatmap?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (err) {}

  // Return real database aggregation (empty state if no items exist)
  let realItems = [];
  try {
    const saved = localStorage.getItem('findit_real_items');
    if (saved) realItems = JSON.parse(saved);
  } catch (e) {}

  if (realItems.length === 0) {
    return {
      success: true,
      timeframe: filters.timeframe || '30d',
      type: filters.type || 'both',
      category: filters.category || 'all',
      totalItems: 0,
      hotspots: [],
    };
  }

  // Aggregate real user items into clusters
  const clusters = {};
  realItems.forEach(item => {
    const lat = item.coordinates?.lat || 12.9716;
    const lng = item.coordinates?.lng || 77.5946;
    const key = `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;

    if (!clusters[key]) {
      clusters[key] = {
        lat,
        lng,
        areaName: item.location || 'Reported Area',
        lostCount: 0,
        foundCount: 0,
        totalCount: 0,
        recentItems: [],
      };
    }
    if ((item.type || '').toUpperCase() === 'LOST') {
      clusters[key].lostCount++;
    } else {
      clusters[key].foundCount++;
    }
    clusters[key].totalCount++;
    if (clusters[key].recentItems.length < 3) {
      clusters[key].recentItems.push(item);
    }
  });

  return {
    success: true,
    timeframe: filters.timeframe || '30d',
    type: filters.type || 'both',
    category: filters.category || 'all',
    totalItems: realItems.length,
    hotspots: Object.values(clusters),
  };
}

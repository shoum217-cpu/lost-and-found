import Item from '../models/Item.js';

// @desc    Get aggregated heatmap data for lost and found activity
// @route   GET /api/heatmap
// @access  Public
export const getHeatmapData = async (req, res) => {
  try {
    const { type = 'both', timeframe = '30d', category = 'all' } = req.query;

    const filter = {};

    // Filter by type
    if (type.toLowerCase() === 'lost') {
      filter.type = 'LOST';
    } else if (type.toLowerCase() === 'found') {
      filter.type = 'FOUND';
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }

    // Filter by timeframe
    const now = new Date();
    if (timeframe === '24h') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: yesterday };
    } else if (timeframe === '7d') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: weekAgo };
    } else if (timeframe === '30d') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: monthAgo };
    }

    const items = await Item.find(filter).select('title type category location coordinates createdAt status');

    // Aggregate into privacy-preserving geographic hotspots
    const hotspots = [];
    const locationClusters = {};

    items.forEach(item => {
      // Use clean rounded coordinates or location name grouping
      const locKey = item.location ? item.location.trim().toLowerCase() : 'central';
      
      const lat = item.coordinates?.lat || 12.9716;
      const lng = item.coordinates?.lng || 77.5946;

      // Approximate coordinates (rounded to 2 decimal places ~1.1km radius)
      const clusterKey = `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;

      if (!locationClusters[clusterKey]) {
        locationClusters[clusterKey] = {
          lat: Math.round(lat * 100) / 100,
          lng: Math.round(lng * 100) / 100,
          areaName: item.location || 'General Area',
          lostCount: 0,
          foundCount: 0,
          totalCount: 0,
          categories: {},
          recentItems: [],
        };
      }

      const cluster = locationClusters[clusterKey];
      if (item.type === 'LOST') {
        cluster.lostCount++;
      } else {
        cluster.foundCount++;
      }
      cluster.totalCount++;

      cluster.categories[item.category] = (cluster.categories[item.category] || 0) + 1;

      if (cluster.recentItems.length < 4) {
        cluster.recentItems.push({
          title: item.title,
          type: item.type,
          category: item.category,
        });
      }
    });

    const clusterList = Object.values(locationClusters).map(cluster => {
      // Calculate heat intensity weight based on total counts
      const intensity = Math.min(Math.max(cluster.totalCount / 5, 0.2), 1.0);
      return {
        ...cluster,
        intensity,
      };
    });

    return res.json({
      success: true,
      timeframe,
      type,
      category,
      totalItems: items.length,
      hotspots: clusterList,
    });
  } catch (error) {
    console.error('Error in getHeatmapData:', error);
    return res.status(500).json({ message: 'Server error generating heatmap data' });
  }
};

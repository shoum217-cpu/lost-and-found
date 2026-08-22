import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, SlidersHorizontal, Layers, Sparkles, AlertCircle, Plus, Map as MapIcon } from 'lucide-react';
import { categories } from '../data/mockItems';
import { getHeatmapData } from '../services/heatmapService';

// Helper component to center map smoothly
function MapViewUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function Heatmap() {
  const [typeFilter, setTypeFilter] = useState('both');
  const [timeframe, setTimeframe] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [data, setData] = useState({ hotspots: [], totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getHeatmapData({
      type: typeFilter,
      timeframe,
      category: categoryFilter,
    })
      .then(res => setData(res || { hotspots: [], totalItems: 0 }))
      .finally(() => setIsLoading(false));
  }, [typeFilter, timeframe, categoryFilter]);

  const defaultCenter = [12.9716, 77.5946];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
              <MapPin size={18} />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Activity Heatmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Anonymized clusters showing geographic zones where items are frequently reported lost and found.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
          <span>{data.totalItems} Active Reports</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Type filter">
          {[
            { id: 'both', label: 'All Activity' },
            { id: 'lost', label: 'Lost Items' },
            { id: 'found', label: 'Found Items' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                typeFilter === t.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-400">Timeframe:</span>
          {['24h', '7d', '30d'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium uppercase transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real Data Empty State Check */}
      {data.totalItems === 0 && !isLoading ? (
        <div className="text-center py-20 bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 max-w-md mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <MapIcon size={22} />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No activity data available yet.
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 mb-6 leading-relaxed">
            Geographic activity clusters will appear once lost and found items are reported in your area.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <Plus size={14} />
            Report First Item
          </Link>
        </div>
      ) : (
        /* Map & Cluster Breakdown Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaflet Map Box */}
          <div className="lg:col-span-2 h-[500px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
            <MapContainer
              center={defaultCenter}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapViewUpdater center={selectedHotspot ? [selectedHotspot.lat, selectedHotspot.lng] : defaultCenter} />

              {data.hotspots.map((spot, idx) => {
                const radius = Math.min(Math.max(spot.totalCount * 6, 18), 45);
                const color = spot.lostCount > spot.foundCount ? '#ea580c' : '#059669';

                return (
                  <CircleMarker
                    key={idx}
                    center={[spot.lat, spot.lng]}
                    radius={radius}
                    pathOptions={{
                      fillColor: color,
                      fillOpacity: 0.6,
                      color: color,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => setSelectedHotspot(spot),
                    }}
                  >
                    <Popup>
                      <div className="p-3 text-xs flex flex-col gap-1 min-w-[180px]">
                        <h4 className="font-bold text-zinc-900 text-sm">{spot.areaName}</h4>
                        <div className="flex items-center gap-3 pt-1 border-t border-zinc-200 mt-1">
                          <span className="text-amber-700 font-semibold">{spot.lostCount} Lost</span>
                          <span className="text-emerald-700 font-semibold">{spot.foundCount} Found</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          {spot.totalCount} Total Incident Reports
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Activity Area Clusters List */}
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-sm overflow-y-auto max-h-[500px]">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Activity Hotspots
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Click an area to center on map
              </p>
            </div>

            <div className="space-y-3">
              {data.hotspots.map((spot, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedHotspot(spot)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedHotspot?.areaName === spot.areaName
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900'
                      : 'border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {spot.areaName}
                    </h4>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {spot.totalCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs mb-2">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {spot.lostCount} lost reports
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {spot.foundCount} found reports
                    </span>
                  </div>

                  {spot.recentItems && spot.recentItems.length > 0 && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Recent: </span>
                      {spot.recentItems.map(i => i.title).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

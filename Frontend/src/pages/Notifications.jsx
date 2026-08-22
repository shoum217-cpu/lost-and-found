import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Sparkles, ShieldAlert, CheckCircle2, ArrowRight, CheckCheck } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllRead } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getNotifications(token).then(res => {
      if (res) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    });
  }, [token]);

  const handleMarkAll = async () => {
    await markAllRead(token);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleItemClick = (id) => {
    markNotificationRead(id, token);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time updates regarding AI matches and ownership verifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <Bell size={32} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs text-zinc-400">No notifications at this moment.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif._id}
              onClick={() => handleItemClick(notif._id)}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                !notif.isRead
                  ? 'bg-zinc-50/90 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-700'
                  : 'bg-white dark:bg-[#121215] border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shrink-0 mt-0.5">
                {notif.type === 'MATCH_FOUND' ? (
                  <Sparkles size={18} className="text-amber-500" />
                ) : notif.type === 'VERIFICATION_REQUESTED' ? (
                  <ShieldAlert size={18} className="text-amber-600" />
                ) : (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <Link
                    to={notif.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline mt-3"
                  >
                    View Details
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

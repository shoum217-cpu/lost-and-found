const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getNotifications(token) {
  if (!token) {
    return { notifications: [], unreadCount: 0 };
  }

  try {
    const res = await fetch(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  let local = [];
  try {
    const saved = localStorage.getItem('findit_real_notifications');
    if (saved) local = JSON.parse(saved);
  } catch (e) {}

  return {
    notifications: local,
    unreadCount: local.filter(n => !n.isRead).length,
  };
}

export async function markNotificationRead(id, token) {
  try {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  try {
    const saved = localStorage.getItem('findit_real_notifications');
    if (saved) {
      let local = JSON.parse(saved);
      local = local.map(n => n._id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('findit_real_notifications', JSON.stringify(local));
    }
  } catch (e) {}
}

export async function markAllRead(token) {
  try {
    await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {}

  try {
    const saved = localStorage.getItem('findit_real_notifications');
    if (saved) {
      let local = JSON.parse(saved);
      local = local.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('findit_real_notifications', JSON.stringify(local));
    }
  } catch (e) {}

  return { success: true };
}

import { fetchApi, USE_MOCK_DATA } from './api';
import { REALTIME_ALERTS } from './mockData';

export async function getNotificationsList() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/notifications');
    if (res.success && res.data) return res.data;
  }

  return {
    unreadCount: 8,
    criticalCount: 2,
    aiInsightsCount: 4,
    resolvedCount: 16,
    alerts: REALTIME_ALERTS
  };
}

export async function markAsRead(id) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi(`/notifications/${id}/read`, { method: 'PUT' });
    if (res.success) return res.data;
  }
  return { success: true, message: `Notification ${id} marked as read.` };
}

export async function takeNotificationAction(id, actionName) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi(`/notifications/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action: actionName })
    });
    if (res.success) return res.data;
  }
  return { success: true, message: `Action '${actionName}' executed successfully for notification ${id}.` };
}

export async function getNotificationPreferences() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/notifications/preferences');
    if (res.success && res.data) return res.data;
  }

  return {
    demandAlerts: true,
    wasteAlerts: true,
    shortageAlerts: true,
    weatherAlerts: true,
    dailyAiBriefing: true,
    predictionUpdates: true,
    channels: { dashboard: true, email: true, browser: false }
  };
}

export async function updateNotificationPreferences(prefs) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs)
    });
    if (res.success) return res.data;
  }
  return { success: true, message: "Notification preferences updated.", prefs };
}

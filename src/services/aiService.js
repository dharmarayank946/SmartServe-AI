import { fetchApi, USE_MOCK_DATA } from './api';
import { INITIAL_AI_INSIGHTS } from './mockData';

export async function getAiInsights() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/ai/insights');
    if (res.success && res.data) return res.data;
  }
  return INITIAL_AI_INSIGHTS;
}

export async function postAiChat(message) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: message })
    });
    if (res.success && res.data) return res.data;
  }

  const query = message.toLowerCase();
  let reply = "SmartServe AI Copilot: Analysis complete. All ML prediction models are operational with 94.2% precision.";
  
  if (query.includes('biryani') || query.includes('veg')) {
    reply = "Veg Biryani demand prediction for today is 85 portions (+12% surge expected due to Friday evening footfall). SmartServe recommends preparing 90 portions in 2 batches (60 at 11:30 AM, 30 at 6:30 PM).";
  } else if (query.includes('waste') || query.includes('reduce')) {
    reply = "Your current food waste rate is 4.2% (49 portions today). Over-preparation of Fresh Salad is responsible for 40% of waste. Reducing salad batch prep will recover ~₹4,800 this week.";
  } else if (query.includes('weather') || query.includes('rain')) {
    reply = "Rain probability is 78% for this afternoon. AI model forecasts a -22% decrease in Cold Beverage demand and a +14% increase in hot meals and Biryani orders.";
  }

  return { reply, confidence: 96, timestamp: new Date().toLocaleTimeString() };
}

export async function getTodayAiBriefing() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/ai/briefing');
    if (res.success && res.data) return res.data;
  }

  return {
    summaryHeader: "3 important items require your attention today:",
    points: [
      "Demand expected to peak between 7:00 PM – 9:00 PM (Veg Biryani +18%).",
      "Paneer Curry has elevated over-prep waste risk (+14%).",
      "Current kitchen capacity (120 seats) is sufficient for today's expected 540 orders."
    ]
  };
}

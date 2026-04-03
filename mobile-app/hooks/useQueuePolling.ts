import { useState, useEffect, useRef } from 'react';

// URL for testing on Android Emulator (10.0.2.2 usually maps to localhost on host machine)
// For iOS Simulator, use localhost or your local IP address.
const API_URL = 'http://10.0.2.2:5000/api/queue/status';

export function useQueuePolling(token: string | null, intervalMs: number = 3000) {
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setQueueStatus(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch queue status');
      }
    } catch (err) {
      console.error('Polling error:', err);
      // Don't show network errors as aggressively during short polling to avoid UI flicker
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Start polling
    const intervalId = setInterval(fetchStatus, intervalMs);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [token, intervalMs]);

  return { queueStatus, loading, error, manualRefresh: fetchStatus };
}

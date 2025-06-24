
import { useState, useEffect } from 'react';
import { getInterviewSettings, InterviewSettings } from '../lib/interviewSettingsService';

export const useInterviewSettings = () => {
  const [settings, setSettings] = useState<InterviewSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const interviewSettings = await getInterviewSettings();
        setSettings(interviewSettings);
      } catch (err) {
        console.error('Error fetching interview settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch interview settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error
  };
};

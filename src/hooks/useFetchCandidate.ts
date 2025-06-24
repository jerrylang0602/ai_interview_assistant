
import { useState, useCallback, useRef } from 'react';
import { getCandidateByZohoId, type CandidateRecord } from '../lib/candidateService';

export const useFetchCandidate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<CandidateRecord | null>(null);
  const fetchedZohoIds = useRef<Set<string>>(new Set());
  const currentFetch = useRef<Promise<CandidateRecord | null> | null>(null);

  const fetchCandidate = useCallback(async (zohoId: string) => {
    // If we've already fetched this candidate, don't fetch again
    if (fetchedZohoIds.current.has(zohoId)) {
      console.log('Candidate already fetched for zoho_id:', zohoId);
      return candidate;
    }

    // If there's already a fetch in progress for this zoho_id, return that promise
    if (currentFetch.current) {
      console.log('Fetch already in progress, waiting for result...');
      return currentFetch.current;
    }

    setLoading(true);
    setError(null);
    setCandidate(null);

    // Create the fetch promise
    currentFetch.current = (async () => {
      try {
        console.log('Fetching candidate from database for zoho_id:', zohoId);
        const existingCandidate = await getCandidateByZohoId(zohoId);
        
        if (existingCandidate) {
          console.log('Candidate found in database:', existingCandidate);
          setCandidate(existingCandidate);
          fetchedZohoIds.current.add(zohoId);
          return existingCandidate;
        } else {
          console.log('No candidate found with zoho_id:', zohoId);
          setError('Candidate not found');
          return null;
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch candidate';
        setError(errorMessage);
        console.error('Error fetching candidate:', err);
        throw err;
      } finally {
        setLoading(false);
        currentFetch.current = null;
      }
    })();

    return currentFetch.current;
  }, [candidate]);

  return {
    loading,
    error,
    candidate,
    fetchCandidate
  };
};

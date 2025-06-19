export const getZohoIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
};

// Keep the old function for backward compatibility
export const getCandidateIdFromUrl = (): string | null => {
  return getZohoIdFromUrl();
};

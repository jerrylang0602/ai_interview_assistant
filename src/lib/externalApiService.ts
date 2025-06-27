
// Service for calling external API endpoints
export const updateCandidateStatusExternal = async (
  zohoId: string,
  status: 'in_progress' | 'passed' | 'failed',
  additionalData?: any
): Promise<void> => {
  try {
    console.log(`Calling external API to update candidate status to ${status} for zoho_id:`, zohoId);
    
    const payload = {
      zoho_id: zohoId,
      ai_interview_result: status,
      ...additionalData
    };

    const response = await fetch('https://msp-interview-assistant.vercel.app/api/candidates/update-by-zoho', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`External API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('External API update successful:', result);
  } catch (error) {
    console.error('Error calling external API:', error);
    // Don't throw the error to avoid blocking the main flow
    // Just log it for debugging purposes
  }
};

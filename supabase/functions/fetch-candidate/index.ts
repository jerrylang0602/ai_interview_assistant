
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { zoho_id } = await req.json()
    
    if (!zoho_id) {
      return new Response(
        JSON.stringify({ error: 'zoho_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Zoho API credentials
    const client_id = "1000.98MBYKQCGVS4E80X765CUI9P4J8STH";
    const client_secret = "b08ff6e5048611fe20451d244b6a01e4cb3cc6e325";
    const refresh_token = "1000.aa48ea2a091c41a1124aa9660a20718f.725d89b4ae4de3455b57ff1b0d1fd2ea";

    // Step 1: Get the access token using refresh token
    async function getAccessToken() {
      const tokenURL = 'https://accounts.zoho.com/oauth/v2/token';
      const params = new URLSearchParams({
        refresh_token,
        client_id,
        client_secret,
        grant_type: 'refresh_token'
      });

      const response = await fetch(tokenURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    }

    // Step 2: Get candidate data from Zoho
    const access_token = await getAccessToken();
    
    const candidateResponse = await fetch(`https://recruit.zoho.com/recruit/v2/Candidates/${zoho_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!candidateResponse.ok) {
      throw new Error(`Failed to fetch candidate: ${candidateResponse.statusText}`);
    }

    const candidateData = await candidateResponse.json();
    console.log('Candidate data from Zoho:', candidateData);

    if (!candidateData.data || candidateData.data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Candidate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const candidate = candidateData.data[0];

    // Step 3: Map Zoho data to our Supabase structure matching your specified data structure
    const candidateRecord = {
      zoho_id: String(zoho_id),
      candidate_id: candidate.id ? String(candidate.id) : null,
      first_name: candidate.First_Name || null,
      last_name: candidate.Last_Name || null,
      full_name: candidate.Full_Name || `${candidate.First_Name || ''} ${candidate.Last_Name || ''}`.trim() || null,
      email: candidate.Email || null,
      mobile: candidate.Mobile || null,
      alternate_mobile: candidate.Alternate_Mobile || null,
      city: candidate.City || null,
      state: candidate.State || null,
      province: candidate.Province || null,
      zip_code: candidate.Zip_Code || null,
      street: candidate.Street || null,
      country: candidate.Country || null,
      sa_id_number: candidate.SA_ID_Number || null,
      salutation: candidate.Salutation || null,
      current_job_title: candidate.Current_Job_Title || null,
      title_position: candidate.Title_Position || null,
      current_employer: candidate.Current_Employer || null,
      // Use Current_Employment_Status_2 as priority, fallback to Current_Employment_Status
      current_employment_status: candidate.Current_Employment_Status_2 || candidate.Current_Employment_Status || null,
      experience_in_years: candidate.Experience_in_Years ? parseInt(candidate.Experience_in_Years) : null,
      notice_period_days: candidate.Notice_Period_Days ? parseInt(candidate.Notice_Period_Days) : null,
      current_salary_zar: candidate.Current_Salary_ZAR ? parseFloat(candidate.Current_Salary_ZAR) : null,
      desired_salary_zar: candidate.Desired_Salary_ZAR ? parseFloat(candidate.Desired_Salary_ZAR) : null,
      monthly_rate: candidate.Monthly_Rate ? parseFloat(candidate.Monthly_Rate) : null,
      candidate_status: candidate.Candidate_Status || null,
      candidate_stage: candidate.Candidate_Stage || null,
      scaled_level: candidate.Scaled_Level || null,
      origin: candidate.Origin || null,
      source: candidate.Source || null,
      skill_set: candidate.Skill_Set || null,
      level_2_strengths: candidate.Level_2_Strengths || null,
      level_3_skills: candidate.Level_3_Skills || null,
      role_interest: candidate.Role_Interest || null,
      how_did_you_hear_about_us: candidate.How_did_you_hear_about_us || null,
      linkedin_profile: candidate.LinkedIn_Profile || null,
      introduction_video_link: candidate.Introduction_Video_Link || null,
      referral: candidate.Referral || null,
      rating: candidate.Rating ? parseFloat(candidate.Rating) : null,
      is_unqualified: candidate.Is_Unqualified === 'true' || candidate.Is_Unqualified === true,
      is_locked: candidate.Is_Locked === 'true' || candidate.Is_Locked === true,
      fresh_candidate: candidate.Fresh_Candidate === 'true' || candidate.Fresh_Candidate === true,
      email_opt_out: candidate.Email_Opt_Out === 'true' || candidate.Email_Opt_Out === true,
      is_attachment_present: candidate.Is_Attachment_Present === 'true' || candidate.Is_Attachment_Present === true,
      no_of_applications: candidate.No_of_Applications ? parseInt(candidate.No_of_Applications) : 0,
      active_stage: candidate.Active_Stage ? (Array.isArray(candidate.Active_Stage) ? candidate.Active_Stage : [candidate.Active_Stage]) : null,
      associated_tags: candidate.Associated_Tags ? (Array.isArray(candidate.Associated_Tags) ? candidate.Associated_Tags : [candidate.Associated_Tags]) : null,
      career_page_invite_status: candidate.Career_Page_Invite_Status || null,
      candidate_owner_name: candidate.Candidate_Owner?.name || null,
      candidate_owner_id: candidate.Candidate_Owner?.id || null,
      created_by_name: candidate.Created_By?.name || null,
      created_by_id: candidate.Created_By?.id || null,
      created_time: candidate.Created_Time ? new Date(candidate.Created_Time).toISOString() : null,
      updated_on: candidate.Modified_Time ? new Date(candidate.Modified_Time).toISOString() : null,
      last_activity_time: candidate.Last_Activity_Time ? new Date(candidate.Last_Activity_Time).toISOString() : null,
      last_mailed_time: candidate.Last_Mailed_Time ? new Date(candidate.Last_Mailed_Time).toISOString() : null,
    };

    console.log('Mapped candidate record:', candidateRecord);

    // Step 4: Save to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if candidate already exists
    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('zoho_id', String(zoho_id))
      .single()

    let result;
    if (existingCandidate) {
      // Update existing candidate
      const { data, error } = await supabase
        .from('candidates')
        .update(candidateRecord)
        .eq('zoho_id', String(zoho_id))
        .select()
        .single()

      if (error) {
        console.error('Error updating candidate:', error)
        throw error
      }
      result = { action: 'updated', candidate: data }
    } else {
      // Insert new candidate
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateRecord])
        .select()
        .single()

      if (error) {
        console.error('Error inserting candidate:', error)
        throw error
      }
      result = { action: 'created', candidate: data }
    }

    console.log(`Candidate ${result.action} successfully:`, result.candidate)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Candidate ${result.action} successfully`,
        data: result.candidate
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in fetch-candidate function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

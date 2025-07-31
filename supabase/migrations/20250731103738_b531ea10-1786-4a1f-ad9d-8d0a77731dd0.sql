-- Drop existing policy that requires authentication
DROP POLICY IF EXISTS "interview_settings_auth_policy" ON interview_settings;

-- Create new policy that allows public read access to interview settings
CREATE POLICY "Allow public read access to interview settings" 
ON interview_settings 
FOR SELECT 
USING (true);

-- Create policy for admin management (if needed for admin panel)
CREATE POLICY "Admin users can manage interview settings" 
ON interview_settings 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());
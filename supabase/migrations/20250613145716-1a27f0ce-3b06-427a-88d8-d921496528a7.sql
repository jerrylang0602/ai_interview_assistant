
-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY categories_auth_policy ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for anonymous users (read-only)
CREATE POLICY categories_anon_policy ON categories
  FOR SELECT
  TO anon
  USING (true);

-- Insert default categories if table is empty
INSERT INTO categories (id, name)
SELECT 'office-365-migration', 'Office 365 Migration'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'office-365-migration');

INSERT INTO categories (id, name)
SELECT 'azure-administration', 'Azure Administration'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'azure-administration');

INSERT INTO categories (id, name)
SELECT 'intune-deployment', 'Intune Deployment'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'intune-deployment');

INSERT INTO categories (id, name)
SELECT 'windows-server-administration', 'Windows Server Administration'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'windows-server-administration');

INSERT INTO categories (id, name)
SELECT 'virtualization-cloud-infrastructure', 'Virtualization & Cloud Infrastructure'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'virtualization-cloud-infrastructure');

INSERT INTO categories (id, name)
SELECT 'security-practices', 'Security Practices'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'security-practices');

INSERT INTO categories (id, name)
SELECT 'collaboration', 'Collaboration'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'collaboration');

INSERT INTO categories (id, name)
SELECT 'documentation', 'Documentation'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'documentation');

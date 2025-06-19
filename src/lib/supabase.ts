
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uzvzyogpqvumqerbgtdf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnp5b2dwcXZ1bXFlcmJndGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjEzNjQsImV4cCI6MjA2NTMzNzM2NH0.ROcDSrhtTqY0x2GNz9-zAsGlpoS9pNaRerXlx1BB1E0'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnp5b2dwcXZ1bXFlcmJndGRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc2MTM2NCwiZXhwIjoyMDY1MzM3MzY0fQ.g6KKSyf2xnqBJhP9GBUo5JJFcZuOjya-h3v0gmTg-zo'

// Regular client for read operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://irrxftnykslhxmswvjwv.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycnhmdG55a3NsaHhtc3d2and2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzQ0NzIsImV4cCI6MjA4MjYxMDQ3Mn0.YUM2sELh9LLeI_iF6MKBCHTFz14soGrhY-91xmWj20Y'

// export const supabase = createClient(supabaseUrl, supabaseKey)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
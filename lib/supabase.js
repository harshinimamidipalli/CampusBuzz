import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://peguafxxfrkxgouqobly.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZ3VhZnh4ZnJreGdvdXFvYmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjI4NzksImV4cCI6MjA3Nzk5ODg3OX0.zc-2CcUJQoMv-FG7sK3RRHoknOhc_ji25boPp1k6q1k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

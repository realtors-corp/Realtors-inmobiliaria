import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://oaudcpisyjsikibfxqyf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Gw5mNEvIAol3w9ezbmi4-A_-4Xw0M2g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

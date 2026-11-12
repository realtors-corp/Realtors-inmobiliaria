import { createClient } from
  'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL =
  'https://oaudcpisyjsikibfxqyf.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'TU_PUBLISHABLE_KEY';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

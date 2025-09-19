import { SUPABASE } from '@/shared/symbols';
import { createClient } from '@supabase/supabase-js';

export const SupabaseProvider = {
  provide: SUPABASE,
  useFactory: () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL ou KEY não configurados');
    }

    const client = createClient(supabaseUrl, supabaseKey);
    return client;
  },
};

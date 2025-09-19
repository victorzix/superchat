import { Module } from '@nestjs/common';
import { SupabaseProvider } from '@/providers/supabase/supabase.provider';

@Module({
  providers: [SupabaseProvider],
  exports: [SupabaseProvider],
})
export class SupabaseModule {}

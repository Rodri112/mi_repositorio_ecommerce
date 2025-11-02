// lib/supabase/server.ts - Versión SIMPLE y FUNCIONAL

// Importamos solo el cliente base
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ⚠️ Ya no es asíncrona ni usa cookies. Se usa SOLO para leer datos públicos.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
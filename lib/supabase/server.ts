// lib/supabase/server.ts - Versión Final y Funcional

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // CORRECCIÓN CLAVE: El método get ahora usa el objeto cookieStore directamente.
        get(name: string) {
          // Acceder a la cookie por su nombre y obtener su valor.
          return cookieStore.get(name)?.value
        },
        
        // El set y remove son necesarios para que el cliente de Supabase funcione,
        // pero deben estar dentro de un bloque try...catch para evitar errores 
        // en Server Components que no pueden modificar encabezados después de renderizar.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El Server Component no puede llamar a 'set', ignoramos el error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El Server Component no puede llamar a 'set', ignoramos el error
          }
        },
      },
    }
  )
}
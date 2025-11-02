// lib/supabase/server.ts - VERSIÓN CORREGIDA

import { createServerClient } from '@supabase/ssr'
// ⚠️ Importamos cookies y headers de Next.js
import { cookies, headers } from 'next/headers' 

// Hacemos que la función sea async, aunque la llamaremos sin 'await'
export async function createClient() {
  const cookieStore = cookies()
  const headerStore = headers()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // La función get debe acceder al método 'get' del cookieStore
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Los métodos set y remove ya no son necesarios aquí si el cliente se usa
        // solo para leer datos en un Server Component. Los quitaremos para evitar errores.
      },
      // Añadimos el encabezado para el manejo de sesiones en el servidor
      global: {
        headers: headerStore
      }
    }
  )
}
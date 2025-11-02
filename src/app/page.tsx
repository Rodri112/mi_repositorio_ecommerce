// src/app/page.tsx - Versión Final para Prueba

import { createClient } from '@/lib/supabase/server'; // Importa el cliente simple

export default async function HomePage() {
  // 1. Conecta con Supabase (¡SIN 'await' al crear la instancia!)
  const supabase = createClient(); 

  const { data: roles, error } = await supabase
    .from('roles') // Pide la lista de roles a Supabase
    .select('*');

  if (error) {
    console.error('Error de conexión:', error);
    // Este error SÍ indicaría un problema con RLS o tabla.
    return <div className="p-10 text-red-500">Error: {error.message}. Conexión fallida.</div>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-600">✅ Conexión Supabase Exitosa</h1>
      
      {/* Muestra los roles obtenidos */}
      {roles && roles.length > 0 ? (
        <>
          <p className="text-lg mb-4">Roles de usuario obtenidos (Prueba superada):</p>
          <ul className="list-disc list-inside">
            {roles.map((role) => (
              <li key={role.id} className="text-gray-700">
                ID: {role.id} - Nombre: **{role.nombre}**
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-red-500">No se encontraron roles.</p>
      )}

    </div>
  );
}
// src/app/page.tsx

import { createClient } from '@/lib/supabase/server'; // Llama a tu archivo de conexión segura

export default async function HomePage() {
  // 1. Conecta con Supabase y obtén los roles (admin, cliente)
  const supabase = await createClient();
  const { data: roles, error } = await supabase
    .from('roles') // Pide la lista de roles a Supabase
    .select('*');

  if (error) {
    // Muestra un error si falla la conexión
    console.error('Error de conexión:', error);
    return <div className="p-10 text-red-500">Error: {error.message}. Revisa tus claves en .env.local.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-600">✅ Conexión Supabase Exitosa</h1>

      {/* 2. Muestra los roles obtenidos */}
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
        <p className="text-red-500">No se encontraron roles. (Asegúrate de que 'admin' y 'cliente' estén insertados en el Dashboard).</p>
      )}

    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testSupabaseConnection } from '@/lib/testSupabase';

export function SupabaseTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleTest = async () => {
    setTesting(true);
    setResult('Probando conexión...');

    try {
      const success = await testSupabaseConnection();
      setResult(success ? '✅ Conexión exitosa' : '❌ Error de conexión');
    } catch (error) {
      setResult('❌ Error: ' + JSON.stringify(error));
    } finally {
      setTesting(false);
    }
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleTest}
        disabled={testing}
        size="sm"
        variant="outline"
      >
        {testing ? 'Probando...' : 'Test Supabase'}
      </Button>
      {result && (
        <div className="mt-2 p-2 bg-background border rounded text-xs max-w-xs">
          {result}
        </div>
      )}
    </div>
  );
}
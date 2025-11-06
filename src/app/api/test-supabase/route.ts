import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Ejecutando test de Supabase desde API...');

    // Test 1: Conexión básica
    const { error: connectionError } = await supabase
      .from('laser_materials')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: connectionError
      });
    }

    console.log('✅ Conexión exitosa');

    // Test 2: Obtener material para test
    const { data: matList, error: matError } = await supabase
      .from('laser_materials')
      .select('id')
      .limit(1);

    if (matError || !matList || matList.length === 0) {
      console.error('❌ No materials found');
      return NextResponse.json({
        success: false,
        error: 'No materials found',
        details: matError
      });
    }

    const realMaterialId = matList[0].id;
    console.log('📋 Usando material ID:', realMaterialId);

    // Test 3: Intentar inserción
    const testData = {
      material_id: realMaterialId,
      piece_width: 10,
      piece_height: 10,
      quantity: 1,
      cutting_minutes: 1,
      requires_assembly: false,
      assembly_cost_per_piece: 0,
      cutting_rate_per_minute: 8,
      sheets_needed: 1,
      material_cost: 10,
      cutting_cost: 8,
      assembly_cost: 0,
      subtotal: 18,
      iva: 2.88,
      total: 20.88,
    };

    console.log('📝 Intentando insertar:', testData);

    const { data: insertResult, error: insertError } = await supabase
      .from('laser_quotes')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error de inserción:', insertError);
      console.error('Tipo de error:', typeof insertError);
      console.error('Keys del error:', Object.keys(insertError));

      // Mostrar todas las propiedades del error
      const errorDetails: Record<string, unknown> = {};
      for (const key of Object.keys(insertError)) {
        errorDetails[key] = (insertError as unknown as Record<string, unknown>)[key];
      }

      return NextResponse.json({
        success: false,
        error: 'Insert failed',
        errorType: typeof insertError,
        errorKeys: Object.keys(insertError),
        errorDetails,
        fullError: JSON.stringify(insertError, null, 2)
      });
    }

    console.log('✅ Inserción exitosa:', insertResult);

    // Limpiar datos de prueba
    await supabase.from('laser_quotes').delete().eq('id', insertResult.id);
    console.log('🧹 Datos de prueba limpiados');

    return NextResponse.json({
      success: true,
      message: 'All tests passed!',
      connection: 'OK',
      insert: 'OK',
      cleanup: 'OK'
    });

  } catch (exception) {
    console.error('💥 Excepción no manejada:', exception);
    return NextResponse.json({
      success: false,
      error: 'Exception occurred',
      exception: String(exception)
    });
  }
}
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');

    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('laser_materials')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return false;
    }

    console.log('✅ Connection successful');

    // Test 2: Check if tables exist
    const { data: materials, error: materialsError } = await supabase
      .from('laser_materials')
      .select('*')
      .limit(1);

    if (materialsError) {
      console.error('Materials table error:', materialsError);
    } else {
      console.log('✅ Materials table exists, sample data:', materials);
    }

    const { data: quotes, error: quotesError } = await supabase
      .from('laser_quotes')
      .select('*')
      .limit(1);

    if (quotesError) {
      console.error('Quotes table error:', quotesError);
    } else {
      console.log('✅ Quotes table exists, sample data:', quotes);
    }

    const { data: settings, error: settingsError } = await supabase
      .from('laser_settings')
      .select('*');

    if (settingsError) {
      console.error('Settings table error:', settingsError);
    } else {
      console.log('✅ Settings table exists, data:', settings);
    }

    // Test insert (try to insert a test quote with real material_id)
    console.log('Testing insert operation...');

    // First get a real material ID
    const { data: matList, error: matError } = await supabase
      .from('laser_materials')
      .select('id')
      .limit(1);

    if (matError || !matList || matList.length === 0) {
      console.error('❌ No materials found for testing');
      return false;
    }

    const realMaterialId = matList[0].id;
    console.log('Using material ID:', realMaterialId);

    const testQuote = {
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

    console.log('Attempting insert with:', testQuote);

    const { data: insertResult, error: insertError } = await supabase
      .from('laser_quotes')
      .insert(testQuote)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      console.error('Error type:', typeof insertError);
      console.error('Error keys:', Object.keys(insertError));
      console.error('Full error object:', JSON.stringify(insertError, null, 2));
    } else {
      console.log('✅ Insert test successful:', insertResult);
      // Clean up test data
      await supabase.from('laser_quotes').delete().eq('id', insertResult.id);
    }

    return true;
  } catch (error) {
    console.error('Supabase test failed:', error);
    return false;
  }
}

// Función para ejecutar desde la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabaseConnection;

  // Función adicional para probar inserción manual
  (window as any).testInsert = async () => {
    console.log('Testing manual insert...');
    try {
      const { data: matList } = await supabase
        .from('laser_materials')
        .select('id')
        .limit(1);

      if (!matList || matList.length === 0) {
        console.error('No materials found');
        return;
      }

      const testData = {
        material_id: matList[0].id,
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

      console.log('Inserting:', testData);

      const { data, error } = await supabase
        .from('laser_quotes')
        .insert(testData)
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        for (const key of Object.keys(error)) {
          console.error(`${key}:`, (error as any)[key]);
        }
      } else {
        console.log('Insert success:', data);
        // Cleanup
        await supabase.from('laser_quotes').delete().eq('id', data.id);
      }
    } catch (e) {
      console.error('Exception:', e);
    }
  };
}
import { supabase } from './supabase';
import { LaserMaterial, LaserQuote, LaserQuoteInput } from '@/types/laser';

// Verificar configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase no configurado correctamente');
  console.error('URL:', supabaseUrl ? '✅' : '❌ Missing');
  console.error('Key:', supabaseKey ? '✅' : '❌ Missing');
}

// Materiales
export async function getActiveMaterials(): Promise<LaserMaterial[]> {
  const { data, error } = await supabase
    .from('laser_materials')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAllMaterials(): Promise<LaserMaterial[]> {
  const { data, error } = await supabase
    .from('laser_materials')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createMaterial(material: Omit<LaserMaterial, 'id' | 'created_at' | 'updated_at'>): Promise<LaserMaterial> {
  const { data, error } = await supabase
    .from('laser_materials')
    .insert(material)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMaterial(id: string, updates: Partial<LaserMaterial>): Promise<LaserMaterial> {
  const { data, error } = await supabase
    .from('laser_materials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await supabase
    .from('laser_materials')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Cotizaciones
export async function createQuote(quote: Omit<LaserQuote, 'id' | 'created_at' | 'material'>): Promise<LaserQuote> {
  console.log('createQuote called with:', quote);

  // Extraer solo los campos que van a la base de datos
  const dbFields = {
    material_id: quote.material_id,
    piece_width: quote.piece_width,
    piece_height: quote.piece_height,
    quantity: quote.quantity,
    cutting_minutes: quote.cutting_minutes,
    requires_assembly: quote.requires_assembly,
    assembly_cost_per_piece: quote.assembly_cost_per_piece,
    cutting_rate_per_minute: quote.cutting_rate_per_minute,
    sheets_needed: quote.sheets_needed,
    material_cost: quote.material_cost,
    cutting_cost: quote.cutting_cost,
    assembly_cost: quote.assembly_cost,
    subtotal: quote.subtotal,
    iva: quote.iva,
    total: quote.total,
  };

  console.log('Inserting fields:', dbFields);

  const { data, error } = await supabase
    .from('laser_quotes')
    .insert(dbFields)
    .select(`
      *,
      material:laser_materials(*)
    `)
    .single();

  if (error) {
    console.error('Supabase error completo:', error);
    console.error('Tipo de error:', typeof error);
    console.error('Keys del error:', Object.keys(error));

    // Intentar acceder a propiedades comunes de error
    if (error.message) console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);

    throw error;
  }

  console.log('Insert successful:', data);
  return data;
}

export async function getQuotes(limit: number = 50): Promise<LaserQuote[]> {
  const { data, error } = await supabase
    .from('laser_quotes')
    .select(`
      *,
      material:laser_materials(*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Configuraciones
export async function getSetting(key: string): Promise<number> {
  const { data, error } = await supabase
    .from('laser_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) throw error;
  return data?.value || 0;
}

export async function updateSetting(key: string, value: number): Promise<void> {
  const { error } = await supabase
    .from('laser_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
}
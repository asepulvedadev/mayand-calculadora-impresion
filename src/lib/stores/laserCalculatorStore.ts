import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LaserCalculatorInput, LaserQuoteResponse, laserCalculatorSchema } from '@/lib/validations/calculator';
import { LaserMaterial } from '@/types/laser';

interface LaserCalculatorState {
  // Estado del formulario
  formData: LaserCalculatorInput;
  errors: Record<string, string>;

  // Estado de materiales
  materials: LaserMaterial[];
  selectedMaterial: LaserMaterial | null;
  materialsLoading: boolean;

  // Estado de la cotización
  quote: LaserQuoteResponse | null;
  isLoading: boolean;

  // Acciones de materiales
  loadMaterials: () => Promise<void>;
  setSelectedMaterial: (material: LaserMaterial | null) => void;

  // Acciones del formulario
  updateFormData: (data: Partial<LaserCalculatorInput>) => void;
  setMaterialId: (materialId: string) => void;
  setPieceWidth: (width: number) => void;
  setPieceHeight: (height: number) => void;
  setQuantity: (quantity: number) => void;
  setCuttingMinutes: (minutes: number) => void;
  setRequiresAssembly: (requires: boolean) => void;
  setAssemblyCostPerPiece: (cost: number) => void;

  // Acciones de validación y cálculo
  validateForm: () => boolean;
  calculateQuote: () => Promise<void>;
  reset: () => void;
}

const initialFormData: LaserCalculatorInput = {
  material_id: '',
  piece_width: 50,
  piece_height: 30,
  quantity: 1,
  cutting_minutes: 5,
  requires_assembly: false,
};

export const useLaserCalculatorStore = create<LaserCalculatorState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      formData: initialFormData,
      errors: {},
      materials: [],
      selectedMaterial: null,
      materialsLoading: false,
      quote: null,
      isLoading: false,

      // Cargar materiales
      loadMaterials: async () => {
        set({ materialsLoading: true });
        try {
          const response = await fetch('/api/laser/materials');
          if (!response.ok) {
            throw new Error('Error al cargar materiales');
          }
          const materials: LaserMaterial[] = await response.json();
          set({ materials, materialsLoading: false });
        } catch (error) {
          console.error('Error loading materials:', error);
          set({ materials: [], materialsLoading: false });
        }
      },

      setSelectedMaterial: (material) => {
        set({ selectedMaterial: material });
        if (material) {
          get().setMaterialId(material.id);
        }
      },

      // Acciones del formulario
      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      setMaterialId: (materialId) => {
        set((state) => ({
          formData: { ...state.formData, material_id: materialId },
        }));
        const { materials } = get();
        const material = materials.find(m => m.id === materialId);
        set({ selectedMaterial: material || null });
      },

      setPieceWidth: (width) => {
        set((state) => ({
          formData: { ...state.formData, piece_width: width },
        }));
      },

      setPieceHeight: (height) => {
        set((state) => ({
          formData: { ...state.formData, piece_height: height },
        }));
      },

      setQuantity: (quantity) => {
        set((state) => ({
          formData: { ...state.formData, quantity },
        }));
      },

      setCuttingMinutes: (minutes) => {
        set((state) => ({
          formData: { ...state.formData, cutting_minutes: minutes },
        }));
      },

      setRequiresAssembly: (requires) => {
        set((state) => ({
          formData: { ...state.formData, requires_assembly: requires },
        }));
      },

      setAssemblyCostPerPiece: (cost) => {
        set((state) => ({
          formData: { ...state.formData, assembly_cost_per_piece: cost },
        }));
      },

      // Validación
      validateForm: () => {
        try {
          laserCalculatorSchema.parse(get().formData);
          set({ errors: {} });
          return true;
        } catch (error) {
          if (error instanceof Error && 'issues' in error) {
            const zodError = error as { issues: Array<{ path: string[]; message: string }> };
            const newErrors: Record<string, string> = {};
            zodError.issues.forEach((issue) => {
              const field = issue.path[0] as string;
              newErrors[field] = issue.message;
            });
            set({ errors: newErrors });
          }
          return false;
        }
      },

      // Cálculo de cotización
      calculateQuote: async () => {
        const { formData, validateForm } = get();

        if (!validateForm()) {
          set({ quote: null });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch('/api/calculations/laser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              cutting_rate_per_minute: 8, // $8 por minuto
              profit_margin: 0.50, // 50% utilidad
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al calcular la cotización');
          }

          const quote: LaserQuoteResponse = await response.json();
          set({ quote, isLoading: false });
        } catch (error) {
          console.error('Error calculating quote:', error);
          set({ quote: null, isLoading: false });
        }
      },

      // Reset
      reset: () => {
        set({
          formData: initialFormData,
          errors: {},
          selectedMaterial: null,
          quote: null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'laser-calculator-store',
    }
  )
);
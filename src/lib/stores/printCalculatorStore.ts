import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PrintCalculatorInput, PrintQuoteResponse, printCalculatorSchema } from '@/lib/validations/calculator';

interface PrintCalculatorState {
  // Estado del formulario
  formData: PrintCalculatorInput;
  errors: Record<string, string>;

  // Estado de la cotización
  quote: PrintQuoteResponse | null;
  isLoading: boolean;

  // Acciones del formulario
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setMaterial: (material: PrintCalculatorInput['material']) => void;
  setIsPromotion: (isPromotion: boolean) => void;
  updateFormData: (data: Partial<PrintCalculatorInput>) => void;

  // Acciones de validación y cálculo
  validateForm: () => boolean;
  calculateQuote: () => Promise<void>;
  reset: () => void;
}

const initialFormData: PrintCalculatorInput = {
  width: 100,
  height: 100,
  material: 'vinil',
  isPromotion: false,
};

export const usePrintCalculatorStore = create<PrintCalculatorState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      formData: initialFormData,
      errors: {},
      quote: null,
      isLoading: false,

      // Acciones del formulario
      setWidth: (width) => {
        set((state) => ({
          formData: { ...state.formData, width },
        }));
        get().calculateQuote();
      },

      setHeight: (height) => {
        set((state) => ({
          formData: { ...state.formData, height },
        }));
        get().calculateQuote();
      },

      setMaterial: (material) => {
        set((state) => ({
          formData: { ...state.formData, material },
        }));
        get().calculateQuote();
      },

      setIsPromotion: (isPromotion) => {
        set((state) => ({
          formData: { ...state.formData, isPromotion },
        }));
        get().calculateQuote();
      },

      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));
      },

      // Validación
      validateForm: () => {
        try {
          printCalculatorSchema.parse(get().formData);
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
          const response = await fetch('/api/calculations/impresion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            throw new Error('Error al calcular la cotización');
          }

          const quote: PrintQuoteResponse = await response.json();
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
          quote: null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'print-calculator-store',
    }
  )
);
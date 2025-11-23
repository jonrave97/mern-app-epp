import { useState, useEffect } from 'react';

interface ValidationRules<T> {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown, allValues: T) => string | undefined;
  };
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => Promise<void>;
  autoClearErrors?: boolean;
  autoClearDelay?: number;
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit,
  autoClearErrors = true,
  autoClearDelay = 5000,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-limpiar errores después del delay especificado
  useEffect(() => {
    if (autoClearErrors && Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, autoClearDelay);

      return () => clearTimeout(timer);
    }
  }, [errors, autoClearErrors, autoClearDelay]);

  const validateField = (field: keyof T, value: unknown): string | undefined => {
    const rules = validationRules[field as string];
    if (!rules) return undefined;

    if (rules.required && !value?.toString().trim()) {
      return `El campo es obligatorio`;
    }

    if (rules.minLength && value?.toString() && value.toString().length < rules.minLength) {
      return `Debe tener al menos ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value?.toString() && value.toString().length > rules.maxLength) {
      return `No puede exceder ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value?.toString() || '')) {
      return `Formato inválido`;
    }

    if (rules.custom) {
      return rules.custom(value, values);
    }

    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field as keyof T, values[field]);
      if (error) {
        newErrors[field as keyof T] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validar campo al perder foco
    const error = validateField(field, values[field]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
    setValues,
  };
};

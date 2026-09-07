import { useCallback, useState } from "react";

export default function useForm(initialValues = {}, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }, []);

  const setFormValues = useCallback((newValues) => {
    setValues((previous) => ({
      ...previous,
      ...newValues,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (typeof validate !== "function") {
      return true;
    }

    const validationErrors = validate(values) || {};

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback(
    async (onSubmit) => {
      const isValid = validateForm();

      if (!isValid) {
        return false;
      }

      setSubmitting(true);

      try {
        await onSubmit(values);
        return true;
      } finally {
        setSubmitting(false);
      }
    },
    [validateForm, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    submitting,

    handleChange,
    setValue,
    setFormValues,

    validateForm,
    handleSubmit,
    resetForm,

    setErrors,
  };
}
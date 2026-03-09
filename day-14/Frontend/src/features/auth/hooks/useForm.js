import { useState } from 'react';

/**
 * Reusable form hook - eliminates duplicated form state management
 * Hooks Layer - Manages form state and change handlers
 */
export function useForm(initialValues) {
    const [formData, setFormData] = useState(initialValues);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData(initialValues);
    };

    return {
        formData,
        handleChange,
        resetForm
    };
}

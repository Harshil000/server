import { useState } from 'react'

const useForm = (initialValues) => {
    const [formValues, setFormValues] = useState(initialValues);

    function handleChange(e) {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return { formValues, handleChange };
}

export default useForm;
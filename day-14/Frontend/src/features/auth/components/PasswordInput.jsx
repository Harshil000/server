import { useState } from 'react';

/**
 * Reusable password input with show/hide toggle
 * UI Layer - Encapsulates repetitive password field logic
 */
const PasswordInput = ({ name, placeholder = "Password", value, onChange, disabled, required = true }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="passContainer">
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            />
            <span className="hide-show" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
            </span>
        </div>
    );
};

export default PasswordInput;

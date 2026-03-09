/**
 * Reusable error message component
 * UI Layer - Pure presentational component
 */
const ErrorMessage = ({ error }) => {
    if (!error) return null;

    return (
        <div className="error-message">
            {error}
        </div>
    );
};

export default ErrorMessage;

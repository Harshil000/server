import { Link , useNavigate } from "react-router";
import useForm from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router";

const Login = () => {

  const navigate = useNavigate();

  const { handleLogin } = useAuth();

  const { formValues, handleChange } = useForm({
    EmailOrUsername: "",
    password: "",
  });

  const error = useSelector(state => state.auth.error);
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = formValues;

    await handleLogin(payload);

    if (!error) {
      navigate("/");
    }
  }

  if (!loading && user) {
    return <Navigate to="/"/>
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Continue to your Perplexity clone account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <p className="auth-error text-red-400">{error}</p>
          )}
          <label className="auth-label">
            Username or Email
            <input
              type="text"
              name="EmailOrUsername"
              value={formValues.EmailOrUsername}
              onChange={handleChange}
              className="auth-input"
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className="auth-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>

        <p className="auth-footnote">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
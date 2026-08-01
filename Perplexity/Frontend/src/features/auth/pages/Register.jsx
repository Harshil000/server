import { Link , useNavigate } from "react-router";
import useForm from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router";

const Register = () => {

  const navigate = useNavigate(); 

  const { handleRegister } = useAuth();

  const { formValues, handleChange } = useForm({
    username: "",
    email: "",
    password: "",
  });

  const error = useSelector(state => state.auth.error);
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);

  if (!loading && user) {
    return <Navigate to="/"/>
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = formValues;

    await handleRegister(payload);

    if (!error) {
      navigate("/login");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join and start searching smarter</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Username
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="auth-input"
              placeholder="johndoe"
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-label">
            Email
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className="auth-input"
              placeholder="you@example.com"
              autoComplete="email"
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
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="auth-submit-btn">
            Register
          </button>
        </form>

        <p className="auth-footnote">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { fetchingUserLogin } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const user = fetchingUserLogin(form);
      console.log(user);

      setError("");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">A</div>

          <h1>Welcome back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register"> Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

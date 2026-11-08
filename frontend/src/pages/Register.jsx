import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">A</div>

          <h1>Create account</h1>
          <p>Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login"> Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

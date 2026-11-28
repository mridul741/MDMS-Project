
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    const success = login(email, password);

    if (!success) {
      setError("Invalid email or password.");
      return;
    }

    const savedUser = JSON.parse(
      localStorage.getItem("mdms-auth-user") || "{}"
    );

    if (savedUser.role === "end-user") {
      navigate("/user/dashboard", { replace: true });
    } else if (savedUser.role === "zone") {
      navigate("/zone/dashboard", { replace: true });
    } else if (savedUser.role === "enterprise") {
      navigate("/enterprise/dashboard", { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">⚡</span>
          <h1>MDMS</h1>
          <p>Meter Data Management System</p>
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <p className="login-footer">
          MDMS · Electricity Management Portal
        </p>
      </div>
    </div>
  );
}

export default Login;

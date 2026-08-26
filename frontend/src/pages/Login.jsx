import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/users/login/", form);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Login failed. Check email/password and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Welcome back</h1>
      <p className="muted">Login to manage your services and wallet.</p>

      <form onSubmit={submit}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={update}
          required
        />

        {message && <div className="error">{message}</div>}

        <button className="primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="muted center">
        New user? <Link to="/register">Create account</Link>
      </p>
    </section>
  );
}

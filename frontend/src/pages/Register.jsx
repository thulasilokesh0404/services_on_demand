import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/users/register/", form);
      navigate("/login");
    } catch (error) {
      const data = error.response?.data;
      setMessage(
        typeof data === "string"
          ? data
          : data
          ? JSON.stringify(data)
          : "Registration failed. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Register as a customer.</p>

      <form onSubmit={submit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={update} required />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
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
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="muted center">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

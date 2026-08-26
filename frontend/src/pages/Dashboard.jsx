import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          "Could not load user details."
        );
      }
    };

    loadUser();
  }, []);

  if (error) return <div className="panel error">{error}</div>;
  if (!user) return <div className="panel">Loading your account...</div>;

  return (
    <div>
      <section className="hero">
        <div>
          <span className="pill">{user.role}</span>
          <h1>Hello, {user.name}</h1>
          <p>{user.email} · {user.phone}</p>
        </div>

        <div className="balance-box">
          <span>Wallet balance</span>
          <strong>₹{Number(user.balance || 0).toFixed(2)}</strong>
        </div>
      </section>

      <section className="grid">
        <Link className="action-card" to="/booking">
          <h3>Book a Service</h3>
          <p>Create a new service booking.</p>
        </Link>

        <Link className="action-card" to="/wallet">
          <h3>Wallet</h3>
          <p>Add or deduct wallet balance.</p>
        </Link>
      </section>
    </div>
  );
}

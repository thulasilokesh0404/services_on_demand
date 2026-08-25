import { useEffect, useState } from "react";
import api from "../api";

export default function Wallet() {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [isDeduction, setIsDeduction] = useState(false);
  const [message, setMessage] = useState("");

  const loadBalance = async () => {
    try {
      const { data } = await api.get("/users/me");
      setBalance(data.balance);
    } catch {
      setMessage("Could not read wallet balance.");
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await api.patch("/users/balance/", {
        amount: Number(amount),
        is_deduction: isDeduction
      });

      setBalance(data.balance);
      setMessage(data.message || "Balance updated.");
      setAmount("");
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        JSON.stringify(error.response?.data || {}) ||
        "Balance update failed."
      );
    }
  };

  return (
    <section className="panel narrow">
      <h1>Wallet</h1>
      <div className="wallet-total">
        ₹{balance === null ? "..." : Number(balance).toFixed(2)}
      </div>

      <form onSubmit={submit}>
        <label>Amount</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Transaction type</label>
        <select
          value={isDeduction ? "deduct" : "add"}
          onChange={(e) => setIsDeduction(e.target.value === "deduct")}
        >
          <option value="add">Add money</option>
          <option value="deduct">Deduct money</option>
        </select>

        {message && <div className="info">{message}</div>}

        <button className="primary">Update Wallet</button>
      </form>
    </section>
  );
}

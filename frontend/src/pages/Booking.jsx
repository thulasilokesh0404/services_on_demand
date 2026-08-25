import { useState } from "react";
import api from "../api";

const initialForm = {
  service_id: "",
  provider_id: "",
  date: "",
  time: "",
  payment_method: "wallet",
  name: "",
  phone: "",
  line1: "",
  city: "",
  pincode: ""
};

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const payload = {
      service_id: Number(form.service_id),
      provider_id: Number(form.provider_id),
      date: form.date,
      time: form.time.length === 5 ? `${form.time}:00` : form.time,
      address: {
        name: form.name,
        phone: form.phone,
        line1: form.line1,
        city: form.city,
        pincode: form.pincode
      },
      payment_method: form.payment_method
    };

    try {
      const { data } = await api.post("/bookings/", payload);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Booking failed. Check backend connection."
      );
    }
  };

  return (
    <section className="panel">
      <h1>Book a Service</h1>
      <p className="muted">
        Enter valid service and provider IDs from your backend database.
      </p>

      <form className="booking-form" onSubmit={submit}>
        <div>
          <label>Service ID</label>
          <input name="service_id" type="number" value={form.service_id} onChange={update} required />
        </div>

        <div>
          <label>Provider ID</label>
          <input name="provider_id" type="number" value={form.provider_id} onChange={update} required />
        </div>

        <div>
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={update} required />
        </div>

        <div>
          <label>Time</label>
          <input name="time" type="time" value={form.time} onChange={update} required />
        </div>

        <div>
          <label>Customer name</label>
          <input name="name" value={form.name} onChange={update} required />
        </div>

        <div>
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={update} required />
        </div>

        <div className="full">
          <label>Address line</label>
          <input name="line1" value={form.line1} onChange={update} required />
        </div>

        <div>
          <label>City</label>
          <input name="city" value={form.city} onChange={update} required />
        </div>

        <div>
          <label>Pincode</label>
          <input name="pincode" value={form.pincode} onChange={update} required />
        </div>

        <div className="full">
          <label>Payment method</label>
          <select name="payment_method" value={form.payment_method} onChange={update}>
            <option value="wallet">Wallet</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div className="full">
          {error && <div className="error">{error}</div>}
          <button className="primary">Confirm Booking</button>
        </div>
      </form>

      {result && (
        <div className="success-card">
          <h2>Booking created</h2>
          <p><b>Booking ID:</b> {result.id}</p>
          <p><b>Service:</b> {result.serviceName || result.serviceId}</p>
          <p><b>Total:</b> ₹{result.total}</p>
          <p><b>Status:</b> {result.status}</p>
          <p><b>Payment:</b> {result.payment_method}</p>
        </div>
      )}
    </section>
  );
}

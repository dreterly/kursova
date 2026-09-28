
import { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";

export function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Вхід:", form);
    alert("Форма входу заповнена!");
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1>Вхід</h1>
        <p className="auth-subtitle">
          Увійдіть до свого облікового запису
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Введіть email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="Введіть пароль"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Увійти
          </button>
        </form>

        <p className="auth-footer">
          Ще немає акаунта?{" "}
          <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </main>
  );
}

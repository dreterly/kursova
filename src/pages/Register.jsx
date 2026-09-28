
import { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";

export function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      alert("Паролі не збігаються!");
      return;
    }

    console.log("Реєстрація:", form);
    alert("Форма реєстрації заповнена!");
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1>Реєстрація</h1>
        <p className="auth-subtitle">
          Створіть новий обліковий запис
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ім'я</label>
            <input
              type="text"
              name="name"
              placeholder="Введіть ім'я"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="form-group">
            <label>Підтвердження пароля</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Повторіть пароль"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Зареєструватися
          </button>
        </form>

        <p className="auth-footer">
          Вже маєте акаунт?{" "}
          <Link to="/login">Увійти</Link>
        </p>
      </div>
    </main>
  );
}
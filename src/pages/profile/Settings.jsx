
import { useState } from "react";
import "./settings.css";

export function Settings() {
  const [form, setForm] = useState({
    name: "Вікторія",
    email: "victoria@example.com",
    phone: "+380 67 123 45 67",
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

    console.log("Збережені налаштування:", form);
    alert("Налаштування збережено!");
  }

  return (
    <main className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <h1>Налаштування</h1>
          <p>Керуйте даними свого облікового запису</p>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Ім'я</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="password-section">
            <h2>Змінити пароль</h2>

            <div className="form-group">
              <label>Новий пароль</label>
              <input
                type="password"
                name="password"
                placeholder="Введіть новий пароль"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="save-settings-button">
            Зберегти
          </button>

        </form>

      </div>
    </main>
  );
}
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Mail,
  Phone,
  Lock,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../../services/usersApi.js";

import "./settings.css";

export function Settings() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setError("Користувач не авторизований");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setError("Не вдалося завантажити дані користувача");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Ім'я та email є обов'язковими");
      return;
    }

    setSaving(true);

    try {
      const data = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const currentUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...currentUser,
        ...data.user,
        phone: form.phone,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setForm((currentForm) => ({
        ...currentForm,
        password: "",
      }));

      setSuccess("Налаштування успішно збережено!");
    } catch (error) {
      console.error(error);
      setError(error.message || "Не вдалося зберегти налаштування");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="settings-page">
        <div className="settings-container">
          <div className="settings-message">
            <div className="settings-loader"></div>
            <p>Завантаження налаштувань...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !form.email) {
    return (
      <main className="settings-page">
        <div className="settings-container">
          <div className="settings-message error">
            <p>{error}</p>

            <button type="button" onClick={() => navigate(-1)}>
              Повернутися назад
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        <button
          type="button"
          className="settings-back-button"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          <ArrowLeft />
          Повернутися назад
        </button>

        <div className="settings-header">
          <div className="settings-title-icon">
            <SettingsIcon />
          </div>

          <div>
            <span className="settings-label">PETFINDER</span>

            <h1>Налаштування</h1>

            <p>Керуйте даними свого облікового запису</p>
          </div>
        </div>

        {error && <div className="settings-alert settings-error">{error}</div>}

        {success && (
          <div className="settings-alert settings-success">{success}</div>
        )}

        <form className="settings-form" onSubmit={handleSubmit}>
          <section className="settings-section">
            <div className="section-heading">
              <div className="section-heading-icon">
                <User />
              </div>

              <div>
                <h2>Особисті дані</h2>
                <p>Основна інформація вашого профілю</p>
              </div>
            </div>

            <div className="settings-fields">
              <div className="form-group">
                <label htmlFor="name">Ім'я</label>

                <div className="input-wrapper">
                  <User />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Введіть ім'я"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <div className="input-wrapper">
                  <Mail />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Введіть email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон</label>

                <div className="input-wrapper">
                  <Phone />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+380..."
                  />
                </div>

                <span className="input-hint">
                  Телефон поки зберігається тільки локально.
                </span>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <div className="section-heading">
              <div className="section-heading-icon">
                <Lock />
              </div>

              <div>
                <h2>Безпека</h2>
                <p>Змініть пароль для захисту акаунта</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Новий пароль</label>

              <div className="input-wrapper">
                <Lock />

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Введіть новий пароль"
                />
              </div>

              <span className="input-hint">
                Залиште поле порожнім, якщо не хочете змінювати пароль.
              </span>
            </div>
          </section>

          <div className="settings-actions">
            <button
              type="button"
              className="cancel-settings-button"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="save-settings-button"
              disabled={saving}
            >
              <Save />
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

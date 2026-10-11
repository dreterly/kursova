import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCog, Save, RefreshCw } from "lucide-react";

import { updateAdminUser } from "../../services/adminUsersApi.js";

import "./editAdminUser.css";

export function EditAdminUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Не вдалося завантажити користувача");
        }

        setUser({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "user",
        });
      } catch (error) {
        console.error(error);

        setError(error.message || "Не вдалося завантажити користувача");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await updateAdminUser(id, user);

      alert("Користувача успішно оновлено");

      navigate("/admin/users");
    } catch (error) {
      console.error(error);

      alert(error.message || "Не вдалося оновити користувача");
    }
  }

  if (loading) {
    return (
      <main className="edit-admin-user">
        <div className="edit-admin-user-state">
          <div className="edit-admin-user-loader"></div>
          <p>Завантаження користувача...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="edit-admin-user">
        <div className="edit-admin-user-container">
          <button
            type="button"
            className="edit-admin-user-back"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft />
            Назад до користувачів
          </button>

          <div className="edit-admin-user-error">
            <div className="edit-admin-user-error-icon">
              <UserCog />
            </div>

            <h2>Не вдалося завантажити користувача</h2>

            <p>{error}</p>

            <button
              type="button"
              className="edit-admin-user-retry"
              onClick={() => window.location.reload()}
            >
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-admin-user">
      <div className="edit-admin-user-container">
        <button
          type="button"
          className="edit-admin-user-back"
          onClick={() => navigate("/admin/users")}
        >
          <ArrowLeft />
          Назад до користувачів
        </button>

        <div className="edit-admin-user-header">
          <div className="edit-admin-user-title-icon">
            <UserCog />
          </div>

          <div>
            <span className="edit-admin-user-label">PETFINDER ADMIN</span>

            <h1>Редагування користувача</h1>

            <p>Зміна інформації про користувача PETFINDER</p>
          </div>
        </div>

        <form className="edit-admin-user-form" onSubmit={handleSubmit}>
          <div className="edit-admin-user-form-header">
            <h2>Дані користувача</h2>

            <span>ID: #{id}</span>
          </div>

          <label>
            <span>Ім'я</span>

            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Введіть ім'я"
              required
            />
          </label>

          <label>
            <span>Email</span>

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Введіть email"
              required
            />
          </label>

          <label>
            <span>Роль</span>

            <select name="role" value={user.role} onChange={handleChange}>
              <option value="user">Користувач</option>

              <option value="admin">Адміністратор</option>
            </select>
          </label>

          <div className="edit-admin-user-buttons">
            <button
              type="button"
              className="cancel-admin-user-button"
              onClick={() => navigate("/admin/users")}
            >
              Скасувати
            </button>

            <button type="submit" className="save-admin-user-button">
              <Save />
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

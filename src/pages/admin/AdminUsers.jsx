import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Users, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { deleteAdminUser } from "../../services/adminUsersApi.js";

import "./adminUsers.css";

export function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не вдалося завантажити користувачів");
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Сталася помилка під час завантаження");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Ви дійсно хочете видалити цього користувача?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(id);

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));

      alert("Користувача видалено");
    } catch (error) {
      console.error(error);
      alert(error.message || "Не вдалося видалити користувача");
    }
  }

  if (loading) {
    return (
      <main className="admin-users">
        <div className="admin-users-state">
          <div className="admin-users-loader"></div>
          <p>Завантаження користувачів...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-users">
        <div className="admin-users-container">
          <button
            type="button"
            className="admin-users-back-button"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="admin-users-error">
            <div className="admin-users-error-icon">
              <Users />
            </div>

            <h2>Не вдалося завантажити користувачів</h2>

            <p>{error}</p>

            <button
              type="button"
              className="admin-users-retry"
              onClick={loadUsers}
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
    <main className="admin-users">
      <div className="admin-users-container">
        <button
          type="button"
          className="admin-users-back-button"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft />
          Повернутися назад
        </button>

        <div className="admin-users-header">
          <div className="admin-users-title-icon">
            <Users />
          </div>

          <div>
            <span className="admin-users-label">PETFINDER ADMIN</span>

            <h1>Користувачі</h1>

            <p>Перегляд та керування зареєстрованими користувачами</p>
          </div>
        </div>

        <div className="admin-users-count">
          <span>Усього користувачів</span>
          <strong>{users.length}</strong>
        </div>

        {users.length === 0 ? (
          <div className="admin-users-empty">
            <div className="admin-users-empty-icon">
              <Users />
            </div>

            <h2>Користувачів поки немає</h2>

            <p>У системі ще не зареєстровано жодного користувача.</p>
          </div>
        ) : (
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ім'я</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Дата реєстрації</th>
                  <th>Дії</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="user-id">#{user.id}</td>

                    <td>
                      <strong className="user-name">{user.name}</strong>
                    </td>

                    <td className="user-email">{user.email}</td>

                    <td>
                      <span
                        className={`user-role ${
                          user.role === "admin" ? "admin" : "user"
                        }`}
                      >
                        {user.role === "admin" ? "Адміністратор" : "Користувач"}
                      </span>
                    </td>

                    <td className="user-date">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("uk-UA")
                        : "Не вказано"}
                    </td>

                    <td>
                      <div className="admin-users-actions">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="admin-user-edit"
                        >
                          <Pencil />
                          <span>Редагувати</span>
                        </Link>

                        <button
                          type="button"
                          className="admin-user-delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 />
                          <span>Видалити</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

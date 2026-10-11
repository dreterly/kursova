import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  FileText,
  RefreshCw,
} from "lucide-react";

import {
  getAnnouncements,
  deleteAnnouncement,
} from "../../services/announcementsApi.js";

import "./adminAnnouncements.css";

export function AdminAnnouncements() {
  const navigate = useNavigate();

  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnnouncements() {
    try {
      setLoading(true);
      setError("");

      const data = await getAnnouncements();

      setAdminAnnouncements(data);
    } catch (error) {
      console.error(error);

      setError(error.message || "Не вдалося завантажити оголошення");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Ви дійсно хочете видалити це оголошення?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAnnouncement(id);

      setAdminAnnouncements((currentAnnouncements) =>
        currentAnnouncements.filter((announcement) => announcement.id !== id),
      );

      alert("Оголошення видалено");
    } catch (error) {
      console.error(error);

      alert(error.message || "Не вдалося видалити оголошення");
    }
  }

  if (loading) {
    return (
      <main className="admin-announcements">
        <div className="admin-announcements-state">
          <div className="admin-announcements-loader"></div>
          <p>Завантаження оголошень...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-announcements">
        <div className="admin-announcements-container">
          <button
            type="button"
            className="admin-announcements-back"
          onClick={() => navigate("/admin")}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="admin-announcements-error">
            <div className="admin-announcements-error-icon">
              <FileText />
            </div>

            <h2>Не вдалося завантажити оголошення</h2>

            <p>{error}</p>

            <button
              type="button"
              className="admin-announcements-retry"
              onClick={loadAnnouncements}
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
    <main className="admin-announcements">
      <div className="admin-announcements-container">
        <button
          type="button"
          className="admin-announcements-back"
         onClick={() => navigate("/admin")}
        >
          <ArrowLeft />
          Повернутися назад
        </button>

        <div className="admin-announcements-header">
          <div className="admin-announcements-title-icon">
            <FileText />
          </div>

          <div>
            <span className="admin-announcements-label">PETFINDER ADMIN</span>

            <h1>Оголошення</h1>

            <p>Керування оголошеннями PETFINDER</p>
          </div>
        </div>

        <div className="admin-announcements-count">
          <span>Усього оголошень</span>
          <strong>{adminAnnouncements.length}</strong>
        </div>

        {adminAnnouncements.length === 0 ? (
          <div className="admin-announcements-empty">
            <div className="admin-announcements-empty-icon">
              <FileText />
            </div>

            <h2>Оголошень поки немає</h2>

            <p>У системі ще не створено жодного оголошення.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Тварина</th>
                  <th>Тип</th>
                  <th>Місто</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Дії</th>
                </tr>
              </thead>

              <tbody>
                {adminAnnouncements.map((announcement) => (
                  <tr key={announcement.id}>
                    <td className="announcement-id">#{announcement.id}</td>

                    <td>
                      <strong className="announcement-name">
                        {announcement.name || "Невідома тварина"}
                      </strong>
                    </td>

                    <td>
                      <span className={`admin-type ${announcement.type}`}>
                        {announcement.type === "lost"
                          ? "Загублений"
                          : "Знайдений"}
                      </span>
                    </td>

                    <td className="announcement-city">
                      {announcement.city || "Не вказано"}
                    </td>

                    <td className="announcement-date">
                      {announcement.created_at
                        ? new Date(announcement.created_at).toLocaleDateString(
                            "uk-UA",
                          )
                        : "Не вказано"}
                    </td>

                    <td>
                      <span className={`admin-status ${announcement.status}`}>
                        {announcement.status === "active"
                          ? "Активне"
                          : announcement.status === "found"
                            ? "Знайдено"
                            : "Закрите"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/announcements/${announcement.id}`}
                          className="admin-view-button"
                        >
                          <Eye />
                          <span>Переглянути</span>
                        </Link>

                        <Link
                          to={`/admin/announcements/edit/${announcement.id}`}
                          className="admin-edit-button"
                        >
                          <Pencil />
                          <span>Редагувати</span>
                        </Link>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => handleDelete(announcement.id)}
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

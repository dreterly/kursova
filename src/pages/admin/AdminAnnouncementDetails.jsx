import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  MapPin,
  CalendarDays,
  PawPrint,
  Pencil,
  RefreshCw,
} from "lucide-react";

import { getAnnouncements } from "../../services/announcementsApi.js";

import "./adminAnnouncementDetails.css";

export function AdminAnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        setLoading(true);
        setError("");

        const announcements = await getAnnouncements();

        const foundAnnouncement = announcements.find(
          (item) => item.id === Number(id),
        );

        if (!foundAnnouncement) {
          throw new Error("Оголошення не знайдено");
        }

        setAnnouncement(foundAnnouncement);
      } catch (error) {
        console.error(error);

        setError(error.message || "Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <main className="admin-announcement-details">
        <div className="admin-announcement-details-state">
          <div className="admin-announcement-details-loader"></div>
          <p>Завантаження оголошення...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-announcement-details">
        <div className="admin-announcement-details-container">
          <button
            type="button"
            className="admin-announcement-details-back"
            onClick={() => navigate("/admin/announcements")}
          >
            <ArrowLeft />
            Назад до оголошень
          </button>

          <div className="admin-announcement-details-error">
            <FileText />

            <h2>Не вдалося завантажити оголошення</h2>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isLost = announcement.type === "lost";

  return (
    <main className="admin-announcement-details">
      <div className="admin-announcement-details-container">
        <button
          type="button"
          className="admin-announcement-details-back"
          onClick={() => navigate("/admin/announcements")}
        >
          <ArrowLeft />
          Назад до оголошень
        </button>

        <div className="admin-announcement-details-header">
          <div className="admin-announcement-details-title-icon">
            <FileText />
          </div>

          <div>
            <span className="admin-announcement-details-label">
              PETFINDER ADMIN
            </span>

            <h1>Перегляд оголошення</h1>

            <p>Повна інформація про оголошення №{announcement.id}</p>
          </div>
        </div>

        <div className="admin-announcement-details-card">
          <div className="admin-announcement-details-card-top">
            <div>
              <span
                className={`admin-announcement-type ${
                  isLost ? "lost" : "found"
                }`}
              >
                {isLost ? "Загублений" : "Знайдений"}
              </span>

              <h2>{announcement.name || "Без імені"}</h2>
            </div>

            <span
              className={`admin-announcement-status ${announcement.status}`}
            >
              {announcement.status === "active"
                ? "Активне"
                : announcement.status === "found"
                  ? "Знайдено"
                  : "Закрите"}
            </span>
          </div>

          <div className="admin-announcement-details-grid">
            <div className="admin-announcement-info-item">
              <PawPrint />

              <div>
                <span>Тварина</span>
                <strong>{announcement.name || "Не вказано"}</strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <PawPrint />

              <div>
                <span>Вид</span>
                <strong>{announcement.pet_type || "Не вказано"}</strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <MapPin />

              <div>
                <span>Місто</span>
                <strong>{announcement.city || "Не вказано"}</strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <MapPin />

              <div>
                <span>Адреса</span>
                <strong>{announcement.address || "Не вказано"}</strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <CalendarDays />

              <div>
                <span>Дата створення</span>
                <strong>
                  {announcement.created_at
                    ? new Date(announcement.created_at).toLocaleDateString(
                        "uk-UA",
                      )
                    : "Не вказано"}
                </strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <div>
                <span>ID користувача</span>
                <strong>#{announcement.user_id}</strong>
              </div>
            </div>
          </div>

          <div className="admin-announcement-description">
            <h3>Опис оголошення</h3>

            <p>{announcement.description || "Опис не вказано."}</p>
          </div>

          {(announcement.latitude || announcement.longitude) && (
            <div className="admin-announcement-coordinates">
              <h3>Координати</h3>

              <div className="coordinates-list">
                <span>Широта: {announcement.latitude || "—"}</span>

                <span>Довгота: {announcement.longitude || "—"}</span>
              </div>
            </div>
          )}

          <div className="admin-announcement-details-actions">
            <Link
              to={`/admin/announcements/edit/${announcement.id}`}
              className="admin-announcement-edit-button"
            >
              <Pencil />
              Редагувати
            </Link>

            <button
              type="button"
              className="admin-announcement-back-button"
              onClick={() => navigate("/admin/announcements")}
            >
              Назад до списку
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

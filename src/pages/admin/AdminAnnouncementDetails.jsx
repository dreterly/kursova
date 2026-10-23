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
import { getPhotoUrl } from "../../utils/photoUrl.js";

import "./adminAnnouncementDetails.css";

export function AdminAnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncement() {
      try {
        const announcements = await getAnnouncements();

        if (!Array.isArray(announcements)) {
          throw new Error("Некоректні дані від сервера");
        }

        const foundAnnouncement = announcements.find(
          (item) => String(item.id) === String(id),
        );

        if (!foundAnnouncement) {
          throw new Error("Оголошення не знайдено");
        }

        if (!cancelled) {
          setAnnouncement(foundAnnouncement);
          setError("");
          setPhotoError(false);
        }
      } catch (error) {
        console.error("Помилка завантаження оголошення:", error);

        if (!cancelled) {
          setError(error.message || "Не вдалося завантажити оголошення");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnnouncement();

    return () => {
      cancelled = true;
    };
  }, [id, retry]);

  function handleRetry() {
    setLoading(true);
    setError("");
    setAnnouncement(null);
    setPhotoError(false);
    setRetry((current) => current + 1);
  }

  function formatDate(date) {
    if (!date) return "Не вказано";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Не вказано";
    }

    return parsedDate.toLocaleDateString("uk-UA");
  }

  if (loading) {
    return (
      <main className="admin-announcement-details">
        <div className="admin-announcement-details-state">
          <div className="admin-announcement-details-loader" />
          <p>Завантаження оголошення...</p>
        </div>
      </main>
    );
  }

  if (error || !announcement) {
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

            <p>{error || "Оголошення не знайдено"}</p>

            <button type="button" onClick={handleRetry}>
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isLost = announcement.type === "lost";

  const announcementName =
    announcement.name ||
    announcement.pet_name ||
    announcement.pet?.name ||
    "Без імені";

  const petType =
    announcement.pet_type ||
    announcement.pet?.type ||
    announcement.animal_type ||
    "";

  const photo =
    announcement.photo ||
    announcement.pet_photo ||
    announcement.image ||
    announcement.pet?.photo ||
    "";

  const photoUrl = getPhotoUrl(photo);

  const statusText = (() => {
    switch (announcement.status) {
      case "active":
        return "Активне";
      case "found":
        return "Знайдено";
      case "closed":
        return "Закрите";
      default:
        return announcement.status || "Не вказано";
    }
  })();

  const hasCoordinates =
    announcement.latitude != null &&
    announcement.longitude != null &&
    announcement.latitude !== "" &&
    announcement.longitude !== "";

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
          {photoUrl && !photoError ? (
            <div className="admin-announcement-photo">
              <img
                src={photoUrl}
                alt={`Фото тварини: ${announcementName}`}
                onError={() => setPhotoError(true)}
              />
            </div>
          ) : (
            <div className="admin-announcement-photo-placeholder">
              <PawPrint size={52} />
              <span>Фото тварини відсутнє</span>
            </div>
          )}

          <div className="admin-announcement-details-card-top">
            <div>
              <span
                className={`admin-announcement-type ${
                  isLost ? "lost" : "found"
                }`}
              >
                {isLost ? "Загублений" : "Знайдений"}
              </span>

              <h2>{announcementName}</h2>
            </div>

            <span
              className={`admin-announcement-status ${
                announcement.status || ""
              }`}
            >
              {statusText}
            </span>
          </div>

          <div className="admin-announcement-details-grid">
            <div className="admin-announcement-info-item">
              <PawPrint />
              <div>
                <span>Тварина</span>
                <strong>{announcementName}</strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <PawPrint />
              <div>
                <span>Вид</span>
                <strong>{petType || "Не вказано"}</strong>
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
                <strong>{formatDate(announcement.created_at)}</strong>
              </div>
            </div>

            <div className="admin-announcement-info-item">
              <PawPrint />
              <div>
                <span>ID користувача</span>
                <strong>
                  {announcement.user_id != null
                    ? `#${announcement.user_id}`
                    : "Не вказано"}
                </strong>
              </div>
            </div>
          </div>

          <div className="admin-announcement-description">
            <h3>Опис оголошення</h3>
            <p>{announcement.description || "Опис не вказано."}</p>
          </div>

          {hasCoordinates && (
            <div className="admin-announcement-coordinates">
              <h3>Координати</h3>

              <div className="coordinates-list">
                <span>Широта: {announcement.latitude}</span>
                <span>Довгота: {announcement.longitude}</span>
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

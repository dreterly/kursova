import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  PawPrint,
  Map,
  Phone,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getAnnouncementById } from "../../services/announcementsApi.js";

import "./announcementDetails.css";

export function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const announcementData = await getAnnouncementById(id);
        setAnnouncement(announcementData);
      } catch (error) {
        console.error(error);
        setError("Оголошення не знайдено");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <main className="announcement-details">
        <div className="announcement-details-state">
          <div className="details-loader"></div>
          <p>Завантаження оголошення...</p>
        </div>
      </main>
    );
  }

  if (error || !announcement) {
    return (
      <main className="announcement-details">
        <div className="announcement-details-state error">
          <div className="details-error-icon">🐾</div>

          <h2>Оголошення не знайдено</h2>

          <p>Можливо, це оголошення було видалено або більше не існує.</p>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>
        </div>
      </main>
    );
  }

  const isLost = announcement.type === "lost";

  return (
    <main className="announcement-details">
      <div className="announcement-details-container">
        {/* Верхня частина */}
        <div className="announcement-details-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="details-title">
            <div className="details-title-icon">
              <PawPrint />
            </div>

            <div>
              <h1>Деталі оголошення</h1>
              <p>Інформація про тварину та місце події</p>
            </div>
          </div>
        </div>

        {/* Картка */}
        <div className="announcement-details-card">
          {/* Фото */}
          <div className="announcement-details-image-wrapper">
            {announcement.photo ? (
              <img
                className="announcement-details-image"
                src={announcement.photo}
                alt={announcement.name || "Тварина"}
              />
            ) : (
              <div className="announcement-details-no-image">
                <PawPrint />
                <span>Фото відсутнє</span>
              </div>
            )}

            <span
              className={`announcement-details-status ${
                isLost ? "lost" : "found"
              }`}
            >
              {isLost ? "Загублений" : "Знайдений"}
            </span>
          </div>

          {/* Інформація */}
          <div className="announcement-details-content">
            <h2 className="pet-name">{announcement.name || "Тварина"}</h2>

            <div className="details-info">
              <div className="details-info-item">
                <PawPrint />
                <div>
                  <span>Вид</span>
                  <strong>{announcement.pet_type || "Не вказано"}</strong>
                </div>
              </div>

              <div className="details-info-item">
                <Tag />
                <div>
                  <span>Порода</span>
                  <strong>{announcement.breed || "Не вказано"}</strong>
                </div>
              </div>

              <div className="details-info-item">
                <MapPin />
                <div>
                  <span>Місто</span>
                  <strong>{announcement.city || "Не вказано"}</strong>
                </div>
              </div>

              <div className="details-info-item">
                <Map />
                <div>
                  <span>Адреса</span>
                  <strong>{announcement.address || "Не вказано"}</strong>
                </div>
              </div>

              <div className="details-info-item">
                <CalendarDays />
                <div>
                  <span>Дата</span>
                  <strong>
                    {announcement.created_at
                      ? new Date(announcement.created_at).toLocaleDateString(
                          "uk-UA",
                        )
                      : "Не вказано"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Опис */}
            <div className="details-description">
              <h3>Опис</h3>

              <p>{announcement.description || "Опис не вказаний"}</p>
            </div>

            {/* Контакт */}
            {announcement.contact && (
              <div className="contact-info">
                <div className="contact-icon">
                  <Phone />
                </div>

                <div>
                  <span>Контакт</span>
                  <strong>{announcement.contact}</strong>
                </div>
              </div>
            )}

            {/* Карта */}
            <button
              type="button"
              className="map-button"
              onClick={() => navigate("/map")}
            >
              <Map />
              Показати на карті
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

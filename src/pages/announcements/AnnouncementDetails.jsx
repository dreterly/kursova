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
import { getPhotoUrl } from "../../utils/PhotoUrl.js";

import "./announcementDetails.css";

export function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError("");
      setAnnouncement(null);

      try {
        const announcementData = await getAnnouncementById(id);

        if (!isMounted) return;

        if (!announcementData) {
          throw new Error("Оголошення не знайдено");
        }

        console.log("Деталі оголошення з API:", announcementData);

        setAnnouncement({
          ...announcementData,
          photo:
            announcementData.photo ||
            announcementData.pet_photo ||
            announcementData.image ||
            announcementData.pet?.photo ||
            null,
        });
      } catch (error) {
        console.error("Помилка завантаження оголошення:", error);

        if (isMounted) {
          setError("Оголошення не знайдено");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadData();
    } else {
      setError("Не вказано ID оголошення");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
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

  const photoUrl = getPhotoUrl(announcement.photo);

  const announcementDate =
    announcement.date ||
    announcement.created_at ||
    announcement.lost_date ||
    null;

  const formattedDate = announcementDate
    ? new Date(announcementDate).toLocaleDateString("uk-UA")
    : "Не вказано";

  const petName =
    announcement.name ||
    announcement.pet_name ||
    announcement.pet?.name ||
    "Тварина";

  const petType =
    announcement.pet_type ||
    announcement.species ||
    announcement.pet?.type ||
    "Не вказано";

  const petBreed =
    announcement.breed || announcement.pet?.breed || "Не вказано";

  const contact =
    announcement.contact ||
    announcement.contact_phone ||
    announcement.phone ||
    "";

  return (
    <main className="announcement-details">
      <div className="announcement-details-container">
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

        <div className="announcement-details-card">
          <div className="announcement-details-image-wrapper">
            {photoUrl ? (
              <img
                className="announcement-details-image"
                src={photoUrl}
                alt={petName}
                onError={(event) => {
                  console.error(
                    "Не вдалося завантажити фото оголошення:",
                    event.currentTarget.src,
                  );

                  event.currentTarget.style.display = "none";
                }}
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

          <div className="announcement-details-content">
            <h2 className="pet-name">{petName}</h2>

            <div className="details-info">
              <div className="details-info-item">
                <PawPrint />
                <div>
                  <span>Вид</span>
                  <strong>{petType}</strong>
                </div>
              </div>

              <div className="details-info-item">
                <Tag />
                <div>
                  <span>Порода</span>
                  <strong>{petBreed}</strong>
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
                  <strong>
                    {announcement.address || announcement.place || "Не вказано"}
                  </strong>
                </div>
              </div>

              <div className="details-info-item">
                <CalendarDays />
                <div>
                  <span>Дата</span>
                  <strong>{formattedDate}</strong>
                </div>
              </div>
            </div>

            <div className="details-description">
              <h3>Опис</h3>
              <p>{announcement.description || "Опис не вказаний"}</p>
            </div>

            {contact && (
              <div className="contact-info">
                <div className="contact-icon">
                  <Phone />
                </div>

                <div>
                  <span>Контакт</span>
                  <strong>{contact}</strong>
                </div>
              </div>
            )}

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

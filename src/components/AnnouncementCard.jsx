import { Link } from "react-router-dom";
import { MapPin, PawPrint, CalendarDays } from "lucide-react";
import "./announcementCard.css";

const API_BASE_URL = "http://localhost:5000";

function getPhotoUrl(photo) {
  if (!photo) return null;

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `${API_BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
}

export function AnnouncementCard({ announcement }) {
  const isLost = announcement.type === "lost";

  const photoUrl = getPhotoUrl(
    announcement.photo || announcement.pet_photo || announcement.image,
  );

  return (
    <div className="announcement-card">
      <div className="announcement-card-image">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={announcement.name || "Тварина"}
            onError={(event) => {
              console.error(
                "Не вдалося завантажити фото оголошення:",
                event.currentTarget.src,
              );
            }}
          />
        ) : (
          <div className="announcement-no-image">
            <PawPrint />
            <span>Фото відсутнє</span>
          </div>
        )}

        <span className={`announcement-status ${isLost ? "lost" : "found"}`}>
          {isLost ? "Загублений" : "Знайдений"}
        </span>
      </div>

      <div className="announcement-card-content">
        <h3>{announcement.name || "Без імені"}</h3>

        <div className="announcement-info">
          <p>
            <PawPrint />
            {announcement.pet_type || "Вид не вказано"}
          </p>

          <p>
            <MapPin />
            {announcement.city || "Місто не вказано"}
          </p>

          {announcement.created_at && (
            <p>
              <CalendarDays />
              {new Date(announcement.created_at).toLocaleDateString("uk-UA")}
            </p>
          )}
        </div>

        {announcement.description && (
          <p className="announcement-description">{announcement.description}</p>
        )}

        <Link
          to={`/announcements/${announcement.id}`}
          className="details-button"
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
}

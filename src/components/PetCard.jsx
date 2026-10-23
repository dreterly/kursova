import { Link } from "react-router-dom";
import { MapPin, PawPrint, Tag } from "lucide-react";
import "./petCard.css";
import API_BASE_URL from "../services/api.js";

function getPhotoUrl(photo) {
  if (!photo) return null;

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `${API_BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
}

export function PetCard({ pet }) {
  const statusClass =
    pet.status === "lost" ? "lost" : pet.status === "found" ? "found" : "owned";

  const statusText =
    pet.status === "lost"
      ? "Загублена"
      : pet.status === "found"
        ? "Знайдена"
        : "Моя тварина";

  const photoUrl = getPhotoUrl(pet.photo || pet.image);

  return (
    <div className="pet-card">
      <div className="pet-card-image">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={pet.name || "Фото тварини"}
            onError={(event) => {
              console.error(
                "Не вдалося завантажити фото тварини:",
                event.currentTarget.src,
              );
            }}
          />
        ) : (
          <div className="pet-no-photo">
            <PawPrint />
          </div>
        )}

        <span className={`pet-status ${statusClass}`}>{statusText}</span>
      </div>

      <div className="pet-card-content">
        <h3>{pet.name}</h3>

        <div className="pet-info">
          <p>
            <PawPrint /> {pet.type}
          </p>

          <p>
            <Tag /> {pet.breed || "Порода не вказана"}
          </p>

          <p>
            <MapPin /> {pet.city || "Місто не вказано"}
          </p>
        </div>

        <Link to={`/profile/pets/${pet.id}`} className="pet-details-button">
          Детальніше
        </Link>
      </div>
    </div>
  );
}

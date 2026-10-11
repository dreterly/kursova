import { Link } from "react-router-dom";
import { MapPin, PawPrint, Tag } from "lucide-react";
import "./petCard.css";
export function PetCard({ pet }) {
  const statusClass =
    pet.status === "lost" ? "lost" : pet.status === "found" ? "found" : "owned";
  const statusText =
    pet.status === "lost"
      ? "Загублена"
      : pet.status === "found"
        ? "Знайдена"
        : "Моя тварина";
  return (
    <div className="pet-card">
      {" "}
      <div className="pet-card-image">
        {" "}
        <img src={pet.photo || pet.image} alt={pet.name} />{" "}
        <span className={`pet-status ${statusClass}`}> {statusText} </span>{" "}
      </div>{" "}
      <div className="pet-card-content">
        {" "}
        <h3>{pet.name}</h3>{" "}
        <div className="pet-info">
          {" "}
          <p>
            {" "}
            <PawPrint /> {pet.type}{" "}
          </p>{" "}
          <p>
            {" "}
            <Tag /> {pet.breed || "Порода не вказана"}{" "}
          </p>{" "}
          <p>
            {" "}
            <MapPin /> {pet.city || "Місто не вказано"}{" "}
          </p>{" "}
        </div>{" "}
        <Link to={`/profile/pets/${pet.id}`} className="pet-details-button">
          {" "}
          Детальніше{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}

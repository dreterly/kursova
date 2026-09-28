import "./petCard.css";

export function PetCard({ pet }) {
  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img src={pet.image} alt={pet.name} />

        <span
          className={`pet-status ${
            pet.status === "lost"
              ? "lost"
              : pet.status === "found"
                ? "found"
                : "owned"
          }`}
        >
          {pet.status === "lost"
            ? "Загублена"
            : pet.status === "found"
              ? "Знайдена"
              : "Моя тварина"}
        </span>
      </div>

      <div className="pet-card-content">
        <h3>{pet.name}</h3>

        <p>🐾 {pet.type}</p>
        <p>🏷 {pet.breed}</p>
        <p>📍 {pet.city}</p>

        <button>Детальніше</button>
      </div>
    </div>
  );
}

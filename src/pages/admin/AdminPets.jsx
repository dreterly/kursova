import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { pets } from "../../data/pets.js";

import "./adminPets.css";

export function AdminPets() {
  const [adminPets, setAdminPets] = useState(pets);

  function handleDelete(id) {
    const confirmed = window.confirm("Ви дійсно хочете видалити цю тварину?");

    if (!confirmed) {
      return;
    }

    setAdminPets(adminPets.filter((pet) => pet.id !== id));
  }

  function handleEdit(id) {
    alert(`Редагування тварини №${id}`);
  }

  return (
    <main className="admin-pets">
      <div className="admin-pets-container">
        <div className="admin-pets-header">
          <h1>Тварини</h1>
          <p>Керування тваринами в системі PETFINDER</p>
        </div>

        <div className="admin-pets-list">
          {adminPets.map((pet) => (
            <div className="admin-pet-card" key={pet.id}>
              <img src={pet.image} alt={pet.name} />

              <div className="admin-pet-info">
                <h3>{pet.name}</h3>

                <p>
                  {pet.type} • {pet.breed}
                </p>

                <p>📍 {pet.city}</p>

                <span className={`admin-pet-status ${pet.status}`}>
                  {pet.status === "lost"
                    ? "Загублена"
                    : pet.status === "found"
                      ? "Знайдена"
                      : "Моя тварина"}
                </span>
              </div>

              <div className="admin-pet-actions">
                <Link
                  to={`/profile/pets/${pet.id}`}
                  className="admin-view-button"
                >
                  <Eye />
                  Переглянути
                </Link>

                <button
                  className="admin-edit-button"
                  onClick={() => handleEdit(pet.id)}
                >
                  <Pencil />
                  Редагувати
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() => handleDelete(pet.id)}
                >
                  <Trash2 />
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { useState } from "react";
import {
  // PawPrint,
  MapPin,
  // Navigation,
  // Clock,
  Plus,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { pets } from "../../data/pets.js";

import "./profile.css";

export function Profile() {
  const myPets = pets.filter((pet) => pet.status === "owned");

  const [selectedPetId, setSelectedPetId] = useState(myPets[0]?.id);

  // const [activeTab, setActiveTab] = useState("data");

  // const selectedPet =
  //   myPets.find((pet) => pet.id === selectedPetId) || myPets[0];

  return (
    <main className="profile">
      {/* Заголовок */}
      <div className="profile-top">
        <div>
          <h1>Мої тварини</h1>
          <p>Керуйте інформацією про своїх улюбленців</p>
        </div>

        <div className="profile-security">
          <span></span>
          <ShieldCheck />
          Безпека
        </div>
      </div>

      {/* Картки тварин */}
      <section className="my-pets">
        {myPets.map((pet) => {
          const isSelected = pet.id === selectedPetId;

          return (
            <Link
              to={`/profile/pets/${pet.id}`}
              key={pet.id}
              className={`pet-profile-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedPetId(pet.id)}
            >
              <div className="pet-profile-image">
                <img src={pet.image} alt={pet.name} />

                {isSelected && (
                  <span className="selected-icon">
                    <Check />
                  </span>
                )}
              </div>

              <h3>{pet.name}</h3>

              <p>
                {pet.type} • {pet.age} роки
              </p>

              <span className="chip-badge">
                <MapPin />
                Чипований
              </span>
            </Link>
          );
        })}

        <Link to="/profile/pets/add" className="add-pet-card">
          <div className="add-pet-icon">
            <Plus />
          </div>

          <span>+ Додати тварину</span>
        </Link>
      </section>

     
    </main>
  );
}

import { MapPin, Plus, Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPets } from "../../services/petsApi.js";
import "./profile.css";

export function Profile() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPets()
      .then((data) => {
        setPets(data);

        if (data.length > 0) {
          setSelectedPetId(data[0].id);
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="profile">
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

      {loading && <p>Завантаження тварин...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <section className="my-pets">
          {pets.map((pet) => {
            const isSelected = pet.id === selectedPetId;

            return (
              <Link
                to={`/profile/pets/${pet.id}`}
                key={pet.id}
                className={`pet-profile-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedPetId(pet.id)}
              >
                <div className="pet-profile-image">
                  <img src={pet.photo} alt={pet.name} />

                  {isSelected && (
                    <span className="selected-icon">
                      <Check />
                    </span>
                  )}
                </div>

                <h3>{pet.name}</h3>

                <p>
                  {pet.type} • {pet.breed}
                </p>

                <span className="chip-badge">
                  <MapPin />
                  {pet.chip_number ? "Чипований" : "Без чипа"}
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
      )}
    </main>
  );
}

import {
  MapPin,
  Plus,
  Check,
  ShieldCheck,
  Megaphone,
  ArrowLeft,
  PawPrint,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPetsByUserId } from "../../services/petsApi.js";
import "./profile.css";

export function Profile() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setError("Користувач не авторизований");
      setLoading(false);
      return;
    }

    const user = JSON.parse(savedUser);

    getPetsByUserId(user.id)
      .then((data) => {
        setPets(data);

        if (data.length > 0) {
          setSelectedPetId(data[0].id);
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Не вдалося завантажити тварин");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="profile">
      <div className="profile-container">
        <div className="profile-top">
          <div>
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
              Повернутися назад
            </button>

            <div className="profile-title">
              <div className="profile-title-icon">
                <PawPrint />
              </div>

              <div>
                <h1>Мої тварини</h1>
                <p>Керуйте інформацією про своїх улюбленців</p>
              </div>
            </div>
          </div>

          <div className="profile-security">
            <span></span>
            <ShieldCheck />
            Безпека
          </div>
        </div>

        {loading && (
          <div className="profile-message">
            <div className="profile-loader"></div>
            <p>Завантаження тварин...</p>
          </div>
        )}

        {error && (
          <div className="profile-message error">
            <p>{error}</p>
            <button type="button" onClick={() => navigate(-1)}>
              Повернутися
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="my-pets">
              {pets.length === 0 ? (
                <div className="empty-pets">
                  <div className="empty-pets-icon">
                    <PawPrint />
                  </div>

                  <h2>У вас ще немає тварин</h2>

                  <p>
                    Додайте свого улюбленця, щоб зберігати його дані та
                    відстежувати місцезнаходження.
                  </p>

                  <Link to="/profile/pets/add" className="empty-pets-button">
                    <Plus />
                    Додати тварину
                  </Link>
                </div>
              ) : (
                <>
                  {pets.map((pet) => {
                    const isSelected = pet.id === selectedPetId;

                    return (
                      <Link
                        to={`/profile/pets/${pet.id}`}
                        key={pet.id}
                        className={`pet-profile-card ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => setSelectedPetId(pet.id)}
                      >
                        <div className="pet-profile-image">
                          {pet.photo ? (
                            <img src={pet.photo} alt={pet.name} />
                          ) : (
                            <div className="pet-no-photo">
                              <PawPrint />
                            </div>
                          )}

                          {isSelected && (
                            <span className="selected-icon">
                              <Check />
                            </span>
                          )}
                        </div>

                        <div className="pet-profile-content">
                          <div>
                            <h3>{pet.name}</h3>

                            <p>
                              {pet.type}
                              {pet.breed ? ` • ${pet.breed}` : ""}
                            </p>
                          </div>

                          <span className="chip-badge">
                            <MapPin />

                            {pet.chip_number ? "Чипований" : "Без чипа"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}

                  <Link to="/profile/pets/add" className="add-pet-card">
                    <div className="add-pet-icon">
                      <Plus />
                    </div>

                    <strong>Додати тварину</strong>

                    <span>Додайте ще одного улюбленця</span>
                  </Link>
                </>
              )}
            </section>

            <section className="my-announcements-link">
              <Link to="/profile/announcements">
                <div className="my-announcements-icon">
                  <Megaphone />
                </div>

                <div className="my-announcements-content">
                  <h2>Мої оголошення</h2>

                  <p>Перегляд та керування створеними оголошеннями</p>
                </div>

                <span className="my-announcements-arrow">→</span>
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

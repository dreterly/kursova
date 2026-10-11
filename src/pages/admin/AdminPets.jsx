import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
  PawPrint,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getPets, deletePet } from "../../services/petsApi.js";

import "./adminPets.css";

export function AdminPets() {
  const navigate = useNavigate();

  const [adminPets, setAdminPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPets() {
    try {
      setLoading(true);
      setError("");

      const data = await getPets();

      setAdminPets(data);
    } catch (error) {
      console.error(error);

      setError(error.message || "Не вдалося завантажити тварин");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Ви дійсно хочете видалити цю тварину?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePet(id);

      setAdminPets((currentPets) => currentPets.filter((pet) => pet.id !== id));

      alert("Тварину видалено");
    } catch (error) {
      console.error(error);

      alert(error.message || "Не вдалося видалити тварину");
    }
  }

  if (loading) {
    return (
      <main className="admin-pets">
        <div className="admin-pets-state">
          <div className="admin-pets-loader"></div>
          <p>Завантаження тварин...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-pets">
        <div className="admin-pets-container">
          <button
            type="button"
            className="admin-pets-back-button"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="admin-pets-error">
            <div className="admin-pets-error-icon">
              <PawPrint />
            </div>

            <h2>Не вдалося завантажити тварин</h2>

            <p>{error}</p>

            <button
              type="button"
              className="admin-pets-retry"
              onClick={loadPets}
            >
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-pets">
      <div className="admin-pets-container">
        <button
          type="button"
          className="admin-pets-back-button"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft />
          Повернутися назад
        </button>

        <div className="admin-pets-header">
          <div className="admin-pets-title-icon">
            <PawPrint />
          </div>

          <div>
            <span className="admin-pets-label">PETFINDER ADMIN</span>

            <h1>Тварини</h1>

            <p>Керування тваринами в системі PETFINDER</p>
          </div>
        </div>

        <div className="admin-pets-count">
          <span>Усього тварин</span>
          <strong>{adminPets.length}</strong>
        </div>

        {adminPets.length === 0 ? (
          <div className="admin-pets-empty">
            <div className="admin-pets-empty-icon">
              <PawPrint />
            </div>

            <h2>Тварин поки немає</h2>

            <p>У системі ще немає зареєстрованих тварин.</p>
          </div>
        ) : (
          <div className="admin-pets-list">
            {adminPets.map((pet) => (
              <div className="admin-pet-card" key={pet.id}>
                <div className="admin-pet-image">
                  {pet.photo ? (
                    <img src={pet.photo} alt={pet.name} />
                  ) : (
                    <div className="admin-pet-no-image">
                      <PawPrint />
                    </div>
                  )}
                </div>

                <div className="admin-pet-info">
                  <h3>{pet.name || "Без імені"}</h3>

                  <p>
                    {pet.type || "Вид не вказано"}
                    {" • "}
                    {pet.breed || "Порода не вказана"}
                  </p>

                  <p className="admin-pet-user">👤 Користувач №{pet.user_id}</p>

                  <span
                    className={`admin-pet-status ${
                      pet.is_own ? "own" : "announcement"
                    }`}
                  >
                    {pet.is_own ? "Власна тварина" : "Тварина з оголошення"}
                  </span>
                </div>

                <div className="admin-pet-actions">
                  <Link
                    to={`/admin/pets/${pet.id}`}
                    className="admin-view-button"
                  >
                    <Eye />
                    Переглянути
                  </Link>

                  <Link
                    to={`/admin/pets/edit/${pet.id}`}
                    className="admin-edit-button"
                  >
                    <Pencil />
                    Редагувати
                  </Link>

                  <button
                    type="button"
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
        )}
      </div>
    </main>
  );
}

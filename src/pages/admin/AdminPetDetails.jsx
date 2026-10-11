import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, FileText, PawPrint, RefreshCw } from "lucide-react";

import { getPetById } from "../../services/petsApi.js";
import { getAnnouncements } from "../../services/announcementsApi.js";

import "./adminPetDetails.css";

export function AdminPetDetails() {
  const { id } = useParams();

  const [pet, setPet] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const petData = await getPetById(id);
        const announcementsData = await getAnnouncements();

        const relatedAnnouncement = announcementsData.find(
          (item) => item.pet_id === Number(id),
        );

        setPet(petData);
        setAnnouncement(relatedAnnouncement || null);
      } catch (error) {
        console.error(error);

        setError(error.message || "Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <main className="admin-pet-details">
        <div className="admin-pet-details-state">
          <div className="admin-pet-details-loader"></div>
          <p>Завантаження даних тварини...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-pet-details">
        <div className="admin-pet-details-container">
          <Link to="/admin/pets" className="back-admin-pets">
            <ArrowLeft />
            Назад до тварин
          </Link>

          <div className="admin-pet-details-error">
            <div className="admin-pet-details-error-icon">
              <PawPrint />
            </div>

            <h2>Не вдалося завантажити дані</h2>

            <p>{error}</p>

            <button
              type="button"
              className="admin-pet-details-retry"
              onClick={() => window.location.reload()}
            >
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="admin-pet-details">
        <div className="admin-pet-details-container">
          <Link to="/admin/pets" className="back-admin-pets">
            <ArrowLeft />
            Назад до тварин
          </Link>

          <div className="admin-pet-details-empty">
            <div className="admin-pet-details-empty-icon">
              <PawPrint />
            </div>

            <h2>Тварину не знайдено</h2>

            <p>Тварина з таким ідентифікатором не існує.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-pet-details">
      <div className="admin-pet-details-container">
        <Link to="/admin/pets" className="back-admin-pets">
          <ArrowLeft />
          Назад до тварин
        </Link>

        <div className="admin-pet-details-card">
          <div className="admin-pet-details-image">
            {pet.photo ? (
              <img src={pet.photo} alt={pet.name || "Тварина"} />
            ) : (
              <div className="admin-pet-details-no-image">
                <PawPrint />
                <span>Фото відсутнє</span>
              </div>
            )}
          </div>

          <div className="admin-pet-details-info">
            <div className="admin-pet-details-header">
              <div>
                <span className="admin-pet-details-label">PETFINDER ADMIN</span>

                <h1>{pet.name || "Без імені"}</h1>

                <p>
                  {pet.type || "Вид не вказано"}
                  {" • "}
                  {pet.breed || "Порода не вказана"}
                </p>
              </div>

              <Link
                to={`/admin/pets/edit/${pet.id}`}
                className="admin-pet-details-edit"
              >
                <Pencil />
                Редагувати
              </Link>
            </div>

            <div className="admin-pet-details-data">
              <div>
                <span>Стать</span>
                <strong>{pet.gender || "Не вказано"}</strong>
              </div>

              <div>
                <span>Дата народження</span>
                <strong>
                  {pet.birth_date
                    ? new Date(pet.birth_date).toLocaleDateString("uk-UA")
                    : "Не вказано"}
                </strong>
              </div>

              <div>
                <span>Колір</span>
                <strong>{pet.color || "Не вказано"}</strong>
              </div>

              <div>
                <span>Номер чипа</span>
                <strong>{pet.chip_number || "Без чипа"}</strong>
              </div>

              <div>
                <span>ID тварини</span>
                <strong>{pet.id}</strong>
              </div>

              <div>
                <span>ID користувача</span>
                <strong>{pet.user_id}</strong>
              </div>
            </div>

            <div className="admin-pet-details-status">
              <span>Тип запису</span>

              <strong className={pet.is_own ? "own" : "announcement"}>
                {pet.is_own
                  ? "Власна тварина користувача"
                  : "Тварина з оголошення"}
              </strong>
            </div>
          </div>
        </div>

        <section className="admin-related-announcement">
          <div className="admin-related-announcement-header">
            <div>
              <span className="admin-related-label">ІНФОРМАЦІЯ</span>

              <h2>Пов'язане оголошення</h2>

              <p>Оголошення, у якому вказана ця тварина</p>
            </div>

            <FileText />
          </div>

          {announcement ? (
            <div className="admin-related-announcement-card">
              <div className="admin-related-content">
                <span className={`admin-related-type ${announcement.type}`}>
                  {announcement.type === "lost" ? "Загублений" : "Знайдений"}
                </span>

                <h3>{announcement.description || "Опис відсутній"}</h3>

                <p>📍 {announcement.city || "Місто не вказано"}</p>

                <p>{announcement.address || "Місце не вказано"}</p>

                <p className="admin-related-status">
                  <span>Статус:</span>{" "}
                  {announcement.status === "active"
                    ? "Активне"
                    : announcement.status === "found"
                      ? "Знайдено"
                      : "Закрите"}
                </p>
              </div>

              <Link
                to={`/admin/announcements/${announcement.id}`}
                className="admin-related-view"
              >
                Переглянути оголошення
              </Link>
            </div>
          ) : (
            <div className="no-related-announcement">
              <FileText />

              <h3>Пов'язаного оголошення немає</h3>

              <p>Для цієї тварини ще не створено оголошення.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

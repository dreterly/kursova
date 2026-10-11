import { useEffect, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAnnouncements } from "../../services/announcementsApi.js";
import { AnnouncementCard } from "../../components/AnnouncementCard.jsx";

import "./foundPets.css";

export function FoundPets() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const announcementsData = await getAnnouncements();

        setAnnouncements(announcementsData);
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const foundPets = announcements.filter((announcement) => {
    const announcementDate = announcement.created_at
      ? announcement.created_at.slice(0, 10)
      : "";

    return (
      announcement.type === "found" &&
      (announcement.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (type === "" || announcement.pet_type === type) &&
      (city === "" || announcement.city === city) &&
      (date === "" || announcementDate === date)
    );
  });

  function clearFilters() {
    setSearch("");
    setType("");
    setCity("");
    setDate("");
  }

  if (loading) {
    return (
      <main className="found-pets">
        <div className="found-pets-message">
          <div className="found-loader"></div>
          <p>Завантаження оголошень...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="found-pets">
        <div className="found-pets-message error">
          <p>{error}</p>

          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft />
            Повернутися назад
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="found-pets">
      <div className="found-pets-container">
        {/* Заголовок */}

        <div className="found-pets-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="found-pets-title">
            <div className="found-title-icon">
              <Search />
            </div>

            <div>
              <h1>Знайдені тварини</h1>

              <p>
                Переглядайте знайдених тварин та допомагайте повернути їх
                власникам
              </p>
            </div>
          </div>
        </div>

        {/* Фільтри */}

        <section className="found-filters">
          <div className="filters-title">
            <SlidersHorizontal />
            <span>Пошук та фільтри</span>
          </div>

          <div className="filters-row">
            <div className="search-wrapper">
              <Search />

              <input
                type="text"
                placeholder="Пошук за ім'ям..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">Усі види</option>
              <option value="Кіт">Кіт</option>
              <option value="Кішка">Кішка</option>
              <option value="Собака">Собака</option>
              <option value="Інше">Інше</option>
            </select>

            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              <option value="">Усі міста</option>
              <option value="Житомир">Житомир</option>
              <option value="Київ">Київ</option>
              <option value="Львів">Львів</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />

            {(search || type || city || date) && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={clearFilters}
              >
                Скинути
              </button>
            )}
          </div>
        </section>

        {/* Інформація про результати */}

        <div className="found-results-info">
          <strong>Знайдені тварини</strong>

          <span>Знайдено оголошень: {foundPets.length}</span>
        </div>

        {/* Картки */}

        {foundPets.length > 0 ? (
          <div className="found-pets-list">
            {foundPets.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <Search />
            </div>

            <h2>Оголошень не знайдено</h2>

            <p>Спробуйте змінити пошуковий запит або параметри фільтрації.</p>

            <button type="button" onClick={clearFilters}>
              Скинути фільтри
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

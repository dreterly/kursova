import { useEffect, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getAnnouncements } from "../../services/announcementsApi.js";
import { AnnouncementCard } from "../../components/AnnouncementCard.jsx";

import "./lostPets.css";

export function LostPets() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";

  useEffect(() => {
    async function loadData() {
      try {
        const announcementsData = await getAnnouncements();

        console.log("Оголошення про загублених тварин:", announcementsData);

        const normalizedAnnouncements = announcementsData.map(
          (announcement) => ({
            ...announcement,
            photo:
              announcement.photo ||
              announcement.pet_photo ||
              announcement.image ||
              announcement.pet?.photo ||
              null,
          }),
        );

        setAnnouncements(normalizedAnnouncements);
      } catch (error) {
        console.error("Помилка завантаження оголошень:", error);
        setError("Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleSearchChange(event) {
    const value = event.target.value;

    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  }

  function clearFilters() {
    setType("");
    setCity("");
    setDate("");
    setSearchParams({});
  }

  const lostPets = announcements.filter((announcement) => {
    const announcementDate = announcement.created_at
      ? String(announcement.created_at).slice(0, 10)
      : "";

    return (
      announcement.type === "lost" &&
      (announcement.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (type === "" || announcement.pet_type === type) &&
      (city === "" || announcement.city === city) &&
      (date === "" || announcementDate === date)
    );
  });

  if (loading) {
    return (
      <main className="lost-pets">
        <div className="lost-pets-message">
          <div className="lost-loader"></div>
          <p>Завантаження оголошень...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="lost-pets">
        <div className="lost-pets-message error">
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
    <main className="lost-pets">
      <div className="lost-pets-container">
        <div className="lost-pets-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="lost-pets-title">
            <div className="lost-title-icon">
              <Search />
            </div>

            <div>
              <h1>Загублені тварини</h1>
              <p>Переглядайте оголошення та допомагайте знайти улюбленців</p>
            </div>
          </div>
        </div>

        <section className="lost-filters">
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
                onChange={handleSearchChange}
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

        <div className="lost-results-info">
          <strong>Загублені тварини</strong>
          <span>Знайдено оголошень: {lostPets.length}</span>
        </div>

        {lostPets.length > 0 ? (
          <div className="lost-pets-list">
            {lostPets.map((announcement) => (
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

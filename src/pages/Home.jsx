import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAnnouncements } from "../services/announcementsApi.js";
import { AnnouncementCard } from "../components/AnnouncementCard.jsx";

import "./home.css";

export function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

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

  const allAnnouncements = announcements
    .filter(
      (announcement) =>
        announcement.type === "lost" || announcement.type === "found",
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const latestAnnouncements = allAnnouncements.slice(0, 3);

  const announcementsToShow = showAll ? allAnnouncements : latestAnnouncements;

  if (loading) {
    return (
      <main className="home">
        <div className="home-state">
          <div className="loading-spinner"></div>
          <p>Завантаження оголошень...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home">
        <div className="home-state error-state">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Спробувати ще раз
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">PETFINDER</p>

          <h1>Знайди свого улюбленця 🐾</h1>

          <p className="hero-description">
            Допомагаємо знаходити загублених домашніх тварин та повертати їх
            додому.
          </p>

          <div className="home-buttons">
            <Link to="/lost" className="home-button lost-button">
              Загублені
            </Link>

            <Link to="/found" className="home-button found-button">
              Знайдені
            </Link>
          </div>
        </div>
      </section>

      {/* ОГОЛОШЕННЯ */}
      <section className="latest-announcements">
        <div className="section-header">
          <h2>Останні оголошення</h2>

          <p>Нові повідомлення про загублених та знайдених тварин</p>
        </div>

        {allAnnouncements.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🐾</div>

            <h3>Оголошень поки немає</h3>

            <p>Тут з'являться оголошення про загублених та знайдених тварин.</p>
          </div>
        ) : (
          <>
            <div className="announcements-list">
              {announcementsToShow.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </div>

            {allAnnouncements.length > 3 && (
              <button
                type="button"
                className="all-announcements"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Сховати оголошення" : "Переглянути всі"}
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}

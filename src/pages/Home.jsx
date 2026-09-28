import { Link } from "react-router-dom";

import { pets } from "../data/pets.js";
import { AnnouncementCard } from "../components/AnnouncementCard.jsx";

import "./home.css";

export function Home() {
  const latestAnnouncements = pets
    .filter((pet) => pet.status === "lost" || pet.status === "found")
    .slice(0, 3);

  return (
    <main className="home">

      <section className="hero">
        <h2>Знайди свого улюбленця 🐾</h2>

        <div className="home-buttons">
          <Link to="/lost" className="home-button lost-button">
            Загублені
          </Link>

          <Link to="/found" className="home-button found-button">
            Знайдені
          </Link>
        </div>
      </section>

      <section className="latest-announcements">
        <h2>Останні оголошення</h2>

        <div className="announcements-list">
          {latestAnnouncements.map((pet) => (
            <AnnouncementCard key={pet.id} announcement={pet} />
          ))}
        </div>

        <Link to="/lost" className="all-announcements">
          Переглянути всі
        </Link>
      </section>
    </main>
  );
}

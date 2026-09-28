import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { announcements } from "../../data/announcements.js";
import { pets } from "../../data/pets.js";

import "./myAnnouncements.css";

export function MyAnnouncements() {
  // Тимчасово беремо перші оголошення
  // як оголошення поточного користувача
  const myAnnouncements = announcements.slice(0, 2);

  return (
    <main className="my-announcements">
      <div className="my-announcements-header">
        <div>
          <h1>Мої оголошення</h1>
          <p>Керуйте створеними вами оголошеннями</p>
        </div>

        <Link to="/create-announcement" className="create-announcement-button">
          + Створити оголошення
        </Link>
      </div>

      <div className="my-announcements-list">
        {myAnnouncements.map((announcement) => {
          const pet = pets.find((pet) => pet.id === announcement.petId);

          return (
            <div key={announcement.id} className="my-announcement-card">
              <img src={pet?.image} alt={pet?.name} />

              <div className="my-announcement-info">
                <h3>{pet?.name}</h3>

                <span className={`announcement-type ${announcement.type}`}>
                  {announcement.type === "lost" ? "Загублений" : "Знайдений"}
                </span>

                <p>📍 {announcement.city}</p>

                <p>📅 {announcement.date}</p>
              </div>

              <div className="my-announcement-actions">
                <Link
                  to={`/announcements/${announcement.id}`}
                  className="view-button"
                >
                  <Eye />
                  Переглянути
                </Link>

                <button className="edit-button">
                  <Pencil />
                  Редагувати
                </button>

                <button className="delete-button">
                  <Trash2 />
                  Видалити
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

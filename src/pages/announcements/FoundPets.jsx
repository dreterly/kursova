import { useState } from "react";

import { announcements } from "../../data/announcements.js";
import { pets } from "../../data/pets.js";
import { AnnouncementCard } from "../../components/AnnouncementCard.jsx";

import "./foundPets.css";

export function FoundPets() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const foundPets = announcements.filter((announcement) => {
    const pet = pets.find((pet) => pet.id === announcement.petId);

    return (
      announcement.type === "found" &&
      announcement.title.toLowerCase().includes(search.toLowerCase()) &&
      (type === "" || pet?.type === type) &&
      (city === "" || announcement.city === city) &&
      (date === "" || announcement.date === date)
    );
  });

  return (
    <main className="found-pets">
      <h1>Знайдені тварини</h1>

      <div className="found-filters">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Усі</option>
          <option value="Кіт">Кіт</option>
          <option value="Кішка">Кішка</option>
          <option value="Собака">Собака</option>
          <option value="Інше">Інше</option>
        </select>

        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">Усі</option>
          <option value="Житомир">Житомир</option>
          <option value="Київ">Київ</option>
          <option value="Львів">Львів</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <div className="found-pets-list">
        {foundPets.map((announcement) => {
          const pet = pets.find((pet) => pet.id === announcement.petId);

          return (
            <AnnouncementCard
              key={announcement.id}
              announcement={{
                ...announcement,
                name: announcement.title,
                image: pet?.image,
              }}
            />
          );
        })}
      </div>

      {foundPets.length === 0 && (
        <p className="no-results">За вашим запитом оголошень не знайдено.</p>
      )}
    </main>
  );
}

import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { announcements } from "../../data/announcements.js";
import { pets } from "../../data/pets.js";
import { AnnouncementCard } from "../../components/AnnouncementCard.jsx";

import "./lostPets.css";

export function LostPets() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  // Беремо пошуковий текст прямо з URL
  const search = searchParams.get("search") || "";

  // Пошук через поле на сторінці
  function handleSearchChange(event) {
    const value = event.target.value;

    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  }

  // Фільтрація загублених тварин
  const lostPets = announcements
    .filter((announcement) => {
      const pet = pets.find((pet) => pet.id === announcement.petId);

      if (!pet) {
        return false;
      }

      return (
        announcement.type === "lost" &&
        pet.name.toLowerCase().includes(search.toLowerCase()) &&
        (type === "" || pet.type === type) &&
        (city === "" || announcement.city === city) &&
        (date === "" || announcement.date === date)
      );
    })
    .map((announcement) => {
      const pet = pets.find((pet) => pet.id === announcement.petId);

      return {
        ...announcement,

        // Дані тварини
        name: pet.name,
        image: pet.image,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,

        // Дані оголошення
        city: announcement.city,
        date: announcement.date,
        description: announcement.description,
      };
    });

  return (
    <main className="lost-pets">
      <h1>Загублені тварини</h1>

      <div className="lost-filters">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={handleSearchChange}
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

      <div className="lost-pets-list">
        {lostPets.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>

      {lostPets.length === 0 && (
        <p className="no-results">За вашим запитом оголошень не знайдено.</p>
      )}
    </main>
  );
}

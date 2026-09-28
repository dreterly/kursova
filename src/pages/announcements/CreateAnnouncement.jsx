
import { useState } from "react";

import "./createAnnouncement.css";

export function CreateAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);

  const [form, setForm] = useState({
    type: "lost",
    image: "",
    name: "",
    species: "",
    breed: "",
    gender: "",
    age: "",
    color: "",
    description: "",
    date: "",
    city: "",
    place: "",
    contact: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newAnnouncement = {
      id: Date.now(),
      ...form,
    };

    setAnnouncements([
      ...announcements,
      newAnnouncement,
    ]);

    setForm({
      type: "lost",
      image: "",
      name: "",
      species: "",
      breed: "",
      gender: "",
      age: "",
      color: "",
      description: "",
      date: "",
      city: "",
      place: "",
      contact: "",
    });

    alert("Оголошення створено!");
  }

  return (
    <main className="create-announcement">
      <h1>Створення оголошення</h1>

      <form
        className="announcement-form"
        onSubmit={handleSubmit}
      >
        <label>
          Тип
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="lost">Загублена</option>
            <option value="found">Знайдена</option>
          </select>
        </label>

        <label>
          Фото
          <input
            type="text"
            name="image"
            placeholder="Посилання на фото"
            value={form.image}
            onChange={handleChange}
          />
        </label>

        <label>
          Ім'я
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Вид
          <select
            name="species"
            value={form.species}
            onChange={handleChange}
          >
            <option value="">Оберіть вид</option>
            <option value="Кіт">Кіт</option>
            <option value="Кішка">Кішка</option>
            <option value="Собака">Собака</option>
            <option value="Інше">Інше</option>
          </select>
        </label>

        <label>
          Порода
          <input
            type="text"
            name="breed"
            value={form.breed}
            onChange={handleChange}
          />
        </label>

        <label>
          Стать
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Оберіть стать</option>
            <option value="Самець">Самець</option>
            <option value="Самка">Самка</option>
          </select>
        </label>

        <label>
          Вік
          <input
            type="number"
            name="age"
            min="0"
            value={form.age}
            onChange={handleChange}
          />
        </label>

        <label>
          Колір
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </label>

        <label>
          Опис
          <textarea
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Дата
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>

        <label>
          Місто
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
        </label>

        <label>
          Місце
          <input
            type="text"
            name="place"
            placeholder="Наприклад: біля парку"
            value={form.place}
            onChange={handleChange}
          />
        </label>

        <label>
          Контакт
          <input
            type="text"
            name="contact"
            placeholder="Телефон або email"
            value={form.contact}
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          Створити
        </button>
      </form>

      <div className="created-announcements">
        {announcements.map((announcement) => (
          <div
            className="created-announcement"
            key={announcement.id}
          >
            <h2>{announcement.name}</h2>
            <p>
              {announcement.type === "lost"
                ? "Загублена"
                : "Знайдена"}
            </p>
            <p>{announcement.city}</p>
            <p>{announcement.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
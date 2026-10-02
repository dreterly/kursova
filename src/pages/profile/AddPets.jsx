import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createPet } from "../../services/petsApi.js";

import "./addPets.css";

export function AddPets() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    image: "",
    name: "",
    type: "",
    breed: "",
    gender: "",
    birthDate: "",
    color: "",
    features: "",
    chipNumber: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      await createPet({
        user_id: 1,
        name: form.name,
        type: form.type,
        breed: form.breed,
        gender: form.gender,
        birth_date: form.birthDate,
        color: form.color,
        chip_number: form.chipNumber,
        photo: form.image,
      });

      alert("Тварину додано!");

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="add-pet-page">
      <div className="add-pet-container">
        <div className="add-pet-header">
          <h1>Додати тварину</h1>
          <p>Заповніть інформацію про свого улюбленця</p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="add-pet-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Фото</label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ім'я</label>

              <input
                type="text"
                name="name"
                placeholder="Наприклад, Томас"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Вид</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Оберіть вид</option>
                <option value="Кіт">Кіт</option>
                <option value="Кішка">Кішка</option>
                <option value="Собака">Собака</option>
                <option value="Інше">Інше</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Порода</label>

              <input
                type="text"
                name="breed"
                placeholder="Наприклад, британська короткошерста"
                value={form.breed}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Стать</label>

              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Оберіть стать</option>
                <option value="Самець">Самець</option>
                <option value="Самка">Самка</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Дата народження</label>

              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Колір</label>

              <input
                type="text"
                name="color"
                placeholder="Наприклад, сірий"
                value={form.color}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Особливі ознаки</label>

            <textarea
              name="features"
              placeholder="Опишіть особливі ознаки тварини..."
              value={form.features}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Номер мікрочипа</label>

            <input
              type="text"
              name="chipNumber"
              placeholder="Наприклад, 985141000123456"
              value={form.chipNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <Link to="/profile" className="cancel-button">
              Скасувати
            </Link>

            <button type="submit" className="save-button">
              Додати тварину
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

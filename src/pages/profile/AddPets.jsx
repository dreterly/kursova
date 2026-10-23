import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { createPet } from "../../services/petsApi.js";
import "./addPets.css";

export function AddPets() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    birthDate: "",
    color: "",
    features: "",
    chipNumber: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Будь ласка, виберіть файл зображення.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Розмір фотографії не повинен перевищувати 5 МБ.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        throw new Error("Користувач не авторизований.");
      }

      const user = JSON.parse(savedUser);

      if (!user.id) {
        throw new Error("Не вдалося визначити користувача.");
      }

      const formData = new FormData();

      formData.append("user_id", String(user.id));
      formData.append("name", form.name.trim());
      formData.append("type", form.type);
      formData.append("breed", form.breed.trim());
      formData.append("gender", form.gender);
      formData.append("birth_date", form.birthDate);
      formData.append("color", form.color.trim());
      formData.append("chip_number", form.chipNumber.trim());
      formData.append("is_own", "true");

      if (imageFile) {
        formData.append("photo", imageFile);
      }

      await createPet(formData);

      alert("Тварину успішно додано!");
      navigate("/profile");
    } catch (error) {
      console.error("Помилка додавання тварини:", error);
      setError(error.message || "Не вдалося додати тварину.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="add-pet-page">
      <div className="add-pet-container">
        <div className="add-pet-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <h1>Додати тварину</h1>
          <p>Заповніть інформацію про свого улюбленця</p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="add-pet-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pet-image">Фото</label>

            <input
              id="pet-image"
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Попередній перегляд фотографії тварини"
                className="pet-image-preview"
              />
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pet-name">Ім'я</label>
              <input
                id="pet-name"
                type="text"
                name="name"
                placeholder="Наприклад, Мурчик"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pet-type">Вид</label>
              <select
                id="pet-type"
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
              <label htmlFor="pet-breed">Порода</label>
              <input
                id="pet-breed"
                type="text"
                name="breed"
                placeholder="Наприклад, британська короткошерста"
                value={form.breed}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pet-gender">Стать</label>
              <select
                id="pet-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Оберіть стать</option>
                <option value="Самець">Самець</option>
                <option value="Самка">Самка</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pet-birth-date">Дата народження</label>
              <input
                id="pet-birth-date"
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pet-color">Колір</label>
              <input
                id="pet-color"
                type="text"
                name="color"
                placeholder="Наприклад, сірий"
                value={form.color}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pet-features">Особливі ознаки</label>
            <textarea
              id="pet-features"
              name="features"
              placeholder="Опишіть особливі ознаки тварини..."
              value={form.features}
              onChange={handleChange}
              rows={4}
            />
            <small>Особливі ознаки поки не зберігаються в базі даних.</small>
          </div>

          <div className="form-group">
            <label htmlFor="pet-chip">Номер мікрочипа</label>
            <input
              id="pet-chip"
              type="text"
              name="chipNumber"
              placeholder="Наприклад, 985141000123456"
              value={form.chipNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Скасувати
            </button>

            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Додавання..." : "Додати тварину"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

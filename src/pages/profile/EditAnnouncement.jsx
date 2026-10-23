import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  getAnnouncementById,
  updateAnnouncement,
} from "../../services/announcementsApi.js";

import "./editAnnouncement.css";

export function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "lost",
    description: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "active",
  });

  const [petId, setPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const announcement = await getAnnouncementById(id);

        setPetId(announcement.pet_id);

        setForm({
          type: announcement.type || "lost",
          description: announcement.description || "",
          city: announcement.city || "",
          address: announcement.address || "",
          latitude: announcement.latitude ?? "",
          longitude: announcement.longitude ?? "",
          status: announcement.status || "active",
        });
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncement();
  }, [id]);

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
    setSaving(true);

    try {
      await updateAnnouncement(id, {
        pet_id: petId,
        type: form.type,
        description: form.description,
        city: form.city,
        address: form.address,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
        status: form.status,
      });

      alert("Оголошення успішно оновлено!");

      navigate("/profile/announcements");
    } catch (error) {
      console.error(error);

      setError(error.message || "Не вдалося оновити оголошення");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="edit-announcement">
        <div className="edit-announcement-state">
          <div className="edit-announcement-spinner"></div>
          <p>Завантаження оголошення...</p>
        </div>
      </main>
    );
  }

  if (error && !form.city && !form.description) {
    return (
      <main className="edit-announcement">
        <div className="edit-announcement-state error-state">
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
    <main className="edit-announcement">
      <div className="edit-announcement-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <h1>Редагувати оголошення</h1>

          <p>Змініть інформацію про ваше оголошення</p>
        </div>
      </div>

      {error && <div className="edit-form-error">{error}</div>}

      <form className="edit-announcement-form" onSubmit={handleSubmit}>
        <label>
          Тип оголошення
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="lost">Загублений</option>

            <option value="found">Знайдений</option>
          </select>
        </label>

        <label>
          Місто
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Наприклад, Житомир"
          />
        </label>

        <label>
          Місце
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Наприклад, вул. Київська, 32"
          />
        </label>

        <label>
          Опис
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Опишіть ситуацію..."
            rows="5"
          />
        </label>

        <div className="coordinates-row">
          <label>
            Широта
            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder="50.2547"
            />
          </label>

          <label>
            Довгота
            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder="28.6587"
            />
          </label>
        </div>

        <label>
          Статус
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Активне</option>

            <option value="found">Тварину знайдено</option>

            <option value="closed">Закрите</option>
          </select>
        </label>

        <div className="edit-announcement-buttons">
          <button
            type="button"
            className="cancel-edit-button"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Скасувати
          </button>

          <button type="submit" className="save-edit-button" disabled={saving}>
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>
      </form>
    </main>
  );
}

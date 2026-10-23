import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Save, RefreshCw } from "lucide-react";

import {
  getAnnouncements,
  updateAdminAnnouncement,
} from "../../services/announcementsApi.js";

import "./editAdminAnnouncement.css";

export function EditAdminAnnouncement() {
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        setLoading(true);
        setError("");

        const announcements = await getAnnouncements();

        const announcement = announcements.find(
          (item) => item.id === Number(id),
        );

        if (!announcement) {
          throw new Error("Оголошення не знайдено");
        }

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
        setError(error.message || "Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncement();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await updateAdminAnnouncement(id, {
        type: form.type,
        description: form.description,
        city: form.city,
        address: form.address,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        status: form.status,
      });

      alert("Оголошення успішно оновлено");

      navigate("/admin/announcements");
    } catch (error) {
      console.error(error);

      alert(error.message || "Не вдалося оновити оголошення");
    }
  }

  if (loading) {
    return (
      <main className="edit-admin-announcement">
        <div className="edit-admin-announcement-state">
          <div className="edit-admin-announcement-loader"></div>
          <p>Завантаження оголошення...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="edit-admin-announcement">
        <div className="edit-admin-announcement-container">
          <button
            type="button"
            className="edit-admin-announcement-back"
            onClick={() => navigate("/admin/announcements")}
          >
            <ArrowLeft />
            Назад до оголошень
          </button>

          <div className="edit-admin-announcement-error">
            <div className="edit-admin-announcement-error-icon">
              <FileText />
            </div>

            <h2>Не вдалося завантажити оголошення</h2>

            <p>{error}</p>

            <button
              type="button"
              className="edit-admin-announcement-retry"
              onClick={() => window.location.reload()}
            >
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-admin-announcement">
      <div className="edit-admin-announcement-container">
        <button
          type="button"
          className="edit-admin-announcement-back"
          onClick={() => navigate("/admin/announcements")}
        >
          <ArrowLeft />
          Назад до оголошень
        </button>

        <div className="edit-admin-announcement-header">
          <div className="edit-admin-announcement-title-icon">
            <FileText />
          </div>

          <div>
            <span className="edit-admin-announcement-label">
              PETFINDER ADMIN
            </span>

            <h1>Редагування оголошення</h1>

            <p>Зміна інформації про оголошення PETFINDER</p>
          </div>
        </div>

        <form className="edit-admin-announcement-form" onSubmit={handleSubmit}>
          <div className="edit-admin-announcement-form-header">
            <h2>Дані оголошення</h2>

            <span>ID: #{id}</span>
          </div>

          <div className="edit-admin-announcement-fields">
            <label>
              <span>Тип оголошення</span>

              <select name="type" value={form.type} onChange={handleChange}>
                <option value="lost">Загублений</option>

                <option value="found">Знайдений</option>
              </select>
            </label>

            <label>
              <span>Статус</span>

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Активне</option>

                <option value="found">Знайдено</option>

                <option value="closed">Закрите</option>
              </select>
            </label>

            <label className="edit-admin-announcement-full-field">
              <span>Опис</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Введіть опис оголошення"
                rows="5"
              />
            </label>

            <label>
              <span>Місто</span>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Наприклад, Житомир"
              />
            </label>

            <label>
              <span>Адреса</span>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Наприклад, вул. Київська, 32"
              />
            </label>

            <label>
              <span>Широта</span>

              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                step="any"
                placeholder="50.2547000"
              />
            </label>

            <label>
              <span>Довгота</span>

              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                step="any"
                placeholder="28.6587000"
              />
            </label>
          </div>

          <div className="edit-admin-announcement-buttons">
            <button
              type="button"
              className="cancel-admin-announcement-button"
              onClick={() => navigate("/admin/announcements")}
            >
              Скасувати
            </button>

            <button type="submit" className="save-admin-announcement-button">
              <Save />
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

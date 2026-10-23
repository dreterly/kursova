import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";
import { getPhotoUrl } from "../../utils/photoUrl.js";
import {
  getAnnouncementsByUserId,
  deleteAnnouncement,
} from "../../services/announcementsApi.js";

import "./myAnnouncements.css";

export function MyAnnouncements() {
  const navigate = useNavigate();

  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setError("Користувач не авторизований");
      setLoading(false);
      return;
    }

    const user = JSON.parse(savedUser);

    async function loadData() {
      try {
        const announcementsData = await getAnnouncementsByUserId(user.id);

        setMyAnnouncements(announcementsData);
      } catch (error) {
        console.error(error);
        setError(error.message || "Не вдалося завантажити оголошення");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Ви дійсно хочете видалити це оголошення?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAnnouncement(id);

      setMyAnnouncements((currentAnnouncements) =>
        currentAnnouncements.filter((announcement) => announcement.id !== id),
      );

      alert("Оголошення видалено");
    } catch (error) {
      console.error(error);

      setError(error.message || "Не вдалося видалити оголошення");
    }
  }

  if (loading) {
    return (
      <main className="my-announcements">
        <div className="my-announcements-state">
          <div className="my-announcements-spinner"></div>
          <p>Завантаження оголошень...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-announcements">
        <div className="my-announcements-state error-state">
          <p>{error}</p>

          <button type="button" onClick={() => navigate("/profile")}>
            <ArrowLeft />
            Повернутися назад
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="my-announcements">
      <div className="my-announcements-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <h1>Мої оголошення</h1>

          <p>Керуйте створеними вами оголошеннями</p>
        </div>

        <Link to="/create-announcement" className="create-announcement-button">
          + Створити оголошення
        </Link>
      </div>

      <div className="my-announcements-list">
        {myAnnouncements.length === 0 ? (
          <div className="my-announcements-empty">
            <div className="empty-icon">🐾</div>

            <h3>У вас поки немає оголошень</h3>

            <p>Створіть перше оголошення про загублену або знайдену тварину.</p>

            <Link to="/create-announcement" className="empty-create-button">
              Створити оголошення
            </Link>
          </div>
        ) : (
          myAnnouncements.map((announcement) => (
            <div key={announcement.id} className="my-announcement-card">
              <div className="my-announcement-image">
                {announcement.photo ? (
                  <img
                    src={getPhotoUrl(announcement.photo)}
                    alt={announcement.name || "Тварина"}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="announcement-no-photo">🐾</div>
                )}
              </div>

              <div className="my-announcement-info">
                <h3>{announcement.name || "Тварина"}</h3>

                <span className={`announcement-type ${announcement.type}`}>
                  {announcement.type === "lost" ? "Загублений" : "Знайдений"}
                </span>

                <p>📍 {announcement.city || "Місто не вказано"}</p>

                <p>
                  📅{" "}
                  {announcement.created_at
                    ? new Date(announcement.created_at).toLocaleDateString(
                        "uk-UA",
                      )
                    : "Дата не вказана"}
                </p>
              </div>

              <div className="my-announcement-actions">
                <Link
                  to={`/announcements/${announcement.id}`}
                  className="view-button"
                >
                  <Eye />
                  Переглянути
                </Link>

                <Link
                  to={`/profile/announcements/edit/${announcement.id}`}
                  className="edit-button"
                >
                  <Pencil />
                  Редагувати
                </Link>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(announcement.id)}
                >
                  <Trash2 />
                  Видалити
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

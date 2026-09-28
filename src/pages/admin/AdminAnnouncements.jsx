import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { announcements } from "../../data/announcements.js";
import { pets } from "../../data/pets.js";

import "./adminAnnouncements.css";

export function AdminAnnouncements() {
  const [adminAnnouncements, setAdminAnnouncements] = useState(announcements);

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Ви дійсно хочете видалити це оголошення?",
    );

    if (!confirmed) {
      return;
    }

    setAdminAnnouncements(
      adminAnnouncements.filter((announcement) => announcement.id !== id),
    );
  }

  function handleEdit(id) {
    alert(`Редагування оголошення №${id}`);
  }

  return (
    <main className="admin-announcements">
      <div className="admin-announcements-container">
        <div className="admin-announcements-header">
          <h1>Оголошення</h1>
          <p>Керування оголошеннями PETFINDER</p>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Тварина</th>
                <th>Тип</th>
                <th>Автор</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>

            <tbody>
              {adminAnnouncements.map((announcement) => {
                const pet = pets.find((pet) => pet.id === announcement.petId);

                return (
                  <tr key={announcement.id}>
                    <td>{announcement.id}</td>

                    <td>{pet?.name || "Невідома тварина"}</td>

                    <td>
                      <span className={`admin-type ${announcement.type}`}>
                        {announcement.type === "lost"
                          ? "Загублений"
                          : "Знайдений"}
                      </span>
                    </td>

                    <td>{announcement.contactName}</td>

                    <td>{announcement.date}</td>

                    <td>
                      <span className={`admin-status ${announcement.status}`}>
                        {announcement.status === "active"
                          ? "Активне"
                          : "Неактивне"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-edit-button"
                          onClick={() => handleEdit(announcement.id)}
                        >
                          <Pencil />
                          Редагувати
                        </button>

                        <button
                          className="admin-delete-button"
                          onClick={() => handleDelete(announcement.id)}
                        >
                          <Trash2 />
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

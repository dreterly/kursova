import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PawPrint, Save, RefreshCw } from "lucide-react";

import { getPetById, updateAdminPet } from "../../services/petsApi.js";

import "./editAdminPet.css";

export function EditAdminPet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    birth_date: "",
    color: "",
    chip_number: "",
    photo: "",
    is_own: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPet() {
      try {
        setLoading(true);
        setError("");

        const pet = await getPetById(id);

        setForm({
          name: pet.name || "",
          type: pet.type || "",
          breed: pet.breed || "",
          gender: pet.gender || "",
          birth_date: pet.birth_date ? pet.birth_date.slice(0, 10) : "",
          color: pet.color || "",
          chip_number: pet.chip_number || "",
          photo: pet.photo || "",
          is_own: Boolean(pet.is_own),
        });
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити тварину");
      } finally {
        setLoading(false);
      }
    }

    loadPet();
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
      await updateAdminPet(id, {
        name: form.name,
        type: form.type,
        breed: form.breed,
        gender: form.gender,
        birth_date: form.birth_date || null,
        color: form.color,
        chip_number: form.chip_number || null,
        photo: form.photo || null,
        is_own: form.is_own,
      });

      alert("Дані тварини успішно оновлено");
      navigate("/admin/pets");
    } catch (error) {
      console.error(error);
      alert(error.message || "Не вдалося оновити тварину");
    }
  }

  if (loading) {
    return (
      <main className="edit-admin-pet">
        <div className="edit-admin-pet-state">
          <div className="edit-admin-pet-loader"></div>
          <p>Завантаження тварини...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="edit-admin-pet">
        <div className="edit-admin-pet-container">
          <button
            type="button"
            className="edit-admin-pet-back"
            onClick={() => navigate("/admin/pets")}
          >
            <ArrowLeft />
            Назад до тварин
          </button>

          <div className="edit-admin-pet-error">
            <div className="edit-admin-pet-error-icon">
              <PawPrint />
            </div>

            <h2>Не вдалося завантажити тварину</h2>

            <p>{error}</p>

            <button
              type="button"
              className="edit-admin-pet-retry"
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
    <main className="edit-admin-pet">
      <div className="edit-admin-pet-container">
        <button
          type="button"
          className="edit-admin-pet-back"
          onClick={() => navigate("/admin/pets")}
        >
          <ArrowLeft />
          Назад до тварин
        </button>

        <div className="edit-admin-pet-header">
          <div className="edit-admin-pet-title-icon">
            <PawPrint />
          </div>

          <div>
            <span className="edit-admin-pet-label">PETFINDER ADMIN</span>

            <h1>Редагування тварини</h1>

            <p>Зміна інформації про тварину в системі PETFINDER</p>
          </div>
        </div>

        <form className="edit-admin-pet-form" onSubmit={handleSubmit}>
          <div className="edit-admin-pet-form-header">
            <h2>Дані тварини</h2>

            <span>ID: #{id}</span>
          </div>

          <div className="edit-admin-pet-fields">
            <label>
              <span>Ім'я тварини</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Введіть ім'я"
                required
              />
            </label>

            <label>
              <span>Вид</span>

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
            </label>

            <label>
              <span>Порода</span>

              <input
                type="text"
                name="breed"
                value={form.breed}
                onChange={handleChange}
                placeholder="Наприклад, Британська короткошерста"
              />
            </label>

            <label>
              <span>Стать</span>

              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Не вказано</option>
                <option value="Самець">Самець</option>
                <option value="Самка">Самка</option>
              </select>
            </label>

            <label>
              <span>Дата народження</span>

              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Колір</span>

              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Наприклад, сірий"
              />
            </label>

            <label>
              <span>Номер чипа</span>

              <input
                type="text"
                name="chip_number"
                value={form.chip_number}
                onChange={handleChange}
                placeholder="Введіть номер чипа"
              />
            </label>

            <label>
              <span>Фото</span>

              <input
                type="text"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="/images/pets/photo.jpg"
              />
            </label>

            <label className="edit-admin-pet-full-field">
              <span>Тип тварини в системі</span>

              <select
                name="is_own"
                value={form.is_own ? "true" : "false"}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    is_own: event.target.value === "true",
                  }))
                }
              >
                <option value="true">Власна тварина користувача</option>

                <option value="false">Тварина з оголошення</option>
              </select>
            </label>
          </div>

          <div className="edit-admin-pet-buttons">
            <button
              type="button"
              className="cancel-admin-pet-button"
              onClick={() => navigate("/admin/pets")}
            >
              Скасувати
            </button>

            <button type="submit" className="save-admin-pet-button">
              <Save />
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

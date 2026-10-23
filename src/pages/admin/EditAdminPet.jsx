import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  PawPrint,
  Save,
  RefreshCw,
  ImagePlus,
  X,
} from "lucide-react";

import { getPetById, updateAdminPet } from "../../services/petsApi.js";
import { getPhotoUrl } from "../../utils/photoUrl.js";

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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPet() {
      try {
        setLoading(true);
        setError("");

        const pet = await getPetById(id);

        if (!isMounted) return;

        setForm({
          name: pet.name || "",
          type: pet.type || "",
          breed: pet.breed || "",
          gender: pet.gender || "",
          birth_date: pet.birth_date ? String(pet.birth_date).slice(0, 10) : "",
          color: pet.color || "",
          chip_number: pet.chip_number || "",
          photo: pet.photo || "",
          is_own: pet.is_own === true || pet.is_own === 1 || pet.is_own === "1",
        });

        setImagePreview(getPhotoUrl(pet.photo || ""));
      } catch (err) {
        console.error("Помилка завантаження тварини:", err);

        if (isMounted) {
          setError(err.message || "Не вдалося завантажити тварину");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPet();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Вибери файл зображення.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір фото не повинен перевищувати 5 МБ.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
  }

  function handleRemoveNewImage() {
    setImageFile(null);
    setImagePreview(getPhotoUrl(form.photo || ""));

    const input = document.getElementById("pet-photo");

    if (input) {
      input.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      let dataToSend;

      if (imageFile) {
        dataToSend = new FormData();

        dataToSend.append("name", form.name);
        dataToSend.append("type", form.type);
        dataToSend.append("breed", form.breed);
        dataToSend.append("gender", form.gender);
        dataToSend.append("birth_date", form.birth_date || "");
        dataToSend.append("color", form.color);
        dataToSend.append("chip_number", form.chip_number);
        dataToSend.append("is_own", String(form.is_own));
        dataToSend.append("photo", imageFile);
      } else {
        dataToSend = {
          ...form,
          birth_date: form.birth_date || null,
          chip_number: form.chip_number || null,
          photo: form.photo || null,
        };
      }

      await updateAdminPet(id, dataToSend);

      alert("Дані тварини успішно оновлено");
      navigate("/admin/pets");
    } catch (err) {
      console.error("Помилка оновлення тварини:", err);
      alert(err.message || "Не вдалося оновити тварину");
    } finally {
      setSaving(false);
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

            <div className="edit-admin-pet-full-field">
              <span className="edit-admin-pet-field-label">Фото тварини</span>

              {imagePreview ? (
                <div className="edit-admin-pet-photo-preview">
                  <img
                    src={imagePreview}
                    alt={`Фото: ${form.name || "тварина"}`}
                    onError={() => setImagePreview("")}
                  />

                  {imageFile && (
                    <button
                      type="button"
                      className="edit-admin-pet-remove-photo"
                      onClick={handleRemoveNewImage}
                    >
                      <X size={16} />
                      Скасувати нове фото
                    </button>
                  )}
                </div>
              ) : (
                <p className="edit-admin-pet-no-photo">Фото не додано</p>
              )}

              <label htmlFor="pet-photo" className="edit-admin-pet-upload">
                <ImagePlus size={20} />
                Вибрати фото з комп'ютера
              </label>

              <input
                id="pet-photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="edit-admin-pet-file-input"
              />

              <p className="edit-admin-pet-hint">
                Формат зображення: JPG, PNG або WebP. Максимум 5 МБ.
              </p>
            </div>

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
              disabled={saving}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="save-admin-pet-button"
              disabled={saving}
            >
              <Save />
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

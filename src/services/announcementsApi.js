const API_URL = "http://localhost:5000/api/announcements";

// =========================================
// Отримати всі оголошення
// =========================================

export async function getAnnouncements() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не вдалося отримати оголошення");
  }

  return response.json();
}

// =========================================
// Отримати оголошення конкретного користувача
// =========================================

export async function getAnnouncementsByUserId(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Не вдалося отримати оголошення користувача");
  }

  return response.json();
}

// =========================================
// Отримати одне оголошення
// =========================================

export async function getAnnouncementById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Оголошення не знайдено");
  }

  return response.json();
}

// =========================================
// Створити оголошення
// =========================================

export async function createAnnouncement(announcement) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(announcement),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося додати оголошення");
  }

  return data;
}

// =========================================
// Оновити власне оголошення
// =========================================

export async function updateAnnouncement(id, announcement) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(announcement),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося оновити оголошення");
  }

  return data;
}

// =========================================
// Видалити власне оголошення
// =========================================

export async function deleteAnnouncement(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося видалити оголошення");
  }

  return data;
}

// =========================================
// Оновити оголошення через адмінпанель
// =========================================

export async function updateAdminAnnouncement(id, announcement) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/admin/announcements/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(announcement),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося оновити оголошення");
  }

  return data;
}

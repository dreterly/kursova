import API_BASE_URL from "./api.js";
const API_URL = `${API_BASE_URL}/api/gps`;

// Отримати токен авторизації
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Отримати GPS-історію власних тварин
export async function getMyPetLocations(userId) {
  const response = await fetch(
    `${API_URL}/user/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося отримати GPS-дані");
  }

  return data;
}

// Зберегти демонстраційні GPS-точки
export async function saveDemoGpsLocations(userId) {
  const response = await fetch(
    `${API_URL}/demo/user/${encodeURIComponent(userId)}`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося зберегти GPS-точки");
  }

  return data;
}

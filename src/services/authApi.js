import API_BASE_URL from "./api.js";
const API_URL = `${API_BASE_URL}/api/auth`;
// Реєстрація користувача
export async function registerUser(user) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Помилка реєстрації");
  }

  return data;
}

// Вхід користувача
export async function loginUser(user) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Помилка входу");
  }

  return data;
}

import API_BASE_URL from "./api.js";
const API_URL = `${API_BASE_URL}/api/auth`;
export async function updateProfile(user) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося оновити профіль");
  }

  return data;
}


const API_URL = "http://localhost:5000/api/gps";

export async function getMyPetLocations(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Не вдалося отримати GPS-дані"
    );
  }

  return response.json();
}

export async function saveDemoGpsLocations(userId) {
  const response = await fetch(
    `${API_URL}/demo/user/${userId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Не вдалося зберегти GPS-точки"
    );
  }

  return response.json();
}

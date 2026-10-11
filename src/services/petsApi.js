const API_URL = "http://localhost:5000/api/pets";

// Отримати всіх тварин
export async function getPets() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не вдалося отримати тварин");
  }

  return response.json();
}

// Отримати тварин конкретного користувача
export async function getPetsByUserId(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Не вдалося отримати тварин користувача");
  }

  return response.json();
}

// Отримати одну тварину
export async function getPetById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Тварину не знайдено");
  }

  return response.json();
}

// Додати тварину
export async function createPet(pet) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

  if (!response.ok) {
    throw new Error("Не вдалося додати тварину");
  }

  return response.json();
}

// Оновити тварину
export async function updatePet(id, pet) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

  if (!response.ok) {
    throw new Error("Не вдалося оновити тварину");
  }

  return response.json();
}

// Видалити тварину
export async function deletePet(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не вдалося видалити тварину");
  }

  return response.json();
}

export async function updateAdminPet(id, pet) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/admin/pets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pet),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Не вдалося оновити тварину");
  }
  return data;
}

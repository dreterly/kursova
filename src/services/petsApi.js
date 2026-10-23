const API_URL = "http://localhost:5000/api/pets";
const ADMIN_API_URL = "http://localhost:5000/api/admin/pets";

// Отримати токен авторизації
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

//  налаштування запиту.
function getRequestOptions(method, data) {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;

  return {
    method,
    headers: {
      ...getAuthHeaders(),
      ...(isFormData
        ? {}
        : data !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
    },
    ...(data !== undefined && {
      body: isFormData ? data : JSON.stringify(data),
    }),
  };
}

// Обробити відповідь сервера
async function parseResponse(response, defaultMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || defaultMessage);
  }

  return data;
}

// всі публічні оголошення тварин
export async function getPets() {
  const response = await fetch(API_URL);

  return parseResponse(response, "Не вдалося отримати тварин");
}

// отримати власних тварин
export async function getPetsByUserId(userId) {
  const response = await fetch(
    `${API_URL}/user/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return parseResponse(response, "Не вдалося отримати тварин користувача");
}

// отримати одну тварину публ
export async function getPetById(id) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return parseResponse(response, "Тварину не знайдено");
}
// додати власну тваринц
export async function createPet(pet) {
  const response = await fetch(API_URL, getRequestOptions("POST", pet));

  return parseResponse(response, "Не вдалося додати тварину");
}

// оновить тварину
export async function updatePet(id, pet) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    getRequestOptions("PUT", pet),
  );

  return parseResponse(response, "Не вдалося оновити тварину");
}

// удалить тварину

export async function deletePet(id) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return parseResponse(response, "Не вдалося видалити тварину");
}

// Оновлення тварини через адмін панель

export async function updateAdminPet(id, pet) {
  const response = await fetch(
    `${ADMIN_API_URL}/${encodeURIComponent(id)}`,
    getRequestOptions("PUT", pet),
  );

  return parseResponse(
    response,
    "Не вдалося оновити тварину через адмінпанель",
  );
}

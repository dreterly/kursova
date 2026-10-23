import API_BASE_URL from "../services/api.js";

export function getPhotoUrl(photo) {
  if (!photo) return "";

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `${API_BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
}

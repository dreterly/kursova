
export function getPhotoUrl(photo) {
  if (!photo) return "";

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `http://localhost:5000${photo.startsWith("/") ? "" : "/"}${photo}`;
}

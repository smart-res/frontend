import api from "../axios";

export async function getItemPhotos(itemId: string) {
  const { data } = await api.get(
    `/api/admin/menu/items/${itemId}/photos`
  );
  return data;
}

export async function uploadItemPhotos(itemId: string, files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("photos", f));

  const { data } = await api.post(
    `/api/admin/menu/items/${itemId}/photos`,
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function removeItemPhoto(itemId: string, photoId: string) {
  return api.delete(
    `/api/admin/menu/items/${itemId}/photos/${photoId}`
  );
}

export async function setPrimaryItemPhoto(itemId: string, photoId: string) {
  return api.patch(
    `/api/admin/menu/items/${itemId}/photos/${photoId}/primary`
  );
}

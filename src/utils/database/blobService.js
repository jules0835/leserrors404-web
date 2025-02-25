import { put } from "@vercel/blob"


export async function uploadPublicPicture(file) {
  if (!file) {
    throw new Error("No file provided for upload")
  }

  const blob = await put(`public/pictures_${Date.now()}`, file, {
    access: "public",
  })

  return blob.url
}
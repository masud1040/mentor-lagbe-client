const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function uploadImageToImgBB(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_IMGBB_API_KEY in environment variables");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok || !data?.success || !data?.data?.display_url) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return data.data.display_url as string;
}
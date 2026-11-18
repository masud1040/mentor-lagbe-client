"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Server Action to revalidate paths after client-side fetch operation
export async function createTuitionPost(data: any) {
  revalidatePath("/dashboard/mentor/posts");
  revalidatePath("/tuitions");
  return { success: true };
}

// Get mentor posts (called from server component)
export async function getMentorPosts(mentorId: string) {
  try {
    const res = await fetch(`${API_URL}/tuitions?mentorId=${mentorId}`, {
      cache: "no-store",
    });
    const posts = await res.json();
    return { success: true, data: Array.isArray(posts) ? posts : [] };
  } catch (error) {
    console.error("Get Mentor Posts Error:", error);
    return { success: false, data: [] };
  }
}

// Close post
export async function closeTuitionPost(postId: string) {
  try {
    const res = await fetch(`${API_URL}/tuitions/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });

    if (!res.ok) return { success: false, message: "Failed to close post." };

    revalidatePath("/dashboard/mentor/posts");
    revalidatePath("/tuitions");
    return { success: true, message: "Tuition post closed successfully." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

// Delete post
export async function deleteTuitionPost(postId: string) {
  try {
    const res = await fetch(`${API_URL}/tuitions/${postId}`, {
      method: "DELETE",
    });

    if (!res.ok) return { success: false, message: "Failed to delete post." };

    revalidatePath("/dashboard/mentor/posts");
    revalidatePath("/tuitions");
    return { success: true, message: "Post deleted permanently." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}
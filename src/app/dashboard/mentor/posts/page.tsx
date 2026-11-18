import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { fetchTuitions } from "@/lib/api/tuition-api";
import PostListClient from "./PostListClient";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MentorPostsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  let posts = [];
  try {
    const data = await fetchTuitions({ mentorId: session.user.id });
    posts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load mentor posts:", error);
    posts = [];
  }

  return (
    <div className="mx-auto max-w-[1050px] space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <BookOpen size={14} /> Mentor Workspace
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Tuition Posts
          </h1>
          <p className="mt-1 text-[15px] font-medium text-slate-500">
            Manage your posted tuitions, track admin approval status, and view applicants.
          </p>
        </div>

        <Link href="/dashboard/mentor/posts/create">
          <Button className="h-12 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700">
            <PlusCircle className="mr-2 size-4" /> Create New Post
          </Button>
        </Link>
      </div>

      {/* Posts List */}
      <PostListClient initialPosts={posts} />
    </div>
  );
}
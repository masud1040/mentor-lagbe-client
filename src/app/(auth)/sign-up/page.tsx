"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { Loader2, GraduationCap, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"student" | "mentor">("student");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      password: string;
    };

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(user.password)) {
      toast.error(
        "Password must contain uppercase, lowercase and at least 6 characters."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        password: user.password,
        role: role,
        isPremium: false,
      });

      if (error) {
        console.error("Auth Error:", error);
        toast.error(error.message || "Registration failed!");
        setLoading(false);
        return;
      }

      if (data) {
        toast.success(`Account created as ${role}! Welcome to MentorLagbe.`);

        if (role === "mentor") {
          window.location.href = "/dashboard/mentor";
        } else {
          window.location.href = "/dashboard/student";
        }
      }
    } catch (error: unknown) {
      console.error("Signup Catch Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Database connection failed."
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-4 inline-block transition-opacity hover:opacity-85"
          >
            <div className="relative h-11 w-11">
              <Image
                src="/logo.png"
                alt="MentorLagbe Logo"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Join MentorLagbe and start your learning journey
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                    role === "student"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap className="size-4" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("mentor")}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                    role === "mentor"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <UserCheck className="size-4" />
                  Mentor
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="h-10 rounded-lg border-slate-200 bg-white px-3.5 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-10 rounded-lg border-slate-200 bg-white px-3.5 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                minLength={6}
                required
                disabled={loading}
                className="h-10 rounded-lg border-slate-200 bg-white px-3.5 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
              <p className="text-xs text-slate-400">
                At least 6 characters with uppercase and lowercase letters.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
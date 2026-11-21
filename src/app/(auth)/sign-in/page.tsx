"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    try {
      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

      if (error) {
        console.error("Signin Auth Error:", error);
        toast.error(error.message || "Invalid email or password!");
        setLoading(false);
        return;
      }

      if (data) {
        toast.success("Welcome back!");

        const userRole =
          (data.user as { role?: string }).role || "student";

        if (userRole === "admin") {
          window.location.href = "/dashboard/admin";
        } else if (userRole === "mentor") {
          window.location.href = "/dashboard/mentor";
        } else {
          window.location.href = "/dashboard/student";
        }
      }
    } catch (error: unknown) {
      console.error("Signin Catch Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Network error occurred."
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-[400px] space-y-6">
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your MentorLagbe account
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
          <form onSubmit={handleSignIn} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                disabled={loading}
                className="h-10 rounded-lg border-slate-200 bg-white px-3.5 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
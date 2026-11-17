"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast"; 
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      toast.error("Password must contain uppercase, lowercase and at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        setLoading(false);
        return;
      }

      if (data) {
        toast.success("Account created successfully! Welcome to MentorLagbe.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Signup Error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error: unknown) {
      console.error("Google Signup Error:", error);
      toast.error(error instanceof Error ? error.message : "Google signup failed!");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 px-4 py-16 sm:py-24 flex items-center justify-center relative overflow-hidden">
      
      {/* Organic Background Elements */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-[100px]"></div>

      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6 inline-block transition-transform duration-300 hover:scale-105">
            <div className="relative h-14 w-14">
              <Image src="/logo.png" alt="MentorLagbe Logo" fill sizes="56px" className="object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            Join MentorLagbe and start your journey
          </p>
        </div>

        {/* Main Card Container */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/5">
          
          <Button
            type="button"
            variant="outline"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignUp}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-white py-6 text-[15px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100"
          >
            {googleLoading ? (
              <Loader2 className="mr-3 size-5 animate-spin text-slate-400" />
            ) : (
              <FcGoogle className="mr-3 size-5" />
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[13px] font-medium uppercase tracking-wider">
              <span className="bg-white px-4 text-slate-400">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-[14px] font-semibold text-slate-800">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                disabled={loading || googleLoading}
                className="h-13 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-[15px] transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[14px] font-semibold text-slate-800">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                disabled={loading || googleLoading}
                className="h-13 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-[15px] transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[14px] font-semibold text-slate-800">
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                minLength={6}
                required
                disabled={loading || googleLoading}
                className="h-13 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-[15px] transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              <p className="pl-1 mt-1.5 text-[12px] font-medium text-slate-500">
                Minimum 6 characters with uppercase and lowercase.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="mt-6 h-13 w-full rounded-2xl bg-blue-600 py-6 text-[15px] font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

        </div>

        <p className="text-center text-[15px] font-medium text-slate-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>

        <p className="px-6 text-center text-[13px] font-medium leading-relaxed text-slate-400">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-slate-500 hover:text-slate-700 underline underline-offset-2">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-slate-500 hover:text-slate-700 underline underline-offset-2">Privacy Policy</Link>.
        </p>

      </div>
    </div>
  );
}
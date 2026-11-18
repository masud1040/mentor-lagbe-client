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

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        console.log("User Logged In:", data.user);
        toast.success("Welcome back!");

        // Route dynamically based on the role stored in DB
        const userRole = data.user.role || "student";
        
        if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "mentor") {
          router.push("/dashboard/mentor");
        } else {
          router.push("/dashboard/student");
        }
        
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Signin Catch Error:", error);
      toast.error(error instanceof Error ? error.message : "Network error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", 
      });
    } catch (error: unknown) {
      console.error("Google Signin Error:", error);
      toast.error(error instanceof Error ? error.message : "Google sign-in failed!");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 px-4 py-16 sm:py-24 flex items-center justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-[100px]"></div>

      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col gap-8">
        
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6 inline-block transition-transform duration-300 hover:scale-105">
            <div className="relative h-14 w-14">
              <Image src="/logo.png" alt="MentorLagbe Logo" fill sizes="56px" className="object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">Sign in to continue your learning journey</p>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/5">
          
          <Button type="button" variant="outline" disabled={loading || googleLoading} onClick={handleGoogleSignIn} className="h-13 w-full rounded-2xl border border-slate-200 bg-white py-6 text-[15px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100">
            {googleLoading ? <Loader2 className="mr-3 size-5 animate-spin text-slate-400" /> : <FcGoogle className="mr-3 size-5" />}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[13px] font-medium uppercase tracking-wider">
              <span className="bg-white px-4 text-slate-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-[14px] font-semibold text-slate-800">Email Address</label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" required disabled={loading || googleLoading} className="h-13 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-[15px] transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[14px] font-semibold text-slate-800">Password</label>
                <Link href="/forgot-password" className="text-[13px] font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" name="password" placeholder="Enter your password" required disabled={loading || googleLoading} className="h-13 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-[15px] transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>

            <Button type="submit" disabled={loading || googleLoading} className="mt-6 h-13 w-full rounded-2xl bg-blue-600 py-6 text-[15px] font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:opacity-70">
              {loading ? <><Loader2 className="mr-2 size-5 animate-spin" />Signing In...</> : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-[15px] font-medium text-slate-600">
          Don't have an account? <Link href="/sign-up" className="font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline underline-offset-4">Create Account</Link>
        </p>

      </div>
    </div>
  );
}
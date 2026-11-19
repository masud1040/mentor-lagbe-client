"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

// Bilingual NavLinks Array
const navLinks = [
  { name: "Home / হোম", href: "/" },
  { name: "Browse Tuitions / খুঁজুন", href: "/tuitions" },
  { name: "Pricing / প্ল্যান", href: "/pricing" },
{ name: "Mentors", href: "/mentors", private: false },
  { name: "Dashboard", href: "/dashboard", private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Filter links based on authentication
  const visibleLinks = navLinks.filter(
    (link) => !link.private || !!user
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut();
      toast.success("Logged out successfully!");
      setProfileOpen(false);
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
   
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    {/* Logo Section */}
      <Link href="/" className="flex items-center group">
  <div className="relative h-[72px] w-[160px] sm:w-[200px] transition-transform duration-300 group-hover:scale-105">
    <Image
      src="/logo.png"
      alt="MentorLagbe Logo"
      fill
      sizes="(max-width: 768px) 160px, 200px"
      priority
      className="object-contain object-left scale-125 origin-left"
    />
  </div>
</Link>

        {/* Center Pill Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/60 bg-slate-50/80 p-1.5 shadow-sm md:flex backdrop-blur-sm">
          {visibleLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-blue-700 hover:bg-slate-200/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Dark Mode & Auth */}
        <div className="hidden items-center gap-4 lg:flex">
          
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Authentication Section */}
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:bg-slate-50 hover:border-blue-200"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-700">
                  {user.image ? (
                    <Image
                      width={32}
                      height={32}
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={15} />
                  )}
                </div>
                <span className="max-w-[90px] truncate text-[13px] font-bold text-slate-700">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-[13px] font-bold text-slate-800">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <UserRound size={15} />
                    Update Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-[13px] font-bold text-slate-700 transition hover:bg-white hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-blue-600 px-5 py-2 text-[13px] font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Icons */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-5 py-5 backdrop-blur-md md:hidden shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1.5">
            {visibleLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3.5 text-[14px] font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-slate-100 pt-5">
            {isPending ? (
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-700">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <UserRound size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-slate-800">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      View Profile & Settings
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-[13px] font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-3.5 text-center text-[13px] font-bold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-blue-600 py-3.5 text-center text-[13px] font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
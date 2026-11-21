"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearJwtToken } from "@/lib/api/jwt-client";
import toast from "react-hot-toast";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tuitions", href: "/tuitions" },
  { name: "Mentors", href: "/mentors" },
  { name: "Pricing", href: "/pricing" },
  { name: "Dashboard", href: "/dashboard", private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const visibleLinks = navLinks.filter((link) => !link.private || !!user);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut();
      clearJwtToken();
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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center">
          <div className="relative h-[68px] w-[155px] transition-transform duration-300 group-hover:scale-105 sm:w-[190px]">
            <Image
              src="/logo.png"
              alt="MentorLagbe Logo"
              fill
              sizes="(max-width: 768px) 155px, 190px"
              priority
              className="origin-left scale-125 object-contain object-left"
            />
          </div>
        </Link>

        {/* Center Pill Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/90 p-1.5 shadow-xs md:flex">
          {visibleLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-blue-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Auth Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-xs transition hover:border-blue-200 hover:bg-slate-50"
              >
                <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-700">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={15} />
                  )}
                </div>
                <span className="max-w-[95px] truncate text-[13px] font-bold text-slate-700">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-900/5">
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-[13px] font-bold text-slate-800">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <UserRound size={15} />
                      Update Profile
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={15} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-xs">
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle Menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200/80 bg-white px-4 pb-5 pt-4 shadow-xl md:hidden">
          {user && (
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-blue-50/70"
            >
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-700">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-600 shadow-2xs">
                Profile
              </span>
            </Link>
          )}

          <nav className="flex flex-col gap-1.5">
            {visibleLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {isPending ? (
              <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
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
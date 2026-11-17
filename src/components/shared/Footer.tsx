import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Lock
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        
        {/* Payment & Trust Banner - Organic Layout */}
        <div className="mb-20 flex flex-col items-center justify-between gap-10 rounded-[2rem] bg-slate-50 p-8 md:flex-row md:px-12 md:py-10">
          
          <div className="flex max-w-sm flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600">
              <Lock size={20} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Secure Payments</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">
              We process all transactions securely through Stripe. Your data is encrypted and protected.
            </p>
          </div>

          {/* Payment Cards Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end md:max-w-md">
            
            {/* Stripe */}
            <div className="flex h-12 w-[72px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
              <span className="text-[15px] font-bold tracking-tight text-[#635BFF]">stripe</span>
            </div>
            
            {/* VISA */}
            <div className="flex h-12 w-[72px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
              <span className="text-[17px] font-extrabold italic tracking-tighter text-[#1434CB]">VISA</span>
            </div>
            
            {/* AMEX */}
            <div className="flex h-12 w-[72px] items-center justify-center rounded-xl border border-slate-200 bg-[#006FCF] shadow-sm transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-bold tracking-widest text-white">AMEX</span>
            </div>
            
            {/* PayPal */}
            <div className="flex h-12 w-[72px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
              <span className="text-[14px] font-bold italic text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
            </div>

            {/* Mastercard */}
            <div className="flex h-12 w-[72px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-[#EB001B] opacity-90"></div>
                <div className="h-5 w-5 -ml-2 rounded-full bg-[#F79E1B] opacity-90"></div>
              </div>
            </div>

            {/* Apple Pay */}
            <div className="flex h-12 w-[72px] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5 text-slate-900">
              <svg className="h-4 w-4" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <span className="text-[13px] font-semibold">Pay</span>
            </div>

            {/* Google Pay */}
            <div className="flex h-12 w-[72px] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
              <span className="text-[16px] font-bold text-slate-600">G</span>
              <span className="text-[14px] font-medium text-slate-500">Pay</span>
            </div>

          </div>
        </div>

        {/* Custom Organic Grid Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="MentorLagbe Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Mentor<span className="text-blue-600">Lagbe</span>
              </span>
            </Link>
            
            <p className="mt-6 text-[15px] leading-relaxed text-slate-600 pr-6">
              বাংলাদেশের সবচেয়ে নির্ভরযোগ্য স্মার্ট টিউশন এবং মেন্টরশিপ প্ল্যাটফর্ম। ভেরিফাইড শিক্ষক ও শিক্ষার্থীদের সেতুবন্ধন।
            </p>

            <div className="mt-8 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-pink-600 hover:bg-pink-50 hover:text-pink-600 shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-700 hover:bg-blue-50 hover:text-blue-700 shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-[15px] font-bold text-slate-900">Quick Links</h3>
            <ul className="mt-6 space-y-4">
              {["Browse Tuitions", "Our Mentors", "Pricing Plans", "Become a Tutor"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[14px] font-medium text-slate-500 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[15px] font-bold text-slate-900">Support</h3>
            <ul className="mt-6 space-y-4">
              {["Help Center", "FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[14px] font-medium text-slate-500 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[15px] font-bold text-slate-900">Contact Us</h3>
            <ul className="mt-6 space-y-5">
              <li className="flex gap-3 text-slate-600">
                <MapPin size={18} className="shrink-0 text-slate-400 mt-0.5" />
                <span className="text-[14px] leading-relaxed">
                  Level-4, Awal Centre, Banani,<br />Dhaka - 1213
                </span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <Phone size={18} className="shrink-0 text-slate-400" />
                <span className="text-[14px] font-medium">+880 1600-000000</span>
              </li>
              <li className="flex gap-3 text-slate-600">
                <Mail size={18} className="shrink-0 text-slate-400" />
                <a href="mailto:support@mentorlagbe.com" className="text-[14px] font-medium hover:text-blue-600">
                  support@mentorlagbe.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col items-center justify-between border-t border-slate-100 pt-8 pb-4 md:flex-row">
          <p className="text-[14px] text-slate-500">
            © {new Date().getFullYear()} MentorLagbe. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0 text-[14px] font-medium text-slate-500">
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
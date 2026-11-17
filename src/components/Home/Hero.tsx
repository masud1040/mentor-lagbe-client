"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const sliderImages = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-blue-700 lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              #1 Mentorship Platform 🚀
            </div>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              আপনার পড়াশোনার জন্য <br className="hidden lg:block" />
              <span className="text-blue-600">Perfect Mentor</span> <br className="lg:hidden" /> খুঁজে নিন
            </h1>
            
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 lg:mx-0">
              দেশের সেরা শিক্ষক এবং প্রফেশনালদের সাথে যুক্ত হয়ে আপনার ক্যারিয়ার ও রেজাল্টকে নিয়ে যান অনন্য উচ্চতায়। ঘরে বসেই নিশ্চিত করুন সেরা গাইডলাইন।
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/tuitions"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/40 sm:w-auto"
              >
                <Search size={18} />
                টিউশন ব্রাউজ করুন
              </Link>
              
              <Link
                href="/sign-up"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-[15px] font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                টিউটর হিসেবে যোগ দিন
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-slate-100 pt-6 sm:flex-row lg:justify-start">
              <div className="flex -space-x-3">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="User" width={40} height={40} className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" />
                <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop" alt="User" width={40} height={40} className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" />
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="User" width={40} height={40} className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                <span className="font-bold text-slate-900">৫,০০০+</span> শিক্ষার্থী ও টিউটর যুক্ত আছেন
              </p>
            </div>
          </div>

          {/* Right Image Slider Content */}
          <div className="relative mx-auto mt-8 w-full max-w-lg lg:mt-0 lg:max-w-none">
            <div className="relative w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-2xl shadow-blue-900/10 aspect-[4/3]">
              {sliderImages.map((src, index) => (
                <Image
                  key={src}
                  src={src}
                  alt={`MentorLagbe Platform ${index + 1}`}
                  fill
                  priority={index === 0}
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${
                    currentImage === index ? "z-10 opacity-100" : "z-0 opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ))}
              
              <div className="absolute inset-0 z-20 rounded-[2rem] ring-1 ring-inset ring-slate-900/10"></div>
            </div>

            <div className="absolute -bottom-5 left-1/2 z-30 flex w-[220px] -translate-x-1/2 items-center gap-4 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100 lg:-bottom-6 lg:-left-6 lg:translate-x-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Search size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Verified</p>
                <p className="text-sm font-bold text-slate-900">Expert Tutors</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
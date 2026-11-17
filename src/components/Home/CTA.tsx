import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Premium Dark CTA Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-20 shadow-2xl sm:px-16 sm:py-24 lg:px-24">
          
          {/* Background Glow Effects */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-blue-600/30 blur-[100px]"></div>
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-purple-600/30 blur-[100px]"></div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              যেকোনো প্রয়োজনে আমাদের <br className="hidden sm:block" />
              <span className="text-blue-400">ইমেইল</span> করুন
            </h2>
            
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
              আপনার টিউশন বা মেন্টরশিপ রিলেটেড যেকোনো প্রশ্ন, অভিযোগ বা স্পেশাল রিকোয়ারমেন্ট থাকলে সরাসরি আমাদের মেইল করুন। আমাদের টিম দ্রুত যোগাযোগ করবে।
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              
              {/* Mailto Button - Opens Email App */}
              <a
                href="mailto:support@mentorlagbe.com?subject=Query about MentorLagbe"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/40 sm:w-auto"
              >
                <Mail size={18} />
                ইমেইল পাঠান
              </a>
              
              {/* Secondary Button */}
              <Link
                href="/sign-up"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-8 py-4 text-[15px] font-bold text-white ring-1 ring-white/20 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
              >
                একাউন্ট খুলুন
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, GraduationCap, Users, ArrowRight } from "lucide-react";

// TODO: Replace this static array with dynamic data from MongoDB API later
const featuredMentors = [
  {
    id: "m1",
    name: "Dr. Rakibul Hasan",
    banglaName: "ড. রাকিবুল হাসান",
    subject: "Higher Mathematics",
    university: "Dhaka University",
    rating: 4.9,
    reviews: 128,
    students: "500+",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "m2",
    name: "Farhana Yasmin",
    banglaName: "ফারহানা ইয়াসমিন",
    subject: "Software Engineering",
    university: "BUET",
    rating: 5.0,
    reviews: 85,
    students: "300+",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "m3",
    name: "Tanvir Ahmed",
    banglaName: "তানভীর আহমেদ",
    subject: "HSC Physics",
    university: "Rajshahi University",
    rating: 4.8,
    reviews: 210,
    students: "1K+",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
    verified: true,
  }
];

export default function FeaturedMentors() {
  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Meet Our <span className="text-blue-600">Top Mentors</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              দেশের সেরা বিশ্ববিদ্যালয়গুলোর অভিজ্ঞ ও ভেরিফাইড মেন্টরদের সাথে যুক্ত হয়ে আপনার প্রস্তুতি আরও মজবুত করুন।
            </p>
          </div>
          
          <Link 
            href="/mentors" 
            className="group hidden items-center gap-2 text-[15px] font-semibold text-blue-600 transition-colors hover:text-blue-700 md:flex"
          >
            View All Mentors
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Ready Mentor Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featuredMentors.map((mentor) => (
            <div 
              key={mentor.id} 
              className="group relative flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
            >
              {/* Profile Image & Badges */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-slate-50 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                {mentor.verified && (
                  <div className="absolute bottom-0 right-[25%] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm" title="Verified Mentor">
                    <ShieldCheck size={18} />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="text-center flex-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {mentor.name}
                </h3>
                <p className="mt-1 text-[14px] font-medium text-slate-500">
                  {mentor.banglaName}
                </p>

                <div className="mt-4 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <GraduationCap size={16} className="text-purple-600" />
                    {mentor.subject}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="truncate max-w-[200px]">{mentor.university}</span>
                  </div>
                </div>
              </div>

              {/* Stats & Action */}
              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="mb-5 flex items-center justify-between px-2">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{mentor.rating}</span>
                    <span className="text-xs font-medium text-slate-500">({mentor.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                    <Users size={16} className="text-blue-500" />
                    {mentor.students}
                  </div>
                </div>

                <Link
                  href={`/mentors/${mentor.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-[14px] font-bold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link 
            href="/mentors" 
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            View All Mentors
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
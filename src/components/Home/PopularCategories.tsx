import Link from "next/link";
import { 
  Code2, 
  FlaskConical, 
  GraduationCap, 
  MessagesSquare, 
  TrendingUp, 
  PenTool, 
  Briefcase, 
  BookOpen,
  ArrowRight
} from "lucide-react";

// Static Data for Categories
const categories = [
  {
    id: 1,
    name: "Web Development",
    banglaName: "ওয়েব ডেভেলপমেন্ট",
    tutors: "১২০+ মেন্টর",
    icon: Code2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    name: "HSC Science",
    banglaName: "এইচএসসি বিজ্ঞান",
    tutors: "৩৫০+ টিউটর",
    icon: FlaskConical,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 3,
    name: "University Admission",
    banglaName: "বিশ্ববিদ্যালয় ভর্তি",
    tutors: "২০০+ মেন্টর",
    icon: GraduationCap,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  {
    id: 4,
    name: "English Spoken",
    banglaName: "ইংরেজি স্পোকেন",
    tutors: "১৫০+ টিউটর",
    icon: MessagesSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 5,
    name: "Digital Marketing",
    banglaName: "ডিজিটাল মার্কেটিং",
    tutors: "৯০+ মেন্টর",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 6,
    name: "Graphic Design",
    banglaName: "গ্রাফিক ডিজাইন",
    tutors: "১১০+ মেন্টর",
    icon: PenTool,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  {
    id: 7,
    name: "Govt. Jobs & BCS",
    banglaName: "বিসিএস ও চাকরি",
    tutors: "১৩০+ টিউটর",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 8,
    name: "Religious Studies",
    banglaName: "কুরআন ও ধর্মশিক্ষা",
    tutors: "২৫০+ টিউটর",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function PopularCategories() {
  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Popular <span className="text-blue-600">Subjects</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              শিক্ষার্থীদের কাছে সবচেয়ে জনপ্রিয় ক্যাটাগরিগুলো থেকে আপনার পছন্দের বিষয় বা স্কিল বেছে নিন।
            </p>
          </div>
          
          <Link 
            href="/tuitions" 
            className="group hidden md:flex items-center gap-2 text-[15px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Explore All
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid (Shadcn Style Cards) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link 
                key={category.id} 
                href={`/tuitions?category=${category.id}`}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.bg} ${category.color} transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                <p className="mt-1 text-[15px] font-medium text-slate-500">
                  {category.banglaName}
                </p>
                
                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                    {category.tutors}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Button */}
        <div className="mt-10 flex md:hidden justify-center">
          <Link 
            href="/tuitions" 
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            Explore All Categories
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
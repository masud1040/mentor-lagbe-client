import { ShieldCheck, CreditCard, Target, Headphones } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Verified Mentors",
    banglaTitle: "ভেরিফাইড মেন্টর",
    description: "আমাদের প্ল্যাটফর্মে যুক্ত হওয়া প্রতিটি টিউটর এবং মেন্টরের ব্যাকগ্রাউন্ড, এনআইডি (NID) এবং শিক্ষাগত যোগ্যতা কঠোরভাবে ভেরিফাই করা হয়।",
    icon: ShieldCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderHover: "hover:border-blue-200",
    shadowHover: "hover:shadow-blue-900/5",
  },
  {
    id: 2,
    title: "Secure Payments",
    banglaTitle: "নিরাপদ পেমেন্ট",
    description: "Stripe-এর মাধ্যমে সম্পূর্ণ নিরাপদ ও ট্রান্সপারেন্ট পেমেন্ট সিস্টেম। কোনো হিডেন চার্জ নেই, আপনার প্রতিটি লেনদেন শতভাগ সুরক্ষিত।",
    icon: CreditCard,
    color: "text-purple-600",
    bg: "bg-purple-50",
    borderHover: "hover:border-purple-200",
    shadowHover: "hover:shadow-purple-900/5",
  },
  {
    id: 3,
    title: "Perfect Matching",
    banglaTitle: "সঠিক টিউটর নির্বাচন",
    description: "আপনার ক্লাসের ধরন, বাজেট এবং লোকেশন অনুযায়ী স্মার্ট সার্চ ও ফিল্টারিং সিস্টেমের মাধ্যমে সবচেয়ে উপযুক্ত টিউটরটি খুঁজে নিন সহজেই।",
    icon: Target,
    color: "text-slate-700",
    bg: "bg-slate-100",
    borderHover: "hover:border-slate-300",
    shadowHover: "hover:shadow-slate-900/5",
  },
  {
    id: 4,
    title: "24/7 Dedicated Support",
    banglaTitle: "সার্বক্ষণিক সাপোর্ট",
    description: "টিউটর বা শিক্ষার্থী, যেকোনো সমস্যায় আমাদের ডেডিকেটেড সাপোর্ট টিম সার্বক্ষণিক আপনার পাশে আছে দ্রুত সমাধান দেওয়ার জন্য।",
    icon: Headphones,
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderHover: "hover:border-blue-200",
    shadowHover: "hover:shadow-blue-900/5",
  }
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 lg:py-28 relative overflow-hidden">
      
      {/* Background Gradient Blurs for Premium Feel */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[400px] -translate-x-1/2 bg-blue-50/50 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why <span className="text-blue-600">Choose Us?</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            MentorLagbe শুধু একটি টিউশন মিডিয়া নয়, এটি আপনার শেখার জার্নিকে নিরাপদ ও স্মার্ট করার একটি সম্পূর্ণ ইকোসিস্টেম।
          </p>
        </div>

        {/* Premium Plate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id}
                className={`group relative flex flex-col sm:flex-row gap-6 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 ${feature.borderHover} ${feature.shadowHover} hover:shadow-xl`}
              >
                {/* Icon Container */}
                <div className="shrink-0">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={28} strokeWidth={1.75} />
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <span className="hidden sm:block text-slate-300">•</span>
                    <span className="text-[15px] font-semibold text-blue-600">
                      {feature.banglaTitle}
                    </span>
                  </div>
                  
                  <p className="text-[15px] leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
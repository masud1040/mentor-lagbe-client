import { UserPlus, Search, Rocket, Trophy } from "lucide-react";

const roadmapSteps = [
  {
    id: 1,
    label: "STEP 01",
    title: "Create Your Profile",
    description: "প্ল্যাটফর্মে নিজের একটি ফ্রি একাউন্ট তৈরি করুন এবং আপনার পড়াশোনার লেভেল ও পছন্দ সেট করুন — শূন্য থেকে শুরু।",
    icon: UserPlus,
  },
  {
    id: 2,
    label: "STEP 02",
    title: "Find the Perfect Match",
    description: "স্মার্ট সার্চ ও ফিল্টার ব্যবহার করে আপনার সাবজেক্ট, বাজেট এবং লোকেশন অনুযায়ী সেরা টিউটর বা মেন্টরশিপ ব্যাচ খুঁজে বের করুন।",
    icon: Search,
  },
  {
    id: 3,
    label: "STEP 03",
    title: "Connect & Enroll",
    description: "মেন্টরের প্রোফাইল, রেটিং ও রিভিউ দেখে কনফার্ম করুন এবং পেমেন্ট করে সেশন বা কোর্সে নিশ্চিন্তে এনরোল করুন।",
    icon: Rocket,
  },
  {
    id: 4,
    label: "STEP 04",
    title: "Start Learning",
    description: "লাইভ বা অফলাইন ক্লাসের মাধ্যমে আপনার মেন্টরের সাথে যুক্ত হয়ে পড়াশোনা শুরু করুন — clear path-এ এগিয়ে যান।",
    icon: Trophy,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Platform <span className="text-blue-600">Roadmap</span>
          </h2>
          <p className="mt-3 text-[15px] font-medium text-slate-500">
            Beginner থেকে Success — clear path-এ এগিয়ে যাও
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-blue-100 md:left-1/2 md:-translate-x-1/2"></div>

          <div className="flex flex-col gap-12 md:gap-16">
            {roadmapSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={step.id} 
                  className="relative flex w-full items-center justify-between"
                >
                  
                  <div className="absolute left-[28px] z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 md:left-1/2">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <div 
                    className={`w-full pl-20 md:w-[45%] md:pl-0 ${
                      isEven 
                        ? "md:mr-auto md:pr-10" 
                        : "md:ml-auto md:pl-10"
                    }`}
                  >
                    <div className="group rounded-[1.25rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        {step.label}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
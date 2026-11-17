"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// MentorLagbe-er jonno adapted FAQ data
const faqs = [
  {
    question: "এই প্ল্যাটফর্মটি কাদের জন্য?",
    answer: "যেসব শিক্ষার্থী অভিজ্ঞ টিউটর বা সঠিক গাইডলাইনের জন্য মেন্টর খুঁজছেন এবং যেসব শিক্ষক টিউশন খুঁজছেন—উভয়ের জন্যই MentorLagbe তৈরি করা হয়েছে।"
  },
  {
    question: "কেন আমার MentorLagbe ব্যবহার করা উচিত?",
    answer: "এখানে প্রতিটি মেন্টর ভেরিফাইড। আপনি আপনার বাজেট, সাবজেক্ট ও লোকেশন অনুযায়ী সহজেই ফিল্টার করে আপনার জন্য সবচেয়ে উপযুক্ত টিউটর খুঁজে নিতে পারবেন।"
  },
  {
    question: "টিউটর হিসেবে যুক্ত হতে কি পূর্ব অভিজ্ঞতা থাকা দরকার?",
    answer: "পূর্ব অভিজ্ঞতা থাকলে আপনি অগ্রাধিকার পাবেন, তবে নতুনদের জন্যও সুযোগ রয়েছে। আপনার স্কিল এবং প্রোফাইলের ভিত্তিতে স্টুডেন্টরা আপনাকে বেছে নিতে পারে।"
  },
  {
    question: "প্ল্যাটফর্মের মধ্যে কী কী সুবিধা আছে?",
    answer: "স্মার্ট সার্চ, ভেরিফাইড প্রোফাইল, সিকিউর পেমেন্ট সিস্টেম এবং ২৪/৭ সাপোর্ট সিস্টেম—যাতে আপনার শেখানো বা শেখার জার্নি হয় একদম চিন্তামুক্ত।"
  },
  {
    question: "টিউশন বা মেন্টরের সাথে কীভাবে যুক্ত হবো?",
    answer: "আপনার পছন্দমতো মেন্টরের প্রোফাইলে গিয়ে 'Book' বা 'Enroll' বাটনে ক্লিক করে সরাসরি যোগাযোগ এবং সেশন শুরু করতে পারবেন।"
  },
  {
    question: "প্রসেস Complete করতে কতদিন লাগবে?",
    answer: "অ্যাকাউন্ট তৈরি থেকে শুরু করে একজন মেন্টরের সাথে যুক্ত হতে মাত্র কয়েক মিনিট সময় লাগে। পেমেন্ট কনফার্ম হলেই সাথে সাথে আপনি কানেক্টেড হয়ে যাবেন।"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Image-er exact design) */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[42px]">
            আমাদের নিয়ে <span className="text-blue-600 underline decoration-blue-600 decoration-[4px] underline-offset-[10px]">আপনার জিজ্ঞাসা</span>
          </h2>
          <p className="mt-8 text-[15px] font-medium text-slate-500">
            Frequently asked questions about our platform
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-sm"
              >
                {/* Accordion Header / Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                >
                  <span className="text-[16px] font-bold text-slate-800">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    strokeWidth={2.5}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`} 
                  />
                </button>

                {/* Accordion Content (Smooth height transition via Grid) */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 px-6 pb-6 pt-4 text-[15px] leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
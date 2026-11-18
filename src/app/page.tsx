import CTA from "@/components/Home/CTA";
import FAQ from "@/components/Home/FAQ";
import FeaturedMentors from "@/components/Home/FeaturedMentors";
import Hero from "@/components/Home/Hero";
import HowItWorks from "@/components/Home/HowItWorks";
import PopularCategories from "@/components/Home/PopularCategories";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Navbar from "@/components/shared/Nav";
import Image from "next/image";

export default function Home() {
  return (
   <div>
     <Navbar/>
    <Hero/>
    <PopularCategories/>
    <WhyChooseUs/>
    <FeaturedMentors/>
    <HowItWorks/>
    <FAQ/>
   <CTA/>
   </div>

   
  );
}

import Hero from "@/components/Home/Hero";
import PopularCategories from "@/components/Home/PopularCategories";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Hero/>
    <PopularCategories/>
    <WhyChooseUs/>

   </div>
   
  );
}

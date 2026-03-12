"use client"

import React, { useEffect } from 'react'
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroSection from "@/components/HeroSection";
import LatestJobs from "@/components/LatestJobs";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

export default function Home() {


  const router = useRouter();
  const { user } = useSelector(store => store.auth);

  // ✅ ALWAYS call the hook
  useGetAllJobs();


  useEffect(() => {
    if (user?.role === 'recruiter') {
      router.push("/admin/companies");
    }
  }, []);


  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
}

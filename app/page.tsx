'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      
      {/* 1. NAVBAR / HEADER */}
      <nav className="flex justify-between items-center px-12 py-6 bg-transparent">
        <div className="text-2xl font-bold text-[#064E3B]">Panganesia</div>
        <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#" className="hover:text-green-700">Discover App</Link>
          <Link href="#" className="hover:text-green-700">Support</Link>
          {user ? (
            <Link href="/dashboard" className="bg-[#064E3B] text-white px-6 py-2 rounded-full font-bold hover:bg-green-900 transition">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="bg-[#064E3B] text-white px-8 py-2 rounded-full font-bold hover:bg-green-900 transition">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* 2. HERO SECTION (Sesuai Mockup) */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-between px-12 py-16 gap-10">
        {/* Kolom Kiri: Headline */}
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-tight">
            From <span className="inline-block px-4 py-1 border-2 border-green-400 rounded-full text-green-500">fresh produce</span> <br /> 
            to daily essentials!
          </h1>
          <p className="text-slate-500 text-lg max-w-md">
            Shop smarter and healthier with our curated selections.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-[#064E3B] text-white px-8 py-3 rounded-full font-bold hover:bg-green-900 transition shadow-lg">
              Get the app
            </button>
            <button className="bg-white border border-gray-200 text-slate-400 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition">
              Discover app
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Image Placeholder Besar */}
        <div className="w-full max-w-xl aspect-square bg-gray-200 rounded-[40px] flex items-center justify-center text-gray-400 font-medium italic shadow-inner">
          Image Placeholder
        </div>
      </section>

      {/* 3. CONTENT SECTION (Posisi Lingkaran & Kotak di Mockup) */}
      <section className="px-12 py-20 space-y-20">
        {/* Baris 1: Bulat Kiri, Kotak Kanan */}
        <div className="flex items-center gap-20">
          <div className="w-64 h-64 bg-gray-200 rounded-full shrink-0"></div>
          <div className="h-64 flex-1 bg-gray-200 rounded-3xl"></div>
        </div>

        {/* Baris 2: Bulat Tengah */}
        <div className="flex justify-center">
          <div className="w-64 h-64 bg-gray-200 rounded-full"></div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-gray-200 py-20 px-12 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 opacity-50">
          <div className="space-y-4">
            <div className="font-bold">Panganesia</div>
            <div className="w-full h-4 bg-gray-300 rounded"></div>
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-2 pt-10">
            <div className="w-full h-3 bg-gray-300 rounded"></div>
            <div className="w-full h-3 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-2 pt-10">
            <div className="w-full h-3 bg-gray-300 rounded"></div>
            <div className="w-full h-3 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-2 pt-10">
            <div className="w-full h-3 bg-gray-300 rounded"></div>
            <div className="w-full h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}
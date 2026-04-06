"use client";

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardRecipesPage() {
    const supabase = createClient();
    const router = useRouter();
    
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkRoleAndFetchRecipes = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (userData?.role === 'admin') {
                    router.push('/admin');
                    return; 
                }
            }

            // MENGAMBIL DATA RESEP DARI SUPABASE
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('id_recipe', { ascending: false });
                
            if (!error) {
                setRecipes(data || []);
            }
            
            setIsChecking(false);
        };
        
        checkRoleAndFetchRecipes();
    }, [router, supabase]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/'); 
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-green-700 font-bold">Memuat resep lezat...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-10 font-sans">
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold text-xl">
                        P
                    </div>
                </div>

                <div className="flex-1 max-w-xl mx-8 relative">
                    <input 
                        type="text" 
                        placeholder="Cari resep sehat..." 
                        className="bg-gray-100 w-full px-5 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-600 transition" 
                    />
                    <span className="absolute right-4 top-2.5 text-gray-400">🔍</span>
                </div>

                <div className="flex items-center gap-6">
                    {/* Link kembali ke Produk/Marketplace */}
                    <Link href="/dashboard" className="text-gray-500 font-bold flex items-center gap-2 hover:text-green-700 transition">
                        <span className="text-xl">🏪</span> Shop
                    </Link>
                    <Link href="/dashboard/keranjang" className="text-green-700 font-bold flex items-center gap-2 hover:text-green-800 transition">
                        <span className="text-xl">🛒</span> Cart
                    </Link>
                    <Link href="/dashboard/profile" className="text-yellow-500 font-bold flex items-center gap-2 hover:text-yellow-600 transition">
                        <span className="text-xl">👤</span> Profile
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="text-red-500 font-bold hover:bg-red-50 px-4 py-1.5 rounded-full border border-red-500 text-sm transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto mt-8 px-4">
                {/* Header Text */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-green-900 mb-1">HEALTHY RECIPES!</h1>
                        <p className="text-gray-500 text-sm">Temukan inspirasi olahan karbohidrat alternatif yang lezat & sehat.</p>
                    </div>
                </div>

                {/* Yellow Banner (Biar beda nuansa dengan produk) */}
                <div className="w-full h-48 bg-yellow-400 rounded-2xl p-8 flex flex-col justify-center relative mb-10 overflow-hidden shadow-lg">
                    <h2 className="text-[#064E3B] text-4xl font-black w-1/2 leading-tight">LET'S COOK<br/>TODAY !</h2>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#064E3B] flex items-center justify-center text-[#064E3B] cursor-pointer hover:bg-[#064E3B] hover:text-yellow-400 transition">
                        <span className="font-bold">{'>'}</span>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#064E3B]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#064E3B]/50"></div>
                        <div className="w-2 h-2 rounded-full bg-[#064E3B]/50"></div>
                    </div>
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recipes.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-gray-500 font-bold">
                            Belum ada resep yang tersedia saat ini.
                        </div>
                    ) : (
                        recipes.map((r: any) => (
                            <div key={r.id_recipe} className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-300">
                                
                                {/* Gambar Resep */}
                                <div className="relative h-48 w-full bg-gray-200 rounded-t-xl overflow-hidden">
                                    <img 
                                        src={r.gambar_url || '/placeholder.jpg'} 
                                        alt={r.judul_resep} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {/* Label Kategori */}
                                    <span className="absolute top-3 left-3 bg-yellow-400 text-[#064E3B] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        {r.kategori_jenis || 'Resep'}
                                    </span>
                                    {/* Tombol Favorit */}
                                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 transition">
                                        ♡
                                    </button>
                                </div>
                                
                                {/* Info Resep */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{r.judul_resep}</h3>
                                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                                        {r.deskripsi_singkat}
                                    </p>
                                    
                                    {/* Tombol Baca Resep */}
                                    <div className="mt-auto">
                                        <Link href={`/dashboard/recipes/${r.id_recipe}`}>
                                            <button className="w-full py-2 bg-[#2A8B36] text-white rounded-lg text-sm font-bold hover:bg-green-800 transition shadow-sm">
                                                Baca Resep
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
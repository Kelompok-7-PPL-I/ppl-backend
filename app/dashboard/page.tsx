"use client";

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    
    const [products, setProducts] = useState<any[]>([]);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkRoleAndFetchProducts = async () => {
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

            // MENGAMBIL DATA DARI SUPABASE
            // Menampilkan produk yang stoknya lebih dari 0 dan diurutkan dari yang terbaru
            const { data, error } = await supabase
                .from('produk')
                .select('*')
                .gt('stok', 0)
                .order('created_at', { ascending: false });
                
            if (!error) {
                setProducts(data || []);
            }
            
            setIsChecking(false);
        };
        
        checkRoleAndFetchProducts();
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
                <p className="text-green-700 font-bold">Memeriksa akses akun...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-10 font-sans">
            {/* Navbar Sesuai Mockup */}
            <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {/* Logo Placeholder */}
                    <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold text-xl">
                        P
                    </div>
                </div>

                {/* Search Bar Tengah */}
                <div className="flex-1 max-w-xl mx-8 relative">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-gray-100 w-full px-5 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-600 transition" 
                    />
                    <span className="absolute right-4 top-2.5 text-gray-400">🔍</span>
                </div>

                {/* Menu Kanan */}
                <div className="flex items-center gap-6">
                    {/* INI LINK BARU MENUJU HALAMAN RESEP */}
                    <Link href="/dashboard/recipes" className="text-orange-500 font-bold flex items-center gap-2 hover:text-orange-600 transition">
                        <span className="text-xl">🍳</span> Recipes
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
                {/* Welcome Text */}
                <h1 className="text-2xl font-extrabold text-green-900 mb-1">WELCOME!</h1>
                <p className="text-gray-500 text-sm mb-6">Take A Look Our Products And Check Out!</p>

                {/* Green Banner Sesuai Mockup */}
                <div className="w-full h-48 bg-[#2A8B36] rounded-2xl p-8 flex flex-col justify-center relative mb-10 overflow-hidden shadow-lg">
                    <h2 className="text-white text-4xl font-black w-1/2 leading-tight">CHECK THIS<br/>OUT !</h2>
                    {/* Panah kanan di banner */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-green-700 transition">
                        <span className="font-bold">{'>'}</span>
                    </div>
                    {/* Dots indicator mockup */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    </div>
                </div>

                {/* Product Grid - MENGGUNAKAN DATA ASLI */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-gray-500 font-bold">
                            Belum ada produk yang tersedia saat ini.
                        </div>
                    ) : (
                        products.map((p: any) => (
                            <div key={p.id_produk} className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-300">
                                
                                {/* Gambar Produk: Melengkung di atas saja */}
                                <div className="relative h-48 w-full bg-gray-200 rounded-t-xl overflow-hidden">
                                    <img 
                                        src={p.gambar_url || '/placeholder.jpg'} 
                                        alt={p.nama_produk} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {/* Label Promo jika produk sedang promo */}
                                    {p.is_promo && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                                            Promo
                                        </span>
                                    )}
                                    {/* Wishlist Icon (Berdasarkan mockup) */}
                                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 transition">
                                        ♡
                                    </button>
                                </div>
                                
                                {/* Info Produk */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{p.nama_produk}</h3>
                                    <p className="text-gray-600 text-sm mb-4 font-medium">
                                        Rp {p.harga ? p.harga.toLocaleString('id-ID') : 0}
                                    </p>
                                    
                                    {/* Tombol Detail dan Buy Now Sesuai Mockup */}
                                    <div className="flex gap-2 mt-auto">
                                        <Link href={`/dashboard/produk/${p.id_produk}`} className="w-1/2">
                                            <button className="w-full py-2 border border-green-700 text-green-700 rounded-lg text-sm font-bold hover:bg-green-50 transition">
                                                Detail
                                            </button>
                                        </Link>
                                        <button className="w-1/2 py-2 bg-[#2A8B36] text-white rounded-lg text-sm font-bold hover:bg-green-800 transition shadow-sm">
                                            Buy Now
                                        </button>
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
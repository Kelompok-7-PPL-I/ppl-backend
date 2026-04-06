"use client";

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const router = useRouter();
    const supabase = createClient();

    // Fungsi Logout Admin
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
        router.push('/'); // Lempar kembali ke Landing Page
        } else {
        alert("Gagal logout: " + error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Hijau Tua */}
        <aside className="w-64 bg-green-900 text-white flex flex-col">
            <div className="p-6 font-bold text-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full"></div> {/* Logo */}
            Panganesia
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/admin" className="block px-4 py-3 hover:bg-green-800 rounded-lg font-medium">Dashboard</Link>
            <Link href="/admin/customers" className="block px-4 py-3 hover:bg-green-800 rounded-lg font-medium">Customers</Link>
            <Link href="/admin/products" className="block px-4 py-3 hover:bg-green-800 rounded-lg font-medium">Products</Link>
            <Link href="/admin/recipes" className="block px-4 py-3 hover:bg-green-800 rounded-lg font-medium">Recipes</Link>
            <Link href="/admin/orders" className="block px-4 py-3 hover:bg-green-800 rounded-lg font-medium">Orders</Link>
            </nav>

            {/* Area Profil Admin & Tombol Logout */}
            <div className="p-6 border-t border-green-800 mt-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <div>
                <p className="font-bold text-sm">Admin</p>
                <p className="text-xs text-green-300">admin@panganesia</p>
                </div>
            </div>
            
            {/* TOMBOL LOGOUT */}
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-sm transition"
            >
                🚪 Logout
            </button>
            </div>
        </aside>

        {/* Area Konten Utama */}
        <main className="flex-1 flex flex-col">
            {/* Topbar Simple */}
            <header className="bg-white p-4 shadow-sm flex justify-between items-center px-8">
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 px-4 py-2 rounded-full w-96 outline-none text-sm"
            />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div> {/* Notif/Avatar */}
            </header>
            
            {/* Konten Halaman (Berubah-ubah tergantung rute) */}
            <div className="p-8">
            {children}
            </div>
        </main>
        </div>
    );
}
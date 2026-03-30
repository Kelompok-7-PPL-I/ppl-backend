'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, ShoppingBag, Settings } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
        } else {
            setUser(user);
        }
        setLoading(false);
        };
        getUser();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Memuat...</div>;

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex text-slate-800">
        
        {/* Sidebar Sederhana */}
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-6 shadow-sm">
            <div className="text-2xl font-bold text-[#064E3B] mb-10 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">P</div>
            Panganesia
            </div>
            
            <nav className="space-y-2 flex-1">
            <div className="flex items-center gap-3 p-3 bg-green-50 text-[#064E3B] rounded-xl font-semibold cursor-pointer">
                <LayoutDashboard size={20} /> Dashboard
            </div>
            <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-gray-50 rounded-xl transition cursor-not-allowed">
                <ShoppingBag size={20} /> Pesanan Saya
            </div>
            <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-gray-50 rounded-xl transition cursor-not-allowed">
                <Settings size={20} /> Pengaturan
            </div>
            </nav>

            <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition mt-auto font-medium"
            >
            <LogOut size={20} /> Keluar
            </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
            {/* Top Navbar Dashboard */}
            <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center px-8">
            <h1 className="text-xl font-bold text-slate-800">Ringkasan Akun</h1>
            
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.user_metadata?.full_name || 'User Panganesia'}</p>
                <p className="text-[10px] text-gray-400">{user?.email}</p>
                </div>
                
                {/* Logo Akun / Avatar User */}
                <div className="w-10 h-10 bg-[#064E3B] rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-green-100 overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" />
                ) : (
                    <User size={20} />
                )}
                </div>
            </div>
            </header>

            {/* Content Area (Kosongan) */}
            <div className="p-8">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl h-[400px] flex flex-col items-center justify-center text-gray-400">
                <LayoutDashboard size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-lg">Selamat Datang di Dashboard Panganesia!</p>
                <p className="text-sm">Fitur monitoring belanjaan kamu akan segera hadir di sini.</p>
            </div>
            </div>
        </main>
        </div>
    );
}
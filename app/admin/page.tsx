"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

// --- DATA DUMMY UNTUK GRAFIK & TABEL (Sesuai Mockup) ---
const trendData = [
    { bulan: 'Jan', pendapatan: 3000 },
    { bulan: 'Feb', pendapatan: 2000 },
    { bulan: 'Mar', pendapatan: 1500 },
    { bulan: 'Apr', pendapatan: 2500 },
    { bulan: 'Mei', pendapatan: 1800 },
    { bulan: 'Jun', pendapatan: 2200 },
    { bulan: 'Jul', pendapatan: 3500 },
    ];

    const categoryData = [
    { kategori: 'Beras', jumlah: 4000 },
    { kategori: 'Sereal', jumlah: 3000 },
    { kategori: 'Umbi', jumlah: 2000 },
    { kategori: 'Tepung', jumlah: 2800 },
    { kategori: 'Lainnya', jumlah: 1800 },
    ];

    const leaderboardData = [
    { id: 1, nama: 'Beras Merah Organik', terjual: 1254, pendapatan: 'Rp. 12.540.000', trend: '+12.5%', isUp: true },
    { id: 2, nama: 'Beras Hitam Premium', terjual: 1102, pendapatan: 'Rp. 11.020.000', trend: '+10.2%', isUp: true },
    { id: 3, nama: 'Singkong Keju Frozen', terjual: 980, pendapatan: 'Rp. 9.800.000', trend: '+5.4%', isUp: true },
    { id: 4, nama: 'Tepung Mocaf 1Kg', terjual: 850, pendapatan: 'Rp. 8.500.000', trend: '+2.1%', isUp: true },
    { id: 5, nama: 'Jagung Manis Pipil', terjual: 720, pendapatan: 'Rp. 7.200.000', trend: '-1.5%', isUp: false },
    ];

    export default function AdminDashboardPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState('Product');
    const [realStats, setRealStats] = useState({ produk: 0, customers: 0 });

    // Tarik sedikit data asli untuk digabung dengan data dummy
    useEffect(() => {
        const fetchStats = async () => {
        const { count: productCount } = await supabase.from('produk').select('*', { count: 'exact', head: true });
        const { count: customerCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer');
        setRealStats({ produk: productCount || 456, customers: customerCount || 12567 });
        };
        fetchStats();
    }, [supabase]);

    return (
        <div className="w-full pb-10">
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm">Selamat datang di admin panel Panganesia</p>
        </div>

        {/* --- 1. EMPAT KARTU RINGKASAN (Sesuai Mockup) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Kartu 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 text-xs font-bold mb-2">Total Penjualan</p>
            <h3 className="text-2xl font-black text-gray-800 mb-3">Rp 45.2 M</h3>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-md">+12.5%</span>
            </div>

            {/* Kartu 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 text-xs font-bold mb-2">Total Pesanan</p>
            <h3 className="text-2xl font-black text-gray-800 mb-3">8,234</h3>
            <span className="bg-yellow-100 text-yellow-600 text-[10px] font-bold px-3 py-1 rounded-md">+0.5%</span>
            </div>

            {/* Kartu 3 (Pakai data asli jika ada) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 text-xs font-bold mb-2">Total Produk</p>
            <h3 className="text-2xl font-black text-gray-800 mb-3">{realStats.produk}</h3>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-md">-2.5%</span>
            </div>

            {/* Kartu 4 (Teks Total Penjualan di mockup typo, aku ganti Total Customers) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 text-xs font-bold mb-2">Total Customers</p>
            <h3 className="text-2xl font-black text-gray-800 mb-3">{realStats.customers}</h3>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-md">+1%</span>
            </div>

        </div>

        {/* --- 2. DUA GRAFIK (AREA & BAR) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Grafik Kiri: Tren Penjualan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Tren Penjualan</h3>
            <p className="text-gray-400 text-xs mb-6">Penjualan dari pesanan 7 bulan terakhir</p>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="pendapatan" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Grafik Kanan: Kategori Produk */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Kategori Produk</h3>
            <p className="text-gray-400 text-xs mb-6">Penjualan per kategori</p>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="kategori" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    {/* Warna hijau sesuai mockup */}
                    <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

        </div>

        {/* --- 3. LEADERBOARD --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header & Tabs */}
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 gap-4">
            <h3 className="text-xl font-extrabold text-gray-800">Leaderboard</h3>
            <div className="flex bg-gray-50 p-1 rounded-lg">
                {['Product', 'Customers', 'Recipes'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition ${
                    activeTab === tab 
                        ? 'bg-yellow-400 text-[#064E3B] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab}
                </button>
                ))}
            </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
                <thead>
                {/* Header kuning sesuai mockup */}
                <tr className="bg-yellow-400 text-[#064E3B] text-sm font-extrabold">
                    <th className="p-4 w-16 text-center">No.</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Sold</th>
                    <th className="p-4">Revenue</th>
                    <th className="p-4">Trend</th>
                </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                {leaderboardData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-center text-gray-500 font-bold">{index + 1}.</td>
                    <td className="p-4 flex items-center gap-3">
                        {/* Kotak hijau gelap sbg placeholder gambar */}
                        <div className="w-10 h-10 bg-[#064E3B] rounded-lg"></div>
                        <span className="font-bold text-gray-800">{item.nama}</span>
                    </td>
                    <td className="p-4 text-gray-600">{item.terjual}</td>
                    <td className="p-4 font-bold text-gray-800">{item.pendapatan}</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold ${item.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {item.trend}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            
            {/* State Tab berubah sekadar info buat presentasi */}
            {activeTab !== 'Product' && (
            <div className="p-8 text-center text-gray-400 font-bold italic">
                Data untuk tab {activeTab} sedang disiapkan...
            </div>
            )}

        </div>
        </div>
    );
}
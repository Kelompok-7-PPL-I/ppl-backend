"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function AdminCustomersPage() {
    const supabase = createClient();
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. STATE UNTUK MENGATUR MUNCULNYA POP-UP MOCKUP
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const fetchCustomers = async () => {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

        if (!error) setCustomers(data || []);
        setIsLoading(false);
    };

    useEffect(() => { fetchCustomers(); }, []);

    // 2. FUNGSI UNTUK MEMUNCULKAN POP-UP (Belum dihapus datanya)
    const triggerDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // 3. FUNGSI UNTUK MENGHAPUS DATA KE SUPABASE (Jika diklik 'Yes')
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        
        // Sesuaikan 'id_user' dengan nama kolom ID di tabel users kamu
        const { error } = await supabase.from('users').delete().eq('id_user', itemToDelete); 
        
        if (!error) {
        fetchCustomers(); // Refresh tabel
        }
        
        // Tutup modal
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    // 4. FUNGSI UNTUK BATAL (Jika diklik 'No')
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    return (
        <div className="w-full relative">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">Customers</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-yellow-400 text-[#064E3B] text-sm font-bold">
                <th className="p-4">No</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
                {customers.map((c, i) => (
                <tr key={c.id_user} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{i + 1}</td>
                    <td className="p-4 font-bold text-gray-800">{c.nama}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${c.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {c.role}
                    </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                    {/* Panggil triggerDelete saat tombol tong sampah diklik */}
                    <button onClick={() => triggerDelete(c.id_user)} className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 text-red-600 transition">🗑️</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* TAMPILAN POP-UP MODAL CUSTOM (Sesuai Mockup) */}
        {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-96 overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-500 flex items-center justify-center rounded-full text-3xl mx-auto mb-4">
                    ⚠️
                </div>
                <h3 className="font-extrabold text-gray-800 text-xl mb-2">Warning!</h3>
                <p className="text-gray-500 text-sm mb-8">
                    Are you sure want to delete this account?
                </p>
                
                <div className="flex justify-center gap-4">
                    <button 
                    onClick={confirmDelete}
                    className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-[#064E3B] font-bold rounded-lg transition shadow-sm w-1/2"
                    >
                    Yes
                    </button>
                    <button 
                    onClick={cancelDelete}
                    className="px-8 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-lg transition w-1/2"
                    >
                    No
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fungsi untuk mengambil data dari Supabase
    const fetchOrders = async () => {
        // Menarik data order sekaligus nama user-nya (relasi)
        const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            users ( nama ) 
        `)
        .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

        if (error) {
        console.error("Gagal menarik data orders:", error.message);
        } else {
        setOrders(data || []);
        }
        setIsLoading(false);
    };

    // Panggil fungsi saat halaman pertama kali dimuat
    useEffect(() => {
        fetchOrders();
    }, [supabase]);

    // Fungsi Hapus (Delete)
    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus order ini?")) {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (!error) {
            alert("Order berhasil dihapus!");
            fetchOrders(); // Refresh tabel setelah dihapus
        }
        }
    };

    return (
        <div className="w-full font-sans">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Orders</h1>
            <p className="text-gray-500 text-sm">Kelola semua order Panganesia</p>
            </div>
            <button className="bg-[#064E3B] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-green-900 transition shadow-sm">
            Cetak Laporan
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-yellow-400 text-[#064E3B] text-sm">
                    <th className="p-4 font-bold whitespace-nowrap">No</th>
                    <th className="p-4 font-bold whitespace-nowrap">Id Order</th>
                    <th className="p-4 font-bold whitespace-nowrap">Tr. Date</th>
                    <th className="p-4 font-bold whitespace-nowrap">Nama User</th>
                    <th className="p-4 font-bold whitespace-nowrap">Total</th>
                    <th className="p-4 font-bold whitespace-nowrap">Pembayaran</th>
                    <th className="p-4 font-bold whitespace-nowrap">Status</th>
                    <th className="p-4 font-bold text-center whitespace-nowrap">Aksi</th>
                </tr>
                </thead>
                
                <tbody className="text-sm divide-y divide-gray-100">
                {isLoading ? (
                    <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 font-bold">Memuat data order...</td>
                    </tr>
                ) : orders.length === 0 ? (
                    <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 font-bold">Belum ada order masuk.</td>
                    </tr>
                ) : (
                    orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="p-4 text-gray-600">{index + 1}</td>
                        <td className="p-4 font-bold text-gray-800">{order.id}</td>
                        <td className="p-4 text-gray-600">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                        {/* Mengambil nama dari tabel relasi users */}
                        <td className="p-4 text-gray-800 font-medium">{order.users?.nama || 'User Tidak Diketahui'}</td>
                        <td className="p-4 font-bold text-[#064E3B]">Rp {order.total_harga?.toLocaleString('id-ID')}</td>
                        <td className="p-4 text-gray-600">{order.metode_pembayaran}</td>
                        <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            order.status === 'Selesai' ? 'bg-green-100 text-green-800 border border-green-200' :
                            order.status === 'Diproses' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                            {order.status || 'Menunggu'}
                        </span>
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 transition" title="Edit">
                            ✏️
                        </button>
                        {/* Fungsi Hapus Dipasang di Sini */}
                        <button onClick={() => handleDelete(order.id)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition" title="Hapus">
                            🗑️
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
    }
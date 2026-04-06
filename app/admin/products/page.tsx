"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  // State Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // State Modal Tambah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State untuk form teks dan file
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nama_produk: '',
    id_kategori: '',
    harga: '',
    stok: '',
    deskripsi: '',
    is_promo: false
  });

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('produk').select('*').order('id_produk', { ascending: false });
    if (!error) setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- LOGIKA HAPUS ---
  const triggerDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from('produk').delete().eq('id_produk', itemToDelete); 
    if (!error) fetchProducts();
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // --- LOGIKA TAMBAH (DENGAN UPLOAD BUCKET) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImage = async (uploadFile: File) => {
    const fileExt = uploadFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('panganesia')
      .upload(filePath, uploadFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('panganesia')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSubmit(true);

    try {
      let finalImageUrl = '/placeholder.jpg';

      if (file) {
        finalImageUrl = await uploadImage(file);
      }

      const { error } = await supabase.from('produk').insert([
        { 
          nama_produk: formData.nama_produk, 
          id_kategori: Number(formData.id_kategori),
          harga: Number(formData.harga), 
          stok: Number(formData.stok),
          deskripsi: formData.deskripsi,
          gambar_url: finalImageUrl,
          is_promo: formData.is_promo
        }
      ]);

      if (error) throw error;

      fetchProducts(); 
      setIsAddModalOpen(false); 
      setFormData({ nama_produk: '', id_kategori: '', harga: '', stok: '', deskripsi: '', is_promo: false }); 
      setFile(null);
    } catch (err: any) {
      alert("Gagal menambahkan produk: " + err.message);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Products</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#064E3B] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-green-900 transition shadow-sm"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-yellow-400 text-[#064E3B] text-sm font-bold">
                <th className="p-4">Gambar</th>
                <th className="p-4">Nama Produk</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Promo</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id_produk} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img src={p.gambar_url || '/placeholder.jpg'} alt={p.nama_produk} className="w-12 h-12 object-cover rounded-lg bg-gray-100 shadow-sm" />
                  </td>
                  <td className="p-4 font-bold text-gray-800">{p.nama_produk}</td>
                  <td className="p-4 text-[#064E3B] font-bold">Rp {p.harga?.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-gray-600">{p.stok}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.is_promo ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_promo ? 'Promo' : 'Normal'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => triggerDelete(p.id_produk)} className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 text-red-600 transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PRODUK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-extrabold text-gray-800 text-lg">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Produk</label>
                  <input type="text" name="nama_produk" required value={formData.nama_produk} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">ID Kategori</label>
                    <input type="number" name="id_kategori" required value={formData.id_kategori} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Stok Barang</label>
                    <input type="number" name="stok" required value={formData.stok} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Harga (Rp)</label>
                  <input type="number" name="harga" required value={formData.harga} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi Produk</label>
                  <textarea name="deskripsi" rows={3} value={formData.deskripsi} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                </div>
                {/* INI INPUTAN FILE UNTUK UPLOAD KE BUCKET */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Upload Foto Produk</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" name="is_promo" id="promo" checked={formData.is_promo} onChange={handleInputChange} className="w-4 h-4 text-green-600 focus:ring-yellow-400 border-gray-300 rounded" />
                  <label htmlFor="promo" className="text-sm font-bold text-gray-700">Produk Sedang Promo</label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 shrink-0 bg-gray-50">
              <button 
                type="submit" 
                form="productForm" 
                disabled={isLoadingSubmit}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#064E3B] font-bold py-3 rounded-lg shadow-sm transition"
              >
                {isLoadingSubmit ? 'Menyimpan...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-500 flex items-center justify-center rounded-full text-3xl mx-auto mb-4">⚠️</div>
            <h3 className="font-extrabold text-gray-800 text-xl mb-2">Warning!</h3>
            <p className="text-gray-500 text-sm mb-8">Yakin ingin menghapus produk ini?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-[#064E3B] font-bold rounded-lg transition w-1/2">Yes</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-8 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-lg transition w-1/2">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
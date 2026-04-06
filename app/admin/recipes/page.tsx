"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function AdminRecipesPage() {
    const supabase = createClient();
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    // State Modal Hapus
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // State Modal Tambah
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        judul_resep: '',
        kategori_jenis: '',
        deskripsi_singkat: '',
        bahan_bahan: '',
        langkah_masak: '',
        informasi_gizi: ''
    });

    const fetchRecipes = async () => {
        const { data, error } = await supabase.from('recipes').select('*').order('id_recipe', { ascending: false });
        if (!error) setRecipes(data || []);
    };

    useEffect(() => { fetchRecipes(); }, []);

    // --- LOGIKA HAPUS ---
    const triggerDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const { error } = await supabase.from('recipes').delete().eq('id_recipe', itemToDelete);
        if (!error) fetchRecipes();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    // --- LOGIKA TAMBAH (DENGAN UPLOAD BUCKET) ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadRecipeImage = async (uploadFile: File) => {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `recipes/${fileName}`;

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
                finalImageUrl = await uploadRecipeImage(file);
            }

            const { error } = await supabase.from('recipes').insert([
                {
                    judul_resep: formData.judul_resep,
                    kategori_jenis: formData.kategori_jenis,
                    deskripsi_singkat: formData.deskripsi_singkat,
                    bahan_bahan: formData.bahan_bahan,
                    langkah_masak: formData.langkah_masak,
                    informasi_gizi: formData.informasi_gizi,
                    gambar_url: finalImageUrl
                }
            ]);

            if (error) throw error;

            fetchRecipes();
            setIsAddModalOpen(false);
            setFormData({ judul_resep: '', kategori_jenis: '', deskripsi_singkat: '', bahan_bahan: '', langkah_masak: '', informasi_gizi: '' });
            setFile(null);
        } catch (err: any) {
            alert("Gagal menambahkan resep: " + err.message);
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    return (
        <div className="w-full relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Recipes</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#064E3B] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-green-900 transition shadow-sm"
                >
                    + Tambah Resep
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                            <tr className="bg-yellow-400 text-[#064E3B] text-sm font-bold">
                                <th className="p-4">Foto</th>
                                <th className="p-4">Judul Resep</th>
                                <th className="p-4">Kategori Jenis</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {recipes.map((r) => (
                                <tr key={r.id_recipe} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <img src={r.gambar_url || '/placeholder.jpg'} alt={r.judul_resep} className="w-12 h-12 object-cover rounded-lg bg-gray-100 shadow-sm" />
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">{r.judul_resep}</td>
                                    <td className="p-4 text-gray-600">{r.kategori_jenis}</td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button onClick={() => triggerDelete(r.id_recipe)} className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 text-red-600 transition">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL TAMBAH RESEP */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-[600px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                            <h3 className="font-extrabold text-gray-800 text-lg">Add New Recipe</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="recipeForm" onSubmit={handleAddSubmit} className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-2/3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Judul Resep</label>
                                        <input type="text" name="judul_resep" required value={formData.judul_resep} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Kategori/Jenis</label>
                                        <input type="text" name="kategori_jenis" required value={formData.kategori_jenis} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi Singkat</label>
                                    <textarea name="deskripsi_singkat" rows={2} required value={formData.deskripsi_singkat} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Bahan-Bahan</label>
                                    <textarea name="bahan_bahan" rows={3} required value={formData.bahan_bahan} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Langkah Memasak</label>
                                    <textarea name="langkah_masak" rows={3} required value={formData.langkah_masak} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Informasi Gizi</label>
                                    <textarea name="informasi_gizi" rows={2} value={formData.informasi_gizi} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                                </div>
                                {/* INI INPUTAN FILE UNTUK UPLOAD KE BUCKET */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Upload Foto Hasil Masakan</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 shrink-0 bg-gray-50">
                            <button
                                type="submit"
                                form="recipeForm"
                                disabled={isLoadingSubmit}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-[#064E3B] font-bold py-3 rounded-lg shadow-sm transition"
                            >
                                {isLoadingSubmit ? 'Menyimpan...' : 'Save Recipe'}
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
                        <p className="text-gray-500 text-sm mb-8">Yakin ingin menghapus resep ini?</p>
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
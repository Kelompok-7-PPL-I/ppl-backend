"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import Link from "next/link";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    // Validasi email sederhana untuk mencegah karakter berbahaya
    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setError("Format email tidak valid atau mengandung karakter tidak aman.");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Instruksi pemulihan kata sandi telah dikirim ke email kamu.");
            setEmail(""); // Kosongkan input setelah sukses
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                
                {/* Icon Header */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#064E3B]">
                    <Mail size={32} />
                </div>

                <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Lupa Kata Sandi?</h2>
                <p className="text-slate-500 text-sm text-center mb-8">
                    Masukkan email terdaftar kamu. Kami akan mengirimkan link untuk mengatur ulang kata sandi.
                </p>

                {/* Alert Sukses */}
                {message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm mb-6 border border-green-200 flex items-start gap-3">
                        <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                        <span>{message}</span>
                    </div>
                )}

                {/* Alert Error */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6 border border-red-200 flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="relative">
                        <input 
                            type="email" 
                            placeholder="nama@email.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-green-600 text-slate-900 placeholder:text-gray-400 bg-white transition-all" 
                        />
                    </div>

                    <button 
                        disabled={loading || !email} 
                        className="w-full bg-[#064E3B] text-white py-3 rounded-lg font-bold hover:bg-green-900 transition duration-200 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Mengirim...' : 'Kirim Link Pemulihan'}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-gray-100">
                    <Link href="/login" className="text-[#064E3B] text-sm font-bold flex items-center justify-center gap-2 hover:underline">
                        <ArrowLeft size={16} /> Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Pakai path relatif biar TypeScript nggak error cari folder utils
import { createClient } from '../../utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // 1. Proses cek email & password ke sistem Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // 2. CEK ROLE: Tarik data role dari tabel 'users' berdasarkan email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

      if (userError) {
        console.error("Gagal ambil role:", userError);
        // Fallback: Kalau gagal ngecek role, lempar ke dashboard biasa
        router.push('/dashboard');
      } else {
        // 3. PEMISAHAN JALUR: Admin ke /admin, selain itu ke /dashboard
        if (userData?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
      
      // Refresh perlu supaya server component sadar kalau session sudah ada
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        // Catatan: Kalau login pakai Google, sementara arahnya tetap ke dashboard
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` 
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Logo Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#064E3B]">
          P
        </div>
        
        {/* Judul */}
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
          Masuk ke Panganesia
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 text-slate-900 placeholder:text-gray-500 bg-white" 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Kata Sandi" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 text-slate-900 placeholder:text-gray-500 bg-white" 
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-[#064E3B] text-white py-3 rounded-lg font-bold hover:bg-green-900 transition shadow-md disabled:opacity-50"
          >
            {loading ? 'MEMPROSES...' : 'LOGIN'}
          </button>
        </form>

        <div className="relative w-full my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-white text-gray-400">Atau</span></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition text-slate-700 font-semibold"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Masuk dengan Google
        </button>

        <div className="text-center mt-8 text-sm space-y-3">
          <p className="text-slate-600">
            Belum punya akun? <Link href="/register" className="text-[#064E3B] font-bold hover:underline">DAFTAR</Link>
          </p>
          <Link
            href="/forgot-password"
            className="text-slate-500 hover:text-[#064E3B] hover:underline text-xs block transition"
          >
            Lupa kata sandi?
          </Link>
        </div>
      </div>
    </div>
  );
}
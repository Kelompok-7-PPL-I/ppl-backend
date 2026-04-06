'use client';

import { useState } from 'react';
import { createClient } from '../../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  // --- Logika Keamanan Password (Sama dengan Register) ---
  const requirements = [
    { re: /.{8,}/, label: "Minimal 8 Karakter" },
    { re: /[A-Z]/, label: "Minimal 1 Huruf Besar" },
    { re: /[0-9]/, label: "Minimal 1 Angka" },
    { re: /^[a-zA-Z0-9.]+$/, label: "Karakter Aman (a-z, A-Z, 0-9, .)" },
  ];

  const metRequirements = requirements.filter(req => req.re.test(password)).length;
  
  const getStrength = () => {
    if (password.length === 0) return { label: "", color: "bg-slate-200", text: "" };
    if (metRequirements <= 1) return { label: "Lemah", color: "bg-red-500", text: "text-red-500" };
    if (metRequirements <= 3) return { label: "Normal", color: "bg-yellow-500", text: "text-yellow-500" };
    return { label: "Kuat", color: "bg-green-500", text: "text-green-500" };
  };

  const strength = getStrength();
  const isAllMet = metRequirements === requirements.length;
  const isMatch = password === confirmPassword && confirmPassword !== "";

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllMet || !isMatch) return;

    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Password berhasil diperbarui! Silakan login kembali.");
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Icon Header */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#064E3B]">
          <Lock size={32} />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Perbarui Kata Sandi</h2>
        <p className="text-slate-500 text-sm text-center mb-8">Buat kata sandi baru yang kuat untuk akun Panganesia kamu.</p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs mb-4 border border-red-200 flex items-center gap-2">
            <X size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Input Password Baru */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">KATA SANDI BARU</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-600 outline-none pr-12 text-slate-900 bg-white transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className={strength.text}>Kekuatan: {strength.label}</span>
                <span className="text-slate-400">{metRequirements}/4 Syarat</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${strength.color}`} 
                  style={{ width: `${(metRequirements / 4) * 100}%` }}
                ></div>
              </div>
              <ul className="grid grid-cols-2 gap-1 mt-1">
                {requirements.map((req, i) => (
                  <li key={i} className={`flex items-center gap-1 text-[9px] ${req.re.test(password) ? "text-green-600" : "text-slate-400"}`}>
                    {req.re.test(password) ? <Check size={10} /> : <X size={10} />}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Konfirmasi Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">KONFIRMASI KATA SANDI</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition-all text-slate-900 ${
                confirmPassword && (isMatch ? 'border-green-500' : 'border-red-500')
              }`}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && (
              <p className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${isMatch ? "text-green-600" : "text-red-500"}`}>
                {isMatch ? <><Check size={12} /> Password cocok</> : <><X size={12} /> Password tidak cocok</>}
              </p>
            )}
          </div>

          <button
            disabled={!isAllMet || !isMatch || loading}
            className="w-full bg-[#064E3B] text-white p-3 rounded-lg font-bold hover:bg-green-900 transition duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md mt-4"
          >
            {loading ? "MEMPROSES..." : "PERBARUI KATA SANDI"}
          </button>
        </form>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/store/auth';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    if (ok) {
      router.replace('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#c8a96e]/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c8a96e]/10 to-transparent" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-[#c8a96e] flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-white font-bold text-xl">N</span>
          </div>
          <h1 className="font-display text-4xl text-white mb-2">Nexa Admin</h1>
          <p className="font-body text-xs text-gray-500 tracking-[0.2em] uppercase">Dealership Management Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-gray-400 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm font-body focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-gray-600"
                placeholder="admin@nexacars.in"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-gray-400 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-gray-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8a96e] text-white py-3 font-body text-sm tracking-widest uppercase hover:bg-[#b8956a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="font-body text-xs text-gray-600 text-center mt-6">
            Default: admin@nexacar.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}

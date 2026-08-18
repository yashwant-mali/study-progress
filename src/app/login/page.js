 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '@/store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error, initialized } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (initialized && user) router.replace('/');
  }, [initialized, user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) router.replace('/');
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#070B16] px-4 text-[#F8FAFC]">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#111827] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#94A3B8]">StudyFlow</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Sign in to continue your study progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-[#CBD5E1]">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-[#6366F1]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-[#CBD5E1]">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-[#6366F1]"
              placeholder="••••••••"
            />
          </label>

          {error ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#22D3EE] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          New here?{' '}
          <Link href="/register" className="font-semibold text-[#22D3EE] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

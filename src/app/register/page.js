'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, register } from '@/store/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error, initialized } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (initialized && user) router.replace('/');
  }, [initialized, user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    dispatch(clearAuthError());

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await dispatch(register({
      name: form.name,
      email: form.email,
      password: form.password,
    }));

    if (register.fulfilled.match(result)) router.replace('/login');
  };

  const message = localError || error;

  return (
    <main className="grid min-h-screen place-items-center bg-[#070B16] px-4 text-[#F8FAFC]">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#111827] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#94A3B8]">StudyFlow</p>
          <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Keep your study workspace private and personalized.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ['name', 'Name', 'text', 'name', 'Your name'],
            ['email', 'Email', 'email', 'email', 'you@example.com'],
            ['password', 'Password', 'password', 'new-password', 'At least 8 characters'],
            ['confirmPassword', 'Confirm password', 'password', 'new-password', 'Repeat your password'],
          ].map(([key, label, type, autoComplete, placeholder]) => (
            <label className="block" key={key}>
              <span className="mb-2 block text-sm text-[#CBD5E1]">{label}</span>
              <input
                type={type}
                required
                minLength={key === 'password' ? 8 : undefined}
                autoComplete={autoComplete}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-[#6366F1]"
                placeholder={placeholder}
              />
            </label>
          ))}

          {message ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#22D3EE] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#22D3EE] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

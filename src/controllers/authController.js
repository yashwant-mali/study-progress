import { authenticateUser, createUser, findUserByEmail, findUserById } from '@/models/userModel';
import { createToken } from '@/lib/auth';
import { migrateLegacyTopicsToUser } from '@/models/topicModel';

function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export async function register({ name, email, password }) {
  if (!name?.trim()) throw validationError('Name is required');
  if (!email?.trim()) throw validationError('Email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw validationError('Enter a valid email');
  if (!password || password.length < 8) throw validationError('Password must be at least 8 characters');

  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error('An account with this email already exists');
    error.status = 409;
    throw error;
  }

  return createUser({ name, email, password });
}

export async function login({ email, password }) {
  if (!email?.trim() || !password) throw validationError('Email and password are required');

  const user = await authenticateUser(email, password);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Migrate legacy topics exactly once to the currently authenticated account.
  // Future accounts will only see their own data.
  await migrateLegacyTopicsToUser(user.id);

  return {
    user,
    token: createToken({ sub: user.id, email: user.email, role: user.role }),
  };
}

export async function getCurrentUser(userId) {
  if (!userId) return null;
  const user = await findUserById(userId);
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role || 'USER',
    createdAt: user.createdAt,
  };
}

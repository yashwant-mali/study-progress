import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';

const COLLECTION = 'users';

function publicUser(user) {
  if (!user) return null;
  return {
    id: user._id?.toString ? user._id.toString() : user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'USER',
    createdAt: user.createdAt,
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = String(storedPassword || '').split(':');
  if (!salt || !storedHash) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(derived, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function findUserByEmail(email) {
  const { db } = await connectToDatabase();
  return db.collection(COLLECTION).findOne({ email: email.trim().toLowerCase() });
}

export async function findUserById(id) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import('mongodb');
  if (!ObjectId.isValid(id)) return null;
  return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const user = {
    name: name.trim(),
    email: normalizedEmail,
    password: hashPassword(password),
    role: 'USER',
    createdAt: now,
    updatedAt: now,
  };

  const { db } = await connectToDatabase();
  const result = await db.collection(COLLECTION).insertOne(user);
  return publicUser({ ...user, _id: result.insertedId });
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password)) return null;
  return publicUser(user);
}

import * as FileSystem from 'expo-file-system';

const DB_PATH = FileSystem.documentDirectory + 'db.json';
const SEED = require('./db.json');

async function read() {
  try {
    const info = await FileSystem.getInfoAsync(DB_PATH);
    if (!info.exists) {
      await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(await FileSystem.readAsStringAsync(DB_PATH));
  } catch { return SEED; }
}

async function write(data) {
  await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify(data));
}

export async function getDB() { return await read(); }

export async function login(phone) {
  const db = await read();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return null;
  db.currentUser = user.id;
  await write(db);
  return user;
}

export async function logout() {
  const db = await read();
  db.currentUser = null;
  await write(db);
}

export async function register(data) {
  const db = await read();
  if (db.users.find(u => u.phone === data.phone)) return null;
  const user = {
    id: 'u' + Date.now(),
    phone: data.phone,
    name: data.name,
    email: data.email || '',
    addresses: [{
      id: 'a1', label: 'Home',
      lane: data.lane, building: data.building,
      city: data.city, pincode: data.pincode
    }],
    wallet: 0, darkMode: false,
    essentialsMode: false, coldSeparation: true,
    orders: [], cart: []
  };
  db.users.push(user);
  db.currentUser = user.id;
  await write(db);
  return user;
}

export async function getCurrentUser() {
  const db = await read();
  if (!db.currentUser) return null;
  return db.users.find(u => u.id === db.currentUser) || null;
}

export async function updateUser(userId, patch) {
  const db = await read();
  const i = db.users.findIndex(u => u.id === userId);
  if (i === -1) return;
  db.users[i] = { ...db.users[i], ...patch };
  await write(db);
  return db.users[i];
}

export async function updateCart(userId, cart) {
  return await updateUser(userId, { cart });
}

export async function getProducts() {
  const db = await read();
  return db.products;
}

export async function getSwaps(productId) {
  const db = await read();
  return db.swaps[productId] || [];
}
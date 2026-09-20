import * as SQLite from 'expo-sqlite';
let db;
export async function getDatabase() { if (!db) db = await SQLite.openDatabaseAsync('smartwallet.db'); return db; }
export async function initializeDatabase() {
  const database = await getDatabase();
  await database.execAsync(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, type TEXT NOT NULL, category TEXT NOT NULL, merchant TEXT NOT NULL, date TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'manual', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS budgets (id INTEGER PRIMARY KEY AUTOINCREMENT, month INTEGER NOT NULL, year INTEGER NOT NULL, amount REAL NOT NULL, UNIQUE(month, year));
    CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, target_amount REAL NOT NULL, current_amount REAL NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
}

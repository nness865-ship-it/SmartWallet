import { getDatabase } from '../database/database';
export async function fetchTransactions() { return (await getDatabase()).getAllAsync('SELECT * FROM transactions ORDER BY date DESC, id DESC'); }
export async function saveTransaction(transaction) {
  const db = await getDatabase();
  const { amount, type, category, merchant, date, source = 'manual' } = transaction;
  if (transaction.id) { await db.runAsync('UPDATE transactions SET amount=?, type=?, category=?, merchant=?, date=?, source=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', amount, type, category, merchant, date, source, transaction.id); return transaction; }
  const result = await db.runAsync('INSERT INTO transactions (amount,type,category,merchant,date,source) VALUES (?,?,?,?,?,?)', amount, type, category, merchant, date, source);
  return { ...transaction, id: result.lastInsertRowId };
}
export async function removeTransaction(id) { await (await getDatabase()).runAsync('DELETE FROM transactions WHERE id=?', id); }

import { getDatabase } from '../database/database';
export async function fetchBudget() { const d = new Date(); return (await getDatabase()).getFirstAsync('SELECT * FROM budgets WHERE month=? AND year=?', d.getMonth() + 1, d.getFullYear()); }
export async function saveBudget(amount) { const d = new Date(); const db = await getDatabase(); await db.runAsync('INSERT INTO budgets (month,year,amount) VALUES (?,?,?) ON CONFLICT(month,year) DO UPDATE SET amount=excluded.amount', d.getMonth()+1, d.getFullYear(), amount); return fetchBudget(); }

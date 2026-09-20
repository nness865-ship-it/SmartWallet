import { getDatabase } from '../database/database';
export async function fetchGoals() { return (await getDatabase()).getAllAsync('SELECT * FROM goals ORDER BY created_at DESC'); }
export async function saveGoal(goal) { const db = await getDatabase(); const r = await db.runAsync('INSERT INTO goals (name,target_amount,current_amount) VALUES (?,?,?)', goal.name, goal.target_amount, goal.current_amount || 0); return { ...goal, id: r.lastInsertRowId }; }
export async function contributeToGoal({ id, amount }) { const db = await getDatabase(); await db.runAsync('UPDATE goals SET current_amount = current_amount + ? WHERE id=?', amount, id); }
export async function removeGoal(id) { await (await getDatabase()).runAsync('DELETE FROM goals WHERE id=?', id); }

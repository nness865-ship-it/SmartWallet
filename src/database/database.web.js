// Browser-only adapter. Native builds use database.js and Expo SQLite.
// It mirrors the small database API used by the services so the web preview is interactive.
const keys = { transactions: 'smartwallet_transactions', budgets: 'smartwallet_budgets', goals: 'smartwallet_goals' };
const read = name => JSON.parse(localStorage.getItem(keys[name]) || '[]');
const write = (name, value) => localStorage.setItem(keys[name], JSON.stringify(value));
const nextId = rows => rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;

export async function initializeDatabase() {}
export async function getDatabase() {
  return {
    async getAllAsync(sql) {
      if (sql.includes('FROM transactions')) return read('transactions').sort((a, b) => `${b.date}-${b.id}`.localeCompare(`${a.date}-${a.id}`));
      if (sql.includes('FROM goals')) return read('goals').sort((a, b) => b.id - a.id);
      return [];
    },
    async getFirstAsync(sql, month, year) {
      if (sql.includes('FROM budgets')) return read('budgets').find(b => b.month === month && b.year === year) || null;
      return null;
    },
    async runAsync(sql, ...args) {
      if (sql.startsWith('INSERT INTO transactions')) {
        const rows = read('transactions'); const id = nextId(rows);
        rows.push({ id, amount: args[0], type: args[1], category: args[2], merchant: args[3], date: args[4], source: args[5] }); write('transactions', rows); return { lastInsertRowId: id };
      }
      if (sql.startsWith('UPDATE transactions')) { const rows = read('transactions'); const id = args[6]; write('transactions', rows.map(row => row.id === id ? { ...row, amount:args[0], type:args[1], category:args[2], merchant:args[3], date:args[4], source:args[5] } : row)); return {}; }
      if (sql.startsWith('DELETE FROM transactions')) { write('transactions', read('transactions').filter(row => row.id !== args[0])); return {}; }
      if (sql.startsWith('INSERT INTO budgets')) { const rows=read('budgets'); const current=rows.find(row=>row.month===args[0]&&row.year===args[1]); if(current) current.amount=args[2]; else rows.push({id:nextId(rows),month:args[0],year:args[1],amount:args[2]}); write('budgets',rows); return {}; }
      if (sql.startsWith('INSERT INTO goals')) { const rows=read('goals'); const id=nextId(rows); rows.push({id,name:args[0],target_amount:args[1],current_amount:args[2]}); write('goals',rows); return {lastInsertRowId:id}; }
      if (sql.startsWith('UPDATE goals')) { const rows=read('goals'); write('goals',rows.map(row=>row.id===args[1]?{...row,current_amount:Number(row.current_amount)+Number(args[0])}:row)); return {}; }
      if (sql.startsWith('DELETE FROM goals')) { write('goals',read('goals').filter(row=>row.id!==args[0])); return {}; }
      return {};
    },
  };
}

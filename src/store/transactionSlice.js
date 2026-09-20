import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTransactions, saveTransaction, removeTransaction } from '../services/transactionService';
export const loadTransactions = createAsyncThunk('transactions/load', fetchTransactions);
export const persistTransaction = createAsyncThunk('transactions/save', saveTransaction);
export const deleteTransaction = createAsyncThunk('transactions/delete', async id => { await removeTransaction(id); return id; });
const slice = createSlice({ name:'transactions', initialState:{ items:[], loading:false }, reducers:{}, extraReducers:b=>b.addCase(loadTransactions.fulfilled,(s,a)=>{s.items=a.payload}).addCase(persistTransaction.fulfilled,(s,a)=>{const i=s.items.findIndex(t=>t.id===a.payload.id); if(i>=0)s.items[i]=a.payload; else s.items.unshift(a.payload)}).addCase(deleteTransaction.fulfilled,(s,a)=>{s.items=s.items.filter(t=>t.id!==a.payload)}) }); export default slice.reducer;

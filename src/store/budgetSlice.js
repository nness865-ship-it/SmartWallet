import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; import { fetchBudget, saveBudget } from '../services/budgetService';
export const loadBudget=createAsyncThunk('budget/load',fetchBudget); export const persistBudget=createAsyncThunk('budget/save',saveBudget);
const slice=createSlice({name:'budget',initialState:{current:null},reducers:{},extraReducers:b=>b.addCase(loadBudget.fulfilled,(s,a)=>{s.current=a.payload}).addCase(persistBudget.fulfilled,(s,a)=>{s.current=a.payload})}); export default slice.reducer;

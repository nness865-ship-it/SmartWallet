import { configureStore } from '@reduxjs/toolkit';
import transactions from './transactionSlice'; import budget from './budgetSlice'; import goals from './goalSlice';
export const store = configureStore({ reducer: { transactions, budget, goals } });

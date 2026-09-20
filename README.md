# SmartWallet

Offline-first Expo prototype for a college/OJT personal finance app.

## Run it

```bash
npm install
npx expo start
```

Use Expo Go on a physical device, or launch an Android/iOS simulator from Expo.

## Included prototype features

- Offline SQLite persistence for transactions, monthly budgets, and goals
- Manual transaction create, edit, and delete (with a `source` field ready for future SMS ingestion)
- Redux Toolkit state separation for transactions, budgets, and goals
- Automatic balance, budget, category, trend, and goal calculations
- Charts, smart in-app budget alerts, and a polished five-tab interface

Financial calculations live in `src/calculations/financials.js`, independent of all UI and input methods. Future SMS parsing can therefore emit the same transaction object without changing dashboard, analytics, budget, or goal logic.

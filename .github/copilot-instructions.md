# Copilot Instructions for Algorand TestNet Transaction Sender
## Architecture
- The repo hosts a Vite+React frontend in `client/` and an Express+Mongo backend in `server/`; they are decoupled packages with their own `package.json` files.
- Frontend talks to the backend via REST calls defined in `client/services/apiService.ts`, targeting `/api/algorand/{send|transactions|status/:txId}` on the server.
- `server/src/controllers/algorandController.ts` handles blockchain I/O with `algosdk.Algodv2`, persists transactions through `server/src/models/transactionModel.ts`, and stores status as `pending/confirmed/failed`.
- Transactions are saved in microAlgos in Mongo; React components convert between ALGO units and microAlgos at the boundary (see `SendAlgoForm.tsx`).
## Frontend Conventions
- `client/App.tsx` is the orchestration layer: it fetches transactions on mount, polls every 5 s for pending confirmations, and wires together `SendAlgoForm`, `TransactionList`, and toast/theme providers.
- `SendAlgoForm` validates mnemonics and addresses using `window.algosdk` injected via the CDN script in `client/index.html`; do not remove that script tag when refactoring.
- Keep new data models aligned with the shared `Transaction` interface in `client/types/index.ts`; the root-level `client/types.ts` and `services/algorandService.ts` are legacy placeholders.
- `TransactionList` sorts by `createdAt` on render and formats explorer links to `https://testnet.allo.info`; preserve this presentation when extending history views.
- Toast notifications come from `hooks/useToast.tsx`; surface user-facing status updates through `showToast` rather than `alert` or console logs.
- Theme toggling relies on `hooks/useTheme.tsx` and the `vite-ui-theme` key; any new layout should wrap content in the existing `ThemeProvider`.
## Backend Conventions
- Environment variables are required via `server/.env` using `server/src/config/environment.ts`; missing values throw early. Configure `PORT`, `MONGODB_URI`, `ALGOD_SERVER`, `ALGOD_TOKEN`, and `ALGOD_PORT` (plus optional `ALGOD_API_ADDR`).
- `server/src/config/db.ts` connects to Mongo on boot; exit the process on failure. Keep new startup logic before route registration to ensure DB availability.
- The controller updates confirmations by re-querying Algorand and persisting `confirmedRound`; reuse `TransactionStatus` from `server/src/types/index.ts` for any status changes.
- Use `server/src/generate.js` to mint fresh testnet accounts/mnemonics when needed; it already imports `algosdk` and prints address + mnemonic.
## Developer Workflows
- Install deps per package (`cd client && npm install`, `cd server && npm install`); there is no root-level install script.
- Frontend dev server runs with `npm run dev` on port 3000 (set in `vite.config.ts`); ensure `VITE_BACKEND_URL` is defined (e.g., `http://localhost:5001/api/algorand`).
- Backend dev server uses `npm run dev` with `nodemon`; production flow is `npm run build` followed by `npm start` from the compiled `dist/` output.
- No automated tests exist yet; manual verification typically involves submitting a transaction via the form and watching the polling loop confirm it.
## Integration Notes
- CORS is globally enabled on the backend; if you add new services, mount them under `/api/algorand` unless there is a strong reason to change routing.
- Frontend styling depends on Tailwind utilities injected at runtime (`index.html` loads the CDN and defines CSS variables); new components should stick to these utilities instead of bespoke CSS files.
- When adding new API calls, expose them from `apiService.ts` and extend the `Transaction` shape or create sibling types so UI components stay typed.
- Keep Algorand network interactions server-side; the client only validates inputs. Any signing or raw transaction submission must continue to flow through the Express layer.

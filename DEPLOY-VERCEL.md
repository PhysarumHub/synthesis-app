# Deploy su Vercel — Task List

## 1. Modifiche al codice già applicate

- [x] `prisma/schema.prisma` → provider cambiato da `sqlite` a `postgresql`, variabili `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING`
- [x] `package.json` → aggiunto `"postinstall": "prisma generate"`
- [x] `proxy.ts` → creato (sostituisce `middleware.ts`, deprecato in Next.js 16)
- [x] `app/api/admin/verify-pin/route.ts` → imposta cookie HTTP
- [x] `app/api/admin/logout/route.ts` → cancella cookie
- [x] `.env` → contiene `DATABASE_URL` locale (SQLite) e `ADMIN_PIN` — **non viene committato** (`.gitignore` include `.env*`)

---

## 2. Pubblica il codice su GitHub

```bash
cd synthesis-app

git init
git add .
git commit -m "init: synthesis app"
```

Vai su [github.com/new](https://github.com/new), crea un repo (es. `synthesis-app`), poi:

```bash
git remote add origin https://github.com/<tuo-utente>/synthesis-app.git
git branch -M main
git push -u origin main
```

---

## 3. Crea il progetto su Vercel

- [ ] Vai su [vercel.com](https://vercel.com) → accedi o registrati
- [ ] Clicca **Add New → Project**
- [ ] Importa il repository GitHub appena creato
- [ ] In **Root Directory** imposta: `synthesis-app`
- [ ] In **Build Command** imposta:
  ```
  prisma db push && next build
  ```
  *(al primo deploy crea le tabelle su Postgres direttamente dallo schema)*
- [ ] Lascia **Install Command** su `npm install` — eseguirà automaticamente `postinstall` → `prisma generate`
- [ ] **Non cliccare Deploy ancora** — prima aggiungi il database

---

## 4. Aggiungi il database PostgreSQL (Neon)

- [ ] Nel progetto Vercel → tab **Storage**
- [ ] Clicca **Create Database** → scegli **Postgres (Neon)**
- [ ] Dai un nome (es. `synthesis-db`)
- [ ] Scegli la region: **Europe West (Frankfurt)** o la più vicina
- [ ] Clicca **Create**

> Vercel aggiunge automaticamente le variabili `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` all'ambiente del progetto.

---

## 5. Aggiungi le variabili d'ambiente

- [ ] Vai su **Settings → Environment Variables**
- [ ] Aggiungi la variabile:

  | Name        | Value            | Environments              |
  |-------------|------------------|---------------------------|
  | `ADMIN_PIN` | *(il tuo PIN)*   | Production, Preview, Development |

---

## 6. Deploy

- [ ] Torna alla tab **Deployments** → clicca **Redeploy** (o Deploy se non ancora triggerato)
- [ ] Attendi che il build completi (~2 min)
- [ ] Verifica nel log che `prisma db push` abbia creato le tabelle senza errori

---

## 7. Verifica post-deploy

- [ ] Apri il dominio assegnato da Vercel (es. `synthesis-app.vercel.app`)
- [ ] Verifica che venga reindirizzato automaticamente a `/admin`
- [ ] Inserisci il PIN → verifica accesso all'admin panel
- [ ] Compila un form (es. Identificazione Cliente) → verifica che i dati vengano salvati
- [ ] Apri l'Admin Panel → verifica che i dati appena salvati appaiano nella tabella

---

## 8. Sviluppo locale dopo il deploy

Ora che lo schema usa PostgreSQL, il database SQLite locale non funziona più.
Per continuare a sviluppare in locale con il database Neon:

```bash
# Installa Vercel CLI (una volta sola)
npm i -g vercel

# Collega il progetto locale a Vercel e scarica le env vars
vercel link
vercel env pull .env.local
```

Questo crea un `.env.local` con `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` che puntano al database Neon. Il server locale (`npm run dev`) le usa automaticamente.

---

## Note

- **`prisma db push`** è usato solo per il primo deploy (crea le tabelle). Per deploy successivi non ha effetti se lo schema non cambia.
- Se in futuro modifichi lo schema Prisma, dovrai aggiungere una migrazione con `prisma migrate dev` in locale e cambiare il build command in `prisma migrate deploy && next build`.
- Il dominio Vercel è HTTPS di default — il cookie `admin_auth` funziona correttamente.

# MS RAG Demo

Un sistema **Retrieval-Augmented Generation (RAG)** sviluppato con **Next.js**, che unisce caricamento documenti e chat AI interattiva.

---

## ✨ Funzionalità

- 🔐 **Autenticazione utenti**: supporto email/password e OAuth con GitHub  
- 📂 **Caricamento documenti**: compatibile con file PDF e TXT  
- ⚙️ **Elaborazione documenti**: estrazione testo, suddivisione in chunk ed embedding automatici  
- 🤖 **Chat AI**: conversazione basata su RAG con modelli OpenAI  
- 🎨 **Interfaccia moderna**: costruita con **shadcn/ui** e **Tailwind CSS**  

---

## 🛠️ Stack Tecnologico

- **Frontend**: Next.js 15, React 19, TypeScript  
- **UI**: shadcn/ui, Tailwind CSS, Lucide React  
- **Autenticazione**: Better Auth  
- **Database**: PostgreSQL + Prisma ORM, estensione pgvector  
- **Storage**: Supabase Storage  
- **AI**: OpenAI API (GPT-4o-mini + text-embedding-3-small)  

---

## 🚀 Setup Locale

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd ms-rag-demo
   ````

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura le variabili d’ambiente**
   Copia il file di esempio:

   ```bash
   cp .env.example .env.local
   ```

   Valori richiesti:

   * `DATABASE_URL`: URL PostgreSQL con estensione pgvector
   * `NEXT_PUBLIC_SUPABASE_URL`: URL del progetto Supabase
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chiave anonima Supabase
   * `SUPABASE_SERVICE_ROLE_KEY`: chiave di ruolo Supabase
   * `OPENAI_KEY`: chiave API OpenAI
   * `BETTER_AUTH_SECRET`: stringa casuale di 32 caratteri per cifratura sessioni
   * `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: credenziali GitHub OAuth (opzionale)

4. **Inizializza il database**

   ```bash
   npm run db:generate   # genera il client Prisma
   npm run db:push       # applica lo schema in sviluppo
   ```

5. **Avvia l’applicazione**

   ```bash
   npm run dev
   ```

   ➡️ Apri [http://localhost:3000](http://localhost:3000) nel browser

---

## 📖 Utilizzo

1. 🔑 **Accedi/Registrati**: crea un account o usa GitHub OAuth
2. 📄 **Carica documenti**: PDF o testo semplice
3. 💬 **Chatta con l’AI**: poni domande sui documenti o in modalità libera
4. 🔍 **Seleziona documenti**: passa da chat contestuale a generale

---

## 🌐 Deployment

### Vercel

1. Collega il repository a **Vercel**
2. Configura le variabili d’ambiente dal dashboard
3. Deploy automatico al push

### Requisiti Database

* PostgreSQL con estensione **pgvector**
* Consigliato **Supabase** per semplicità e storage integrato

### Requisiti Storage

* Bucket Supabase chiamato `documents` per gli upload
* Configurazione CORS e policy di accesso

---

## 🔌 API Endpoints

* `POST /api/auth/*` → autenticazione (Better Auth)
* `GET /api/documents` → elenco documenti utente
* `POST /api/documents` → upload documento
* `POST /api/chat` → invio messaggio chat

---

## 📄 Licenza

Distribuito sotto licenza **MIT**.

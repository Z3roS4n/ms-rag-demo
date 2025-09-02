# MS RAG Demo

---

## 🇬🇧 English Version

A **Retrieval-Augmented Generation (RAG)** system built with **Next.js**, combining document upload and AI-powered chat.

---

### ✨ Features

- 🔐 **User Authentication**: Email/password and GitHub OAuth  
- 📂 **Document Upload**: Supports PDF and TXT files  
- ⚙️ **Document Processing**: Automatic text extraction, chunking, and embeddings  
- 🤖 **AI Chat**: OpenAI-powered RAG chat  
- 🎨 **Modern UI**: Built with **shadcn/ui** and **Tailwind CSS**  

---

### 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript  
- **UI**: shadcn/ui, Tailwind CSS, Lucide React  
- **Authentication**: Better Auth  
- **Database**: PostgreSQL + Prisma ORM, pgvector extension  
- **Storage**: Supabase Storage  
- **AI**: OpenAI API (GPT-4o-mini + text-embedding-3-small)  

---

### 🚀 Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ms-rag-demo
   ````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

   Required values:

   * `DATABASE_URL`: PostgreSQL URL with pgvector extension
   * `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
   * `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
   * `OPENAI_KEY`: OpenAI API key
   * `BETTER_AUTH_SECRET`: Random 32-character string for session encryption
   * `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials (optional)

4. **Initialize the database**

   ```bash
   npm run db:generate   # generate Prisma client
   npm run db:push       # apply schema in dev
   ```

5. **Run the application**

   ```bash
   npm run dev
   ```

   ➡️ Open [http://localhost:3000](http://localhost:3000) in your browser

---

### 📖 Usage

1. 🔑 **Sign Up / Sign In**: Create an account or use GitHub OAuth
2. 📄 **Upload documents**: PDF or plain text
3. 💬 **Chat with AI**: Ask questions about documents or in general mode
4. 🔍 **Document selection**: Switch between contextual and general chat

---

### 🌐 Deployment

#### Vercel

1. Connect repository to **Vercel**
2. Set environment variables in the dashboard
3. Deploy automatically on push

#### Database Requirements

* PostgreSQL with **pgvector** extension
* **Supabase** recommended for simple setup and storage integration

#### Storage Requirements

* Supabase bucket named `documents`
* Proper CORS and access policies configured

---

### 🔌 API Endpoints

* `POST /api/auth/*` → authentication (Better Auth)
* `GET /api/documents` → list user documents
* `POST /api/documents` → upload document
* `POST /api/chat` → send chat message

---

### 📄 License

Released under the **MIT License**.

---

---

## 🇮🇹 Versione Italiana

Un sistema **Retrieval-Augmented Generation (RAG)** sviluppato con **Next.js**, che unisce caricamento documenti e chat AI interattiva.

---

### ✨ Funzionalità

* 🔐 **Autenticazione utenti**: supporto email/password e OAuth con GitHub
* 📂 **Caricamento documenti**: compatibile con file PDF e TXT
* ⚙️ **Elaborazione documenti**: estrazione testo, suddivisione in chunk ed embedding automatici
* 🤖 **Chat AI**: conversazione basata su RAG con modelli OpenAI
* 🎨 **Interfaccia moderna**: costruita con **shadcn/ui** e **Tailwind CSS**

---

### 🛠️ Stack Tecnologico

* **Frontend**: Next.js 15, React 19, TypeScript
* **UI**: shadcn/ui, Tailwind CSS, Lucide React
* **Autenticazione**: Better Auth
* **Database**: PostgreSQL + Prisma ORM, estensione pgvector
* **Storage**: Supabase Storage
* **AI**: OpenAI API (GPT-4o-mini + text-embedding-3-small)

---

### 🚀 Setup Locale

1. **Clona il repository**

   ```bash
   git clone <repository-url>
   cd ms-rag-demo
   ```

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

### 📖 Utilizzo

1. 🔑 **Accedi/Registrati**: crea un account o usa GitHub OAuth
2. 📄 **Carica documenti**: PDF o testo semplice
3. 💬 **Chatta con l’AI**: poni domande sui documenti o in modalità libera
4. 🔍 **Seleziona documenti**: passa da chat contestuale a generale

---

### 🌐 Deployment

#### Vercel

1. Collega il repository a **Vercel**
2. Configura le variabili d’ambiente dal dashboard
3. Deploy automatico al push

#### Requisiti Database

* PostgreSQL con estensione **pgvector**
* Consigliato **Supabase** per semplicità e storage integrato

#### Requisiti Storage

* Bucket Supabase chiamato `documents` per gli upload
* Configurazione CORS e policy di accesso

---

### 🔌 API Endpoints

* `POST /api/auth/*` → autenticazione (Better Auth)
* `GET /api/documents` → elenco documenti utente
* `POST /api/documents` → upload documento
* `POST /api/chat` → invio messaggio chat

---

### 📄 Licenza

Distribuito sotto licenza **MIT**.

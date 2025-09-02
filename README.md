# MS RAG Demo

A simple RAG (Retrieval-Augmented Generation) system built with Next.js, featuring document upload and AI-powered chat functionality.

## Features

- **User Authentication**: Email/password and GitHub OAuth support
- **Document Upload**: Support for PDF and text files
- **Document Processing**: Automatic text extraction and chunking with embeddings
- **AI Chat**: OpenAI-powered chat with RAG capabilities
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma ORM, pgvector for embeddings
- **Storage**: Supabase Storage
- **AI**: OpenAI API (GPT-4o-mini + text-embedding-3-small)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ms-rag-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `DATABASE_URL`: PostgreSQL database URL with pgvector extension
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
   - `OPENAI_KEY`: OpenAI API key
   - `BETTER_AUTH_SECRET`: Random 32-character string for session encryption
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials (optional)

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema (for development)
   npm run db:push
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Upload Documents**: Upload PDF or text files for processing
3. **Chat**: Ask questions about your documents or have general conversations
4. **Document Selection**: Switch between document-specific and general chat modes

## Deployment

### Vercel

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

### Database Requirements

- PostgreSQL database with `pgvector` extension enabled
- Supabase is recommended for easy setup with storage integration

### Storage Requirements

- Supabase Storage bucket named `documents` for file uploads
- Proper CORS and access policies configured

## API Endpoints

- `POST /api/auth/*` - Authentication endpoints (Better Auth)
- `GET /api/documents` - List user documents
- `POST /api/documents` - Upload document
- `POST /api/chat` - Send chat message

## License

MIT License

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Pinecone-Vector%20DB-00A98F" />
  <img src="https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-Llama%203.3-F55036" />
</p>

# 📜 What I Signed

> **RAG-Powered Personal Agreement Vault** — Upload, analyze, and intelligently query your contracts and legal documents using AI.

**What I Signed** is a full-stack AI application that lets you upload legal documents (contracts, offer letters, insurance policies, NDAs, lease agreements), automatically extracts and analyzes their contents, stores them as vector embeddings, and lets you ask natural language questions about them — with cited sources.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Document Processing Pipeline](#-document-processing-pipeline)
- [RAG Query Pipeline](#-rag-query-pipeline)
- [Authentication Flow](#-authentication-flow)
- [Database Models](#-database-models)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Run with Docker](#-run-with-docker-recommended)
- [Getting Started (without Docker)](#-getting-started-without-docker)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Key Design Decisions](#-key-design-decisions)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📤 **Document Upload** | Drag-and-drop upload for PDF, DOCX, and scanned images (JPEG/PNG/WebP) |
| 🔍 **Text Extraction** | Automatic text extraction via pdf-parse, mammoth (DOCX), or Tesseract.js OCR |
| 🧠 **AI Analysis** | LLM-powered clause extraction — parties, dates, penalties, red flags, financial terms |
| 📊 **Vector Embeddings** | Documents are chunked, embedded (768-dim), and stored in Pinecone for semantic search |
| 💬 **Natural Language Queries** | Ask questions in plain English — AI searches your docs and streams cited answers |
| ⚖️ **Document Comparison** | Compare two agreements side-by-side on any topic |
| 🚨 **Smart Alerts** | Automatic alerts for expiry dates, renewal deadlines, and red flags |
| 🔐 **Secure Auth** | JWT access tokens + httpOnly refresh cookies with automatic silent refresh |
| 🌊 **Real-time Streaming** | SSE-based streaming for both processing status and AI answers |
| 🎨 **Premium Glass UI** | Warm glassmorphism design with frosted panels, bronze accents, micro-animations, and a responsive layout |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server with HMR |
| **Tailwind CSS 3** | Utility-first styling + custom warm glassmorphism design system |
| **TanStack React Query 5** | Server state management, caching, mutations |
| **Zustand 5** | Client state management (auth store) |
| **React Router 7** | Client-side routing |
| **React Hook Form + Zod** | Form management with schema validation |
| **Axios** | HTTP client with interceptors for auth refresh |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting utilities |
| **react-dropzone** | Drag-and-drop file upload |
| **react-hot-toast** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express 4** | REST API framework |
| **MongoDB + Mongoose 8** | Primary database & ODM |
| **Pinecone** | Vector database for semantic search |
| **Cloudinary** | Cloud file storage for uploaded documents |
| **Gemini 2.5 Flash** | Primary LLM for analysis, reranking, and answer generation |
| **Groq (Llama 3.3 70B)** | Fallback LLM when Gemini is rate-limited |
| **Gemini Embedding 001** | Text embedding model (768 dimensions) |
| **Agenda.js** | Background job queue for document processing |
| **pdf-parse** | PDF text extraction |
| **mammoth** | DOCX text extraction |
| **Tesseract.js + Sharp** | OCR for scanned images |
| **node-cron** | Scheduled alert checking |
| **Winston** | Structured logging |

---

## 🏗 System Architecture

### High-Level Overview

![System Architecture](docs/diagrams/system_architecture.png)

### Request Flow

![Request Flow](docs/diagrams/request_flow.png)

---

## 🖥 Frontend Architecture

### Component Tree

![Frontend Component Tree](docs/diagrams/frontend_component_tree.png)

### State Management

| Store | Library | Scope | Persistence |
|-------|---------|-------|-------------|
| **Auth State** | Zustand | `user`, `accessToken`, `isAuthenticated`, `isInitialized` | None (rebuilt via cookie refresh on load) |
| **Server State** | React Query | Documents, Alerts, Dashboard stats | In-memory cache, staleTime: 2 min |

**Auth Store Actions:**
- `setAuth(user, token)` — Login/register success
- `setAccessToken(token)` — Silent refresh
- `logout()` — Clear all auth state
- `initialize()` — Called on app mount, attempts cookie-based token refresh

### Pages Overview

| Page | Route | Key Features |
|------|-------|-------------|
| **Login** | `/login` | Email/password form, Zod validation, frosted card over the vault backdrop |
| **Register** | `/register` | Name/email/password/confirm form, password match validation |
| **Dashboard** | `/dashboard` | Animated stat counters, quick query, recent alerts & documents |
| **Documents** | `/documents` | Upload zone toggle, filterable document grid (type + status) |
| **DocumentDetail** | `/documents/:id` | Tabbed view: Summary, Clauses, Red Flags, Ask (per-doc query) |
| **Query** | `/query` | Full RAG query interface with document filters, streaming answer, source citations |
| **Compare** | `/compare` | Select 2 docs + topic, get structured comparison |
| **Alerts** | `/alerts` | Filtered tabs (All/Upcoming/Red Flags/Dismissed), dismiss & snooze actions |

### Design System

The UI is a warm **glassmorphism design system** built on Tailwind CSS. Every
surface is a frosted pane: a translucent warm-white gradient over a real
`backdrop-filter`, a 1px specular top edge, and a layered drop shadow so panels
float above the backdrop rather than sit painted onto it.

All classes are defined in `client/src/index.css`:

| Class | Use |
|-------|-----|
| `.glass` | Standard panel — content cards, answer panes, empty states |
| `.glass-strong` | Chrome that needs more opacity — sidebar, navbar, modals |
| `.glass-soft` | Nested elements sitting inside another glass surface |
| `.glass-tile` | Flatter tile for stat rows, document cards, alerts |
| `.glass-well` | Recessed surface — upload dropzone, quoted excerpts |
| `.glass-input` | Inputs and search pills, with focus ring and hover states |
| `.glass-chip` | Small interactive chips — filters, suggestions, tabs |
| `.glass-hover` | Lift-on-hover for clickable panes |
| `.btn-primary-glass` / `.btn-gold-glass` | Bronze and gold gradient buttons |
| `.heading-display` | Playfair Display heading treatment |

**Backdrop:** `VaultBackdrop` renders a mocha field with a cream light source,
two slowly drifting colour pools, a vignette and film grain — glass only reads
as glass when there is something varied behind it to refract.

**Custom animations:** fadeIn, slideUp, slideDown, scaleIn, pulse, shimmer
(skeleton loading), float, sheen, driftSlow. All are disabled under
`prefers-reduced-motion`.

**Fonts:** Playfair Display for display headings, Inter for UI text.

**Color palette:** `mocha` (backdrop taupe) and `gold` (bronze accent) scales,
with warm-white glass surfaces and severity-coded alerts (blue/gold/red).

---

## ⚙️ Backend Architecture

### Layered Architecture

![Backend Layered Architecture](docs/diagrams/backend_architecture.png)

### Middleware Stack (in order)

| # | Middleware | Purpose |
|---|-----------|---------|
| 1 | `helmet()` | Security headers (CSP, XSS protection, etc.) |
| 2 | `cors()` | Allow frontend origin with credentials |
| 3 | `express.json()` | Parse JSON bodies (1MB limit) |
| 4 | `cookieParser()` | Parse httpOnly cookies for refresh tokens |
| 5 | `morgan('dev')` | HTTP request logging via Winston |
| 6 | `generalLimiter` | Rate limit: 100 requests / 15 min on all `/api` |
| 7 | `protect` | JWT verification (per-route, from header or query param) |
| 8 | `upload.single('file')` | Multer file upload (per-route, 20MB, memory storage) |
| 9 | `validate(schema)` | Zod body validation (per-route) |

### Rate Limiting

| Limiter | Scope | Limit | Window |
|---------|-------|-------|--------|
| `generalLimiter` | All `/api` routes | 100 requests | 15 minutes |
| `authLimiter` | `/api/auth/register`, `/api/auth/login` | 20 requests | 15 minutes |
| `queryLimiter` | `/api/query`, `/api/query/compare` | 10 requests | 1 minute |

### Services Map

```
server/src/services/
├── ai/
│   ├── embedding.service.js    # Gemini embedding-001 (768-dim, batch 50)
│   └── llm.provider.js         # Gemini 2.5 Flash → Groq Llama 3.3 fallback
├── chunking/
│   └── chunker.service.js      # Recursive text splitter (500 chars, 60 overlap)
├── clause/
│   └── clause.extractor.js     # LLM-based clause/red flag extraction
├── extraction/
│   ├── pdf.extractor.js        # pdf-parse
│   ├── docx.extractor.js       # mammoth
│   └── ocr.extractor.js        # sharp → tesseract.js
├── rag/
│   ├── retriever.service.js    # Pinecone query + MongoDB enrichment
│   ├── reranker.service.js     # LLM-based relevance scoring (0-10)
│   ├── answerer.service.js     # Streaming answer with citations
│   └── comparator.service.js   # Side-by-side document comparison
├── storage/
│   └── cloudinary.service.js   # Upload/delete files on Cloudinary
└── vector/
    └── pinecone.service.js     # Upsert/query/delete vectors
```

---

## 📄 Document Processing Pipeline

When a user uploads a document, it goes through a **10-step background pipeline** managed by Agenda.js:

![Document Processing Pipeline](docs/diagrams/document_pipeline.png)

### Step-by-Step Detail

| Step | Status | Progress | What Happens |
|------|--------|----------|-------------|
| **1. Download** | `extracting` | 5% → 15% | Fetches the uploaded file from Cloudinary URL into a Buffer |
| **2. Extract Text** | `extracting` | 15% → 30% | Routes to the correct extractor based on file type: **PDF** → `pdf-parse` extracts text + page count. **DOCX** → `mammoth.extractRawText()`, estimates pages as `ceil(length / 3000)`. **Image** → `sharp` preprocesses (grayscale, sharpen, normalize → PNG), then `tesseract.js` OCR (English) |
| **3. Hash** | `extracting` | 30% | Computes SHA-256 of raw text, stores as `rawTextHash` for deduplication |
| **4. Chunk** | `chunking` | 40% → 50% | Splits cleaned text using a recursive character text splitter with **legal-aware separators**: `\n\n\n`, `\n\n`, `\nClause `, `\nSection `, `\nArticle `, `\nSchedule `, `\n`, `. `, ` `, `""`. **Chunk size: 500 chars, overlap: 60 chars**. Each chunk gets a `chunkIndex` and estimated `pageNumber` |
| **5. Embed** | `embedding` | 55% → 70% | Sends chunk texts to **Gemini embedding-001** in batches of 50. Each text → 768-dimensional vector. Uses `model.batchEmbedContents()` |
| **6. Upsert Vectors** | `embedding` | 70% → 75% | Upserts to Pinecone in batches of 100. Vector ID: `{documentId}-{chunkIndex}`. Metadata: `userId`, `documentId`, `docType`, `docName`, `pageNumber`, `chunkIndex`, `text` (first 1000 chars) |
| **7. Save Chunks** | `embedding` | 75% → 80% | Bulk inserts Chunk documents to MongoDB with `documentId`, `userId`, `text`, `pineconeId`, `metadata` |
| **8. Clause Extraction** | `analyzing` | 80% → 90% | Sends text to LLM (Gemini → Groq fallback) with a legal parser prompt. Extracts: `parties`, `startDate`, `endDate`, `noticePeriod`, `penaltyClauses`, `autoRenewal`, `depositAmount`, `monthlyAmount`, `redFlags` (with severity), `keyDates`, `docType`, `summary`. Text truncated to first 6000 + last 2000 chars for long documents |
| **9. Create Alerts** | `analyzing` | 90% | Generates alerts based on extracted clauses: **Expiry** alert if `endDate` exists, **Renewal** alert if `autoRenewal && endDate` (30 days before), **Notice Deadline** alert if `noticePeriod && endDate` (notice days before), **Red Flag** alerts for each high-severity red flag |
| **10. Mark Ready** | `ready` | 100% | Updates document with analysis results, sets `processedAt`, increments user `docCount` |

### Text Cleaning (Pre-Chunking)

The raw extracted text is cleaned before chunking:
1. Form feed characters (`\f`) → newlines
2. Trailing whitespace on each line → trimmed
3. 4+ consecutive blank lines → collapsed to 3
4. Multiple spaces → single space

---

## 🔍 RAG Query Pipeline

When a user asks a question, the app executes a **4-stage Retrieval-Augmented Generation pipeline**:

![RAG Query Pipeline](docs/diagrams/rag_query_pipeline.png)

### Stage 1: Embed Query
- **Model:** Gemini `embedding-001`
- **Dimensions:** 768
- The user's question is converted into a dense vector representation
- Same model used for document chunks ensures alignment in vector space

### Stage 2: Retrieve Relevant Chunks
- **Database:** Pinecone
- **Top-K:** 10 vectors
- **Filters:** Always filtered by `userId` (data isolation). Optional: `documentId` (single-doc query), `docType` (category filter)
- After Pinecone returns matches with metadata, chunks are **enriched** from MongoDB to get full text (Pinecone metadata stores only first 1000 chars)
- Returns: `[{ id, score, text, metadata: { docName, pageNumber, documentId, ... } }]`

### Stage 3: Rerank with LLM
- **Method:** LLM-based reranking (no external reranking API needed)
- Sends all 10 chunks with their document names and page numbers to the LLM
- LLM scores each chunk 0–10 for relevance to the query
- **Filters:** Keep only chunks with score ≥ 5
- **Limit:** Top 5 highest-scoring chunks
- **Fallback:** If LLM reranking fails (rate limit, parse error), returns original Pinecone order (top 5)

### Stage 4: Stream Answer
- **Primary LLM:** Gemini 2.5 Flash (temperature: 0.3)
- **Fallback LLM:** Groq Llama 3.3 70B (automatic on 429/503 errors)
- Context is built from reranked chunks with labels: `[Document: name | Page: N]`
- **System prompt rules:**
  - Answer using ONLY the provided document excerpts
  - Cite document names for every claim
  - Never invent or assume clauses not in the text
  - Highlight potential red flags
  - If information isn't in the documents, say so explicitly
- Response is **streamed** via SSE (Server-Sent Events) for real-time display

### SSE Event Protocol

The query endpoint uses named SSE events:

```
event: status
data: {"step":"embedding","message":"Understanding your question..."}

event: status
data: {"step":"retrieving","message":"Searching your documents..."}

event: status
data: {"step":"analyzing","message":"Analyzing relevance..."}

event: status
data: {"step":"generating","message":"Generating answer..."}

event: answer
data: {"text":"Based on your offer letter, "}

event: answer
data: {"text":"your monthly in-hand salary is..."}

event: sources
data: {"sources":[{"documentName":"Offer_Letter.docx","documentId":"...","page":2,"relevance":0.95,"excerpt":"...first 200 chars..."}]}

event: done
data: {"chunksUsed":3}
```

### Document Comparison Pipeline

![Document Comparison Pipeline](docs/diagrams/comparison_pipeline.png)

---

## 🔐 Authentication Flow

![Authentication Flow](docs/diagrams/auth_flow.png)

**Key details:**
- **Access token** (15 min): Stored in Zustand memory only — never in localStorage
- **Refresh token** (7 days): Stored as `httpOnly`, `sameSite: Lax`, `path: /` cookie — not accessible to JavaScript
- **Query endpoint auth**: The query service uses raw `fetch()` (for SSE streaming). On 401, it independently calls `/api/auth/refresh` before retrying
- **SSE endpoint auth**: `EventSource` API cannot set headers, so the token is passed as `?token=` query parameter. The auth middleware reads from both `Authorization` header and `req.query.token`

---

## 🗃 Database Models

### Entity Relationship Diagram

![Entity Relationship Diagram](docs/diagrams/er_diagram.png)

### extractedClauses Schema (Document subdocument)

```javascript
{
  parties:        [String],           // ["Aniket Bajpai", "Anthropic Inc."]
  startDate:      Date,               // 2026-07-01
  endDate:        Date,               // 2027-06-30
  noticePeriod:   String,             // "30 days"
  penaltyClauses: [String],           // ["Early termination fee of $5,000"]
  autoRenewal:    Boolean,            // false
  depositAmount:  String,             // "$2,000"
  monthlyAmount:  String,             // "$15,000"
  redFlags: [{
    clause:       String,             // "Non-compete extends 2 years post-employment"
    severity:     "low|medium|high",
    explanation:  String              // "This is unusually long and may limit..."
  }],
  keyDates: [{
    label:        String,             // "Probation End Date"
    date:         Date                // 2026-10-01
  }]
}
```

---

## 📡 API Reference

All endpoints return responses in a consistent shape:
```json
{
  "success": true,
  "data": {},
  "message": "Human-readable message"
}
```

### Authentication

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | `{ name, email, password }` | Create account. Returns `{ user, accessToken }` + refresh cookie |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | Login. Returns `{ user, accessToken }` + refresh cookie |
| `POST` | `/api/auth/logout` | ❌ | — | Clears refresh cookie |
| `POST` | `/api/auth/refresh` | 🍪 Cookie | — | Issues new access token from refresh cookie |

### Documents

| Method | Endpoint | Auth | Params / Body | Description |
|--------|----------|------|---------------|-------------|
| `GET` | `/api/documents` | ✅ | Query: `page`, `limit`, `docType`, `status` | List documents (paginated, max 50/page) |
| `POST` | `/api/documents/upload` | ✅ | Multipart: `file` field | Upload document → Cloudinary → queue processing |
| `GET` | `/api/documents/:id` | ✅ | — | Get document with full extracted clauses |
| `DELETE` | `/api/documents/:id` | ✅ | — | Delete doc + Cloudinary file + Pinecone vectors + chunks + alerts |
| `GET` | `/api/documents/:id/status` | ✅ | Query: `token` (for SSE) | SSE stream: `{ status, progress, error }` every 2s |

### Query (RAG)

| Method | Endpoint | Auth | Body | Response Type | Description |
|--------|----------|------|------|---------------|-------------|
| `POST` | `/api/query` | ✅ | `{ question, filters?: { documentId?, docType? } }` | SSE Stream | Full RAG pipeline with streamed answer |
| `POST` | `/api/query/compare` | ✅ | `{ docIdA, docIdB, topic }` | JSON | Compare two documents on a topic |

### Alerts

| Method | Endpoint | Auth | Params / Body | Description |
|--------|----------|------|---------------|-------------|
| `GET` | `/api/alerts` | ✅ | Query: `type`, `severity`, `dismissed` | List alerts with filters |
| `PUT` | `/api/alerts/:id/dismiss` | ✅ | — | Mark alert as dismissed |
| `PUT` | `/api/alerts/:id/snooze` | ✅ | `{ snoozeDays? }` (default: 7) | Snooze alert for N days |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dashboard/stats` | ✅ | Returns `{ totalDocs, activeAlerts, docsByType }` |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Returns `{ status: 'ok', timestamp }` |

---

## 📁 Project Structure

```
What-I-Signed/
├── .gitignore
├── .dockerignore                   # Keeps node_modules and secrets out of build context
├── .env.example                    # Template for environment variables
├── docker-compose.yml              # mongo + server + client, wired together
├── package.json                    # Root: workspaces config + dev scripts
├── package-lock.json
│
├── client/                         # ── FRONTEND ──────────────────────────
│   ├── Dockerfile                  # Multi-stage: Vite build → nginx
│   ├── nginx.conf                  # SPA fallback, /api proxy, asset caching
│   ├── index.html                  # SPA entry point (title, meta, fonts)
│   ├── package.json                # React + Vite dependencies
│   ├── vite.config.js              # Vite config + API proxy to :5000
│   ├── tailwind.config.js          # Custom theme (colors, animations, fonts)
│   ├── postcss.config.js           # PostCSS: tailwindcss + autoprefixer
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   └── src/
│       ├── main.jsx                # React root render
│       ├── App.jsx                 # Routes, QueryClient, Toaster
│       ├── App.css                 # (Legacy Vite template styles)
│       ├── index.css               # Global styles: glassmorphism, gradients
│       │
│       ├── pages/                  # 8 route-level page components
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Documents.jsx
│       │   ├── DocumentDetail.jsx  # Tabbed: Summary/Clauses/RedFlags/Ask
│       │   ├── Query.jsx
│       │   ├── Compare.jsx
│       │   └── Alerts.jsx
│       │
│       ├── components/
│       │   ├── ui/                 # Reusable design system components
│       │   │   ├── Badge.jsx       #   Color-coded pills (docType, status)
│       │   │   ├── Button.jsx      #   Variants: primary/secondary/danger/ghost
│       │   │   ├── Card.jsx        #   Glass container with hover effects
│       │   │   ├── EmptyState.jsx  #   Centered icon + text + action
│       │   │   ├── Input.jsx       #   Glass input with icon + error state
│       │   │   ├── Modal.jsx       #   Backdrop blur overlay with ESC close
│       │   │   ├── Skeleton.jsx    #   Shimmer loading placeholders
│       │   │   └── Spinner.jsx     #   Gradient spinning loader
│       │   │
│       │   ├── layout/             # App chrome & navigation
│       │   │   ├── Sidebar.jsx     #   Collapsible nav with user section
│       │   │   ├── Navbar.jsx      #   Mobile hamburger menu
│       │   │   ├── PageWrapper.jsx #   Layout with sidebar + ambient orbs
│       │   │   └── ProtectedRoute.jsx  # Auth guard
│       │   │
│       │   ├── documents/          # Document-specific components
│       │   │   ├── UploadZone.jsx  #   Drag-and-drop with progress bar
│       │   │   ├── DocumentList.jsx    # Filterable grid
│       │   │   ├── DocumentCard.jsx    # Card with badges + delete modal
│       │   │   └── ProcessingStatus.jsx # SSE-powered progress display
│       │   │
│       │   ├── query/              # Query-specific components
│       │   │   ├── QueryInput.jsx  #   Input with filters + suggestions
│       │   │   ├── StreamingAnswer.jsx # Markdown-rendered streamed answer
│       │   │   └── SourceCitation.jsx  # Expandable source cards
│       │   │
│       │   └── alerts/
│       │       └── AlertCard.jsx   #   Severity-coded alert with actions
│       │
│       ├── hooks/                  # Custom React hooks
│       │   ├── useDocuments.js     #   CRUD queries + mutations
│       │   ├── useQuery.js         #   Streaming query + comparison
│       │   ├── useAlerts.js        #   Alert list + dismiss/snooze
│       │   └── useDocumentStatus.js    # SSE hook for processing status
│       │
│       ├── services/               # API client layer
│       │   ├── api.js              #   Axios instance + auth interceptors
│       │   ├── auth.js             #   Login/register/logout/refresh
│       │   ├── documents.js        #   CRUD + upload with progress
│       │   ├── query.js            #   SSE streaming + comparison
│       │   └── alerts.js           #   List/dismiss/snooze
│       │
│       ├── store/
│       │   └── authStore.js        #   Zustand: user, token, auth state
│       │
│       └── utils/
│           ├── docTypeColors.js    #   Color maps for docType/status/severity
│           ├── fileHelpers.js      #   MIME validation, file size formatting
│           └── formatDate.js       #   date-fns wrappers
│
└── server/                         # ── BACKEND ───────────────────────────
    ├── Dockerfile                  # Node 22 slim, non-root, healthcheck
    ├── package.json                # Express + AI/DB dependencies
    │
    └── src/
        ├── index.js                # Entry: connect DB, start Agenda, listen
        ├── app.js                  # Express app: middleware, routes, errors
        │
        ├── config/
        │   ├── db.js               #   Mongoose connection (TLS auto-detected)
        │   ├── cloudinary.js       #   Cloudinary v2 SDK config
        │   ├── pinecone.js         #   Pinecone client + index reference
        │   └── agenda.js           #   Agenda.js job queue config
        │
        ├── models/
        │   ├── User.js             #   User schema + comparePassword()
        │   ├── Document.js         #   Document + extractedClauses subdoc
        │   ├── Chunk.js            #   Text chunks with pineconeId
        │   └── Alert.js            #   Smart alerts with snooze/dismiss
        │
        ├── middleware/
        │   ├── auth.middleware.js   #   JWT protect + optionalAuth
        │   ├── upload.middleware.js #   Multer (memory, 20MB, file filter)
        │   ├── validate.middleware.js  # Zod schema validation
        │   └── rateLimit.middleware.js # express-rate-limit configs
        │
        ├── controllers/
        │   ├── auth.controller.js  #   Register, login, logout, refresh
        │   ├── document.controller.js  # CRUD + upload + SSE status
        │   ├── query.controller.js #   RAG query + document comparison
        │   └── alert.controller.js #   List, dismiss, snooze alerts
        │
        ├── routes/
        │   ├── auth.routes.js
        │   ├── document.routes.js
        │   ├── query.routes.js
        │   ├── alert.routes.js
        │   └── dashboard.routes.js
        │
        ├── services/
        │   ├── ai/
        │   │   ├── embedding.service.js   # Gemini embeddings (768-dim)
        │   │   └── llm.provider.js        # Gemini → Groq fallback
        │   ├── chunking/
        │   │   └── chunker.service.js     # Recursive text splitter
        │   ├── clause/
        │   │   └── clause.extractor.js    # LLM clause/red flag extraction
        │   ├── extraction/
        │   │   ├── pdf.extractor.js       # pdf-parse
        │   │   ├── docx.extractor.js      # mammoth
        │   │   └── ocr.extractor.js       # sharp + tesseract.js
        │   ├── rag/
        │   │   ├── retriever.service.js   # Pinecone → MongoDB enrichment
        │   │   ├── reranker.service.js    # LLM relevance scoring
        │   │   ├── answerer.service.js    # Streaming cited answers
        │   │   └── comparator.service.js  # Side-by-side comparison
        │   ├── storage/
        │   │   └── cloudinary.service.js  # Upload/delete cloud files
        │   └── vector/
        │       └── pinecone.service.js    # Upsert/query/delete vectors
        │
        ├── jobs/
        │   ├── document.job.js     #   10-step processing pipeline
        │   └── alert.job.js        #   Daily cron: fire due alerts
        │
        └── utils/
            ├── asyncHandler.js     #   Express async error wrapper
            └── logger.js           #   Winston logger (dev/prod formats)
```

---

## 🐳 Run with Docker (recommended)

The fastest way to get a working stack. Compose brings up **MongoDB, the API, and
the nginx-served front end** together — no Atlas account, no local MongoDB install.

### Prerequisites

- **Docker Desktop** (or Docker Engine + Compose v2)
- API keys for Gemini, Pinecone and Cloudinary (see [Environment Variables](#-environment-variables))

### Quick start

```bash
# 1. Clone
git clone https://github.com/AniketB26/What-I-Signed.git
cd What-I-Signed

# 2. Create the root .env — Compose reads variable substitutions from here
cp .env.example .env

# 3. Generate the two JWT secrets and paste them into .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # JWT_REFRESH_SECRET

# 4. Set CLIENT_URL=http://localhost:8080 and a real MONGO_ROOT_PASSWORD in .env,
#    then fill in your API keys

# 5. Build and start
docker compose up --build
```

Open **http://localhost:8080** and register an account.

> `JWT_SECRET` and `JWT_REFRESH_SECRET` have no defaults — Compose refuses to
> start without them rather than booting with a guessable signing key.

### What Compose runs

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| `mongo` | `mongo:7` | `127.0.0.1:27017` | Data persists in the `mongo-data` volume. Bound to loopback — the API reaches it over the compose network. |
| `server` | built from `server/Dockerfile` | internal `5000` | Node 22 slim, runs as non-root, `/api/health` healthcheck. |
| `client` | built from `client/Dockerfile` | `8080` | Vite build served by nginx, which also proxies `/api` → `server`. |

Because nginx proxies `/api` on the **same origin**, the refresh-token cookie stays
first-party — no CORS preflight and `SameSite=Lax` works as intended.

### Common commands

```bash
docker compose up -d --build     # rebuild and run detached
docker compose logs -f server    # tail API logs
docker compose ps                # health status of each service
docker compose down              # stop (data survives in the volume)
docker compose down -v           # stop AND delete the database
```

### Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `JWT_SECRET is required` on `up` | The root `.env` is missing or the secret is blank. |
| API restarts in a loop | `docker compose logs server` — usually a bad `MONGODB_URI` or a missing API key. |
| Login works, then logs out on refresh | `CLIENT_URL` doesn't match the origin in the browser's address bar. |
| Port 8080 already taken | Set `CLIENT_PORT=3000` in `.env`. |

---

## 🚀 Getting Started (without Docker)

### Prerequisites

- **Node.js** ≥ 18.x (22.x recommended)
- **npm** ≥ 9.x
- **MongoDB** — either a local install or an Atlas cluster
- **Pinecone** account with an index named `wdis-documents` (768 dimensions, cosine metric)
- **Cloudinary** account (free tier works)
- **Google AI Studio** API key (for Gemini)
- **Groq** API key (for fallback LLM)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AniketB26/What-I-Signed.git
cd What-I-Signed

# 2. Install all dependencies (root + client + server workspaces)
npm install

# 3. Create the environment file
cp .env.example server/.env
# Edit server/.env with your actual keys (see Environment Variables section)

# 4. Point MONGODB_URI at your database
#    Local:  mongodb://127.0.0.1:27017/whatisigned
#    Atlas:  whitelist your IP under Atlas → Network Access first

# 5. Create a Pinecone index
# Name: wdis-documents
# Dimensions: 768
# Metric: cosine

# 6. Start the development servers
npm run dev
```

This starts both servers concurrently:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

### Manual Start (separate terminals)

```bash
# Terminal 1: Backend
cd server
node src/index.js

# Terminal 2: Frontend (after backend is ready)
cd client
npm run dev
```

> ⚠️ **Important:** Start the backend FIRST and wait for `Server running on port 5000` before starting the frontend. The Vite proxy will return 502 if the backend isn't ready.

### If login or registration fails

Auth failures are almost always the database, not the credentials — the API cannot
create or look up a user if Mongo is unreachable. Check the backend log first:

| Log line | Meaning | Fix |
|----------|---------|-----|
| `querySrv ENOTFOUND ...mongodb.net` | The Atlas cluster hostname doesn't resolve — the cluster was deleted or paused into oblivion. | Create a new cluster and update `MONGODB_URI`, or switch to Docker / a local MongoDB. |
| `MongoServerError: bad auth` | Wrong user or password in the URI. | Re-copy the connection string from Atlas. |
| `connect ECONNREFUSED 127.0.0.1:27017` | Local MongoDB isn't running. | Start the MongoDB service. |
| `MONGODB_URI is not set` | No `server/.env`. | `cp .env.example server/.env` and fill it in. |

Verify the API independently of the UI:

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"TestPass123!"}'
```

A healthy register returns `{"success":true,...}` with an `accessToken`.

---

## 🔑 Environment Variables

Create `server/.env` with the following variables:

```env
# ── Server ─────────────────────────────────
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# ── MongoDB ────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=Cluster0&tls=true

# ── Pinecone (Vector Database) ─────────────
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX=wdis-documents

# ── JWT Authentication ─────────────────────
JWT_SECRET=<random-64-char-hex>
JWT_REFRESH_SECRET=<different-random-64-char-hex>

# ── Cloudinary (File Storage) ──────────────
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# ── Google AI (Primary LLM + Embeddings) ───
GEMINI_API_KEY=AIza...

# ── Groq (Fallback LLM) ───────────────────
GROQ_API_KEY=gsk_...
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | Connection string. Atlas (`mongodb+srv://…`) or local (`mongodb://…`). TLS is enabled automatically for `+srv` and left off otherwise, so both work unchanged. |
| `PINECONE_API_KEY` | ✅ | Pinecone API key from console.pinecone.io |
| `PINECONE_INDEX` | ✅ | Index name (default: `wdis-documents`) |
| `JWT_SECRET` | ✅ | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens (must differ from JWT_SECRET) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | ✅ | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ✅ | From Cloudinary dashboard |
| `GEMINI_API_KEY` | ✅ | From Google AI Studio |
| `GROQ_API_KEY` | ⚠️ | Recommended — fallback when Gemini is rate-limited |
| `CLIENT_URL` | ✅ | Origin(s) allowed to call the API with credentials. Comma-separate for multiple. |
| `COOKIE_SAMESITE` | — | `Lax` (default). Use `None` only when the SPA and API are on different sites; implies `Secure`. |
| `COOKIE_DOMAIN` | — | Set to share the refresh cookie across subdomains, e.g. `.yourdomain.com`. |
| `TRUST_PROXY_HOPS` | — | Proxy hops in front of the API (default `1`). Needed for correct client IPs behind nginx or a PaaS router. |
| `MONGODB_TLS_ALLOW_INVALID_CERTS` | — | Disables TLS certificate verification. Local workaround for the Node 22 + Atlas + Windows issue — **never enable in production**. |
| `SENDGRID_API_KEY` / `FROM_EMAIL` | — | Only needed for email alert delivery. |

Docker Compose additionally reads `MONGO_ROOT_USER`, `MONGO_ROOT_PASSWORD`,
`MONGO_DB`, `MONGO_PORT` and `CLIENT_PORT` from the root `.env`.

---

## 🌐 Deployment

The repository ships production-ready images: the API runs as a non-root user on
Node 22 slim with a `/api/health` probe and graceful SIGTERM shutdown, and the
front end is a static Vite build served by nginx.

### Single host (Docker Compose)

```bash
git clone https://github.com/AniketB26/What-I-Signed.git
cd What-I-Signed
cp .env.example .env          # fill in secrets and real API keys
docker compose up -d --build
```

Put a TLS terminator (Caddy, Traefik, or nginx with certbot) in front of port
`8080` and point it at your domain. Then set in `.env`:

```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

### Split hosting (managed platforms)

Deploying the API and the SPA separately — for example Render/Railway/Fly for the
API and Vercel/Netlify for the front end — needs three changes, because the
browser then treats the cookie as cross-site:

**API service**
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
COOKIE_SAMESITE=None          # required cross-site; forces Secure
MONGODB_URI=<your Atlas SRV string>
```
Point the platform's health check at `/api/health`.

**Front end** — build with the API origin baked in, since Vite inlines env vars
at build time:
```bash
VITE_API_URL=https://your-api.onrender.com npm run build --workspace=client
```

Both origins must be served over HTTPS: `SameSite=None` requires `Secure`, and
browsers reject a `Secure` cookie sent over plain HTTP.

### Pre-deploy checklist

- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are fresh 64-char random hex values, different from each other
- [ ] `MONGODB_TLS_ALLOW_INVALID_CERTS` is unset or `false`
- [ ] `CLIENT_URL` exactly matches the browser's origin (scheme included — no trailing slash)
- [ ] MongoDB is reachable from the API host (Atlas IP allowlist covers it)
- [ ] Pinecone index exists with 768 dimensions and cosine metric
- [ ] `NODE_ENV=production`
- [ ] No `.env` file is committed — `git check-ignore .env` should print `.env`

---

## 💡 Key Design Decisions

### Why Gemini + Groq dual-LLM?
Gemini 2.5 Flash is fast and capable but has aggressive rate limits on the free tier (15 req/min). When it returns 429 or 503, the system **automatically falls back** to Groq's Llama 3.3 70B. This ensures queries never fail due to rate limiting.

### Why Pinecone + MongoDB (not Pinecone alone)?
Pinecone metadata is limited to 1000 chars per vector. Full chunk text is stored in MongoDB's `Chunk` collection and joined after retrieval. This gives us unlimited text per chunk while keeping vector search fast.

### Why LLM-based reranking (not Cohere)?
Cohere's reranking API is expensive at scale. Using the same LLM (Gemini/Groq) for reranking keeps costs at $0 while achieving strong relevance scoring. The LLM scores each chunk 0–10 with a reason.

### Why cookies for refresh tokens (not localStorage)?
`httpOnly` cookies cannot be read by JavaScript, making them immune to XSS attacks. The access token is kept in Zustand memory only (not persisted), so a page refresh triggers a silent cookie-based re-authentication.

### Why Agenda.js for document processing?
Document processing (extract → chunk → embed → analyze) takes 15–60 seconds. Running this synchronously would time out the HTTP request. Agenda.js runs the pipeline as a background job with progress tracking, letting the user see real-time status via SSE.

### Why custom chunking (not LangChain)?
The chunker uses **legal-document-aware separators** (`Clause`, `Section`, `Article`, `Schedule`) that respect the structure of legal documents rather than blindly splitting at character boundaries. This produces more semantically coherent chunks.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/AniketB26">Aniket Bajpai</a>
</p>

# TinyLink Design & Implementation

## Architecture

The application is built using **Next.js 15** (App Router), **Tailwind CSS** for styling, and **PostgreSQL** (via Neon) as the database. **Prisma** is used as the ORM for type-safe database interactions.

### Tech Stack
- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Styling:** Tailwind CSS

## Database Design

The database consists of a single table `urls` (mapped to `Url` model in Prisma) to store link information.

### Schema

```prisma
model Url {
  id            Int      @id @default(autoincrement())
  originalUrl   String   // The target URL
  shortCode     String   @unique // The unique 6-8 char code (or custom alias)
  clicks        Int      @default(0) // Click counter
  lastClickedAt DateTime? // Timestamp of last click
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

- `shortCode` is the primary public identifier. It serves as both the randomly generated code and the custom alias.
- `clicks` and `lastClickedAt` track usage statistics.

## API Design

The application exposes the following API endpoints:

### 1. Create Link
- **Endpoint:** `POST /api/links`
- **Body:** `{ "url": "https://example.com", "shortCode": "optional_alias" }`
- **Behavior:**
    - Validates URL format.
    - Checks for `shortCode` uniqueness (returns 409 if taken).
    - Generates random code if `shortCode` is not provided.
    - Returns created link details.

### 2. List Links
- **Endpoint:** `GET /api/links`
- **Behavior:** Returns a list of all links, ordered by creation date (descending).

### 3. Get Link Stats
- **Endpoint:** `GET /api/links/[code]`
- **Behavior:** Returns details (clicks, last clicked) for a specific code.

### 4. Delete Link
- **Endpoint:** `DELETE /api/links/[code]`
- **Behavior:** Deletes the link from the database.

### 5. Health Check
- **Endpoint:** `GET /healthz`
- **Response:** `{ "ok": true, "version": "1.0" }`

## Frontend Implementation

### Dashboard (`/`)
- Implemented as a Client Component (`src/components/Dashboard.tsx`).
- Features:
    - **List View:** Displays links in a responsive table.
    - **Search:** Filters links by code or URL.
    - **Add Link:** Inline form to create new short links with optional custom aliases.
    - **Actions:** Copy to clipboard, View Stats, Delete.

### Stats Page (`/code/[code]`)
- Server Component (`src/app/code/[code]/page.tsx`).
- Displays detailed statistics for a specific link.

### Redirect Logic (`/[code]`)
- Handled by `src/app/[id]/page.tsx` (Next.js dynamic route).
- **Behavior:**
    - Looks up the code in the database.
    - If found: Increments `clicks`, updates `lastClickedAt`, and redirects (302) to `originalUrl`.
    - If not found: Returns 404.

## Deployment

- Designed to be deployed on **Vercel**.
- Requires `DATABASE_URL` environment variable pointing to a PostgreSQL instance (e.g., Neon).


# instinct-hello / Instinct Tasks

A professional task manager built with Nuxt 3, Tailwind CSS, and a MySQL-compatible database (TiDB Cloud Serverless).

Live site: https://instinct-tasks.netlify.app

## Features

- Create, view, edit, and delete tasks
- Priority levels (low / medium / high) and completion tracking
- Filter by all / active / completed, with live stats
- Data persisted in MySQL; the schema is created automatically on first use
- No login required: anyone with the URL can read and mutate tasks

## Architecture

- `app.vue` - single-page UI (Tailwind CSS)
- `server/api/tasks/*` - REST API (GET/POST list & create, PATCH/DELETE by id)
- `server/utils/db.ts` - shared mysql2 connection pool with TLS; reads
  connection settings from Nuxt runtime config (server-side only, never
  exposed to the client)

## Configuration

Set these environment variables (server-side only):

- `NUXT_DB_HOST` - database host
- `NUXT_DB_PORT` - database port (default 4000)
- `NUXT_DB_USER` - database user
- `NUXT_DB_PASSWORD` - database password
- `NUXT_DB_NAME` - database name (default `taskdb`)

## Run locally

```
npm install
npm run dev
```

## Deployment

Every push to `main` is built and deployed to Netlify automatically.

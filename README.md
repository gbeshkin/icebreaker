# What Do You See?

A shared team icebreaker: each participant draws a surreal card and adds a short interpretation to the gallery.

## Local development

```sh
npm ci
npm run dev
```

The app is available at `http://localhost:3000`. The shared gallery requires a PostgreSQL connection in `DATABASE_URL`.

## Deploy to Railway

This repository includes `railway.toml`; Railway builds the app with `npm run build`, runs database setup before deployment, and starts the app on Railway's assigned port.

1. Push this repository to GitHub.
2. In Railway, create a project and deploy the GitHub repository.
3. Add a PostgreSQL service to that Railway project.
4. In the web service's Variables tab, create `DATABASE_URL` as a reference to the PostgreSQL service's `DATABASE_URL` variable.
5. Generate a public domain in the web service's Networking tab.

Every deployment safely creates the `interpretations` table and its index when they do not already exist. The gallery persists in Railway PostgreSQL.
